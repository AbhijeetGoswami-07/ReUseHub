# ReUseHub - PowerShell Launcher Script
Write-Host "===================================================" -ForegroundColor Green
Write-Host "             ReUseHub Platform                    " -ForegroundColor Green
Write-Host "    Give Every Product a Second Life              " -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""

# 1. Check for Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}

# 2. Check for node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] node_modules not found. Running npm install..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] npm install failed." -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "[SUCCESS] Dependencies installed." -ForegroundColor Green
}

# 3. Start Vite dev server and open browser
Write-Host "[INFO] Starting Vite development server on http://localhost:5173/..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow
Write-Host ""

# Launch browser
Start-Process "http://localhost:5173/"

# Run server
npm run dev -- --host 127.0.0.1 --port 5173
