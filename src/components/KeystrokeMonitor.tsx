import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  IconButton,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  Keyboard,
  Timeline,
  Security,
  Warning
} from '@mui/icons-material';

interface KeystrokeEvent {
  key: string;
  timestamp: number;
  type: 'keydown' | 'keyup';
  duration?: number;
}

interface Pattern {
  sequence: string[];
  risk: 'low' | 'medium' | 'high';
  description: string;
}

const suspiciousPatterns: Pattern[] = [
  {
    sequence: ['Control', 'c'],
    risk: 'medium',
    description: 'Copy operation detected'
  },
  {
    sequence: ['Control', 'v'],
    risk: 'high',
    description: 'Paste operation detected'
  },
  {
    sequence: ['Alt', 'Tab'],
    risk: 'medium',
    description: 'Window switching detected'
  },
  {
    sequence: ['Control', 'Alt', 'Delete'],
    risk: 'high',
    description: 'System command detected'
  }
];

const KeystrokeMonitor: React.FC = () => {
  const [keystrokes, setKeystrokes] = useState<KeystrokeEvent[]>([]);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const theme = useTheme();

  const handleKeyDown = (e: KeyboardEvent) => {
    const newKeystroke: KeystrokeEvent = {
      key: e.key,
      timestamp: Date.now(),
      type: 'keydown'
    };

    setKeystrokes(prev => [...prev, newKeystroke]);
    setActiveKeys(prev => new Set(prev).add(e.key));

    // Check for patterns
    const currentKeys = Array.from(new Set([...Array.from(activeKeys), e.key]));
    checkPatterns(currentKeys);

    // Calculate typing speed
    const recentKeystrokes = keystrokes.filter(k => 
      k.timestamp > Date.now() - 5000
    ).length;
    setTypingSpeed(recentKeystrokes / 5); // keystrokes per second
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    const matchingDownstroke = keystrokes.findIndex(k => 
      k.key === e.key && k.type === 'keydown' && !k.duration
    );

    if (matchingDownstroke !== -1) {
      const updatedKeystrokes = [...keystrokes];
      updatedKeystrokes[matchingDownstroke].duration = 
        Date.now() - updatedKeystrokes[matchingDownstroke].timestamp;
      setKeystrokes(updatedKeystrokes);
    }

    setActiveKeys(prev => {
      const updated = new Set(prev);
      updated.delete(e.key);
      return updated;
    });
  };

  const checkPatterns = (currentKeys: string[]) => {
    suspiciousPatterns.forEach(pattern => {
      if (pattern.sequence.every(key => currentKeys.includes(key))) {
        setPatterns(prev => [...prev, pattern]);
        logActivity(pattern);
      }
    });
  };

  const logActivity = (pattern: Pattern) => {
    const activity = {
      timestamp: new Date().toISOString(),
      type: 'keystroke_pattern',
      severity: pattern.risk,
      details: pattern.description
    };

    // Store in localStorage
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    activities.push(activity);
    localStorage.setItem('activities', JSON.stringify(activities));
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keystrokes, activeKeys]);

  return (
    <Card sx={{ 
      bgcolor: 'black',
      backgroundImage: 'linear-gradient(45deg, rgba(0,255,0,0.05) 25%, transparent 25%, transparent 75%, rgba(0,255,0,0.05) 75%)',
      backgroundSize: '10px 10px',
      p: 2,
      height: '100%',
      border: '1px solid #0f0',
      boxShadow: '0 0 20px rgba(0,255,0,0.2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Scan Effect */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        backgroundColor: '#0f0',
        opacity: 0.5,
        animation: 'scan 2s linear infinite',
        boxShadow: '0 0 20px #0f0',
        zIndex: 1
      }} />

      {/* Header */}
      <Box sx={{ 
        mb: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        position: 'relative',
        zIndex: 2
      }}>
        <Keyboard sx={{ 
          color: '#0f0',
          animation: 'pulse 2s infinite',
          filter: 'drop-shadow(0 0 5px #0f0)'
        }} />
        <Typography variant="h6" sx={{ 
          color: '#0f0',
          textShadow: '0 0 10px #0f0',
          fontFamily: 'monospace',
          letterSpacing: '0.1em'
        }}>
          KEYSTROKE MONITOR v2.0
        </Typography>
      </Box>

      {/* Active Keys Display */}
      <Box sx={{ mb: 3, position: 'relative', zIndex: 2 }}>
        <Typography variant="subtitle2" sx={{ 
          color: '#0f0',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          mb: 1
        }}>
          Active Keys
        </Typography>
        <Grid container spacing={1}>
          {Array.from(activeKeys).map(key => (
            <Grid item key={key}>
              <Card sx={{ 
                p: 1, 
                bgcolor: 'rgba(0,255,0,0.1)',
                border: '1px solid #0f0',
                color: '#0f0',
                minWidth: '40px',
                textAlign: 'center',
                animation: 'keyPress 0.3s ease-out',
                boxShadow: '0 0 10px rgba(0,255,0,0.3)',
                '&:hover': {
                  boxShadow: '0 0 20px #0f0'
                }
              }}>
                <Typography variant="body2" sx={{ 
                  fontFamily: 'monospace',
                  textShadow: '0 0 5px #0f0'
                }}>
                  {key}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Typing Speed with Enhanced Visual */}
      <Box sx={{ mb: 3, position: 'relative', zIndex: 2 }}>
        <Typography variant="subtitle2" sx={{ 
          color: '#0f0',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          mb: 1
        }}>
          Typing Speed
        </Typography>
        <Box sx={{ 
          position: 'relative',
          height: '20px',
          border: '1px solid #0f0',
          borderRadius: '2px',
          overflow: 'hidden',
          boxShadow: '0 0 10px rgba(0,255,0,0.2)'
        }}>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(typingSpeed * 10, 100)} 
            sx={{
              height: '100%',
              backgroundColor: 'rgba(0,255,0,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#0f0',
                boxShadow: '0 0 10px #0f0'
              }
            }}
          />
        </Box>
        <Typography variant="caption" sx={{ 
          color: '#0f0',
          display: 'block',
          textAlign: 'right',
          mt: 0.5,
          fontFamily: 'monospace'
        }}>
          {typingSpeed.toFixed(1)} KPS
        </Typography>
      </Box>

      {/* Pattern Detection with Enhanced Visuals */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <Typography variant="subtitle2" sx={{ 
          color: '#0f0',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          mb: 1
        }}>
          Detected Patterns
        </Typography>
        {patterns.slice(-5).map((pattern, index) => (
          <Box 
            key={index}
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1,
              p: 1,
              bgcolor: 'rgba(0,0,0,0.8)',
              border: `1px solid ${
                pattern.risk === 'high' ? '#f00' :
                pattern.risk === 'medium' ? '#ff0' :
                '#0f0'
              }`,
              boxShadow: `0 0 10px ${
                pattern.risk === 'high' ? 'rgba(255,0,0,0.3)' :
                pattern.risk === 'medium' ? 'rgba(255,255,0,0.3)' :
                'rgba(0,255,0,0.3)'
              }`,
              color: pattern.risk === 'high' ? '#f00' :
                     pattern.risk === 'medium' ? '#ff0' :
                     '#0f0',
              borderRadius: 1,
              animation: 'patternAlert 0.5s ease-out',
              backdropFilter: 'blur(5px)'
            }}
          >
            <Warning sx={{ 
              animation: 'pulse 2s infinite',
              filter: `drop-shadow(0 0 5px ${
                pattern.risk === 'high' ? '#f00' :
                pattern.risk === 'medium' ? '#ff0' :
                '#0f0'
              })`
            }} />
            <Typography variant="body2" sx={{ 
              fontFamily: 'monospace',
              textShadow: `0 0 5px ${
                pattern.risk === 'high' ? '#f00' :
                pattern.risk === 'medium' ? '#ff0' :
                '#0f0'
              }`
            }}>
              {pattern.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <style>
        {`
          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100vh); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes keyPress {
            0% { transform: scale(0.95); opacity: 0.5; }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes patternAlert {
            0% { transform: translateX(-10px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </Card>
  );
};

export default KeystrokeMonitor; 