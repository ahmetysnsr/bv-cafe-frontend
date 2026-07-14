import { Box, Avatar, Typography, IconButton } from '@mui/material';
import { AddCircleOutlineTwoTone } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { Product, Language } from '../types';

interface ProductCardProps {
  product: Product;
  lang: Language;
  index: number;
  isLast: boolean;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, lang, index, isLast, onAdd }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 1.5,
          borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Avatar
          src={product.image}
          variant="square"
          sx={{ width: 48, height: 48, borderRadius: 1.5 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            sx={{ fontWeight: 500, color: '#EDF2F7', fontSize: '0.9375rem' }}
            noWrap
          >
            {product.name[lang]}
          </Typography>
          {lang === 'tr' && product.name.en !== product.name.tr && (
            <Typography
              variant="body2"
              sx={{ color: '#64748B', fontSize: '0.75rem' }}
              noWrap
            >
              {product.name.en}
            </Typography>
          )}
          {lang === 'en' && product.name.tr !== product.name.en && (
            <Typography
              variant="body2"
              sx={{ color: '#64748B', fontSize: '0.75rem' }}
              noWrap
            >
              {product.name.tr}
            </Typography>
          )}
        </Box>
        <IconButton
          color="primary"
          onClick={() => onAdd(product)}
          sx={{ flexShrink: 0 }}
        >
          <AddCircleOutlineTwoTone />
        </IconButton>
      </Box>
    </motion.div>
  );
}
