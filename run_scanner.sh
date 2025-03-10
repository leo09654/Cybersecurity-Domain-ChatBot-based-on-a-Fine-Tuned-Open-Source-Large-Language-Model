#!/bin/bash

echo "Starting AI Security Scanner..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python is not installed! Please install Python using your package manager:"
    echo "Ubuntu/Debian: sudo apt install python3"
    echo "MacOS: brew install python3"
    echo
    read -p "Press Enter to exit..."
    exit 1
fi

# Install required packages if not already installed
echo "Installing required packages..."
python3 -m pip install requests tkinter >/dev/null 2>&1

# Set API key if not set
if [ -z "$HF_API_KEY" ]; then
    echo "Please enter your HuggingFace API key:"
    read HF_API_KEY
    export HF_API_KEY
fi

# Run the scanner
python3 antivirus_app.py

read -p "Press Enter to exit..." 