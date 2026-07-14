import { Box, Card, CardContent, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router';
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';
import QrCodeScannerTwoToneIcon from '@mui/icons-material/QrCodeScannerTwoTone';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
import TabletMacTwoToneIcon from '@mui/icons-material/TabletMacTwoTone';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0B0F19', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <SmartToyTwoToneIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }} color="primary.main">
            BV Robotik Cafe
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Lütfen giriş yapmak istediğiniz portalı seçin
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              sx={{ cursor: 'pointer', border: '1px solid rgba(20, 184, 166, 0.2)' }}
              onClick={() => navigate('/order?table=16')}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 4 }}>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(20, 184, 166, 0.1)' }}>
                  <QrCodeScannerTwoToneIcon sx={{ fontSize: 40, color: '#14B8A6' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="text.primary">
                    Müşteri Arayüzü
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    QR kodu okutan müşterinin gördüğü sipariş verme ekranı.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              sx={{ cursor: 'pointer', border: '1px solid rgba(139, 92, 246, 0.2)' }}
              onClick={() => navigate('/admin')}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 4 }}>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(139, 92, 246, 0.1)' }}>
                  <AdminPanelSettingsTwoToneIcon sx={{ fontSize: 40, color: '#8B5CF6' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="text.primary">
                    Yönetim Paneli
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    İstatistikler, ürün yönetimi ve ayarlar (Admin).
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card 
              sx={{ cursor: 'pointer', border: '1px solid rgba(59, 130, 246, 0.2)' }}
              onClick={() => navigate('/table-screen')}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 4 }}>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(59, 130, 246, 0.1)' }}>
                  <TabletMacTwoToneIcon sx={{ fontSize: 40, color: '#3B82F6' }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }} color="text.primary">
                    QR Gösterim Ekranı
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Masanın tabletinde sürekli dinamik QR gösteren ekran.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
