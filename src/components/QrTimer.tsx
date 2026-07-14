import { useState, useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const TOTAL_SECONDS = 600;
const CIRCLE_SIZE = 64;
const STROKE_WIDTH = 4;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface QrTimerProps {
  onRefresh?: () => void;
}

export default function QrTimer({ onRefresh }: QrTimerProps) {
  const { t } = useTranslation();
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [refreshing, setRefreshing] = useState(false);

  const reset = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRemaining(TOTAL_SECONDS);
      setRefreshing(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (refreshing) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          reset();
          if (onRefresh) onRefresh();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [refreshing, reset, onRefresh]);

  const progress = remaining / TOTAL_SECONDS;
  const offset = CIRCUMFERENCE * (1 - progress);
  const isWarning = remaining < 60 && remaining > 0;
  const strokeColor = refreshing ? '#94A3B8' : isWarning ? '#F59E0B' : '#14B8A6';

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1,
      }}
    >
      <Box sx={{ position: 'relative', width: CIRCLE_SIZE, height: CIRCLE_SIZE, flexShrink: 0 }}>
        <svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
          <circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={STROKE_WIDTH}
          />
          <circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={strokeColor}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
            style={{ transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease' }}
          />
        </svg>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: strokeColor,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {refreshing ? '...' : timeText}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.6875rem' }}>
          {t('qr.validFor')}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: '#EDF2F7', fontSize: '0.8125rem', fontWeight: 600 }}
        >
          {refreshing ? t('qr.refreshing') : `${t('qr.remaining')}: ${timeText}`}
        </Typography>
      </Box>
    </Box>
  );
}
