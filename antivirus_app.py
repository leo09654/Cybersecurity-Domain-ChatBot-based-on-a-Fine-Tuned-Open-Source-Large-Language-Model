import tkinter as tk
from tkinter import scrolledtext, filedialog, messagebox, ttk
import threading
import os
import time
import hashlib
import requests
from chatbot import HuggingFaceAPIClient

class AntivirusApp:
    def __init__(self, root):
        self.root = root
        self.root.title("AI-Enhanced Security Scanner")
        self.root.geometry("900x700")
        self.root.minsize(900, 700)
        
        # Initialize the AI assistant
        try:
            self.ai_assistant = HuggingFaceAPIClient()
            self.ai_ready = True
        except Exception as e:
            self.ai_ready = False
            messagebox.showwarning("AI Assistant", f"Could not initialize AI assistant: {str(e)}")
        
        self.setup_ui()
    
    def setup_ui(self):
        # Create main frame with dark theme support
        self.style = ttk.Style()
        self.style.configure("TFrame", background="#f0f0f0")
        self.style.configure("TLabel", background="#f0f0f0")
        self.style.configure("TButton", padding=5)
        
        main_frame = ttk.Frame(self.root)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)
        
        # Create notebook for tabs
        self.notebook = ttk.Notebook(main_frame)
        self.notebook.pack(fill=tk.BOTH, expand=True)
        
        # Create tabs
        self.scan_frame = ttk.Frame(self.notebook)
        self.assistant_frame = ttk.Frame(self.notebook)
        self.report_frame = ttk.Frame(self.notebook)
        
        self.notebook.add(self.scan_frame, text="Security Scan")
        self.notebook.add(self.assistant_frame, text="AI Assistant")
        self.notebook.add(self.report_frame, text="Scan Reports")
        
        # Setup each section
        self.setup_scan_section()
        self.setup_assistant_section()
        self.setup_report_section()
    
    def setup_scan_section(self):
        # Scan controls
        scan_controls = ttk.Frame(self.scan_frame)
        scan_controls.pack(fill=tk.X, pady=5)
        
        self.scan_path_var = tk.StringVar(value=os.path.expanduser("~"))
        path_entry = ttk.Entry(scan_controls, textvariable=self.scan_path_var, width=50)
        path_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 5))
        
        browse_btn = ttk.Button(scan_controls, text="Browse", command=self.browse_path)
        browse_btn.pack(side=tk.LEFT, padx=5)
        
        scan_btn = ttk.Button(scan_controls, text="Start Scan", command=self.start_scan)
        scan_btn.pack(side=tk.LEFT, padx=5)
        
        # Progress bar
        self.progress_var = tk.DoubleVar()
        self.progress = ttk.Progressbar(self.scan_frame, variable=self.progress_var, maximum=100)
        self.progress.pack(fill=tk.X, pady=5)
        
        # Scan results area
        results_frame = ttk.LabelFrame(self.scan_frame, text="Scan Results")
        results_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        self.scan_results = scrolledtext.ScrolledText(results_frame, height=10)
        self.scan_results.pack(fill=tk.BOTH, expand=True, pady=5)
        self.scan_results.insert(tk.END, "Ready to scan. Select a folder and click 'Start Scan'.\n")
        self.scan_results.config(state=tk.DISABLED)
    
    def setup_assistant_section(self):
        # Chat history area
        chat_frame = ttk.LabelFrame(self.assistant_frame, text="AI Security Assistant")
        chat_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        self.chat_history = scrolledtext.ScrolledText(chat_frame, height=20)
        self.chat_history.pack(fill=tk.BOTH, expand=True, pady=5)
        
        if self.ai_ready:
            welcome_msg = (
                "AI Assistant: Hello! I'm your security assistant. I can help you with:\n"
                "- Analyzing potential threats\n"
                "- Explaining security vulnerabilities\n"
                "- Providing security recommendations\n"
                "- Answering cybersecurity questions\n\n"
            )
            self.chat_history.insert(tk.END, welcome_msg)
        else:
            self.chat_history.insert(tk.END, "AI Assistant is not available. Please check your API key setup.\n\n")
        
        self.chat_history.config(state=tk.DISABLED)
        
        # Message input area
        input_frame = ttk.Frame(self.assistant_frame)
        input_frame.pack(fill=tk.X, pady=5)
        
        self.message_var = tk.StringVar()
        message_entry = ttk.Entry(input_frame, textvariable=self.message_var, width=70)
        message_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 5))
        message_entry.bind("<Return>", lambda event: self.send_message())
        
        send_btn = ttk.Button(input_frame, text="Send", command=self.send_message)
        send_btn.pack(side=tk.LEFT)
    
    def setup_report_section(self):
        # Report summary
        summary_frame = ttk.LabelFrame(self.report_frame, text="Scan Summary")
        summary_frame.pack(fill=tk.X, pady=5)
        
        self.total_scans = tk.StringVar(value="Total Scans: 0")
        self.threats_found = tk.StringVar(value="Threats Found: 0")
        self.last_scan = tk.StringVar(value="Last Scan: Never")
        
        ttk.Label(summary_frame, textvariable=self.total_scans).pack(pady=2)
        ttk.Label(summary_frame, textvariable=self.threats_found).pack(pady=2)
        ttk.Label(summary_frame, textvariable=self.last_scan).pack(pady=2)
        
        # Detailed reports
        reports_frame = ttk.LabelFrame(self.report_frame, text="Scan History")
        reports_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        self.reports_text = scrolledtext.ScrolledText(reports_frame, height=15)
        self.reports_text.pack(fill=tk.BOTH, expand=True, pady=5)
        self.reports_text.insert(tk.END, "No scans performed yet.\n")
        self.reports_text.config(state=tk.DISABLED)
    
    def browse_path(self):
        directory = filedialog.askdirectory(initialdir=self.scan_path_var.get())
        if directory:
            self.scan_path_var.set(directory)
    
    def start_scan(self):
        path = self.scan_path_var.get()
        if not os.path.exists(path):
            messagebox.showerror("Error", "Invalid path")
            return
        
        # Reset progress
        self.progress_var.set(0)
        
        # Clear and enable results area
        self.scan_results.config(state=tk.NORMAL)
        self.scan_results.delete(1.0, tk.END)
        self.scan_results.insert(tk.END, f"Starting scan of {path}...\n")
        self.scan_results.see(tk.END)
        self.scan_results.config(state=tk.DISABLED)
        
        # Start scan in a separate thread
        threading.Thread(target=self.perform_scan, args=(path,), daemon=True).start()
    
    def perform_scan(self, path):
        try:
            self.update_scan_status(f"Scanning {path}...\n")
            
            # Count total files first
            total_files = sum([len(files) for _, _, files in os.walk(path)])
            scanned_files = 0
            threats_found = 0
            
            # Scan each file
            for root, _, files in os.walk(path):
                for file in files:
                    file_path = os.path.join(root, file)
                    scanned_files += 1
                    
                    # Update progress
                    progress = (scanned_files / total_files) * 100
                    self.root.after(0, self.progress_var.set, progress)
                    
                    if scanned_files % 10 == 0:
                        self.update_scan_status(f"Scanned {scanned_files}/{total_files} files...\n")
                    
                    # Scan file (demo implementation)
                    try:
                        if os.path.getsize(file_path) < 10000000:  # Skip files larger than 10MB
                            with open(file_path, 'rb') as f:
                                content = f.read(1024)  # Read first 1KB for demo
                                file_hash = hashlib.md5(content).hexdigest()
                                
                                # Demo threat detection
                                if file_hash.startswith('a'):
                                    threats_found += 1
                                    self.update_scan_status(f"⚠️ ALERT: Potential threat in {file_path}\n")
                                    
                                    # Ask AI assistant about the potential threat
                                    if self.ai_ready:
                                        question = f"What security risks might be associated with a file having the MD5 hash {file_hash}?"
                                        threading.Thread(target=self.get_ai_analysis, args=(question, file_path), daemon=True).start()
                    
                    except Exception as e:
                        self.update_scan_status(f"Could not scan {file_path}: {str(e)}\n")
                    
                    time.sleep(0.01)  # Prevent UI freezing
            
            # Update final status
            self.update_scan_status(f"\nScan completed. Scanned {scanned_files} files. Found {threats_found} potential threats.\n")
            
            # Update report
            self.update_report(scanned_files, threats_found)
            
        except Exception as e:
            self.update_scan_status(f"Error during scan: {str(e)}\n")
        finally:
            self.root.after(0, self.progress_var.set, 100)
    
    def update_scan_status(self, message):
        self.root.after(0, self._update_scan_ui, message)
    
    def _update_scan_ui(self, message):
        self.scan_results.config(state=tk.NORMAL)
        self.scan_results.insert(tk.END, message)
        self.scan_results.see(tk.END)
        self.scan_results.config(state=tk.DISABLED)
    
    def get_ai_analysis(self, question, file_path):
        try:
            response = self.ai_assistant.generate_response(question)
            self.update_scan_status(f"\nAI Analysis for {os.path.basename(file_path)}:\n{response}\n")
        except Exception as e:
            self.update_scan_status(f"AI analysis error: {str(e)}\n")
    
    def send_message(self):
        message = self.message_var.get().strip()
        if not message:
            return
        
        self.message_var.set("")
        
        self.chat_history.config(state=tk.NORMAL)
        self.chat_history.insert(tk.END, f"You: {message}\n\n")
        self.chat_history.config(state=tk.DISABLED)
        self.chat_history.see(tk.END)
        
        if not self.ai_ready:
            self.update_chat("AI Assistant is not available.")
            return
        
        threading.Thread(target=self.get_ai_response, args=(message,), daemon=True).start()
    
    def get_ai_response(self, message):
        try:
            response = self.ai_assistant.generate_response(message)
            self.update_chat(response)
        except Exception as e:
            self.update_chat(f"Error: {str(e)}")
    
    def update_chat(self, message):
        self.root.after(0, self._update_chat_ui, message)
    
    def _update_chat_ui(self, message):
        self.chat_history.config(state=tk.NORMAL)
        self.chat_history.insert(tk.END, f"AI Assistant: {message}\n\n")
        self.chat_history.config(state=tk.DISABLED)
        self.chat_history.see(tk.END)
    
    def update_report(self, scanned_files, threats_found):
        # Update summary statistics
        current_total = int(self.total_scans.get().split(": ")[1])
        current_threats = int(self.threats_found.get().split(": ")[1])
        
        self.total_scans.set(f"Total Scans: {current_total + 1}")
        self.threats_found.set(f"Threats Found: {current_threats + threats_found}")
        self.last_scan.set(f"Last Scan: {time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Update detailed report
        self.reports_text.config(state=tk.NORMAL)
        self.reports_text.insert(1.0, f"Scan completed at {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        self.reports_text.insert(tk.END, f"Files scanned: {scanned_files}\n")
        self.reports_text.insert(tk.END, f"Threats found: {threats_found}\n")
        self.reports_text.insert(tk.END, "-" * 50 + "\n")
        self.reports_text.config(state=tk.DISABLED)

if __name__ == "__main__":
    root = tk.Tk()
    app = AntivirusApp(root)
    root.mainloop() 