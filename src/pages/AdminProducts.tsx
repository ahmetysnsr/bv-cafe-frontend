import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { motion } from 'framer-motion';
import { apiService } from '../services/api';

export default function AdminProducts() {
  const { t } = useTranslation();
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<{id: string, nameTr: string, nameEn: string}[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Product State
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProduct, setNewProduct] = useState({ nameTr: '', nameEn: '', price: '', categoryId: '' });

  const showMessage = (msg: string) => {
    setSnackMessage(msg);
    setSnackOpen(true);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await apiService.products.getAll();
      if (res.success && res.data) {
        let allProducts: any[] = [];
        const cats = res.data.map((cat: any) => ({ id: cat.id, nameTr: cat.nameTr, nameEn: cat.nameEn }));
        setCategories(cats);
        res.data.forEach((cat: any) => {
          allProducts = [...allProducts, ...cat.products];
        });
        setProducts(allProducts);
        
        // Auto-select first category if empty
        if (cats.length > 0 && !newProduct.categoryId) {
          setNewProduct(prev => ({ ...prev, categoryId: cats[0].id }));
        }
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
      showMessage('Ürünler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleProduct = async (product: any) => {
    const newStatus = product.isActive === false ? true : false;
    
    // Optimistic UI update
    setProducts(prev => prev.map(p => 
      p.productId === product.productId ? { ...p, isActive: newStatus } : p
    ));

    try {
      const res = await apiService.products.updateStatus(product.productId, newStatus);
      if (!res.success) {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error('Status update failed', err);
      // Revert optimistic update
      setProducts(prev => prev.map(p => 
        p.productId === product.productId ? { ...p, isActive: !newStatus } : p
      ));
      showMessage('Ürün durumu güncellenemedi');
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.nameTr || !newProduct.nameEn || !newProduct.price || !newProduct.categoryId) {
      showMessage('Lütfen tüm alanları doldurun');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        nameTr: newProduct.nameTr,
        nameEn: newProduct.nameEn,
        price: parseFloat(newProduct.price),
        categoryId: newProduct.categoryId,
        imageUrl: '',
      };
      const res = await apiService.products.create(payload);
      if (res.success) {
        showMessage('Ürün başarıyla eklendi');
        setAddDialogOpen(false);
        setNewProduct({ nameTr: '', nameEn: '', price: '', categoryId: categories[0]?.id || '' });
        fetchProducts(); // Refresh list
      } else {
        throw new Error(res.message);
      }
    } catch (error: any) {
      console.error('Add product failed', error);
      showMessage(error.response?.data?.message || 'Ürün eklenemedi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {t('admin.productManagement')}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddDialogOpen(true)}>
          {t('admin.addProduct')}
        </Button>
      </Box>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('admin.productImage')}</TableCell>
                    <TableCell>{t('admin.productName')} (TR)</TableCell>
                    <TableCell>{t('admin.productName')} (EN)</TableCell>
                    <TableCell align="center">{t('admin.productStatus')}</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.productId} hover>
                      <TableCell>
                        <Avatar
                          src={product.imageUrl || product.image}
                          alt={product.nameTr || product.name?.tr}
                          variant="rounded"
                          sx={{ width: 48, height: 48 }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{product.nameTr || product.name?.tr}</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{product.nameEn || product.name?.en}</TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={product.isActive !== false}
                          onChange={() => toggleProduct(product)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary" onClick={() => showMessage('Edit disabled in this phase')}>
                          <EditTwoToneIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'error.main', ml: 1 }} onClick={() => showMessage('Delete disabled in this phase')}>
                          <DeleteTwoToneIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Product Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Yeni Ürün Ekle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Ürün Adı (TR)"
              fullWidth
              value={newProduct.nameTr}
              onChange={(e) => setNewProduct({ ...newProduct, nameTr: e.target.value })}
            />
            <TextField
              label="Ürün Adı (EN)"
              fullWidth
              value={newProduct.nameEn}
              onChange={(e) => setNewProduct({ ...newProduct, nameEn: e.target.value })}
            />
            <TextField
              label="Fiyat (₺)"
              type="number"
              fullWidth
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select
                value={newProduct.categoryId}
                label="Kategori"
                onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value as string })}
              >
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nameTr}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setAddDialogOpen(false)} color="inherit">İptal</Button>
          <Button onClick={handleAddProduct} variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : 'Ekle'}
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
