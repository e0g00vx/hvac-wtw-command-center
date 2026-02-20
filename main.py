"""HVAC Win-the-Winter Command Center - Region 15B
The ULTIMATE dashboard for Franky Gonzalez
Auto-refreshes every 5 minutes with live BigQuery data
"""
import json
import logging
import subprocess
import time
import threading
from datetime import datetime
from pathlib import Path
from typing import Any
import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════
PORT = 8780
REFRESH_INTERVAL = 300  # 5 minutes
REGION = "15B"
SR_DIRECTOR = "B.A. GLASS"
FM_DIRECTOR = "FRANKY GONZALEZ"

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
log = logging.getLogger(__name__)

app = FastAPI(title="HVAC WtW Command Center", version="1.0.0")

# Static files and templates
BASE_DIR = Path(__file__).parent
STATIC_DIR = BASE_DIR / "static"
TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR.mkdir(exist_ok=True)
TEMPLATES_DIR.mkdir(exist_ok=True)
(STATIC_DIR / "js").mkdir(exist_ok=True)
(STATIC_DIR / "css").mkdir(exist_ok=True)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

# ═══════════════════════════════════════════════════════════════════════════════
# DATA CACHE
# ═══════════════════════════════════════════════════════════════════════════════
_cache: dict[str, Any] = {
    "stores": [],
    "hvac_wos": [],
    "ahu_rtu": [],
    "comm_loss": [],
    "leak_summary": [],
    "wtw_status": [],
    "projects": [],
    "sams_clubs": [],
    "last_refresh": None,
    "refresh_count": 0
}

# ═══════════════════════════════════════════════════════════════════════════════
# BQ QUERIES
# ═══════════════════════════════════════════════════════════════════════════════

STORES_QUERY = """
SELECT 
  s.store_nbr as store,
  s.city,
  s.state_prov_code as state,
  COALESCE(h.sub_region_id, 'Unknown') as sub,
  COALESCE(h.fm_regional_mgr, 'Unknown') as mgr,
  s.latitude as lat,
  s.longitude as lng,
  CASE 
    WHEN s.store_type_desc LIKE '%SUPERCENTER%' THEN 'Supercenter'
    WHEN s.store_type_desc LIKE '%NEIGHBORHOOD%' THEN 'NHM'
    WHEN s.store_type_desc LIKE '%SAM%' THEN 'Sams'
    WHEN s.store_type_desc LIKE '%DISCOUNT%' THEN 'Discount'
    ELSE 'Other'
  END as store_type,
  ROUND(t.time_in_target_pct, 2) as tit
FROM `wmt-edw-prod.WW_CORE_DIM_VM.STORE_DIM` s
LEFT JOIN `wmt-fm-engg-prod.HVAC_REPORTING.store_hierarchy` h 
  ON s.store_nbr = h.store_nbr
LEFT JOIN `wmt-fm-engg-prod.HVAC_REPORTING.tit_latest` t
  ON s.store_nbr = t.store_nbr
WHERE h.sr_director = 'B.A. GLASS'
  AND s.store_type_desc IN ('SUPERCENTER', 'NEIGHBORHOOD MARKET', 'SAMS CLUB', 'WALMART DISCOUNT')
  AND s.store_status_desc = 'OPERATING'
ORDER BY s.store_nbr
"""

AHU_RTU_QUERY = """
SELECT
  w.location_id as store,
  w.tracking_nbr as tracking,
  w.problem_type as problem,
  w.equipment_desc as equipment,
  w.status,
  w.provider_name as provider,
  DATE_DIFF(CURRENT_DATE(), CAST(w.call_date AS DATE), DAY) as age_days,
  s.city,
  s.state_prov_code as state,
  h.sub_region_id as sub,
  h.fm_regional_mgr as mgr
FROM `wmt-fm-engg-prod.FM_WO_VIEWS.work_orders_current` w
JOIN `wmt-edw-prod.WW_CORE_DIM_VM.STORE_DIM` s ON w.location_id = s.store_nbr
JOIN `wmt-fm-engg-prod.HVAC_REPORTING.store_hierarchy` h ON w.location_id = h.store_nbr
WHERE h.sr_director = 'B.A. GLASS'
  AND w.trade = 'HVAC'
  AND (LOWER(w.equipment_desc) LIKE '%ahu%' 
       OR LOWER(w.equipment_desc) LIKE '%air handler%'
       OR LOWER(w.equipment_desc) LIKE '%rtu%'
       OR LOWER(w.equipment_desc) LIKE '%roof top%')
  AND w.status NOT IN ('COMPLETED', 'CANCELLED')
ORDER BY age_days DESC
"""

