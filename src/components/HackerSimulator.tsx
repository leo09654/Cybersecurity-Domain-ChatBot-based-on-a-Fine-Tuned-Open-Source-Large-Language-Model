import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  useTheme
} from '@mui/material';
import {
  Terminal,
  Code,
  Lock,
  LocationOn,
  Storage,
  Security,
  NetworkCheck,
  BugReport,
  Visibility,
  Computer
} from '@mui/icons-material';

interface SimulatorWindow {
  id: string;
  title: string;
  content: string;
  type: 'terminal' | 'scan' | 'monitor';
  position: { x: number; y: number };
}

const HackerSimulator: React.FC = () => {
  const [windows, setWindows] = useState<SimulatorWindow[]>([]);
  const [terminalContent, setTerminalContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const theme = useTheme();

  const simulatedCommands = [
    'nmap -sS -sV -p- target.com',
    'sudo wireshark -i eth0',
    'hydra -l admin -P wordlist.txt target.com ssh',
    'sqlmap -u "http://target.com/page.php?id=1" --dbs',
    'dirb http://target.com/',
    'nikto -h target.com',
    'gobuster dir -u http://target.com -w wordlist.txt',
    'wpscan --url http://target.com --enumerate u',
    'aircrack-ng capture.cap -w wordlist.txt'
  ];

  const simulatedOutputs = {
    scan: [
      'Scanning target system...',
      'Port 22 (SSH): OPEN',
      'Port 80 (HTTP): OPEN',
      'Port 443 (HTTPS): OPEN',
      'Port 3306 (MySQL): FILTERED',
      'OS Detection: Linux 5.4.0',
      'Service Detection in progress...'
    ],
    monitor: [
      'Monitoring network traffic...',
      'Detected suspicious connection from 192.168.1.100',
      'High bandwidth usage on port 443',
      'Possible DDoS attempt detected',
      'Analyzing packet patterns...'
    ],
    system: [
      'CPU Usage: 78%',
      'Memory: 6.2GB/16GB',
      'Network: 2.5MB/s UP, 1.8MB/s DOWN',
      'Active Connections: 42',
      'Running Processes: 186'
    ]
  };

  const createWindow = (type: 'terminal' | 'scan' | 'monitor') => {
    const newWindow: SimulatorWindow = {
      id: Math.random().toString(36).substr(2, 9),
      title: type === 'terminal' ? 'Terminal' : type === 'scan' ? 'Network Scanner' : 'System Monitor',
      content: '',
      type,
      position: { x: Math.random() * 300, y: Math.random() * 200 }
    };
    setWindows([...windows, newWindow]);
    simulateOutput(newWindow.id, type);
  };

  const simulateOutput = (windowId: string, type: string) => {
    const outputs = type === 'terminal' ? simulatedCommands :
                   type === 'scan' ? simulatedOutputs.scan :
                   simulatedOutputs.monitor;
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < outputs.length) {
        setWindows(prev => prev.map(w => {
          if (w.id === windowId) {
            return {
              ...w,
              content: w.content + '\n' + outputs[index]
            };
          }
          return w;
        }));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!isTyping) {
      setIsTyping(true);
      const randomCommand = simulatedCommands[Math.floor(Math.random() * simulatedCommands.length)];
      let index = 0;
      const interval = setInterval(() => {
        if (index < randomCommand.length) {
          setTerminalContent(prev => prev + randomCommand[index]);
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          setTimeout(() => setTerminalContent(''), 2000);
        }
      }, 50);
    }
  };

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isTyping]);

  return (
    <Box sx={{ 
      height: '100vh', 
      backgroundColor: '#000',
      backgroundImage: 'radial-gradient(#0f0 1px, transparent 1px)',
      backgroundSize: '50px 50px',
      color: '#0f0',
      fontFamily: 'monospace',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Matrix Rain Effect */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        opacity: 0.1,
        zIndex: 1,
        animation: 'matrix 20s linear infinite',
        backgroundImage: 'linear-gradient(180deg, #0f0 0%, transparent 100%)',
        backgroundSize: '100% 500px',
        mixBlendMode: 'screen'
      }} />

      {/* Tool Icons with Glow Effect */}
      <Box sx={{ 
        position: 'fixed', 
        right: 20, 
        top: 20, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        zIndex: 2
      }}>
        <IconButton 
          onClick={() => createWindow('terminal')} 
          sx={{ 
            color: '#0f0',
            '&:hover': {
              boxShadow: '0 0 20px #0f0',
              backgroundColor: 'rgba(0, 255, 0, 0.1)'
            }
          }}
        >
          <Terminal />
        </IconButton>
        <IconButton 
          onClick={() => createWindow('scan')} 
          sx={{ 
            color: '#0f0',
            '&:hover': {
              boxShadow: '0 0 20px #0f0',
              backgroundColor: 'rgba(0, 255, 0, 0.1)'
            }
          }}
        >
          <NetworkCheck />
        </IconButton>
        <IconButton 
          onClick={() => createWindow('monitor')} 
          sx={{ 
            color: '#0f0',
            '&:hover': {
              boxShadow: '0 0 20px #0f0',
              backgroundColor: 'rgba(0, 255, 0, 0.1)'
            }
          }}
        >
          <Computer />
        </IconButton>
      </Box>

      {/* Floating Windows with Enhanced Style */}
      {windows.map(window => (
        <Card
          key={window.id}
          sx={{
            position: 'absolute',
            left: window.position.x,
            top: window.position.y,
            minWidth: 400,
            backgroundColor: 'rgba(0,0,0,0.9)',
            border: '1px solid #0f0',
            boxShadow: '0 0 10px #0f0',
            color: '#0f0',
            borderRadius: 1,
            backdropFilter: 'blur(5px)',
            '&:hover': {
              boxShadow: '0 0 20px #0f0'
            },
            animation: 'windowFadeIn 0.3s ease-out'
          }}
        >
          <Box sx={{ 
            p: 1, 
            borderBottom: '1px solid #0f0', 
            display: 'flex', 
            justifyContent: 'space-between',
            background: 'linear-gradient(90deg, #0f01 0%, #0f02 100%)'
          }}>
            <Typography variant="body2" sx={{ textShadow: '0 0 5px #0f0' }}>
              {window.title}
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => setWindows(prev => prev.filter(w => w.id !== window.id))}
              sx={{ 
                color: '#0f0', 
                p: 0,
                '&:hover': {
                  color: '#f00',
                  textShadow: '0 0 10px #f00'
                }
              }}
            >
              ×
            </IconButton>
          </Box>
          <Box sx={{ 
            p: 1, 
            whiteSpace: 'pre-wrap', 
            fontFamily: 'monospace',
            fontSize: '0.9em',
            letterSpacing: '0.05em',
            textShadow: '0 0 2px #0f0'
          }}>
            {window.content}
          </Box>
        </Card>
      ))}

      {/* Enhanced Terminal */}
      <Box sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        p: 2, 
        backgroundColor: 'rgba(0,0,0,0.95)',
        borderTop: '1px solid #0f0',
        boxShadow: '0 -5px 20px rgba(0,255,0,0.2)',
        backdropFilter: 'blur(5px)'
      }}>
        <Typography variant="body2" sx={{ 
          fontFamily: 'monospace',
          letterSpacing: '0.1em',
          textShadow: '0 0 5px #0f0'
        }}>
          root@system:~$ {terminalContent}
          <span style={{ 
            animation: 'blink 1s infinite',
            boxShadow: '0 0 5px #0f0'
          }}>█</span>
        </Typography>
      </Box>

      <style>
        {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          @keyframes matrix {
            0% { background-position: 0 0; }
            100% { background-position: 0 500px; }
          }
          @keyframes windowFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
};

export default HackerSimulator; 