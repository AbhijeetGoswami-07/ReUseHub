@echo off
setlocal
title ReUseHub - Sustainable Life Extension Platform
cd /d "%~dp0"

echo ==============================================================================
echo                      ReUseHub Application Launcher
echo               Give unwanted products a purposeful second life
echo ==============================================================================
echo.

REM 1. Verify Node.js
where node >nul 2>nul
if errorlevel 1 goto NoNode

REM 2. Verify npm
where npm >nul 2>nul
if errorlevel 1 goto NoNpm

echo [OK] Node.js environment detected:
call node -v
echo.

REM 3. Ensure .env exists
if exist .env goto EnvExists
echo [INFO] No .env file detected. Creating default .env from .env.example...
if exist .env.example (
    copy .env.example .env >nul
    echo [OK] Created .env file.
) else (
    echo VITE_APP_ENV=development> .env
    echo [OK] Created minimal .env file.
)
echo.
:EnvExists

REM 4. Check dependencies in node_modules
if exist node_modules goto ModulesExist
echo [INFO] Project dependencies not detected.
echo [*] Installing dependencies with npm install... Please wait.
echo.
call npm.cmd install
if errorlevel 1 goto InstallFailed
echo [OK] Dependencies installed successfully.
echo.
:ModulesExist

REM 5. Start development server and open browser
echo ==============================================================================
echo  [OK] System check passed!
echo  [*] Starting ReUseHub development server...
echo  [*] Launching default browser at http://localhost:5173/
echo.
echo  To stop the application, press Ctrl+C in this window.
echo ==============================================================================
echo.

call npm.cmd run dev -- --open
goto End

:NoNode
echo [ERROR] Node.js is not found on your system!
echo Please install Node.js v18 or higher from https://nodejs.org/
echo.
pause
exit /b 1

:NoNpm
echo [ERROR] npm is not found on your system!
echo Please ensure npm is installed alongside Node.js.
echo.
pause
exit /b 1

:InstallFailed
echo.
echo [ERROR] Failed to install project dependencies.
pause
exit /b 1

:End
echo.
echo [NOTE] Server stopped.
pause
