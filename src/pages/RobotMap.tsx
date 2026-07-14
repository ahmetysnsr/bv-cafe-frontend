import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';
import DemoBadge from '../components/DemoBadge';

const KITCHEN_POSITION = { x: 100, y: 100, label: 'Mutfak' };

interface MappedLocation {
  name: string;
  x: number;
  y: number;
}

export default function RobotMap() {
  const { t } = useTranslation();
  const [locations, setLocations] = useState<MappedLocation[]>([]);
  const [robotPos, setRobotPos] = useState({ x: KITCHEN_POSITION.x, y: KITCHEN_POSITION.y });

  useEffect(() => {
    const fetchLocationsForMap = async () => {
      try {
        const res = await apiService.locations.getAll();
        if (res.success && res.data) {
          const active = res.data.filter((l: any) => l.isActive);
          // Assign dynamic coordinates dynamically in a grid to draw on the map
          const mapped = active.map((l: any, idx: number) => {
            const cols = 3;
            const xOffset = 220 + (idx % cols) * 140;
            const yOffset = 120 + Math.floor(idx / cols) * 120;
            return {
              name: l.name,
              x: xOffset,
              y: yOffset
            };
          });
          setLocations(mapped);
        }
      } catch (error) {
        console.error('Failed to load locations for map', error);
      }
    };
    fetchLocationsForMap();
  }, []);

  useEffect(() => {
    if (locations.length === 0) return;
    
    // Simple mock animation of the robot moving to the first active table
    const targetTable = locations[0];
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.03;
      if (progress > 1) progress = 0; // loop back for demo

      setRobotPos({
        x: KITCHEN_POSITION.x + (targetTable.x - KITCHEN_POSITION.x) * (progress < 0.5 ? progress * 2 : (1 - progress) * 2),
        y: KITCHEN_POSITION.y + (targetTable.y - KITCHEN_POSITION.y) * (progress < 0.5 ? progress * 2 : (1 - progress) * 2),
      });
    }, 100);

    return () => clearInterval(interval);
  }, [locations]);

  return (
    <Box sx={{ position: 'relative', height: '100%', minHeight: '600px', p: 3 }}>
      <DemoBadge />
      <Typography variant="h5" gutterBottom>
        {t('robot.map')}
      </Typography>

      <Card variant="outlined" sx={{ height: 'calc(100% - 60px)', position: 'relative', overflow: 'hidden', bgcolor: 'background.default' }}>
        <CardContent sx={{ p: 0, height: '100%' }}>
          {/* Mock floor plan background */}
          <Box
            sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: 'radial-gradient(#333 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              opacity: 0.2
            }}
          />

          {/* Kitchen */}
          <Box
            sx={{
              position: 'absolute',
              left: KITCHEN_POSITION.x,
              top: KITCHEN_POSITION.y,
              width: 70, height: 40,
              bgcolor: 'warning.dark',
              transform: 'translate(-50%, -50%)',
              borderRadius: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{KITCHEN_POSITION.label}</Typography>
          </Box>

          {/* Dynamic Tables from DB */}
          {locations.map((table, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                left: table.x,
                top: table.y,
                width: 50, height: 50,
                bgcolor: 'grey.800',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                border: '2px solid',
                borderColor: 'grey.700',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{table.name}</Typography>
            </Box>
          ))}

          {/* Robot */}
          {locations.length > 0 && (
            <motion.div
              animate={{ left: robotPos.x, top: robotPos.y }}
              transition={{ type: 'tween', duration: 0.1 }}
              style={{
                position: 'absolute',
                width: 24, height: 24,
                backgroundColor: '#14B8A6',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 15px #14B8A6',
                zIndex: 10
              }}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
