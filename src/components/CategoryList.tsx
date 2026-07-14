import { Box, Chip } from '@mui/material';
import type { Language } from '../types';

interface CategoryListProps {
  categories: any[];
  selectedCategory: string;
  lang: Language;
  onSelect: (categoryId: string) => void;
}

export default function CategoryList({ categories, selectedCategory, lang, onSelect }: CategoryListProps) {
  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 2, overflowX: 'auto', pb: 1 }}>
      {categories.map((cat) => (
        <Chip
          key={cat.id}
          label={cat.name[lang]}
          size="small"
          onClick={() => onSelect(cat.id)}
          sx={{
            bgcolor:
              selectedCategory === cat.id
                ? 'rgba(20, 184, 166, 0.15)'
                : 'rgba(255,255,255,0.06)',
            color: selectedCategory === cat.id ? '#14B8A6' : '#94A3B8',
            fontWeight: 500,
            border:
              selectedCategory === cat.id
                ? '1px solid rgba(20, 184, 166, 0.3)'
                : '1px solid transparent',
            '&:hover': {
              bgcolor:
                selectedCategory === cat.id
                  ? 'rgba(20, 184, 166, 0.2)'
                  : 'rgba(255,255,255,0.1)',
            },
          }}
        />
      ))}
    </Box>
  );
}
