# ReUseHub PowerShell Launcher
Set-Location -Path $PSScriptRoot

Write-Host "==============================================================================" -ForegroundColor Green
Write-Host "                     ReUseHub Application Launcher" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor Green
Write-Host ""

# 1. Verify Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not found on your system." -ForegroundColor Red
    Write-Host "Please install Node.js (v18+) from https://nodejs.org/"
    pause
    exit 1
}

# 2. Check .env
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Write-Host "[!] Creating .env from .env.example..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
    } else {
        Set-Content -Path ".env" -Value "VITE_APP_ENV=development"
    }
}

# 3. Check node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "[!] Installing project dependencies (npm install)..." -ForegroundColor Yellow
    npm.cmd install
}

Write-Host "[✓] Starting ReUseHub Dev Server (http://localhost:5173)..." -ForegroundColor Cyan
Write-Host "Press Ctrl + C in this terminal window to stop." -ForegroundColor Gray
Write-Host ""

npm.cmd run dev -- --open
