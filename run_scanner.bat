@echo off
echo Starting AI Security Scanner...

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed! Please download and install Python from:
    echo https://www.python.org/downloads/
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

:: Install required packages if not already installed
echo Installing required packages...
python -m pip install requests tkinter >nul 2>&1

:: Set API key if not set
if "%HF_API_KEY%"=="" (
    echo Please enter your HuggingFace API key:
    set /p HF_API_KEY=
)

:: Run the scanner
python antivirus_app.py

pause 