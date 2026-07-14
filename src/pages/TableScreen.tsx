import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { Box, Card, CardContent, Typography, Container, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress } from '@mui/material';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
import QrTimer from '../components/QrTimer';
import { QRCodeSVG } from 'qrcode.react';
import { apiService } from '../services/api';

interface Location {
  id: string;
  name: string;
  targetUid: string;
  isActive: boolean;
}

export default function TableScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tableParam = searchParams.get('table');
  
  const [activeTables, setActiveTables] = useState<Location[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [loadingTables, setLoadingTables] = useState(true);

  const [qrToken, setQrToken] = useState('INIT');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch active locations
  useEffect(() => {
    const fetchActiveTables = async () => {
      try {
        const res = await apiService.locations.getAll();
        if (res.success && res.data) {
          const active = res.data.filter((l: Location) => l.isActive);
          setActiveTables(active);
          if (active.length > 0) {
            setSelectedTable(active[0].name);
          }
        }
      } catch (err) {
        console.error('Failed to fetch active locations', err);
      } finally {
        setLoadingTables(false);
      }
    };
    fetchActiveTables();
  }, []);

  // Fetch token from API
  const fetchToken = useCallback(async () => {
    if (!tableParam) return;
    try {
      const data = await apiService.qr.generate(tableParam);
      if (data.success) {
        setQrToken(data.token);
        setErrorMsg('');
      } else {
        setErrorMsg(data.message || 'Bilinmeyen hata');
      }
    } catch (error: any) {
      console.error('Failed to fetch QR token', error);
      setErrorMsg(error.response?.data?.message || 'Bağlantı hatası');
    }
  }, [tableParam]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  if (!tableParam) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0B0F19' }}>
      {/* Top Bar */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          component="a"
          href="/"
          sx={{
            fontWeight: 900,
            color: '#14B8A6',
            fontSize: '1.25rem',
            minWidth: 'auto',
            p: 0,
            textDecoration: 'none',
            '&:hover': { background: 'none', opacity: 0.8 }
          }}
        >
          BV
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Card sx={{ maxWidth: 400, width: '100%' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <SmartToyTwoToneIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 3 }}>Masayı Tanımlayın</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Bu tabletin hangi masada durduğunu veritabanından seçin.
            </Typography>
            
            {loadingTables ? (
              <Box sx={{ py: 2 }}><CircularProgress size={24} /></Box>
            ) : activeTables.length === 0 ? (
              <Typography color="error" sx={{ mb: 3 }}>
                Aktif masa bulunamadı. Lütfen önce admin panelinden masa ekleyin.
              </Typography>
            ) : (
              <>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Masa Seçin</InputLabel>
                  <Select
                    value={selectedTable}
                    label="Masa Seçin"
                    onChange={(e) => setSelectedTable(e.target.value)}
                  >
                    {activeTables.map((t) => (
                      <MenuItem key={t.id} value={t.name}>
                        {t.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large"
                  onClick={() => {
                    if (selectedTable) setSearchParams({ table: selectedTable });
                  }}
                >
                  Tanımla
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
      </Box>
    );
  }

  const orderUrl = `${window.location.origin}/order?table=${tableParam}&token=${qrToken}`;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0B0F19' }}>
      {/* Top Bar */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          component="a"
          href="/"
          sx={{
            fontWeight: 900,
            color: '#14B8A6',
            fontSize: '1.25rem',
            minWidth: 'auto',
            p: 0,
            textDecoration: 'none',
            '&:hover': { background: 'none', opacity: 0.8 }
          }}
        >
          BV
        </Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Container maxWidth="sm">
          <Card sx={{ borderRadius: 4, border: '1px solid rgba(20, 184, 166, 0.2)' }}>
            <CardContent sx={{ textAlign: 'center', p: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 4 }}>
                <SmartToyTwoToneIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Masa {tableParam}</Typography>
              </Box>

              <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, mb: 4, minWidth: 250, minHeight: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.05)' } }}>
                {qrToken === 'INIT' ? (
                  <Typography color={errorMsg ? 'error' : 'text.secondary'}>
                    {errorMsg ? errorMsg : 'QR Yükleniyor...'}
                  </Typography>
                ) : (
                  <a href={orderUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <QRCodeSVG value={orderUrl} size={250} level="H" />
                  </a>
                )}
              </Box>

              <Typography variant="h6" sx={{ mb: 1 }}>
                Sipariş vermek için okutun veya tıklayın
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Dışarıdan siparişleri engellemek için kod 5 dakikada bir değişmektedir.
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <QrTimer onRefresh={fetchToken} />
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}
