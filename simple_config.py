# Simple configuration file for AI Security Scanner

# Scan settings
SCAN_TYPES = [
    '.exe',  # Windows executables
    '.dll',  # Windows libraries
    '.bat',  # Batch files
    '.ps1',  # PowerShell scripts
    '.zip',  # Archives
    '.pdf',  # Documents
]

# Maximum file size to scan (in bytes)
MAX_FILE_SIZE = 10_000_000  # 10MB

# Security level
SECURITY_LEVEL = 'medium'  # Options: low, medium, high

# Window settings
WINDOW_TITLE = "AI Security Scanner"
WINDOW_SIZE = "800x600"

# Colors
BACKGROUND_COLOR = "#f0f0f0"
TEXT_COLOR = "#000000"
BUTTON_COLOR = "#4a90e2"
ALERT_COLOR = "#ff4444" 