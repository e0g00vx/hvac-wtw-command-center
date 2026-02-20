"""Senior Director & FM Hierarchy Data for HVAC WtW Super Dashboard
Real hierarchy data from Walmart Confluence
"""

# ══════════════════════════════════════════════════════════════════════
# HIERARCHY: VP (RJ Zane) → Sr. Director → FM Director → Regional Manager
# ══════════════════════════════════════════════════════════════════════

# Senior Directors (Sn Directors) - Direct Reports to RJ Zane (VP)
SN_DIRECTORS = [
    {
        "id": "BA", 
        "name": "B.A. GLASS", 
        "title": "Senior Director - SW BU",
        "region": "Southwest Business Unit (SWBU)",
        "scope": "850-1,000 stores (SCs, D1s, NHMs)",
        "team_size": "~1,000 Associates",
        "is_current": True,  # Your Sn Director
        "fm_directors": ["FRANKY GONZALEZ"],
    },
    {
        "id": "WB", 
        "name": "WHITNEY BOX", 
        "title": "Senior Director - East BU",
        "region": "East Business Unit",
        "is_current": False,
        "fm_directors": ["JASON SHERIDAN"],
    },
    {
        "id": "MB", 
        "name": "MONIQUE BRENNAN", 
        "title": "Senior Director - Field",
        "region": "FM Region 5 (Ops 40, 43)",
        "is_current": False,
        "fm_directors": [],
    },
    {
        "id": "NP", 
        "name": "NICK PALADINO", 
        "title": "Senior Director - Field",
        "region": "South",
        "is_current": False,
        "fm_directors": [],
    },
    {
        "id": "LO", 
        "name": "LAURA O'NEAL", 
        "title": "Senior Director - Field",
        "region": "Southeast",
        "is_current": False,
        "fm_directors": [],
    },
    {
        "id": "BB", 
        "name": "BRANDON BALLARD", 
        "title": "Sr Director - HVAC/R Assets",
        "region": "HVAC/R Asset Strategy",
        "is_current": False,
        "fm_directors": [],
    },
    {
        "id": "ED", 
        "name": "ERIC DALTON", 
        "title": "Sr Director - GM Assets",
        "region": "GM Assets",
        "is_current": False,
        "fm_directors": [],
    },
    {
        "id": "BLB", 
        "name": "BLAINE BATEMAN", 
        "title": "Sr Director - Commercial",
        "region": "Commercial Facility Services",
        "is_current": False,
        "fm_directors": [],
    },
]

# Backwards compatibility alias
BU_DIRECTORS = SN_DIRECTORS

# Senior Director Performance Metrics (current month - placeholder data)
SN_DIRECTOR_METRICS = {
    "BA": {"stores": 187, "tnt_avg": 92.1, "wos_open": 47, "wos_aged": 8, "comm_loss": 12, "rank": 1},
    "WB": {"stores": 178, "tnt_avg": 91.5, "wos_open": 41, "wos_aged": 7, "comm_loss": 9, "rank": 2},
    "MB": {"stores": 195, "tnt_avg": 90.8, "wos_open": 52, "wos_aged": 11, "comm_loss": 15, "rank": 3},
    "NP": {"stores": 168, "tnt_avg": 90.1, "wos_open": 55, "wos_aged": 12, "comm_loss": 14, "rank": 4},
    "LO": {"stores": 202, "tnt_avg": 89.2, "wos_open": 68, "wos_aged": 16, "comm_loss": 21, "rank": 5},
    "BB": {"stores": 0, "tnt_avg": 0, "wos_open": 0, "wos_aged": 0, "comm_loss": 0, "rank": 0},
    "ED": {"stores": 0, "tnt_avg": 0, "wos_open": 0, "wos_aged": 0, "comm_loss": 0, "rank": 0},
    "BLB": {"stores": 0, "tnt_avg": 0, "wos_open": 0, "wos_aged": 0, "comm_loss": 0, "rank": 0},
}

# Backwards compatibility alias
BU_DIRECTOR_METRICS = SN_DIRECTOR_METRICS

# Senior Director trend comparison (last 6 months)
SN_DIRECTOR_TRENDS = {
    "BA": [87.2, 88.9, 90.2, 91.1, 91.7, 92.1],  # B.A. GLASS - YOUR Sn Director
    "WB": [87.0, 88.2, 89.6, 90.5, 91.0, 91.5],  # Whitney Box
    "MB": [86.5, 87.8, 89.1, 90.0, 90.5, 90.8],  # Monique Brennan
    "NP": [86.0, 87.2, 88.3, 89.2, 89.7, 90.1],  # Nick Paladino
    "LO": [85.2, 86.4, 87.5, 88.4, 89.0, 89.2],  # Laura O'Neal
}

# Backwards compatibility alias
BU_DIRECTOR_TRENDS = SN_DIRECTOR_TRENDS

# ══════════════════════════════════════════════════════════════════════
# ALIASES FOR BACKWARDS COMPATIBILITY
# ══════════════════════════════════════════════════════════════════════
DIRECTORS = SN_DIRECTORS
DIRECTOR_METRICS = SN_DIRECTOR_METRICS
DIRECTOR_TRENDS = SN_DIRECTOR_TRENDS
