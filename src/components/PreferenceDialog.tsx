import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Product, Preference } from '../types';
import type { Language } from '../types';
import { useCartStore } from '../stores/cartStore';

interface PreferenceDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  preferences: Preference[];
}

export default function PreferenceDialog({
  open,
  onClose,
  product,
  preferences,
}: PreferenceDialogProps) {
  const { t, i18n } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);
  const lang = i18n.language as Language;

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    preferences.forEach((pref) => {
      if (pref.values.length > 0) {
        initial[pref.name] = pref.values[0].value;
      }
    });
    return initial;
  });

  const handleAdd = () => {
    if (!product) return;

    const selectedPreferences: Preference[] = preferences.map((pref) => ({
      ...pref,
      values: pref.values.filter((v) => v.value === selected[pref.name]),
    }));

    addItem(product, selectedPreferences);
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Avatar
          src={product.image}
          variant="square"
          sx={{ width: 40, height: 40, borderRadius: 1.5 }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontSize: '1rem', lineHeight: 1.3 }}>
            {product.name[lang]}
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
            {t('order.selectPreference')}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {preferences.map((pref) => (
          <FormControl key={pref.name} sx={{ mb: 2, width: '100%' }}>
            <FormLabel
              sx={{
                color: '#94A3B8',
                fontSize: '0.8125rem',
                mb: 1,
                '&.Mui-focused': { color: '#14B8A6' },
              }}
            >
              {pref.label[lang]}
            </FormLabel>
            <RadioGroup
              value={selected[pref.name] || ''}
              onChange={(e) =>
                setSelected((prev) => ({ ...prev, [pref.name]: e.target.value }))
              }
            >
              {pref.values.map((val) => (
                <FormControlLabel
                  key={val.value}
                  value={val.value}
                  control={
                    <Radio
                      size="small"
                      sx={{
                        color: 'rgba(255,255,255,0.3)',
                        '&.Mui-checked': { color: '#14B8A6' },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#EDF2F7', fontSize: '0.875rem' }}>
                      {val.label[lang]}
                    </Typography>
                  }
                  sx={{
                    mx: 0,
                    py: 0.5,
                    px: 1.5,
                    borderRadius: 1.5,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        ))}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: '#94A3B8' }}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
            '&:hover': { background: 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 100%)' },
          }}
        >
          {t('order.addToCart')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
