@echo off
echo Setting up AI-Enhanced Security Scanner...

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed! Please install Python 3.7 or later.
    exit /b 1
)

:: Create virtual environment
echo Creating virtual environment...
python -m venv security-env
if errorlevel 1 (
    echo Failed to create virtual environment!
    exit /b 1
)

:: Activate virtual environment
echo Activating virtual environment...
call security-env\Scripts\activate
if errorlevel 1 (
    echo Failed to activate virtual environment!
    exit /b 1
)

:: Install dependencies
echo Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Failed to install dependencies!
    exit /b 1
)

:: Check for HuggingFace API key
if "%HF_API_KEY%"=="" (
    echo.
    echo IMPORTANT: HuggingFace API key not found!
    echo Please set your API key using:
    echo set HF_API_KEY=your_api_key_here
    echo.
    echo You can get an API key from: https://huggingface.co/settings/tokens
)

echo.
echo Setup completed successfully!
echo To start the application:
echo 1. Ensure your virtual environment is activated
echo 2. Run: python antivirus_app.py
echo. 