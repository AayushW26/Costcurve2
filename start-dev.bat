@echo off
echo Starting Cost Curve Development Environment...
echo.

echo ================================================
echo Starting Backend Server (Port 5000)...
echo ================================================
start cmd /k "cd backend && npm run dev"

echo.
echo Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak >nul

echo ================================================
echo Starting Frontend Server (Port 3000)...
echo ================================================
start cmd /k "cd frontend && npm start"

echo.
echo ================================================
echo Development servers are starting!
echo ================================================
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:3000
echo Health Check: http://localhost:5000/health
echo API Documentation: http://localhost:5000/api
echo.
echo Press any key to close this window...
pause >nul