import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import ReceiptLongTwoToneIcon from '@mui/icons-material/ReceiptLongTwoTone';
import TableRestaurantTwoToneIcon from '@mui/icons-material/TableRestaurantTwoTone';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
import TimerTwoToneIcon from '@mui/icons-material/TimerTwoTone';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import RecentOrdersTable from '../components/Admin/RecentOrdersTable';
import type { AdminOrderDto } from '../components/Admin/RecentOrdersTable';

interface AdminDashboardDto {
  todayOrders: number;
  activeTables: number;
  robotStatus: string;
  avgDeliveryTime: string;
  recentOrders: AdminOrderDto[];
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}

function StatCard({ icon, value, label, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: `${color}22`,
              color,
              width: 52,
              height: 52,
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState<AdminDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.admin.getDashboard()
      .then(data => {
        if (data.success) {
          setData(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const stats: StatCardProps[] = [
    {
      icon: <ReceiptLongTwoToneIcon />,
      value: data.todayOrders,
      label: t('admin.todayOrders'),
      color: '#14B8A6',
    },
    {
      icon: <TableRestaurantTwoToneIcon />,
      value: data.activeTables,
      label: t('admin.activeTables'),
      color: '#8B5CF6',
    },
    {
      icon: <SmartToyTwoToneIcon />,
      value: t(`robot.status.${data.robotStatus}`),
      label: t('admin.robotStatus'),
      color: '#3B82F6',
    },
    {
      icon: <TimerTwoToneIcon />,
      value: data.avgDeliveryTime,
      label: t('admin.avgDeliveryTime'),
      color: '#F59E0B',
    },
  ];

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((s, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      <RecentOrdersTable orders={data.recentOrders} />
    </Box>
  );
}
