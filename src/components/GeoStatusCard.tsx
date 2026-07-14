import { useEffect } from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import { MyLocation, LocationOff, LocationOn, Refresh } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGeoStore } from '../stores/geoStore';

const pulseKeyframes = {
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)', opacity: 1 },
    '50%': { transform: 'scale(1.5)', opacity: 0.5 },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
};

interface StatusDotProps {
  color: string;
  animate?: boolean;
}

function StatusDot({ color, animate = false }: StatusDotProps) {
  return (
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        bgcolor: color,
        flexShrink: 0,
        ...(animate && {
          ...pulseKeyframes,
          animation: 'pulse 1.5s ease-in-out infinite',
        }),
      }}
    />
  );
}

export default function GeoStatusCard() {
  const { t } = useTranslation();
  const { status, isWithinRange, distance, requestLocation } = useGeoStore();

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const getStatusConfig = () => {
    switch (status) {
      case 'requesting':
        return {
          dot: <StatusDot color="#F59E0B" animate />,
          icon: <MyLocation sx={{ color: '#F59E0B', fontSize: 20 }} />,
          text: t('geo.requesting'),
          borderColor: 'rgba(245, 158, 11, 0.3)',
          bgColor: 'rgba(245, 158, 11, 0.05)',
        };
      case 'granted':
        if (isWithinRange) {
          return {
            dot: <StatusDot color="#22C55E" animate />,
            icon: <LocationOn sx={{ color: '#22C55E', fontSize: 20 }} />,
            text: t('geo.verified'),
            chip: distance !== null ? t('geo.distance', { distance }) : undefined,
            borderColor: 'rgba(34, 197, 94, 0.3)',
            bgColor: 'rgba(34, 197, 94, 0.05)',
          };
        }
        return {
          dot: <StatusDot color="#EF4444" />,
          icon: <LocationOff sx={{ color: '#EF4444', fontSize: 20 }} />,
          text: t('geo.outside'),
          chip: distance !== null ? t('geo.distance', { distance }) : undefined,
          borderColor: 'rgba(239, 68, 68, 0.3)',
          bgColor: 'rgba(239, 68, 68, 0.05)',
        };
      case 'denied':
        return {
          dot: <StatusDot color="#EF4444" />,
          icon: <LocationOff sx={{ color: '#EF4444', fontSize: 20 }} />,
          text: t('geo.denied'),
          borderColor: 'rgba(239, 68, 68, 0.3)',
          bgColor: 'rgba(239, 68, 68, 0.05)',
          action: (
            <Button
              size="small"
              startIcon={<Refresh />}
              onClick={requestLocation}
              sx={{ ml: 'auto', color: '#EF4444', textTransform: 'none', fontSize: '0.75rem' }}
            >
              {t('geo.permissionNeeded')}
            </Button>
          ),
        };
      default:
        return {
          dot: <StatusDot color="#3B82F6" />,
          icon: <MyLocation sx={{ color: '#3B82F6', fontSize: 20 }} />,
          text: t('geo.permissionNeeded'),
          borderColor: 'rgba(59, 130, 246, 0.3)',
          bgColor: 'rgba(59, 130, 246, 0.05)',
          action: (
            <Button
              size="small"
              variant="outlined"
              startIcon={<MyLocation />}
              onClick={requestLocation}
              sx={{
                ml: 'auto',
                borderColor: '#3B82F6',
                color: '#3B82F6',
                textTransform: 'none',
                fontSize: '0.75rem',
              }}
            >
              {t('common.confirm')}
            </Button>
          ),
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        borderRadius: 2,
        border: `1px solid ${config.borderColor}`,
        bgcolor: config.bgColor,
      }}
    >
      {config.dot}
      {config.icon}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ color: '#EDF2F7', fontSize: '0.8125rem' }}>
          {config.text}
        </Typography>
      </Box>
      {config.chip && (
        <Chip
          label={config.chip}
          size="small"
          sx={{
            height: 22,
            fontSize: '0.6875rem',
            bgcolor: 'rgba(255,255,255,0.08)',
            color: '#94A3B8',
          }}
        />
      )}
      {config.action}
    </Box>
  );
}
