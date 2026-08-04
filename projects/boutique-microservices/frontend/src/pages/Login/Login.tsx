import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      // Only reaches here on SUCCESS
      navigate('/products');
    } catch (err) {
      // Error is set in AuthContext — stay on login page
    }
  };

  const handleForgotSubmit = async () => {
    if (!forgotEmail) return;
    setForgotLoading(true);
    // Simulate sending reset email (mock — no real API)
    await new Promise((r) => setTimeout(r, 1500));
    setForgotLoading(false);
    setForgotSent(true);
    setForgotOpen(false);
    setForgotEmail('');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: 'center',
        }}
      >
        <Paper elevation={4} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
          {/* Icon */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <Box
              sx={{
                bgcolor: 'primary.main',
                borderRadius: '50%',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockOutlinedIcon sx={{ color: 'white' }} />
            </Box>
          </Box>

          <Typography component="h1" variant="h5" align="center" gutterBottom fontWeight={700}>
            Welcome Back
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
            Sign in to your Boutique account
          </Typography>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Forgot Password Link */}
            <Box sx={{ textAlign: 'right', mt: 0.5 }}>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: 'pointer', display: 'inline', '&:hover': { textDecoration: 'underline' } }}
                onClick={() => { clearError(); setForgotOpen(true); }}
                id="forgot-password-link"
              >
                Forgot password?
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.3, borderRadius: 2, fontWeight: 700 }}
              disabled={loading}
              id="login-submit-btn"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Divider sx={{ my: 1 }}>
              <Typography variant="body2" color="text.secondary">OR</Typography>
            </Divider>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                  Don't have an account? <strong>Sign Up</strong>
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* ─── Forgot Password Dialog ─── */}
      <Dialog open={forgotOpen} onClose={() => setForgotOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Reset Your Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter your registered email address. We'll send you a link to reset your password.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Email Address"
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            id="forgot-email-input"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setForgotOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleForgotSubmit}
            disabled={forgotLoading || !forgotEmail}
            id="forgot-submit-btn"
          >
            {forgotLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Success Snackbar ─── */}
      <Snackbar
        open={forgotSent}
        autoHideDuration={5000}
        onClose={() => setForgotSent(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setForgotSent(false)}>
          Password reset link sent to <strong>{forgotEmail || 'your email'}</strong>! Check your inbox.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;