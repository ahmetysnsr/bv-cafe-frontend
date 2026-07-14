import { Chip } from '@mui/material';
import ScienceTwoToneIcon from '@mui/icons-material/ScienceTwoTone';

export default function DemoBadge() {
  return (
    <Chip
      icon={<ScienceTwoToneIcon sx={{ fontSize: 14 }} />}
      label="DEMO"
      size="small"
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        bgcolor: 'rgba(139, 92, 246, 0.15)',
        color: 'secondary.light',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        fontWeight: 700,
        fontSize: '0.65rem',
        letterSpacing: 1,
      }}
    />
  );
}
