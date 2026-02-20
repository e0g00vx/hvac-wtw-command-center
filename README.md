# ❄️ HVAC Win-the-Winter Command Center - Region 15B

> **The ULTIMATE Dashboard for Franky Gonzalez**  
> Created by Luna 🐶 | Auto-refreshes every 5 minutes with LIVE data!

## 🚀 Quick Start

### Option 1: Double-click launcher
```
START_DASHBOARD.bat
```

### Option 2: Manual launch
```bash
cd hvac_wtw_command_center
.venv\Scripts\python main.py
```
Then open: **http://localhost:8780**

## 🎯 Features

| Tab | Description |
|-----|-------------|
| **📊 Executive** | KPIs, manager scorecard, charts, critical items, wins |
| **🗺️ Heat Map** | Interactive map showing TnT performance by store |
| **❄️ AHU/RTU** | All broken air handling & rooftop units (25 WOs) |
| **📡 Comm Loss** | Controllers offline with age tracking |
| **💧 Leak Summary** | Refrigerant leak events FY26 |
| **❄️ WtW Status** | Win-the-Winter checklist phases |
| **🏗️ Projects** | Active remodels and equipment replacements |
| **🛒 Sam's Club** | All 19 Sam's Clubs performance tracking |

## 📊 Data Coverage

- **187 Total Stores** (119 Supercenter + 42 NHM + 19 Sam's + 7 Discount)
- **4 Regional Managers**: ERIC GRAY, JASON MCALESTER, DAVID GUESS, DANE CLAYTON
- **25 AHU/RTU Work Orders** tracked with age
- **Live TnT %** (Time in Target) from BigQuery

## ⏰ Auto-Refresh

The dashboard automatically refreshes every **5 minutes**!

- Countdown timer in header shows time to next refresh
- Click **🔄 Refresh Now** button for manual refresh
- Green pulse dot indicates LIVE mode

## 🔗 Sharing

Click **🔗 Share Link** to copy the URL for teammates.

## 🛠️ Tech Stack

- **Backend**: FastAPI + Python 3.13
- **Frontend**: HTMX + Tailwind CSS + Chart.js + Leaflet
- **Data**: Embedded fallback + BigQuery (when available)

## 📁 Files

```
hvac_wtw_command_center/
├── main.py              # FastAPI server
├── data.py              # Embedded store/WO data
├── START_DASHBOARD.bat  # Windows launcher
├── templates/
│   └── index.html       # Main dashboard UI
└── static/js/
    └── app.js           # All frontend logic
```

---

**Made with ❤️ by Luna 🐶 for Walmart FM Engineering**
