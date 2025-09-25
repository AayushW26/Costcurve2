@echo off
echo 🚀 Setting up Cost Curve Web Scraper
echo ==================================

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.7+ first.
    pause
    exit /b 1
)

echo ✅ Python found: 
python --version

REM Navigate to backend directory
cd /d "%~dp0"

REM Install Python dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies
    pause
    exit /b 1
)

echo ✅ Python dependencies installed successfully!

REM Test the scraper
echo 🧪 Testing the scraper...
python test_scraper.py

echo 🎉 Setup complete!
echo.
echo To start the backend server:
echo   npm run dev
echo.
echo To test the scraper manually:
echo   python scraper.py "iPhone 15"
pause