import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import {
  Box,
  Container,
  Card,
  CardContent,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  TextField,
  Button,
  Badge,
  Link,
  CircularProgress,
} from '@mui/material';
import {
  Settings,
  Search,
  ShoppingCartOutlined,
  ExpandMore,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
import { useCartStore } from '../stores/cartStore';
import type { Product, Language } from '../types';
import QrTimer from '../components/QrTimer';
import PreferenceDialog from '../components/PreferenceDialog';
import CartDrawer from '../components/CartDrawer';
import ProductCard from '../components/ProductCard';
import CategoryList from '../components/CategoryList';
import { apiService } from '../services/api';

export default function OrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTable = searchParams.get('table') || '16';
  const [tableNumber, setTableNumber] = useState(initialTable);

  const handleTableChange = () => {
    const newTable = window.prompt("Yeni masa numarasını girin:", tableNumber);
    if (newTable && newTable.trim() !== '') {
      setTableNumber(newTable.trim());
      setSearchParams({ table: newTable.trim() });
    }
  };
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Language;
  const { note, setNote, addItem, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  const [prefDialogOpen, setPrefDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [preferencesMap, setPreferencesMap] = useState<any>({});
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiService.products.getAll();
        if (res.success && res.data) {
          const apiCategories = res.data;
          setCategories(apiCategories);
          if (apiCategories.length > 0) {
            setSelectedCategory(apiCategories[0].id);
          }

          let prefs: any = {};
          
          apiCategories.forEach((cat: any) => {
            // Transform category name
            cat.name = { tr: cat.nameTr, en: cat.nameEn };
            cat.image = cat.imageUrl || cat.image;

            // Transform products to match frontend Product interface
            const transformedProducts = cat.products.map((p: any) => ({
              ...p,
              name: { tr: p.nameTr, en: p.nameEn },
              image: p.imageUrl || p.image,
            }));
            
            cat.products = transformedProducts;
            
            transformedProducts.forEach((p: any) => {
              if (p.preferences && p.preferences.length > 0) {
                prefs[p.productId] = p.preferences;
              }
            });
          });

          setPreferencesMap(prefs);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setIsTokenValid(false);
        return;
      }
      try {
        const data = await apiService.qr.validate(token);
        setIsTokenValid(data.success && data.isValid);
      } catch (error) {
        console.error('QR Validation failed', error);
        setIsTokenValid(false);
      }
    };
    validateToken();
  }, [searchParams]);

  if (isTokenValid === null) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0B0F19' }}>
        <CircularProgress sx={{ color: '#14B8A6' }} />
      </Box>
    );
  }

  if (isTokenValid === false) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: '#0B0F19' }}>
        <Card sx={{ maxWidth: 400, width: '100%', bgcolor: '#1E293B', color: 'white' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" color="error" sx={{ mb: 2 }}>Geçersiz veya Süresi Dolmuş Kod</Typography>
            <Typography variant="body1">Lütfen masanızdaki ekrandan QR kodu tekrar okutun.</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const handleAddProduct = (product: Product) => {
    // We map preferences from backend
    const prefs = preferencesMap[product.productId];
    if (prefs && prefs.length > 0) {
      // Create a temporary mapped product for the dialog to match the expected Preference structure
      const mappedProduct = { ...product };
      setSelectedProduct(mappedProduct);
      setPrefDialogOpen(true);
    } else {
      addItem(product);
    }
  };

  const currentCat = categories.find(c => c.id === selectedCategory);
  const filteredProducts = currentCat ? currentCat.products.filter((p: any) => p.isActive !== false) : [];

  if (loadingProducts) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0B0F19' }}>
        <CircularProgress sx={{ color: '#14B8A6' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0B0F19', pb: 12 }}>
      <Container maxWidth="sm" sx={{ pt: 2, px: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
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
          <IconButton
            component="a"
            href="/admin"
            size="small"
            sx={{ color: '#94A3B8' }}
          >
            <Settings fontSize="small" />
          </IconButton>
        </Box>

        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: 'rgba(20, 184, 166, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SmartToyTwoToneIcon sx={{ color: 'primary.main', fontSize: 32 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                BV Robotik Cafe
              </Typography>
            </Box>
            <Chip
              label={`${t('order.table')} ${tableNumber.replace('Masa ', '')}`}
              size="small"
              onClick={handleTableChange}
              sx={{
                bgcolor: 'rgba(20, 184, 166, 0.12)',
                color: '#14B8A6',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(20, 184, 166, 0.2)' }
              }}
            />
          </CardContent>
        </Card>

        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ py: 0.5, '&:last-child': { pb: 0.5 } }}>
            <QrTimer />
          </CardContent>
        </Card>

        <Accordion defaultExpanded sx={{ mb: 2, borderRadius: '16px !important', overflow: 'hidden' }}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{
              '& .MuiAccordionSummary-content': {
                alignItems: 'center',
                gap: 1.5,
              },
            }}
          >
            <Avatar
              src="/images/icecekler-1777556512800.png"
              variant="square"
              sx={{ width: 36, height: 36, borderRadius: 1.5 }}
            />
            <Typography variant="h6" sx={{ flex: 1, fontSize: '1rem' }}>
              Mutfak
            </Typography>
            <Search sx={{ color: '#94A3B8', mr: 1 }} />
          </AccordionSummary>

          <AccordionDetails sx={{ pt: 0 }}>
            <CategoryList 
              categories={categories.length > 0 ? categories : []}
              selectedCategory={selectedCategory || ''}
              lang={lang}
              onSelect={setSelectedCategory}
            />

            <Box>
              {filteredProducts.map((product: any, index: number) => (
                <ProductCard 
                  key={product.productId}
                  product={product}
                  lang={lang}
                  index={index}
                  isLast={index === filteredProducts.length - 1}
                  onAdd={handleAddProduct}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: 2 }} />

        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 150))}
          placeholder={t('order.orderNotePlaceholder')}
          label={t('order.orderNote')}
          slotProps={{
            htmlInput: { maxLength: 150 },
            formHelperText: { sx: { textAlign: 'right' } },
          }}
          helperText={`${note.length}/150`}
          sx={{ mb: 3 }}
        />

        <Box sx={{ textAlign: 'center', py: 3 }}>
          {[
            { key: 'footer.termsOfUse' },
            { key: 'footer.deliveryConditions' },
            { key: 'footer.privacyAgreement' },
            { key: 'footer.distanceSalesContract' },
            { key: 'footer.aboutUs' },
          ].map((link, i) => (
            <Box key={link.key} component="span">
              {i > 0 && (
                <Typography component="span" sx={{ color: '#64748B', mx: 0.5, fontSize: '0.6875rem' }}>
                  ·
                </Typography>
              )}
              <Link
                href="#"
                underline="hover"
                sx={{
                  color: '#64748B',
                  fontSize: '0.6875rem',
                  '&:hover': { color: '#94A3B8' },
                }}
              >
                {t(link.key)}
              </Link>
            </Box>
          ))}
        </Box>
      </Container>

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: '#111827',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          px: 2,
          py: 1.5,
          zIndex: 1200,
        }}
      >
        <Container maxWidth="sm" sx={{ px: 0 }}>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={() => setCartOpen(true)}
              startIcon={
                <Badge
                  badgeContent={totalItems}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#14B8A6',
                      color: '#fff',
                      fontSize: '0.6875rem',
                      minWidth: 18,
                      height: 18,
                    },
                  }}
                >
                  <ShoppingCartOutlined />
                </Badge>
              }
              sx={{
                borderColor: 'rgba(255,255,255,0.12)',
                color: '#EDF2F7',
                px: 2,
                '&:hover': { borderColor: 'rgba(255,255,255,0.2)' },
              }}
            >
              {t('order.cart')}
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={totalItems === 0}
              onClick={() => setCartOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 100%)' },
                '&.Mui-disabled': {
                  background: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.3)',
                },
                fontWeight: 600,
                fontSize: '0.9375rem',
              }}
            >
              {t('order.orderNow')}
            </Button>
          </Box>
        </Container>
      </Box>

      {prefDialogOpen && selectedProduct && (
        <PreferenceDialog
          open={prefDialogOpen}
          onClose={() => {
            setPrefDialogOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          preferences={preferencesMap[selectedProduct.productId] || []}
        />
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </Box>
  );
}
