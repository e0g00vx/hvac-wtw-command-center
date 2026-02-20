# ❄️ HVAC Win-the-Winter Command Center

**Region 15B Master Dashboard for Franky Gonzalez**

![Status](https://img.shields.io/badge/Status-LIVE-brightgreen)
![Auto-Refresh](https://img.shields.io/badge/Auto--Refresh-5%20min-blue)
![Region](https://img.shields.io/badge/Region-15B-orange)

## 🚀 Quick Start

### Option 1: Double-click to Start
```
START_DASHBOARD.bat
```

### Option 2: Manual Start
```bash
cd hvac_wtw_command_center
.venv\Scripts\activate
python main.py
```

Then open: **http://localhost:8780**

## ✨ Features

### 📊 Executive Dashboard
- Real-time KPIs with color-coded status
- TnT distribution charts
- Manager performance scoreboard
- Click-to-drill-down on any metric

### 🗺️ Interactive Heat Maps
| Layer | Description |
|-------|-------------|
| 🎯 **TnT %** | Store performance by Time-in-Target |
| ❄️ **AHU/RTU WOs** | Work order locations with age coloring |
| 📡 **Comm Loss** | Stores with communication issues |

### ❄️ Win-the-Winter Phases
- **Phase 1**: Pre-Season Prep (Oct-Nov) ✅
- **Phase 2**: Active Monitoring (Dec-Feb) 🔄
- **Phase 3**: Post-Season Review (Mar-Apr) ⏳

### 🛠️ AHU/RTU Work Orders
- Real-time broken unit tracking
- Copy WO numbers with one click
- Age-based color coding
- ServiceChannel integration

### 👥 Manager Drill-Down
- Click any manager to see FS Managers
- Click FS Manager to see stores
- Click store for full details

## 🔄 Auto-Refresh

The dashboard automatically refreshes every **5 minutes**:
- Countdown timer in header
- Green LIVE pulse indicator
- Manual refresh button available

## 📤 Sharing

1. **Copy Link**: Click 📋 Copy Link button
2. **Full Screen**: Click 🚀 Open Full Screen
3. **Export CSV**: Click 📤 Export All

## 🏗️ Project Structure

```
hvac_wtw_command_center/
├── main.py              # FastAPI server + data refresh
├── data.py              # Embedded region data
├── templates/
│   └── index.html       # Dashboard UI
├── static/
│   └── js/
│       └── app.js       # Interactive JavaScript
├── START_DASHBOARD.bat  # One-click launcher
└── README.md            # This file
```

## 📡 Data Sources

| Data | Source |
|------|--------|
| Store Alignment | `fsai_store_alignment` (BigQuery) |
| TnT Scores | `tit_dash_historical` (BigQuery) |
| AHU/RTU WOs | `ah_rtu_wos` (BigQuery) |
| Comm Loss | `comm_loss_combined` (BigQuery) |
| WTW Status | `win_the_winter` (Crystal/BigQuery) |

## 🎨 Walmart Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Walmart Blue | `#0053e2` | Primary |
| Spark Yellow | `#ffc220` | Accent |
| Success Green | `#2a8703` | Good status |
| Warning Orange | `#f47920` | Watch |
| Error Red | `#ea1100` | Critical |

## 👤 Regional Managers

- **Eric Gray** - 48 stores
- **Jason McAlester** - 64 stores  
- **David Guess** - 78 stores
- **Dane Clayton** - 59 stores

## 📞 Support

- **Created by**: Luna 🐶 (Code Puppy)
- **For**: Franky Gonzalez - Region 15B
- **Date**: February 2026

---

*Built with FastAPI + HTMX + Tailwind CSS + Chart.js + Leaflet*
