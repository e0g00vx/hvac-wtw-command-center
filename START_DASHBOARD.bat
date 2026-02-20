@echo off
REM ================================================================
REM HVAC Win-the-Winter Command Center - Region 15B
REM Launcher Script for Franky Gonzalez Master Report
REM Auto-refreshes every 5 minutes with LIVE data!
REM ================================================================

echo.
echo  ==================================================
echo   HVAC Win-the-Winter Command Center - Region 15B
echo   Created by Luna for Franky Gonzalez
echo  ==================================================
echo.

cd /d "%~dp0"

REM Check if virtual environment exists
if not exist ".venv" (
    echo Creating virtual environment...
    uv venv --index-url https://pypi.ci.artifacts.walmart.com/artifactory/api/pypi/external-pypi/simple --allow-insecure-host pypi.ci.artifacts.walmart.com
    echo Installing dependencies...
    .venv\Scripts\pip install fastapi uvicorn jinja2 --index-url https://pypi.ci.artifacts.walmart.com/artifactory/api/pypi/external-pypi/simple --trusted-host pypi.ci.artifacts.walmart.com
)

echo.
echo Starting HVAC WtW Command Center on http://localhost:8780
echo Auto-refresh every 5 minutes | Press Ctrl+C to stop
echo.

REM Activate venv and run
call .venv\Scripts\activate
start "" http://localhost:8780
python main.py

pause
