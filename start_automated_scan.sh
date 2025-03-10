#!/bin/bash

echo "Starting AI-Enhanced Security Scanner with n8n Automation..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed! Please install Docker:"
    echo "Ubuntu/Debian: sudo apt install docker.io"
    echo "MacOS: brew install docker"
    echo
    read -p "Press Enter to exit..."
    exit 1
fi

# Check for .env file
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env file with your configuration"
    if command -v nano &> /dev/null; then
        nano .env
    else
        vi .env
    fi
fi

# Create necessary directories
mkdir -p data/scan

# Start the containers
echo "Starting n8n and security scanner..."
docker-compose up -d

echo
echo "Setup completed! You can access:"
echo "- n8n dashboard: http://localhost:5678"
echo "- Security scanner dashboard: http://localhost:3000"
echo
echo "Press Ctrl+C to stop viewing logs..."
echo

# Show logs
docker-compose logs -f 