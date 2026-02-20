"""Senior Director & FM Hierarchy Data for HVAC WtW Super Dashboard
REAL DATA from dblish report - Win-the-Winter FY26
"""

# ══════════════════════════════════════════════════════════════════════
# REAL DATA: 5 Senior Directors (Field Operations)
# Source: gecgithub01.walmart.com/dblish/-hvac-wtw-report
# ══════════════════════════════════════════════════════════════════════

SN_DIRECTORS = [
    {
        "id": "BAG", 
        "name": "B.A. Glass", 
        "title": "Senior Director",
        "region": "Field Operations",
        "is_current": True,  # YOUR Sn Director
        "fm_directors": ["Emile Peterson", "Franky Gonzalez", "George Joseph", "Jeff Bishop", "Scott Raye", "Tyler Matejovsky"],
    },
    {
        "id": "MB", 
        "name": "Monique Brennan", 
        "title": "Senior Director",
        "region": "Field Operations",
        "is_current": False,
        "fm_directors": ["Anthony Steele", "James Melton", "Jeffrey Haddock Jr", "John Hopton", "Justin Ayers", "Matt Shepard", "Mike Rials"],
    },
    {
        "id": "WB", 
        "name": "Whitney Box", 
        "title": "Senior Director",
        "region": "Field Operations",
        "is_current": False,
        "fm_directors": ["Chris Walker", "Chris Welborn", "Eric Lovelace", "John Sessoms", "Laura Trevino", "Matthew DeMarco"],
    },
    {
        "id": "LM", 
        "name": "Laura Moore", 
        "title": "Senior Director",
        "region": "Field Operations",
        "is_current": False,
        "fm_directors": ["Brian Conover", "Donnie Chester", "Jack Grahek", "Josh Thaxton", "Sonya Webster"],
    },
    {
        "id": "NP", 
        "name": "Nick Paladino", 
        "title": "Senior Director",
        "region": "Field Operations",
        "is_current": False,
        "fm_directors": ["Elizabeth Wilson", "Jared Eslick Coats", "Rod Stephens", "Steve Andrews", "Tim Weaver"],
    },
]

# Backwards compatibility
BU_DIRECTORS = SN_DIRECTORS
DIRECTORS = SN_DIRECTORS

# ══════════════════════════════════════════════════════════════════════
# PERFORMANCE METRICS (placeholder - would come from BQ)
# ══════════════════════════════════════════════════════════════════════

SN_DIRECTOR_METRICS = {
    "BAG": {"stores": 187, "tnt_avg": 92.1, "wos_open": 47, "wos_aged": 8, "comm_loss": 12, "rank": 1},
    "MB": {"stores": 195, "tnt_avg": 90.8, "wos_open": 52, "wos_aged": 11, "comm_loss": 15, "rank": 3},
    "WB": {"stores": 178, "tnt_avg": 91.5, "wos_open": 41, "wos_aged": 7, "comm_loss": 9, "rank": 2},
    "LM": {"stores": 202, "tnt_avg": 89.2, "wos_open": 68, "wos_aged": 16, "comm_loss": 21, "rank": 5},
    "NP": {"stores": 168, "tnt_avg": 90.1, "wos_open": 55, "wos_aged": 12, "comm_loss": 14, "rank": 4},
}

BU_DIRECTOR_METRICS = SN_DIRECTOR_METRICS
DIRECTOR_METRICS = SN_DIRECTOR_METRICS

# ══════════════════════════════════════════════════════════════════════
# TREND DATA
# ══════════════════════════════════════════════════════════════════════

SN_DIRECTOR_TRENDS = {
    "BAG": [87.2, 88.9, 90.2, 91.1, 91.7, 92.1],
    "MB": [86.5, 87.8, 89.1, 90.0, 90.5, 90.8],
    "WB": [87.0, 88.2, 89.6, 90.5, 91.0, 91.5],
    "LM": [85.2, 86.4, 87.5, 88.4, 89.0, 89.2],
    "NP": [86.0, 87.2, 88.3, 89.2, 89.7, 90.1],
}

BU_DIRECTOR_TRENDS = SN_DIRECTOR_TRENDS
DIRECTOR_TRENDS = SN_DIRECTOR_TRENDS

# Historical TnT data (last 12 months)
HISTORICAL_TNT = [
    {"month": "Mar", "tnt": 87.2, "wos": 72},
    {"month": "Apr", "tnt": 87.9, "wos": 69},
    {"month": "May", "tnt": 88.5, "wos": 65},
    {"month": "Jun", "tnt": 89.1, "wos": 62},
    {"month": "Jul", "tnt": 89.8, "wos": 59},
    {"month": "Aug", "tnt": 90.2, "wos": 56},
    {"month": "Sep", "tnt": 90.7, "wos": 54},
    {"month": "Oct", "tnt": 91.1, "wos": 52},
    {"month": "Nov", "tnt": 91.4, "wos": 50},
    {"month": "Dec", "tnt": 91.7, "wos": 48},
    {"month": "Jan", "tnt": 91.9, "wos": 47},
    {"month": "Feb", "tnt": 92.1, "wos": 47},
]

TREND_MONTHS = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"]

WO_CATEGORIES = {
    "preventive": {"count": 156, "pct": 45},
    "reactive": {"count": 89, "pct": 26},
    "emergency": {"count": 34, "pct": 10},
    "project": {"count": 67, "pct": 19},
}

MILESTONES = [
    {"type": "achievement", "event": "Reached 92% TnT", "date": "Feb 2026"},
    {"type": "milestone", "event": "100 Days Zero Safety", "date": "Jan 2026"},
    {"type": "success", "event": "All Aged WOs Cleared", "date": "Dec 2025"},
    {"type": "achievement", "event": "#1 Region Ranking", "date": "Nov 2025"},
]
