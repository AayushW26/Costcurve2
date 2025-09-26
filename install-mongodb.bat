@echo off
echo ================================================
echo MongoDB Community Server Installer for Windows
echo ================================================
echo.

echo This script will help you install MongoDB Community Server
echo.

echo Step 1: Opening MongoDB download page...
start https://www.mongodb.com/try/download/community
echo.

echo Step 2: Download Instructions:
echo - Select: "Windows x64"  
echo - Version: Latest (currently 7.x)
echo - Package: msi
echo - Click "Download"
echo.

echo Step 3: Installation Instructions:
echo - Run the downloaded .msi file
echo - Choose "Complete" installation type
echo - Check "Install MongoDB as a Service"
echo - Check "Install MongoDB Compass" (optional GUI)
echo - Complete the installation
echo.

echo Step 4: After Installation:
echo - MongoDB will start automatically as a Windows service
echo - Verify with: mongod --version
echo - MongoDB will run on: mongodb://localhost:27017
echo.

echo ================================================
echo Alternative: Use MongoDB Atlas (Cloud)
echo ================================================
echo.
echo If you prefer cloud database (recommended for beginners):
echo 1. Go to: https://www.mongodb.com/atlas
echo 2. Create free account and cluster
echo 3. Get connection string
echo 4. Update MONGODB_URI in backend/.env
echo.

pause
echo.

echo Opening MongoDB Atlas signup page...
start https://www.mongodb.com/atlas/register

echo.
echo Choose your preferred option:
echo [1] Local MongoDB Community Server (download started)
echo [2] MongoDB Atlas Cloud (signup started)
echo.

pause