COMM_LOSS_QUERY = """
SELECT
  c.store_nbr as store,
  c.controller_name as controller,
  c.rack_type as rack,
  DATE_DIFF(CURRENT_DATE(), CAST(c.offline_since AS DATE), DAY) as days_offline,
  c.last_comm_time,
  s.city,
  s.state_prov_code as state,
  h.sub_region_id as sub,
  h.fm_regional_mgr as mgr
FROM `wmt-fm-engg-prod.HVAC_REPORTING.comm_loss_current` c
JOIN `wmt-edw-prod.WW_CORE_DIM_VM.STORE_DIM` s ON c.store_nbr = s.store_nbr
JOIN `wmt-fm-engg-prod.HVAC_REPORTING.store_hierarchy` h ON c.store_nbr = h.store_nbr
WHERE h.sr_director = 'B.A. GLASS'
ORDER BY days_offline DESC
"""

LEAK_SUMMARY_QUERY = """
SELECT
  l.store_nbr as store,
  l.event_date,
  l.refrigerant_type,
  l.lbs_leaked,
  l.circuit_name,
  s.city,
  s.state_prov_code as state,
  h.sub_region_id as sub,
  h.fm_regional_mgr as mgr
FROM `wmt-fm-engg-prod.REFRIGERANT.leak_events_fy26` l
JOIN `wmt-edw-prod.WW_CORE_DIM_VM.STORE_DIM` s ON l.store_nbr = s.store_nbr
JOIN `wmt-fm-engg-prod.HVAC_REPORTING.store_hierarchy` h ON l.store_nbr = h.store_nbr
WHERE h.sr_director = 'B.A. GLASS'
ORDER BY l.event_date DESC
"""

PROJECTS_QUERY = """
SELECT
  p.store_nbr as store,
  p.project_name,
  p.project_type,
  p.status,
  p.start_date,
  p.completion_date,
  s.city,
  s.state_prov_code as state,
  h.sub_region_id as sub,
  h.fm_regional_mgr as mgr
FROM `wmt-fm-engg-prod.FM_PROJECTS.active_projects` p
JOIN `wmt-edw-prod.WW_CORE_DIM_VM.STORE_DIM` s ON p.store_nbr = s.store_nbr
JOIN `wmt-fm-engg-prod.HVAC_REPORTING.store_hierarchy` h ON p.store_nbr = h.store_nbr
WHERE h.sr_director = 'B.A. GLASS'
  AND p.status != 'COMPLETED'
ORDER BY p.start_date
"""

# ═══════════════════════════════════════════════════════════════════════════════
# DATA FETCHING
# ═══════════════════════════════════════════════════════════════════════════════

def run_bq_query(query: str) -> list[dict]:
    """Execute a BigQuery query via gcloud CLI."""
    try:
        cmd = ["bq", "query", "--use_legacy_sql=false", "--format=json", "--max_rows=5000", query]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if result.returncode == 0 and result.stdout.strip():
            return json.loads(result.stdout)
        log.warning(f"BQ query returned no data or failed")
        return []
    except Exception as e:
        log.error(f"BQ query failed: {e}")
        return []

def load_fallback_data():
    """Load data from embedded Python data module."""
    from data import STORES, AHU_RTU_WOS, COMM_LOSS, LEAK_SUMMARY, PROJECTS, FS_MANAGERS, WTW_STATUS, WTW_PHASES
    from data_directors import DIRECTORS, DIRECTOR_METRICS, HISTORICAL_TNT, DIRECTOR_TRENDS, TREND_MONTHS, WO_CATEGORIES, MILESTONES
    from store_managers import enrich_stores_with_managers, STORE_MANAGERS
    
    # Enrich stores with store manager names
    enriched_stores = enrich_stores_with_managers(STORES.copy())
    _cache["stores"] = enriched_stores
    _cache["store_managers"] = STORE_MANAGERS
    _cache["ahu_rtu"] = AHU_RTU_WOS
    _cache["comm_loss"] = COMM_LOSS
    _cache["leak_summary"] = LEAK_SUMMARY
    _cache["projects"] = PROJECTS
    _cache["fs_managers"] = FS_MANAGERS
    _cache["wtw_status"] = WTW_STATUS
    _cache["wtw_phases"] = WTW_PHASES
    
    # Director comparison data
    _cache["directors"] = DIRECTORS
    _cache["director_metrics"] = DIRECTOR_METRICS
    _cache["historical_tnt"] = HISTORICAL_TNT
    _cache["director_trends"] = DIRECTOR_TRENDS
    _cache["trend_months"] = TREND_MONTHS
    _cache["wo_categories"] = WO_CATEGORIES
    _cache["milestones"] = MILESTONES
    
    # Org hierarchy data
    from org_hierarchy import ORG_HIERARCHY, get_hierarchy_summary
    _cache["org_hierarchy"] = ORG_HIERARCHY
    _cache["hierarchy_summary"] = get_hierarchy_summary()
    
    log.info(f"Loaded embedded data: {len(STORES)} stores, {len(AHU_RTU_WOS)} WOs, {len(WTW_STATUS)} WTW stores, {len(DIRECTORS)} directors")

