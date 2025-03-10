#!/bin/bash

echo "Setting up AI-Enhanced Security Scanner..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python is not installed! Please install Python 3.7 or later."
    exit 1
fi

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv security-env
if [ $? -ne 0 ]; then
    echo "Failed to create virtual environment!"
    exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source security-env/bin/activate
if [ $? -ne 0 ]; then
    echo "Failed to activate virtual environment!"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies!"
    exit 1
fi

# Check for HuggingFace API key
if [ -z "$HF_API_KEY" ]; then
    echo
    echo "IMPORTANT: HuggingFace API key not found!"
    echo "Please set your API key using:"
    echo "export HF_API_KEY=your_api_key_here"
    echo
    echo "You can get an API key from: https://huggingface.co/settings/tokens"
fi

echo
echo "Setup completed successfully!"
echo "To start the application:"
echo "1. Ensure your virtual environment is activated"
echo "2. Run: python antivirus_app.py"
echo 