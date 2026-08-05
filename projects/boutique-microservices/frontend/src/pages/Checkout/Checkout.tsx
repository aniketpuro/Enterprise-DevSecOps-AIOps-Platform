import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  Snackbar,
  Alert,
  Divider,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  CreditCard as CardIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Try real backend first
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      await axios.post(`${apiUrl}/orders/checkout`, { items, total });
    } catch (err) {
      // Backend unavailable — simulate success for demo/local preview
      console.warn('[Checkout] Backend unavailable — simulating successful payment for demo mode');
    } finally {
      // ── Always show success (demo mode) ──────────────────────────────────
      // Play cha-ching sound
      const audio = new Audio('https://www.myinstants.com/media/sounds/kaching_1.mp3');
      audio.play().catch(() => {});

      setSuccess(true);
      clearCart();
      setLoading(false);

      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  // ── Order Summary ─────────────────────────────────────────────────────────
  const subtotal = total;
  const shipping = subtotal >= 500 ? 0 : 25;
  const tax = +(subtotal * 0.08).toFixed(2);
  const grandTotal = +(subtotal + shipping + tax).toFixed(2);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="overline"
            sx={{ color: '#d4af37', letterSpacing: 3, fontWeight: 600 }}
          >
            Secure Checkout
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#1a1a1a', mt: 0.5 }}
          >
            Complete Your Order
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* ── Left: Payment Form ──────────────────────────────────────── */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Payment section */}
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #f0ece4', borderRadius: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <CardIcon sx={{ color: '#d4af37' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Payment Details
                </Typography>
                <Chip
                  label="Demo Mode"
                  size="small"
                  sx={{ ml: 'auto', bgcolor: '#fff8e6', color: '#b8941f', border: '1px solid #d4af37', fontSize: '0.65rem', fontWeight: 600 }}
                />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, p: 2, bgcolor: '#f8f6f2', borderRadius: 2 }}>
                🔒 This is a demo checkout — no real payment will be processed.
              </Typography>

              <Grid container spacing={2.5}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    defaultValue="Aniket Puro"
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Card Number"
                    defaultValue="4111 1111 1111 1111"
                    variant="outlined"
                    InputProps={{
                      startAdornment: <CardIcon sx={{ color: '#aaa', mr: 1 }} />,
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    defaultValue="12/28"
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    defaultValue="123"
                    type="password"
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Shipping section */}
            <Paper elevation={0} sx={{ p: 4, border: '1px solid #f0ece4', borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <ShippingIcon sx={{ color: '#d4af37' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Shipping Address
                </Typography>
              </Box>
              <Grid container spacing={2.5}>
                <Grid size={6}>
                  <TextField fullWidth label="First Name" defaultValue="Aniket" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid size={6}>
                  <TextField fullWidth label="Last Name" defaultValue="Puro" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid size={12}>
                  <TextField fullWidth label="Address" defaultValue="123 Luxury Lane, Mumbai" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid size={6}>
                  <TextField fullWidth label="City" defaultValue="Mumbai" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid size={6}>
                  <TextField fullWidth label="PIN Code" defaultValue="400001" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* ── Right: Order Summary ────────────────────────────────────── */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{ p: 4, border: '1px solid #f0ece4', borderRadius: 3, position: 'sticky', top: 90 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Order Summary
              </Typography>

              {/* Cart items */}
              <Box sx={{ mb: 3, maxHeight: 260, overflowY: 'auto' }}>
                {items.length === 0 ? (
                  <Typography color="text.secondary" variant="body2">No items in cart.</Typography>
                ) : (
                  items.map((item) => (
                    <Box
                      key={item.id}
                      sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}
                    >
                      <Box
                        component="img"
                        src={item.imageUrl || '/product-images/placeholder.jpg'}
                        alt={item.name}
                        sx={{ width: 56, height: 56, borderRadius: 2, objectFit: 'cover', flexShrink: 0, border: '1px solid #f0ece4' }}
                      />
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Qty: {item.quantity}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, flexShrink: 0 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>

              <Divider sx={{ mb: 2.5 }} />

              {/* Price breakdown */}
              {[
                { label: 'Subtotal', value: `$${subtotal.toFixed(2)}` },
                { label: 'Shipping', value: shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}` },
                { label: 'Tax (8%)', value: `$${tax.toFixed(2)}` },
              ].map(({ label, value }) => (
                <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">{label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: value === 'FREE' ? 700 : 400, color: value === 'FREE' ? '#2e7d32' : 'inherit' }}>
                    {value}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#d4af37' }}>
                  ${grandTotal.toFixed(2)}
                </Typography>
              </Box>

              {/* Pay button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handlePayment}
                disabled={loading || items.length === 0}
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LockIcon />}
                sx={{
                  bgcolor: '#1a1a1a',
                  color: '#fff',
                  py: 1.8,
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: 1,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#d4af37', color: '#1a1a1a' },
                  '&:disabled': { bgcolor: '#ccc' },
                  transition: 'all 0.3s',
                }}
              >
                {loading ? 'Processing...' : `Pay $${grandTotal.toFixed(2)}`}
              </Button>

              {/* Trust badges */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2.5 }}>
                <Typography variant="caption" sx={{ color: '#aaa', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LockIcon sx={{ fontSize: 12 }} /> SSL Secured
                </Typography>
                <Typography variant="caption" sx={{ color: '#aaa' }}>|</Typography>
                <Typography variant="caption" sx={{ color: '#aaa' }}>
                  🔒 256-bit Encryption
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          icon={<CheckCircleIcon />}
          severity="success"
          sx={{ fontWeight: 600, fontSize: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
        >
          🎉 Payment Successful! Redirecting...
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Checkout;
