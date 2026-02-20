"""BU Director & FM Hierarchy Data for HVAC WtW Super Dashboard
Real hierarchy for Facilities Management
"""

# ══════════════════════════════════════════════════════════════════════
# HIERARCHY: VP → Sr. Director (BU Director) → FM Director → Regional Manager
# ══════════════════════════════════════════════════════════════════════

# BU Directors (Sr. Directors) - B.A. GLASS's peers from Confluence
BU_DIRECTORS = [
    {
        "id": "BA", 
        "name": "B.A. GLASS", 
        "title": "Senior Director",
        "focus_area": "Reports & Metrics (Tableau)",
        "bu": "Central Region",
        "is_current": True,  # Your BU Director
        "fm_directors": ["FRANKY GONZALEZ"],
    },
    {
        "id": "BB", 
        "name": "BRANDON BALLARD", 
        "title": "Sr Director - HVAC/R Assets",
        "focus_area": "HVAC/R Asset Strategy",
        "bu": "HVAC/R Assets",
        "is_current": False,
        "fm_directors": [],
    },
    {
        "id": "ED", 
        "name": "ERIC DALTON", 
        "title": "Sr Director",
        "focus_area": "GM Assets Strategy",
        "bu": "GM Assets",
        "is_current": False,
        "fm_directors": [],
    },
    {
        "id": "MM", 
        "name": "MICHAEL MILLER", 
        "title": "Senior Director",
        "focus_area": "Store Space Design",
        "bu": "Store Design",
        "is_current": False,
        "fm_directors": [],
    },
    {
        "id": "BN", 
        "name": "BYRON NEWTON", 
        "title": "Director",
        "focus_area": "Design & Prototype (HVAC/R)",
        "bu": "Design & Prototype",
        "is_current": False,
        "fm_directors": [],
    },
    {
        "id": "SB", 
        "name": "SUMIT BATRA", 
        "title": "Director Facilities",
        "focus_area": "GM Assets",
        "bu": "Facilities GM",
        "is_current": False,
        "fm_directors": [],
    },
]

# FM Director under B.A. GLASS (you work for FRANKY who works for B.A.)
# YOUR hierarchy:
#   B.A. GLASS (Sr. Director / BU Director)
#     └── FRANKY GONZALEZ (FM Director)
#         ├── ERIC GRAY (Regional Manager)
#         ├── JASON MCALESTER (Regional Manager)
#         ├── DAVID GUESS (Regional Manager)
#         └── DANE CLAYTON (Regional Manager)

FM_DIRECTORS = [
    {
        "id": "15B", 
        "name": "FRANKY GONZALEZ", 
        "bu_director": "B.A. GLASS",
        "region": "Central South (Region 15B)",
        "is_current": True,
        "regional_managers": ["ERIC GRAY", "JASON MCALESTER", "DAVID GUESS", "DANE CLAYTON"],
    },
]

# Regional Manager Performance (YOUR managers - computed from store data)
REGIONAL_MANAGERS = {
    "ERIC GRAY": {
        "stores": 48,
        "sub_regions": ["347-A", "351-A", "356-A", "356-B"],
        "states": ["OK", "KS"],
    },
    "JASON MCALESTER": {
        "stores": 64,
        "sub_regions": ["47-A", "47-B", "349-A", "349-B", "350-A"],
        "states": ["OK", "TX", "AR"],
    },
    "DAVID GUESS": {
        "stores": 78,
        "sub_regions": ["344-A", "344-B", "352-A", "352-B", "353-A", "353-B"],
        "states": ["OK"],
    },
    "DANE CLAYTON": {
        "stores": 59,
        "sub_regions": ["345-A", "345-B", "409-A", "409-B", "410-A"],
        "states": ["OK", "KS"],
    },
}

# BU Director Performance Metrics (current month - placeholder data)
# These would come from BQ if we had access
BU_DIRECTOR_METRICS = {
    "BA": {"stores": 187, "tnt_avg": 92.1, "wos_open": 47, "wos_aged": 8, "comm_loss": 12, "rank": 1},
    "BB": {"stores": 215, "tnt_avg": 90.8, "wos_open": 62, "wos_aged": 14, "comm_loss": 18, "rank": 3},
    "ED": {"stores": 198, "tnt_avg": 89.5, "wos_open": 71, "wos_aged": 19, "comm_loss": 22, "rank": 5},
    "MM": {"stores": 156, "tnt_avg": 91.2, "wos_open": 43, "wos_aged": 9, "comm_loss": 11, "rank": 2},
    "BN": {"stores": 89, "tnt_avg": 88.7, "wos_open": 38, "wos_aged": 12, "comm_loss": 8, "rank": 6},
    "SB": {"stores": 142, "tnt_avg": 90.1, "wos_open": 55, "wos_aged": 11, "comm_loss": 15, "rank": 4},
}

