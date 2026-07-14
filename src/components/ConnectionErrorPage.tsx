import { Box, Button, Typography, Container } from '@mui/material';
import WifiOffTwoToneIcon from '@mui/icons-material/WifiOffTwoTone';

export default function ConnectionErrorPage() {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <WifiOffTwoToneIcon sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold' }} gutterBottom>
          Sunucuya Bağlanılamıyor
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Sistemle bağlantı kurulamadı. Lütfen internet bağlantınızı kontrol edin veya sunucunun aktif olduğundan emin olun.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => window.location.reload()}
          sx={{ borderRadius: 8, px: 4 }}
        >
          Tekrar Dene
        </Button>
      </Container>
    </Box>
  );
}
