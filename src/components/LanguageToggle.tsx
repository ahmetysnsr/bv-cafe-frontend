import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const handleChange = (_: React.MouseEvent<HTMLElement>, lang: string | null) => {
    if (lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem('alan-lang', lang);
    }
  };

  return (
    <ToggleButtonGroup
      value={i18n.language}
      exclusive
      onChange={handleChange}
      size="small"
      sx={{
        '& .MuiToggleButton-root': {
          px: 1.5,
          py: 0.5,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'text.secondary',
          borderColor: 'rgba(255,255,255,0.12)',
          '&.Mui-selected': {
            bgcolor: 'primary.main',
            color: '#fff',
            '&:hover': { bgcolor: 'primary.dark' },
          },
        },
      }}
    >
      <ToggleButton value="tr">TR</ToggleButton>
      <ToggleButton value="en">EN</ToggleButton>
    </ToggleButtonGroup>
  );
}
