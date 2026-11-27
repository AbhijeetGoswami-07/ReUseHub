@echo off
setlocal enabledelayedexpansion
title ReUseHub - Local Development Server

echo ===================================================
echo               ReUseHub Platform
echo      Give Every Product a Second Life
echo ===================================================
echo.

:: 1. Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

:: 2. Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm is not found in your PATH.
    echo.
    pause
    exit /b 1
)

:: 3. Check node_modules dependencies
if not exist "node_modules\" (
    echo [INFO] Dependencies not found. Installing node_modules...
    echo.
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo.
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo.
    echo [SUCCESS] Dependencies installed successfully.
    echo.
)

:: 4. Start Development Server & Open Browser
echo [INFO] Starting Vite development server...
echo [INFO] Target URL: http://localhost:5173/
echo.
echo Press Ctrl+C in this window anytime to stop the server.
echo ===================================================
echo.

:: Launch browser in background after short delay
start "" http://localhost:5173/

:: Run Vite Dev Server
call npm run dev -- --host 127.0.0.1 --port 5173 --open

if %ERRORLEVEL% neq 0 (
    echo.
    echo [NOTICE] Development server stopped.
    pause
)
