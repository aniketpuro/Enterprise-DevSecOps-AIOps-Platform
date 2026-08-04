import React, { useState } from 'react';
import { Container, Typography, Box, Button, TextField, Paper, Grid, Snackbar, Alert } from '@mui/material';
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
      // 1. Play "cha-ching" sound
      const audio = new Audio('https://www.myinstants.com/media/sounds/kaching_1.mp3');
      audio.play().catch(e => console.log('Audio play blocked:', e));

      // 2. Call order-service to mock process the checkout
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      await axios.post(`${apiUrl}/orders/checkout`, { items, total });

      setSuccess(true);
      clearCart();
      setTimeout(() => {
        navigate('/orders');
      }, 3000);

    } catch (err) {
      console.error(err);
      alert('Checkout failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        <Typography variant="h3" gutterBottom>
          Checkout
        </Typography>

        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>Payment Details</Typography>
          <Typography color="text.secondary" paragraph>
            Fake Payment Checkout - No real money will be deducted.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField fullWidth label="Cardholder Name" defaultValue="Aniket" />
            </Grid>
            <Grid size={12}>
              <TextField fullWidth label="Card Number" defaultValue="4111 1111 1111 1111" />
            </Grid>
            <Grid size={6}>
              <TextField fullWidth label="Expiry Date" defaultValue="12/28" />
            </Grid>
            <Grid size={6}>
              <TextField fullWidth label="CVV" defaultValue="123" type="password" />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handlePayment}
              disabled={loading || items.length === 0}
            >
              {loading ? 'Processing...' : 'Pay OK'}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar open={success} autoHideDuration={3000}>
        <Alert severity="success">Payment Successful! You will receive an email shortly.</Alert>
      </Snackbar>
    </Container>
  );
};

export default Checkout;
