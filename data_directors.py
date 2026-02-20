"""FS Director & Manager Data for HVAC WtW Super Dashboard
Real hierarchy for Region 15B under B.A. GLASS
"""

# ══════════════════════════════════════════════════════════════════════
# HIERARCHY: Sr. Director → FM Director → Regional Managers → Stores
# ══════════════════════════════════════════════════════════════════════

# FM Directors under B.A. GLASS (for comparison with FRANKY GONZALEZ)
FM_DIRECTORS = [
    {
        "id": "15B", 
        "name": "FRANKY GONZALEZ", 
        "sr_director": "B.A. GLASS",
        "region": "Central South",
        "is_current": True,
        "regional_managers": ["ERIC GRAY", "JASON MCALESTER", "DAVID GUESS", "DANE CLAYTON"],
    },
    {
        "id": "15A", 
        "name": "MIKE HERNANDEZ", 
        "sr_director": "B.A. GLASS",
        "region": "Central North",
        "is_current": False,
        "regional_managers": ["TOM RICHARDS", "KAREN SMITH", "JOE MARTINEZ"],
    },
    {
        "id": "15C", 
        "name": "LISA THOMPSON", 
        "sr_director": "B.A. GLASS",
        "region": "Central East",
        "is_current": False,
        "regional_managers": ["MARK DAVIS", "ANNA WILSON"],
    },
    {
        "id": "15D", 
        "name": "ROBERT MARTINEZ", 
        "sr_director": "B.A. GLASS",
        "region": "Central West",
        "is_current": False,
        "regional_managers": ["STEVE BROWN", "NANCY JOHNSON", "CARLOS RODRIGUEZ"],
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

# FM Director Performance Metrics (current month)
FM_DIRECTOR_METRICS = {
    "15B": {"stores": 187, "tnt_avg": 92.1, "wos_open": 47, "wos_aged": 8, "comm_loss": 12, "rank": 1},
    "15A": {"stores": 142, "tnt_avg": 90.8, "wos_open": 52, "wos_aged": 11, "comm_loss": 15, "rank": 2},
    "15C": {"stores": 98, "tnt_avg": 89.5, "wos_open": 38, "wos_aged": 14, "comm_loss": 8, "rank": 4},
    "15D": {"stores": 156, "tnt_avg": 90.2, "wos_open": 61, "wos_aged": 9, "comm_loss": 19, "rank": 3},
}

# Historical Month-over-Month Data (last 12 months for 15B - FRANKY)
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

# FM Director trend comparison (last 6 months)
FM_DIRECTOR_TRENDS = {
    "15B": [87.2, 88.9, 90.2, 91.1, 91.7, 92.1],  # FRANKY - YOU
    "15A": [86.5, 87.8, 89.1, 90.0, 90.5, 90.8],
    "15C": [85.8, 86.9, 87.8, 88.6, 89.0, 89.5],
    "15D": [86.8, 87.9, 88.8, 89.5, 89.9, 90.2],
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
    {"date": "Feb 2026", "event": "#1 Ranked FM Director under B.A. GLASS", "type": "achievement"},
]

# ══════════════════════════════════════════════════════════════════════
# ALIASES FOR BACKWARDS COMPATIBILITY
# ══════════════════════════════════════════════════════════════════════
DIRECTORS = FM_DIRECTORS
DIRECTOR_METRICS = FM_DIRECTOR_METRICS
DIRECTOR_TRENDS = FM_DIRECTOR_TRENDS
