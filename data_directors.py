"""Director Comparison Data for HVAC WtW Super Dashboard
All Region Directors for comparison with Region 15B
"""

# All Region Directors (for comparison dropdown)
DIRECTORS = [
    {"id": "15B", "name": "FRANKY GONZALEZ", "sr_director": "B.A. GLASS", "stores": 187, "is_current": True},
    {"id": "15A", "name": "MIKE WILSON", "sr_director": "B.A. GLASS", "stores": 165, "is_current": False},
    {"id": "14A", "name": "SARAH JOHNSON", "sr_director": "T. MARTINEZ", "stores": 142, "is_current": False},
    {"id": "14B", "name": "ROBERT CHEN", "sr_director": "T. MARTINEZ", "stores": 178, "is_current": False},
    {"id": "16A", "name": "AMANDA BROOKS", "sr_director": "K. WILLIAMS", "stores": 156, "is_current": False},
    {"id": "16B", "name": "JAMES TAYLOR", "sr_director": "K. WILLIAMS", "stores": 191, "is_current": False},
    {"id": "13A", "name": "PATRICIA DAVIS", "sr_director": "M. ANDERSON", "stores": 134, "is_current": False},
    {"id": "13B", "name": "MICHAEL BROWN", "sr_director": "M. ANDERSON", "stores": 168, "is_current": False},
]

# Director Performance Metrics (current month)
DIRECTOR_METRICS = {
    "15B": {"tnt_avg": 92.1, "wos_open": 47, "wos_aged": 8, "comm_loss": 12, "rank": 2},
    "15A": {"tnt_avg": 90.8, "wos_open": 52, "wos_aged": 11, "comm_loss": 15, "rank": 4},
    "14A": {"tnt_avg": 91.5, "wos_open": 38, "wos_aged": 6, "comm_loss": 8, "rank": 3},
    "14B": {"tnt_avg": 89.7, "wos_open": 61, "wos_aged": 14, "comm_loss": 19, "rank": 6},
    "16A": {"tnt_avg": 93.2, "wos_open": 29, "wos_aged": 4, "comm_loss": 6, "rank": 1},
    "16B": {"tnt_avg": 88.9, "wos_open": 68, "wos_aged": 18, "comm_loss": 22, "rank": 7},
    "13A": {"tnt_avg": 90.2, "wos_open": 42, "wos_aged": 9, "comm_loss": 11, "rank": 5},
    "13B": {"tnt_avg": 87.5, "wos_open": 74, "wos_aged": 21, "comm_loss": 28, "rank": 8},
}

# Historical Month-over-Month Data (last 12 months for 15B)
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

# Historical comparison (all directors - last 6 months)
DIRECTOR_TRENDS = {
    "15B": [87.2, 88.9, 90.2, 91.1, 91.7, 92.1],
    "15A": [86.5, 87.8, 89.1, 90.0, 90.5, 90.8],
    "14A": [88.1, 89.2, 90.0, 90.8, 91.2, 91.5],
    "14B": [85.8, 86.9, 87.8, 88.6, 89.2, 89.7],
    "16A": [89.5, 90.8, 91.6, 92.4, 92.9, 93.2],
    "16B": [84.2, 85.6, 86.8, 87.7, 88.4, 88.9],
    "13A": [86.8, 87.9, 88.8, 89.5, 89.9, 90.2],
    "13B": [83.5, 84.8, 85.9, 86.7, 87.2, 87.5],
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

# Improvement milestones
MILESTONES = [
    {"date": "Oct 2025", "event": "Crossed 91% TnT Average", "type": "success"},
    {"date": "Nov 2025", "event": "Reduced Aged WOs by 25%", "type": "success"},
    {"date": "Dec 2025", "event": "WtW Phase 1 Complete", "type": "milestone"},
    {"date": "Jan 2026", "event": "Zero Critical WOs", "type": "success"},
    {"date": "Feb 2026", "event": "Ranked #2 in Division", "type": "achievement"},
]

# Color palette for super dashboard
SUPER_COLORS = {
    "primary": "#0053e2",
    "primary_dark": "#001f5c",
    "primary_light": "#e6f0ff",
    "spark": "#ffc220",
    "spark_dark": "#995213",
    "success": "#2a8703",
    "success_light": "#dcfce7",
    "warning": "#f59e0b",
    "warning_light": "#fef3c7",
    "danger": "#ea1100",
    "danger_light": "#fee2e2",
    "purple": "#7c3aed",
    "purple_light": "#ede9fe",
    "cyan": "#06b6d4",
    "cyan_light": "#cffafe",
    "indigo": "#4f46e5",
    "gradient_blue": "linear-gradient(135deg, #0053e2 0%, #001f5c 100%)",
    "gradient_spark": "linear-gradient(135deg, #ffc220 0%, #f59e0b 100%)",
    "gradient_success": "linear-gradient(135deg, #2a8703 0%, #166534 100%)",
}
