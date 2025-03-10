# AI-Enhanced Security Scanner

An advanced security scanning application that combines traditional antivirus capabilities with AI-powered threat analysis.

## Features

- File system scanning with real-time progress tracking
- AI-powered threat analysis using HuggingFace models
- Interactive security assistant for cybersecurity queries
- Detailed scan reports and history
- Modern GUI with dark theme support

## Installation

### Automatic Setup (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-security-scanner.git
   cd ai-security-scanner
   ```

2. Run the automatic setup script:
   ```bash
   # Windows
   setup.bat

   # Linux/Mac
   ./setup.sh
   ```

The automatic setup will:
- Create a virtual environment
- Install required dependencies
- Configure environment variables
- Test the installation

### Manual Setup

1. Create and activate a virtual environment:
   ```bash
   # Create virtual environment
   python -m venv security-env

   # Activate on Windows
   security-env\Scripts\activate

   # Activate on Linux/Mac
   source security-env/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure the HuggingFace API:
   - Create an account at [HuggingFace](https://huggingface.co/)
   - Generate an API token in your profile settings
   - Set the environment variable:
     ```bash
     # Windows
     set HF_API_KEY=your_api_key_here

     # Linux/Mac
     export HF_API_KEY=your_api_key_here
     ```

## Usage

1. Start the application:
   ```bash
   python antivirus_app.py
   ```

2. The application provides three main features:
   - **Security Scan**: Select folders to scan for potential threats
   - **AI Assistant**: Ask security-related questions
   - **Scan Reports**: View history of scans and findings

## Configuration

### AI Model Settings

The application supports two modes:

1. **API Mode** (Default):
   - Uses HuggingFace's API
   - Requires internet connection
   - Faster response times
   - No local GPU required

2. **Local Mode**:
   - Edit `config.py` to enable:
     ```python
     USE_LOCAL_MODEL = True
     MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"  # or your preferred model
     ```
   - Requires more system resources
   - Works offline
   - May be slower on CPU-only systems

### Scan Settings

Modify `config.py` to adjust scan behavior:
```python
MAX_FILE_SIZE = 10_000_000  # Maximum file size to scan (in bytes)
SCAN_EXTENSIONS = ['.exe', '.dll', '.sys']  # File types to scan
THREAT_DETECTION_LEVEL = 'medium'  # 'low', 'medium', 'high'
```

## Troubleshooting

### Common Issues

1. **API Connection Errors**:
   - Check internet connection
   - Verify API key is set correctly
   - Ensure HuggingFace services are available

2. **Performance Issues**:
   - For CPU-only systems, use smaller models
   - Reduce scan scope for large directories
   - Close resource-intensive applications

3. **Memory Errors**:
   - Increase virtual memory
   - Reduce batch size in config.py
   - Use API mode instead of local mode

### Debug Mode

Enable debug logging:
```bash
# Windows
set DEBUG=1

# Linux/Mac
export DEBUG=1
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- HuggingFace for AI models and API
- Python tkinter for GUI
- Open source security community
