# AI Model Configuration
USE_LOCAL_MODEL = False  # Set to True to use local model instead of API
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"  # Default model for local mode
API_TIMEOUT = 30  # Timeout for API requests in seconds
MAX_RETRIES = 3  # Number of API request retries

# Scan Configuration
MAX_FILE_SIZE = 10_000_000  # Maximum file size to scan (10MB)
SCAN_EXTENSIONS = [
    # Executables
    '.exe', '.dll', '.sys', '.ocx', '.com',
    # Scripts
    '.bat', '.cmd', '.ps1', '.vbs', '.js',
    # Archives
    '.zip', '.rar', '.7z', '.tar', '.gz',
    # Documents
    '.pdf', '.doc', '.docx', '.xls', '.xlsx',
    # Web
    '.html', '.htm', '.php', '.asp', '.aspx'
]

# Threat Detection Settings
THREAT_DETECTION_LEVEL = 'medium'  # 'low', 'medium', 'high'
HASH_BLOCK_SIZE = 1024  # Size of blocks to read when calculating file hashes

# UI Configuration
DARK_MODE = False  # Default theme
WINDOW_SIZE = "900x700"  # Default window size
FONT_FAMILY = "Segoe UI"  # Default font
FONT_SIZE = 10  # Default font size

# Debug Configuration
DEBUG = False  # Enable debug logging
LOG_FILE = "security_scanner.log"  # Log file path

# Performance Settings
THREAD_POOL_SIZE = 4  # Number of threads for scanning
BATCH_SIZE = 32  # Batch size for AI model inference
USE_GPU = False  # Whether to use GPU for local model (if available) 