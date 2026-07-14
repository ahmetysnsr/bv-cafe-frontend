import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  Button,
  TextField,
  Divider,
} from '@mui/material';
import {
  Add,
  Remove,
  DeleteOutlined,
  ShoppingCartOutlined,
  Close,
} from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
import toast from 'react-hot-toast';
import { useCartStore } from '../stores/cartStore';
import type { Language } from '../types';
import { apiService } from '../services/api';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lang = i18n.language as Language;
  const { items, note, updateQuantity, removeItem, setNote, clearCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    const token = searchParams.get('token');
    if (!token) {
      toast.error(t('geo.error') + ': QR Token bulunamadı.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        qrToken: token,
        note: note,
        language: lang,
        idempotencyKey: typeof crypto.randomUUID === 'function' 
          ? crypto.randomUUID() 
          : Math.random().toString(36).substring(2) + Date.now().toString(36),
        items: items.map(item => ({
          productId: item.product.productId,
          quantity: item.quantity,
          note: item.note || "",
          selectedPreferencesJson: item.preferreds && item.preferreds.length > 0 
            ? JSON.stringify(item.preferreds) 
            : ""
        }))
      };

      const data = await apiService.orders.create(payload);

      if (data.success) {
        clearCart();
        onClose();
        navigate('/order/success', { replace: true });
      } else {
        toast.error(t('order.orderFailed') + ': ' + data.message);
      }
    } catch (error) {
      console.error('Order submission failed:', error);
      toast.error(t('order.orderFailedMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '80vh',
          px: 2,
          pt: 1,
          pb: 3,
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.2)',
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCartOutlined sx={{ color: '#14B8A6' }} />
          <Typography variant="h6">
            {t('order.cart')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            ({t('order.cartItems', { count: totalItems })})
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <ShoppingCartOutlined sx={{ fontSize: 48, color: '#64748B', mb: 1 }} />
          <Typography variant="body2" sx={{ color: '#94A3B8' }}>
            {t('order.emptyCart')}
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ maxHeight: '40vh', overflowY: 'auto', mb: 2 }}>
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.cartItemId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      py: 1.5,
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <Avatar
                      src={item.product.image}
                      variant="square"
                      sx={{ width: 44, height: 44, borderRadius: 1.5 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: '#EDF2F7', fontSize: '0.875rem', fontWeight: 500 }}
                        noWrap
                      >
                        {item.product.name[lang]}
                      </Typography>
                      {item.preferreds && item.preferreds.length > 0 && (
                        <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.6875rem' }}>
                          {item.preferreds
                            .flatMap((p) => p.values.map((v) => v.label[lang]))
                            .join(', ')}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity - 1)
                        }
                        sx={{ color: '#94A3B8', width: 28, height: 28 }}
                      >
                        <Remove sx={{ fontSize: 16 }} />
                      </IconButton>
                      <Typography
                        sx={{
                          minWidth: 24,
                          textAlign: 'center',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity + 1)
                        }
                        sx={{ color: '#14B8A6', width: 28, height: 28 }}
                      >
                        <Add sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => removeItem(item.cartItemId)}
                      sx={{ color: '#EF4444', width: 28, height: 28 }}
                    >
                      <DeleteOutlined sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={3}
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 150))}
            placeholder={t('order.orderNotePlaceholder')}
            label={t('order.orderNote')}
            slotProps={{ htmlInput: { maxLength: 150 } }}
            sx={{ mb: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            onClick={handlePlaceOrder}
            sx={{
              background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 100%)' },
              '&.Mui-disabled': {
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.3)',
              },
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            {isSubmitting ? '...' : t('order.placeOrder')}
          </Button>
        </>
      )}
    </Drawer>
  );
}
