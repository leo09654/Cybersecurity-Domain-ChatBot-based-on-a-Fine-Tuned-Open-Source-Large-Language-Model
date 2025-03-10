@echo off
echo Starting AI-Enhanced Security Scanner with n8n Automation...

:: Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo Docker is not installed! Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

:: Check for .env file
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please edit .env file with your configuration
    notepad .env
)

:: Create necessary directories
if not exist data\scan mkdir data\scan

:: Start the containers
echo Starting n8n and security scanner...
docker-compose up -d

echo.
echo Setup completed! You can access:
echo - n8n dashboard: http://localhost:5678
echo - Security scanner dashboard: http://localhost:3000
echo.
echo Press any key to view logs...
pause >nul

:: Show logs
docker-compose logs -f 