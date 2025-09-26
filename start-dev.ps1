Write-Host "Starting Cost Curve Development Environment..." -ForegroundColor Green
Write-Host ""

Write-Host "================================================" -ForegroundColor Yellow
Write-Host "Starting Backend Server (Port 5000)..." -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Yellow

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"

Write-Host ""
Write-Host "Waiting 3 seconds for backend to initialize..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

Write-Host "================================================" -ForegroundColor Yellow
Write-Host "Starting Frontend Server (Port 3000)..." -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Yellow

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm start"

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "Development servers are starting!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "Frontend App: http://localhost:3000" -ForegroundColor White
Write-Host "Health Check: http://localhost:5000/health" -ForegroundColor White
Write-Host "API Documentation: http://localhost:5000/api" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")