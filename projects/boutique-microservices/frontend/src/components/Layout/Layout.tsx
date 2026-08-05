import React, { useState, useEffect } from 'react';
import { Outlet, Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Avatar,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Home,
  ShoppingBag,
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout,
  Person,
  Receipt,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
];

const Layout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleMobileClose = () => setMobileOpen(false);

  // ── Mobile Drawer ───────────────────────────────────────────────────────────
  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: '#0d0d0d', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Drawer header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5, borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Playfair Display", serif', color: '#d4af37', fontWeight: 700, letterSpacing: 2 }}
        >
          LUXE BOUTIQUE
        </Typography>
        <IconButton onClick={handleMobileClose} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Nav links */}
      <List sx={{ pt: 2, flexGrow: 1 }}>
        {NAV_LINKS.map(({ label, path }) => (
          <ListItem
            key={path}
            component={RouterLink}
            to={path}
            onClick={handleMobileClose}
            sx={{
              py: 1.5, px: 3,
              color: isActive(path) ? '#d4af37' : '#ccc',
              borderLeft: isActive(path) ? '3px solid #d4af37' : '3px solid transparent',
              '&:hover': { color: '#d4af37', bgcolor: 'rgba(212,175,55,0.05)' },
              transition: 'all 0.2s',
            }}
          >
            <ListItemText
              primary={label}
              primaryTypographyProps={{ fontWeight: isActive(path) ? 700 : 400, letterSpacing: 1 }}
            />
          </ListItem>
        ))}

        {isAuthenticated && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />
            {[
              { label: 'My Orders', path: '/orders', icon: <Receipt fontSize="small" /> },
              { label: 'Profile', path: '/profile', icon: <Person fontSize="small" /> },
            ].map(({ label, path, icon }) => (
              <ListItem
                key={path}
                component={RouterLink}
                to={path}
                onClick={handleMobileClose}
                sx={{ py: 1.5, px: 3, color: '#ccc', '&:hover': { color: '#d4af37' } }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItem>
            ))}
          </>
        )}
      </List>

      {/* Auth action */}
      <Box sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {isAuthenticated ? (
          <Button
            fullWidth variant="outlined"
            startIcon={<Logout />}
            onClick={() => { logout(); handleMobileClose(); }}
            sx={{ borderColor: '#d4af37', color: '#d4af37', '&:hover': { bgcolor: 'rgba(212,175,55,0.1)' } }}
          >
            Sign Out
          </Button>
        ) : (
          <Button
            fullWidth variant="contained"
            onClick={() => { navigate('/login'); handleMobileClose(); }}
            sx={{ bgcolor: '#d4af37', color: '#0d0d0d', fontWeight: 700, '&:hover': { bgcolor: '#b8941f' } }}
          >
            Sign In
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fafaf8' }}>
      {/* ── Top Navbar ───────────────────────────────────────────────────── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: scrolled ? 'rgba(255,255,255,0.95)' : '#fff',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid',
          borderColor: scrolled ? 'rgba(0,0,0,0.08)' : '#f0ece4',
          transition: 'all 0.3s ease',
          boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        <Toolbar sx={{ maxWidth: 1280, width: '100%', mx: 'auto', px: { xs: 2, md: 4 }, minHeight: { xs: 64, md: 72 } }}>
          {/* Logo */}
          <Typography
            component={RouterLink}
            to="/"
            variant="h6"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: { xs: '1.1rem', md: '1.35rem' },
              color: '#1a1a1a',
              textDecoration: 'none',
              letterSpacing: 2,
              mr: 4,
              '& span': { color: '#d4af37' },
              flexShrink: 0,
            }}
          >
            LUXE<span>·</span>BOUTIQUE
          </Typography>

          {/* Desktop nav links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flexGrow: 1 }}>
            {NAV_LINKS.map(({ label, path }) => (
              <Button
                key={path}
                component={RouterLink}
                to={path}
                sx={{
                  color: isActive(path) ? '#d4af37' : '#4a4a4a',
                  fontWeight: isActive(path) ? 700 : 500,
                  fontSize: '0.85rem',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  px: 2,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 6,
                    left: '50%',
                    transform: isActive(path) ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                    width: '60%',
                    height: 2,
                    bgcolor: '#d4af37',
                    transition: 'transform 0.25s ease',
                    borderRadius: 1,
                  },
                  '&:hover': { color: '#d4af37', bgcolor: 'transparent' },
                  '&:hover::after': { transform: 'translateX(-50%) scaleX(1)' },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

          {/* Right icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* Cart */}
            <Tooltip title="Shopping Cart">
              <IconButton
                onClick={() => navigate('/cart')}
                sx={{
                  color: '#1a1a1a',
                  '&:hover': { color: '#d4af37', bgcolor: 'rgba(212,175,55,0.08)' },
                  transition: 'all 0.2s',
                }}
              >
                <Badge
                  badgeContent={itemCount}
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#d4af37',
                      color: '#1a1a1a',
                      fontWeight: 700,
                      fontSize: '0.65rem',
                    },
                  }}
                >
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Auth */}
            {isAuthenticated ? (
              <Tooltip title={user ? `${user.firstName} ${user.lastName}`.trim() : 'Account'}>
                <IconButton
                  onClick={() => navigate('/profile')}
                  sx={{ ml: 0.5, '&:hover': { bgcolor: 'rgba(212,175,55,0.08)' } }}
                >
                  <Avatar
                    sx={{ width: 32, height: 32, bgcolor: '#1a1a1a', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    {(user?.firstName || user?.email || 'U')[0].toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate('/login')}
                sx={{
                  ml: 1,
                  display: { xs: 'none', md: 'flex' },
                  bgcolor: '#1a1a1a',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  letterSpacing: 1,
                  px: 2.5,
                  py: 1,
                  '&:hover': { bgcolor: '#d4af37', color: '#1a1a1a' },
                  transition: 'all 0.25s',
                }}
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu toggle */}
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#1a1a1a', ml: 0.5 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleMobileClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none' } }}
      >
        {drawer}
      </Drawer>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <Box
        component="footer"
        sx={{
          bgcolor: '#0d0d0d',
          color: '#aaa',
          py: 5,
          mt: 'auto',
        }}
      >
        <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 3, md: 6 } }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontFamily: '"Playfair Display", serif', color: '#d4af37', letterSpacing: 3, mb: 1.5, fontWeight: 700 }}
              >
                LUXE·BOUTIQUE
              </Typography>
              <Typography variant="body2" sx={{ maxWidth: 240, lineHeight: 1.8, color: '#777' }}>
                Curated luxury fashion for the discerning individual.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 6 }}>
              {[
                { title: 'Shop', links: ['Products', 'New Arrivals', 'Sale'] },
                { title: 'Help', links: ['Contact', 'Shipping', 'Returns'] },
              ].map(({ title, links }) => (
                <Box key={title}>
                  <Typography variant="overline" sx={{ color: '#d4af37', letterSpacing: 2, fontWeight: 700, display: 'block', mb: 1.5 }}>
                    {title}
                  </Typography>
                  {links.map((l) => (
                    <Typography key={l} variant="body2" sx={{ color: '#666', mb: 0.8, cursor: 'pointer', '&:hover': { color: '#d4af37' }, transition: 'color 0.2s' }}>
                      {l}
                    </Typography>
                  ))}
                </Box>
              ))}
            </Box>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 3 }} />
          <Typography variant="caption" sx={{ color: '#555', letterSpacing: 1 }}>
            © {new Date().getFullYear()} LUXE BOUTIQUE — All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;