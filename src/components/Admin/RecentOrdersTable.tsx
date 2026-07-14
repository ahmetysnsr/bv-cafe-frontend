import {
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export interface AdminOrderDto {
  id: string;
  table: string;
  items: number;
  status: string;
  time: string;
}

const statusColor: Record<string, 'default' | 'warning' | 'info' | 'success'> = {
  pending: 'default',
  preparing: 'warning',
  delivering: 'info',
  delivered: 'success',
};

interface RecentOrdersTableProps {
  orders: AdminOrderDto[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('admin.recentOrders')}
          </Typography>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>{t('order.table')}</TableCell>
                  <TableCell>{t('admin.products')}</TableCell>
                  <TableCell>{t('admin.productStatus')}</TableCell>
                  <TableCell align="right">{t('admin.avgDeliveryTime').split('.')[0]}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Henüz sipariş yok</TableCell>
                  </TableRow>
                ) : orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                      #{order.id}
                    </TableCell>
                    <TableCell>{order.table}</TableCell>
                    <TableCell>
                      {order.items} {t('order.quantity')}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={t(`robot.steps.${order.status}`)}
                        size="small"
                        color={statusColor[order.status] || 'default'}
                        variant="outlined"
                        sx={{ textTransform: 'capitalize', minWidth: 80 }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary' }}>
                      {order.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
