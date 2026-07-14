import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Container,
  Button,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import DemoBadge from '../components/DemoBadge';
import LanguageToggle from '../components/LanguageToggle';

const steps = [
  'orderReceived',
  'preparing',
  'onTheWay',
  'delivered'
];

export default function RobotTracker() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeStep] = useState(2); // "Robot On The Way" default for demo
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/order')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Button
            component="a"
            href="/"
            sx={{
              mr: 2,
              fontWeight: 900,
              color: '#14B8A6',
              fontSize: '1.25rem',
              minWidth: 'auto',
              p: 0,
              textDecoration: 'none',
              '&:hover': { background: 'none', opacity: 0.8 }
            }}
          >
            BV
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('robot.tracker')}
          </Typography>
          <LanguageToggle />
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <DemoBadge />

        <Card variant="outlined">
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <SmartToyTwoToneIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            </motion.div>
            
            <Typography variant="h4" gutterBottom>
              {formatTime(timeLeft)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('robot.estimatedTime')}
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sipariş #ORD-1006
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Masa 16 • 3 Ürün
            </Typography>

            <Box sx={{ mt: 4, mb: 2 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>
                      {t(`robot.steps.${label}`)}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </CardContent>
        </Card>

        <Button 
          variant="contained" 
          color="secondary" 
          size="large" 
          fullWidth
          onClick={() => navigate('/robot-map')}
          startIcon={<SmartToyTwoToneIcon />}
        >
          {t('robot.liveLocation')}
        </Button>
      </Container>
    </Box>
  );
}
