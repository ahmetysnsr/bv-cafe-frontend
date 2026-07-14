import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { motion, AnimatePresence } from 'framer-motion';

const CONFETTI_COUNT = 40;
const CONFETTI_COLORS = ['#14B8A6', '#8B5CF6', '#22C55E', '#F59E0B', '#3B82F6', '#EF4444'];

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
}

function generateParticles(): Particle[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10,
    size: Math.random() * 8 + 4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    delay: Math.random() * 0.8,
    duration: Math.random() * 2 + 2,
    rotation: Math.random() * 360,
  }));
}

export default function OrderSuccessPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [particles] = useState(generateParticles);
  const [showConfetti, setShowConfetti] = useState(true);

  const steps = [
    t('robot.steps.orderReceived'),
    t('robot.steps.preparing'),
    t('robot.steps.onTheWay'),
    t('robot.steps.delivered'),
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Top Bar */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-start', zIndex: 10 }}>
        <Button
          component="a"
          href="/"
          sx={{
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
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          position: 'relative',
        }}
      >
      <AnimatePresence>
        {showConfetti &&
          particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: `${p.x}vw`, y: '-5vh', rotate: 0, opacity: 1 }}
              animate={{
                y: '110vh',
                rotate: p.rotation + 720,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeIn',
              }}
              style={{
                position: 'fixed',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.size > 8 ? '50%' : 2,
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />
          ))}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        style={{ zIndex: 1 }}
      >
        <CheckCircleIcon sx={{ fontSize: 100, color: 'success.main', mb: 2 }} />
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ zIndex: 1, textAlign: 'center' }}
      >
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 800 }}>
          {t('order.orderSuccess')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          {t('order.orderSuccessMessage')}
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: 'primary.main', fontWeight: 700, mb: 4 }}
        >
          #ORD-1006
        </Typography>
      </motion.div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ zIndex: 1, width: '100%', maxWidth: 600 }}
      >
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ py: 4 }}>
            <Stepper activeStep={1} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label} completed={index === 0}>
                  <StepLabel
                    sx={{
                      '& .MuiStepIcon-root': {
                        '&.Mui-active': { color: 'primary.main' },
                        '&.Mui-completed': { color: 'success.main' },
                        ...(index === 1
                          ? {
                              animation: 'pulse 1.5s ease-in-out infinite',
                              '@keyframes pulse': {
                                '0%, 100%': { opacity: 1 },
                                '50%': { opacity: 0.5 },
                              },
                            }
                          : {}),
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: index <= 1 ? 'text.primary' : 'text.secondary',
                        fontWeight: index === 1 ? 600 : 400,
                      }}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.1 }}
        style={{ zIndex: 1, display: 'flex', gap: 16 }}
      >
        <Button
          variant="outlined"
          startIcon={<ShoppingCartIcon />}
          onClick={() => navigate('/order')}
          sx={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          {t('order.newOrder')}
        </Button>
        <Button
          variant="contained"
          startIcon={<LocalShippingIcon />}
          onClick={() => navigate('/robot-tracker')}
        >
          {t('order.trackOrder')}
        </Button>
      </motion.div>
      </Box>
    </Box>
  );
}
