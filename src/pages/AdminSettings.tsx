import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Slider,
  Snackbar,
  Switch,
  TextField,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';
import AddIcon from '@mui/icons-material/Add';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';

interface Location {
  id: string;
  name: string;
  targetUid: string;
  isActive: boolean;
}

export default function AdminSettings() {
  const { t } = useTranslation();
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  
  // Settings values (Demo placeholders for now, can be persisted in local storage or backend settings later)
  const [geofenceRadius, setGeofenceRadius] = useState(() => Number(localStorage.getItem('admin_geofenceRadius') || 50));
  const [maxOrderLimit, setMaxOrderLimit] = useState(() => Number(localStorage.getItem('admin_maxOrderLimit') || 3));

  // Locations state
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Table dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableUid, setNewTableUid] = useState('');
  const [isSubmittingTable, setIsSubmittingTable] = useState(false);

  const showMessage = (msg: string) => {
    setSnackMessage(msg);
    setSnackOpen(true);
  };

  const fetchLocations = async () => {
    try {
      const res = await apiService.locations.getAll();
      if (res.success && res.data) {
        setLocations(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch locations', error);
      showMessage('Masalar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const toggleTable = async (table: Location) => {
    const newStatus = !table.isActive;
    
    // Optimistic UI update
    setLocations(prev => prev.map(l => l.id === table.id ? { ...l, isActive: newStatus } : l));

    try {
      const res = await apiService.locations.updateStatus(table.id, newStatus);
      if (!res.success) {
        throw new Error(res.message);
      }
      showMessage(`${table.name} durumu güncellendi.`);
    } catch (error) {
      console.error('Failed to toggle table status', error);
      // Revert optimistic UI
      setLocations(prev => prev.map(l => l.id === table.id ? { ...l, isActive: !newStatus } : l));
      showMessage('Masa durumu güncellenemedi.');
    }
  };

  const handleAddTable = async () => {
    if (!newTableName || !newTableUid) {
      showMessage('Lütfen tüm alanları doldurun.');
      return;
    }

    setIsSubmittingTable(true);
    try {
      const res = await apiService.locations.create({
        name: newTableName,
        targetUid: newTableUid,
      });

      if (res.success) {
        showMessage('Masa başarıyla eklendi.');
        setAddDialogOpen(false);
        setNewTableName('');
        setNewTableUid('');
        fetchLocations(); // Refresh list
      } else {
        throw new Error(res.message);
      }
    } catch (error: any) {
      console.error('Failed to add table', error);
      showMessage(error.response?.data?.message || 'Masa eklenirken bir hata oluştu.');
    } finally {
      setIsSubmittingTable(false);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('admin_geofenceRadius', geofenceRadius.toString());
    localStorage.setItem('admin_maxOrderLimit', maxOrderLimit.toString());
    showMessage('Ayarlar başarıyla kaydedildi.');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        {t('admin.settings')}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                {t('admin.geofenceRadius')}
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={geofenceRadius}
                  onChange={(_, v) => setGeofenceRadius(v as number)}
                  min={10}
                  max={200}
                  step={5}
                  valueLabelDisplay="on"
                  valueLabelFormat={(v) => `${v}m`}
                  marks={[
                    { value: 10, label: '10m' },
                    { value: 100, label: '100m' },
                    { value: 200, label: '200m' },
                  ]}
                />
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                {t('admin.maxOrderLimit')}
              </Typography>
              <TextField
                type="number"
                value={maxOrderLimit}
                onChange={(e) => setMaxOrderLimit(Number(e.target.value))}
                slotProps={{ htmlInput: { min: 1, max: 20 } }}
                fullWidth
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Masa Yönetimi
                </Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={() => setAddDialogOpen(true)}>
                  Masa Ekle
                </Button>
              </Box>
              <List disablePadding>
                {locations.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Kayıtlı masa bulunamadı.
                  </Typography>
                ) : locations.map((loc, idx, arr) => (
                  <Box key={loc.id}>
                    <ListItem
                      secondaryAction={
                        <Switch
                          checked={loc.isActive}
                          onChange={() => toggleTable(loc)}
                          color="primary"
                        />
                      }
                    >
                      <ListItemText
                        primary={loc.name}
                        secondary={`UID: ${loc.targetUid}`}
                      />
                    </ListItem>
                    {idx < arr.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </motion.div>

        <Button
          variant="contained"
          startIcon={<SaveTwoToneIcon />}
          onClick={handleSaveSettings}
          size="large"
          sx={{ alignSelf: 'flex-end' }}
        >
          {t('common.save')}
        </Button>
      </Box>

      {/* Add Table Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Yeni Masa Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Masa Adı (Örn: Masa 17)"
              fullWidth
              value={newTableName}
              onChange={(e) => {
                setNewTableName(e.target.value);
                // Auto generate Target Uid
                const clean = e.target.value.toLowerCase().replace(/\s+/g, '_');
                setNewTableUid(clean ? `table_${clean.replace('masa_', '')}` : '');
              }}
            />
            <TextField
              label="Robot Target UID (Örn: table_17)"
              fullWidth
              value={newTableUid}
              onChange={(e) => setNewTableUid(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setAddDialogOpen(false)} color="inherit">İptal</Button>
          <Button onClick={handleAddTable} variant="contained" disabled={isSubmittingTable}>
            {isSubmittingTable ? <CircularProgress size={24} /> : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={() => setSnackOpen(false)}
        message={snackMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
