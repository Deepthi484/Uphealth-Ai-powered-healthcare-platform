@echo off
echo Installing Python requirements for FastAPI...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo Python found. Installing requirements...
pip install -r requirements.txt

if %errorlevel% equ 0 (
    echo.
    echo ✅ Requirements installed successfully!
    echo.
    echo To start the FastAPI server:
    echo    python start_fastapi.py
    echo.
    echo To test the endpoints:
    echo    python test_fastapi.py
    echo.
) else (
    echo.
    echo ❌ Failed to install requirements
    echo Please check the error messages above
)

pause

