import React, { ReactElement } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Badge,
  useTheme as useMuiTheme
} from '@mui/material';
import {
  Security,
  BugReport,
  Language,
  Lock,
  Shield,
  Visibility,
  NetworkCheck,
  Code,
  Storage,
  CloudQueue,
  Build,
  VpnKey,
  CloudDownload,
  MonitorHeart,
  VerifiedUser,
  Https,
  DataUsage,
  Wifi,
  WifiLock,
  SmartToy,
  Psychology,
  Analytics,
  Scanner,
  Keyboard,
  Monitor,
  ScreenShare,
  Mouse
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

interface SecurityTool {
  id: string;
  name: string;
  category: string;
  icon: ReactElement;
  description: string;
  lastUsed?: string;
  findings?: number;
  url?: string;
  features?: string[];
}

const securityTools: SecurityTool[] = [
  // ... existing tools ...

  // Add new System Monitoring category tools
  {
    id: 'keystroke-spy',
    name: 'Keystroke Spy',
    category: 'System Monitoring',
    icon: <Keyboard />,
    description: 'Advanced keystroke monitoring and analysis tool',
    features: [
      'Real-time keystroke logging',
      'Pattern analysis',
      'Keyboard activity monitoring',
      'Input validation checks',
      'Suspicious pattern detection'
    ]
  },
  {
    id: 'screen-monitor',
    name: 'Screen Monitor',
    category: 'System Monitoring',
    icon: <Monitor />,
    description: 'Screen activity monitoring and analysis',
    features: [
      'Real-time screen capture',
      'Activity recording',
      'Screenshot analysis',
      'Screen pattern detection',
      'Visual security monitoring'
    ]
  },
  {
    id: 'input-tracker',
    name: 'Input Tracker',
    category: 'System Monitoring',
    icon: <Mouse />,
    description: 'Mouse and input device monitoring',
    features: [
      'Mouse movement tracking',
      'Click pattern analysis',
      'Input device monitoring',
      'Behavior analysis',
      'Anomaly detection'
    ]
  },
  {
    id: 'activity-monitor',
    name: 'Activity Monitor',
    category: 'System Monitoring',
    icon: <ScreenShare />,
    description: 'Comprehensive system activity monitoring',
    features: [
      'Process monitoring',
      'Application tracking',
      'System resource analysis',
      'User activity logging',
      'Behavioral analytics'
    ]
  }

  // ... rest of the existing tools ...
];

// Update handleToolClick function to include System Monitoring category
const handleToolClick = (tool: SecurityTool) => {
  const timestamp = new Date().toISOString();
  const findings = Math.floor(Math.random() * 10);
  let severity = findings > 7 ? 'critical' : findings > 5 ? 'high' : findings > 3 ? 'medium' : 'low';
  let details = `Completed security scan using ${tool.name}`;

  switch (tool.category) {
    // ... existing cases ...
    
    case 'System Monitoring':
      severity = tool.name === 'Keystroke Spy' ? 'high' : 'medium';
      details = `Started system monitoring using ${tool.name}`;
      break;

    // ... rest of the cases ...
  }

  const toolActivity = {
    timestamp,
    action: `${tool.name} ${
      tool.category === 'AI Security' ? 'Analysis' : 
      tool.category === 'VPN' ? 'Download' : 
      tool.category === 'System Monitoring' ? 'Monitoring' :
      'Operation'
    }`,
    details,
    type: tool.category.toLowerCase(),
    toolName: tool.name,
    severity,
    findings: ['VPN', 'SSL/TLS', 'Firewall', 'SIEM', 'AI Security'].includes(tool.category) ? undefined : findings
  };

  const activities = JSON.parse(localStorage.getItem('activities') || '[]');
  activities.push(toolActivity);
  localStorage.setItem('activities', JSON.stringify(activities));

  tool.lastUsed = timestamp;
  if (!['VPN', 'SSL/TLS', 'Firewall', 'SIEM', 'AI Security'].includes(tool.category)) {
    tool.findings = findings;
  }
};

const SecurityToolsTracker: React.FC = () => {
  const { isDarkMode } = useTheme();
  const muiTheme = useMuiTheme();
  
  // Radar constants
  const MIN_ANGLE = 15;
  const MAX_ANGLE = 165;
  const SCAN_DELAY = 30;
  const MAX_DISTANCE = 40; // cm
  
  // State for radar calculations
  const [currentAngle, setCurrentAngle] = React.useState(MIN_ANGLE);
  const [isReversed, setIsReversed] = React.useState(false);
  const [distances, setDistances] = React.useState<{[key: number]: number}>({});
  const [noObject, setNoObject] = React.useState("Out of Range");
  
  // Calculate pixel distance
  const calculatePixelDistance = (distance: number) => {
    return distance * ((400 - 400 * 0.1666) * 0.025);
  };

  // Update radar sweep
  React.useEffect(() => {
    const updateRadar = () => {
      setCurrentAngle(prev => {
        let next;
        if (!isReversed) {
          next = prev + 1;
          if (next >= MAX_ANGLE) {
            setIsReversed(true);
            return MAX_ANGLE;
          }
        } else {
          next = prev - 1;
          if (next <= MIN_ANGLE) {
            setIsReversed(false);
            return MIN_ANGLE;
          }
        }
        return next;
      });

      // Simulate distance reading
      const newDistance = Math.floor(Math.random() * 50);
      setDistances(prev => ({
        ...prev,
        [currentAngle]: newDistance
      }));
      setNoObject(newDistance > MAX_DISTANCE ? "Out of Range" : "In Range");
    };

    const interval = setInterval(updateRadar, SCAN_DELAY);
    return () => clearInterval(interval);
  }, [currentAngle, isReversed]);

  const groupedTools = securityTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, SecurityTool[]>);

  return (
    <Card sx={{ 
      position: 'relative',
      bgcolor: 'black',
      color: '#0f0',
      overflow: 'hidden',
      minHeight: '700px'
    }}>
      {/* Radar Display */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '1000px',
        height: '500px',
        borderRadius: '0',
        overflow: 'hidden'
      }}>
        {/* Motion Blur Effect */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0,0,0,0.96)',
          zIndex: 1
        }} />

        {/* Radar Arcs */}
        <Box sx={{
          position: 'absolute',
          bottom: '7.4%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1000px',
          height: '1000px',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '50%',
            borderTop: '2px solid #62f51f',
            borderRadius: '50% 50% 0 0'
          }
        }}>
          {/* Distance Arcs */}
          {[0.0625, 0.27, 0.479, 0.687].map((ratio, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: `${100 - ratio * 100}%`,
                height: `${(100 - ratio * 100) / 2}%`,
                borderTop: '2px solid #62f51f',
                borderRadius: '50% 50% 0 0'
              }}
            />
          ))}

          {/* Angle Lines */}
          {[30, 60, 90, 120, 150].map((angle) => (
            <Box
              key={angle}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                width: '1px',
                height: '50%',
                bgcolor: '#62f51f',
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'bottom'
              }}
            />
          ))}
        </Box>

        {/* Scanner Line */}
        <Box sx={{
          position: 'absolute',
          bottom: '7.4%',
          left: '50%',
          width: '2px',
          height: '460px',
          bgcolor: '#1eff3c',
          transform: `translateX(-50%) rotate(${currentAngle}deg)`,
          transformOrigin: 'bottom',
          boxShadow: '0 0 10px #1eff3c',
          zIndex: 3
        }} />

        {/* Target Object */}
        {distances[currentAngle] && distances[currentAngle] <= MAX_DISTANCE && (
          <Box sx={{
            position: 'absolute',
            bottom: '7.4%',
            left: '50%',
            width: '4px',
            height: `${calculatePixelDistance(distances[currentAngle])}px`,
            bgcolor: '#ff0a0a',
            transform: `translateX(-50%) rotate(${currentAngle}deg)`,
            transformOrigin: 'bottom',
            boxShadow: '0 0 20px #ff0a0a',
            zIndex: 2
          }} />
        )}

        {/* Text Display */}
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '7.4%',
          bgcolor: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 4,
          zIndex: 4
        }}>
          <Typography sx={{ 
            color: '#62f51f',
            fontSize: '40px',
            fontFamily: 'monospace'
          }}>
            Security Radar
          </Typography>
          <Typography sx={{ 
            color: '#62f51f',
            fontSize: '40px',
            fontFamily: 'monospace'
          }}>
            Angle: {currentAngle}°
          </Typography>
          <Typography sx={{ 
            color: '#62f51f',
            fontSize: '40px',
            fontFamily: 'monospace'
          }}>
            Distance: {distances[currentAngle] <= MAX_DISTANCE ? `${distances[currentAngle]} cm` : noObject}
          </Typography>
        </Box>

        {/* Distance Labels */}
        <Box sx={{
          position: 'absolute',
          bottom: '8.33%',
          right: '7.29%',
          display: 'flex',
          gap: '50px',
          zIndex: 4
        }}>
          {[10, 20, 30, 40].map((dist) => (
            <Typography key={dist} sx={{ 
              color: '#62f51f',
              fontSize: '25px',
              fontFamily: 'monospace'
            }}>
              {dist}cm
            </Typography>
          ))}
        </Box>

        {/* Angle Labels */}
        {[30, 60, 90, 120, 150].map((angle) => (
          <Typography
            key={angle}
            sx={{
              position: 'absolute',
              bottom: `${15 + Math.sin(angle * Math.PI / 180) * 40}%`,
              left: `${50 + Math.cos(angle * Math.PI / 180) * 40}%`,
              color: '#3cf53c',
              fontSize: '25px',
              fontFamily: 'monospace',
              transform: `rotate(${-angle + 90}deg)`,
              zIndex: 4
            }}
          >
            {angle}°
          </Typography>
        ))}
      </Box>

      <CardContent sx={{ position: 'relative', zIndex: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          color: '#0f0',
          textShadow: '0 0 10px #0f0'
        }}>
          <Security sx={{ 
            mr: 1, 
            animation: 'pulse 2s infinite',
            filter: 'drop-shadow(0 0 5px #0f0)'
          }} />
          <Typography variant="h6" sx={{ 
            fontFamily: 'monospace',
            letterSpacing: '0.1em'
          }}>
            SECURITY TOOLS RADAR
          </Typography>
        </Box>

        {/* Rest of your existing component content */}
        {Object.entries(groupedTools).map(([category, tools]) => (
          <Box key={category} sx={{ mb: 4, position: 'relative' }}>
            <Typography variant="h6" sx={{ 
              mb: 2, 
              color: '#0f0',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              textShadow: '0 0 5px #0f0',
              fontFamily: 'monospace'
            }}>
              {category}
            </Typography>
            <Grid container spacing={2}>
              {tools.map((tool) => (
                <Grid item xs={6} sm={4} md={3} key={tool.id}>
                  <Tooltip title={
                    <Box>
                      <Typography variant="body2">{tool.description}</Typography>
                      {tool.features && (
                        <>
                          <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
                            Features:
                          </Typography>
                          <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                            {tool.features.map((feature, index) => (
                              <li key={index}>
                                <Typography variant="body2">{feature}</Typography>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </Box>
                  }>
                    <Card sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: '0.3s',
                      bgcolor: 'rgba(0,0,0,0.8)',
                      border: '1px solid #0f0',
                      boxShadow: '0 0 10px rgba(0,255,0,0.2)',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 0 20px #0f0'
                      }
                    }} onClick={() => handleToolClick(tool)}>
                      <Badge
                        badgeContent={tool.findings}
                        color={tool.findings && tool.findings > 5 ? 'error' : 'warning'}
                        invisible={!tool.findings}
                        sx={{
                          '& .MuiBadge-badge': {
                            background: tool.findings && tool.findings > 5 ? 
                              'linear-gradient(45deg, #ff0000, #ff6b6b)' : 
                              'linear-gradient(45deg, #ffd700, #ffa500)',
                            boxShadow: '0 0 10px rgba(255,0,0,0.5)'
                          }
                        }}
                      >
                        <IconButton
                          sx={{
                            color: '#0f0',
                            bgcolor: 'rgba(0,255,0,0.1)',
                            mb: 1,
                            '&:hover': {
                              bgcolor: 'rgba(0,255,0,0.2)'
                            },
                            animation: 'pulse 2s infinite',
                            filter: 'drop-shadow(0 0 5px #0f0)'
                          }}
                        >
                          {tool.icon}
                        </IconButton>
                      </Badge>
                      <Typography variant="body2" sx={{ 
                        color: '#0f0',
                        fontFamily: 'monospace',
                        textShadow: '0 0 5px #0f0'
                      }} noWrap>
                        {tool.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(0,255,0,0.7)',
                          display: 'block',
                          fontFamily: 'monospace'
                        }}
                      >
                        {tool.category}
                      </Typography>
                    </Card>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </CardContent>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </Card>
  );
};

export default SecurityToolsTracker; 