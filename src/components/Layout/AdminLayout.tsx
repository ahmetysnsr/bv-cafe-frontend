import { useState } from 'react';
import { Outlet, NavLink as RouterNavLink, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import InventoryTwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import SmartToyTwoToneIcon from '@mui/icons-material/SmartToyTwoTone';
import MapTwoToneIcon from '@mui/icons-material/MapTwoTone';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LanguageToggle from '../../components/LanguageToggle';
import DemoBadge from '../../components/DemoBadge';

const DRAWER_WIDTH = 240;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export default function AdminLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const mainNav: NavItem[] = [
    { label: t('admin.dashboard'), icon: <DashboardTwoToneIcon />, path: '/admin' },
    { label: t('admin.products'), icon: <InventoryTwoToneIcon />, path: '/admin/products' },
    { label: t('admin.settings'), icon: <SettingsTwoToneIcon />, path: '/admin/settings' },
  ];

  const robotNav: NavItem[] = [
    { label: t('robot.tracker'), icon: <SmartToyTwoToneIcon />, path: '/robot-tracker' },
    { label: t('robot.map'), icon: <MapTwoToneIcon />, path: '/robot-map' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const pageTitle = () => {
    const match = [...mainNav, ...robotNav].find((n) => isActive(n.path));
    return match?.label || t('admin.dashboard');
  };

  const drawerContent = (
    <>
      <Toolbar sx={{ px: 2 }}>
        <Typography
          component={RouterNavLink}
          to="/"
          variant="h6"
          sx={{
            fontWeight: 900,
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': { opacity: 0.8 }
          }}
        >
          BV
        </Typography>
        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
          Admin
        </Typography>
      </Toolbar>

      <List sx={{ px: 1 }}>
        {mainNav.map((item) => (
          <ListItemButton
            key={item.path}
            component={RouterNavLink}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            selected={isActive(item.path)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'rgba(20, 184, 166, 0.12)',
                '& .MuiListItemIcon-root': { color: 'primary.main' },
                '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 600 },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ mx: 2, my: 1 }} />

      <List sx={{ px: 1 }}>
        {robotNav.map((item) => (
          <ListItemButton
            key={item.path}
            component={RouterNavLink}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            selected={isActive(item.path)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'rgba(20, 184, 166, 0.12)',
                '& .MuiListItemIcon-root': { color: 'primary.main' },
                '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 600 },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ mx: 2, my: 1 }} />

      <List sx={{ px: 1 }}>
        <ListItemButton
          component={RouterNavLink}
          to="/order"
          sx={{ borderRadius: 2 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <ArrowBackIcon />
          </ListItemIcon>
          <ListItemText primary={t('nav.order')} />
        </ListItemButton>
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Button
              component={RouterNavLink}
              to="/"
              sx={{
                mr: 2,
                fontWeight: 900,
                color: 'primary.main',
                fontSize: '1.25rem',
                minWidth: 'auto',
                p: 0,
                textDecoration: 'none',
                '&:hover': { background: 'none', opacity: 0.8 }
              }}
            >
              BV
            </Button>
            <Typography variant="h6">{pageTitle()}</Typography>
          </Box>
          <LanguageToggle />
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Temporary Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Desktop Permanent Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: '1px solid rgba(255,255,255,0.08)',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          maxWidth: '100vw',
          overflowX: 'hidden',
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>

      <DemoBadge />
    </Box>
  );
}
