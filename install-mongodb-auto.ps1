# MongoDB Community Server Installation Script for Windows
Write-Host "🍃 Installing MongoDB Community Server..." -ForegroundColor Green

# Create MongoDB directories
$mongoPath = "C:\Program Files\MongoDB"
$dataPath = "C:\data\db"
$logPath = "C:\data\log"

Write-Host "📁 Creating MongoDB directories..." -ForegroundColor Yellow

# Create data directory
if (!(Test-Path $dataPath)) {
    New-Item -ItemType Directory -Path $dataPath -Force
    Write-Host "✅ Created data directory: $dataPath" -ForegroundColor Green
}

# Create log directory
if (!(Test-Path $logPath)) {
    New-Item -ItemType Directory -Path $logPath -Force
    Write-Host "✅ Created log directory: $logPath" -ForegroundColor Green
}

# Download MongoDB Community Server
$downloadUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.14.msi"
$downloadPath = "$env:TEMP\mongodb-installer.msi"

Write-Host "⬇️ Downloading MongoDB Community Server..." -ForegroundColor Yellow
Write-Host "URL: $downloadUrl" -ForegroundColor Cyan

try {
    # Download the installer
    Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadPath -UseBasicParsing
    Write-Host "✅ Download completed: $downloadPath" -ForegroundColor Green
    
    # Install MongoDB
    Write-Host "🔧 Installing MongoDB..." -ForegroundColor Yellow
    Write-Host "This will open the installer. Please follow these steps:" -ForegroundColor Cyan
    Write-Host "1. Choose 'Complete' installation" -ForegroundColor White
    Write-Host "2. Check 'Install MongoDB as a Service'" -ForegroundColor White
    Write-Host "3. Keep default service settings" -ForegroundColor White
    Write-Host "4. Optionally install MongoDB Compass (GUI tool)" -ForegroundColor White
    
    # Start the installer
    Start-Process -FilePath $downloadPath -Wait
    
    Write-Host "✅ MongoDB installation completed!" -ForegroundColor Green
    
    # Clean up
    Remove-Item $downloadPath -Force
    
} catch {
    Write-Host "❌ Error downloading MongoDB: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Manual download link: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 Post-installation steps:" -ForegroundColor Yellow
Write-Host "1. MongoDB should now be running as a Windows service" -ForegroundColor White
Write-Host "2. Default connection: mongodb://localhost:27017" -ForegroundColor White
Write-Host "3. Data directory: $dataPath" -ForegroundColor White
Write-Host "4. Log directory: $logPath" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")