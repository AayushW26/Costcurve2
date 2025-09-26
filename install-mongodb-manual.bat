@echo off
echo ================================================
echo MongoDB Manual Installation for Cost Curve
echo ================================================
echo.

echo Creating MongoDB data directories...
mkdir "C:\data\db" 2>nul
mkdir "C:\data\log" 2>nul
echo ✅ Data directories created

echo.
echo Opening MongoDB download page...
echo Please download and install MongoDB Community Server
echo.

echo 📋 Installation Instructions:
echo 1. Download "MongoDB Community Server" for Windows
echo 2. Choose "Complete" installation
echo 3. ✅ CHECK "Install MongoDB as a Service"
echo 4. Keep default service name and data directory
echo 5. Optional: Install MongoDB Compass (GUI tool)
echo.

start https://www.mongodb.com/try/download/community

echo ================================================
echo After installation, MongoDB will start automatically
echo Default connection: mongodb://localhost:27017
echo ================================================
echo.

pause
echo.

echo Checking if MongoDB is running...
timeout /t 3 /nobreak >nul

net start | findstr /i "mongo" >nul
if %errorlevel%==0 (
    echo ✅ MongoDB service is running!
) else (
    echo ⚠️  MongoDB service not found. After installation:
    echo    Run: net start MongoDB
)

echo.
echo Press any key to continue...
pause >nul