def refresh_data():
    """Refresh all data from BigQuery or fallback sources."""
    start = time.monotonic()
    log.info("🔄 Starting data refresh...")
    
    # Try BQ first, fallback to CSV
    try:
        stores = run_bq_query(STORES_QUERY)
        if stores:
            _cache["stores"] = stores
            log.info(f"  ✓ Stores: {len(stores)}")
        else:
            load_fallback_data()
    except Exception as e:
        log.warning(f"BQ failed, using fallback: {e}")
        load_fallback_data()
    
    # Try to refresh other data
    for key, query in [("ahu_rtu", AHU_RTU_QUERY), ("comm_loss", COMM_LOSS_QUERY)]:
        try:
            data = run_bq_query(query)
            if data:
                _cache[key] = data
                log.info(f"  ✓ {key}: {len(data)}")
        except:
            pass
    
    _cache["last_refresh"] = datetime.now().isoformat()
    _cache["refresh_count"] += 1
    log.info(f"✅ Refresh complete in {time.monotonic() - start:.1f}s")

def background_refresh():
    """Background thread for auto-refresh every 5 minutes."""
    while True:
        time.sleep(REFRESH_INTERVAL)
        try:
            refresh_data()
        except Exception as e:
            log.error(f"Background refresh failed: {e}")

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/full", response_class=HTMLResponse)
async def full_dashboard(request: Request):
    """Serve FRANKY'S FINAL Command Center - dblish data + Red/Blue/Green + Heat Maps."""
    html_path = TEMPLATES_DIR / "franky_final.html"
    if html_path.exists():
        content = html_path.read_text(encoding="utf-8")
        return HTMLResponse(content=content)
    return HTMLResponse("<h1>Dashboard not found</h1>", status_code=404)

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Redirect to full dashboard."""
    from fastapi.responses import RedirectResponse
    return RedirectResponse(url="/full", status_code=302)

# Mount data directory for JSON files
DATA_DIR = BASE_DIR / "data"
if DATA_DIR.exists():
    app.mount("/data", StaticFiles(directory=str(DATA_DIR)), name="data")

@app.get("/api/stores")
async def get_stores():
    """Return stores data for dashboard."""
    return JSONResponse(_cache.get("stores", []))

@app.get("/api/work-orders")
async def get_work_orders():
    """Return work orders data."""
    return JSONResponse(_cache.get("hvac_wos", []))

@app.get("/api/data")
async def get_all_data():
    """Return all cached data including director comparison."""
    return JSONResponse({
        "stores": _cache["stores"],
        "ahu_rtu": _cache["ahu_rtu"],
        "comm_loss": _cache["comm_loss"],
        "leak_summary": _cache["leak_summary"],
        "projects": _cache["projects"],
        "fs_managers": _cache.get("fs_managers", {}),
        "wtw_status": _cache.get("wtw_status", []),
        "wtw_phases": _cache.get("wtw_phases", {}),
        "directors": _cache.get("directors", []),
        "director_metrics": _cache.get("director_metrics", {}),
        "historical_tnt": _cache.get("historical_tnt", []),
        "director_trends": _cache.get("director_trends", {}),
        "trend_months": _cache.get("trend_months", []),
        "wo_categories": _cache.get("wo_categories", {}),
        "milestones": _cache.get("milestones", []),
        "store_managers": _cache.get("store_managers", {}),
        "org_hierarchy": _cache.get("org_hierarchy", {}),
        "hierarchy_summary": _cache.get("hierarchy_summary", []),
        "last_refresh": _cache["last_refresh"],
        "refresh_count": _cache["refresh_count"],
        "config": {
            "region": REGION,
            "sr_director": SR_DIRECTOR,
            "fm_director": FM_DIRECTOR,
            "refresh_interval": REFRESH_INTERVAL
        }
    })

@app.post("/api/refresh")
async def trigger_refresh():
    """Manually trigger a data refresh."""
    refresh_data()
    return {"status": "ok", "last_refresh": _cache["last_refresh"]}

@app.get("/api/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "stores": len(_cache["stores"]),
        "ahu_rtu": len(_cache["ahu_rtu"]),
        "comm_loss": len(_cache["comm_loss"]),
        "last_refresh": _cache["last_refresh"]
    }

# ═══════════════════════════════════════════════════════════════════════════════
# STARTUP
# ═══════════════════════════════════════════════════════════════════════════════

@app.on_event("startup")
async def startup():
    """Initialize data on startup."""
    log.info(f"🚀 Starting HVAC WtW Command Center on port {PORT}")
    refresh_data()
    # Start background refresh thread
    thread = threading.Thread(target=background_refresh, daemon=True)
    thread.start()
    log.info(f"⏰ Auto-refresh enabled every {REFRESH_INTERVAL}s")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT, log_level="info")