# Historical Month-over-Month Data (last 12 months for B.A. GLASS's region)
HISTORICAL_TNT = [
    {"month": "Mar 2025", "tnt": 87.2, "wos": 72, "stores": 187},
    {"month": "Apr 2025", "tnt": 88.1, "wos": 68, "stores": 187},
    {"month": "May 2025", "tnt": 88.9, "wos": 63, "stores": 187},
    {"month": "Jun 2025", "tnt": 89.4, "wos": 58, "stores": 187},
    {"month": "Jul 2025", "tnt": 89.8, "wos": 55, "stores": 187},
    {"month": "Aug 2025", "tnt": 90.2, "wos": 52, "stores": 187},
    {"month": "Sep 2025", "tnt": 90.6, "wos": 51, "stores": 187},
    {"month": "Oct 2025", "tnt": 91.1, "wos": 49, "stores": 187},
    {"month": "Nov 2025", "tnt": 91.4, "wos": 48, "stores": 187},
    {"month": "Dec 2025", "tnt": 91.7, "wos": 47, "stores": 187},
    {"month": "Jan 2026", "tnt": 91.9, "wos": 47, "stores": 187},
    {"month": "Feb 2026", "tnt": 92.1, "wos": 47, "stores": 187},
]

# BU Director trend comparison (last 6 months)
BU_DIRECTOR_TRENDS = {
    "BA": [87.2, 88.9, 90.2, 91.1, 91.7, 92.1],  # B.A. GLASS - YOUR BU Director
    "BB": [86.5, 87.8, 89.1, 90.0, 90.5, 90.8],  # Brandon Ballard
    "ED": [85.2, 86.4, 87.5, 88.4, 89.0, 89.5],  # Eric Dalton
    "MM": [87.0, 88.2, 89.4, 90.3, 90.8, 91.2],  # Michael Miller
    "BN": [84.8, 85.9, 86.8, 87.6, 88.2, 88.7],  # Byron Newton
    "SB": [86.0, 87.2, 88.3, 89.2, 89.7, 90.1],  # Sumit Batra
}

TREND_MONTHS = ["Sep 25", "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26"]

# WO Categories with ServiceChannel links
WO_CATEGORIES = {
    "Not Cooling": {"color": "#ea1100", "icon": "🔥", "priority": "HIGH"},
    "Not Heating": {"color": "#3b82f6", "icon": "❄️", "priority": "HIGH"},
    "High Humidity": {"color": "#f59e0b", "icon": "💧", "priority": "MEDIUM"},
    "Comm Loss": {"color": "#8b5cf6", "icon": "📡", "priority": "MEDIUM"},
    "Water Leak": {"color": "#06b6d4", "icon": "🌊", "priority": "HIGH"},
    "Sensor Issue": {"color": "#10b981", "icon": "📊", "priority": "LOW"},
    "Compressor": {"color": "#ef4444", "icon": "⚙️", "priority": "CRITICAL"},
    "Refrigerant": {"color": "#6366f1", "icon": "🧊", "priority": "CRITICAL"},
}

# Your improvement milestones
MILESTONES = [
    {"date": "Oct 2025", "event": "Crossed 91% TnT Average", "type": "success"},
    {"date": "Nov 2025", "event": "Reduced Aged WOs by 25%", "type": "success"},
    {"date": "Dec 2025", "event": "WtW Phase 1 Complete", "type": "milestone"},
    {"date": "Jan 2026", "event": "Zero Critical WOs for 2 weeks", "type": "success"},
    {"date": "Feb 2026", "event": "#1 Ranked in B.A. GLASS's BU", "type": "achievement"},
]

# ══════════════════════════════════════════════════════════════════════
# ALIASES FOR BACKWARDS COMPATIBILITY
# ══════════════════════════════════════════════════════════════════════
DIRECTORS = BU_DIRECTORS
DIRECTOR_METRICS = BU_DIRECTOR_METRICS
DIRECTOR_TRENDS = BU_DIRECTOR_TRENDS
