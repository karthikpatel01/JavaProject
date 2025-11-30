import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Tab,
  Tabs,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, AccountCircle, AdminPanelSettings } from '@mui/icons-material';
import type { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole, cardNumber?: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [tab, setTab] = useState(0);
  const [cardNumber, setCardNumber] = useState('');
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Demo cards
    const validCards = ['4111111111111111', '4222222222222222', '4333333333333333'];
    const validPins: Record<string, string> = {
      '4111111111111111': '1234',
      '4222222222222222': '5678',
      '4333333333333333': '9012',
    };

    if (!validCards.includes(cardNumber)) {
      setError('Invalid card number');
      return;
    }

    if (validPins[cardNumber] !== pin) {
      setError('Invalid PIN');
      return;
    }

    onLogin('CUSTOMER', cardNumber);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'admin' && password === 'admin123') {
      onLogin('ADMIN');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Banking System
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Secure Payment Gateway
            </Typography>
          </Box>

          <Tabs
            value={tab}
            onChange={(_, v) => {
              setTab(v);
              setError('');
            }}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab icon={<AccountCircle />} label="Customer Login" />
            <Tab icon={<AdminPanelSettings />} label="Admin Login" />
          </Tabs>

          {tab === 0 ? (
            <form onSubmit={handleCustomerLogin}>
              <TextField
                fullWidth
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                margin="normal"
                placeholder="4111111111111111"
                required
                inputProps={{ maxLength: 16 }}
              />
              <TextField
                fullWidth
                label="PIN"
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                margin="normal"
                placeholder="Enter 4-digit PIN"
                required
                inputProps={{ maxLength: 4 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPin(!showPin)} edge="end">
                        {showPin ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
              >
                Login as Customer
              </Button>

              <Paper sx={{ mt: 3, p: 2, bgcolor: '#f0f4ff' }} elevation={0}>
                <Typography variant="caption" display="block" gutterBottom fontWeight={600}>
                  Demo Customer Accounts:
                </Typography>
                <Typography variant="caption" display="block">
                  Card: <strong>4111111111111111</strong> | PIN: <strong>1234</strong>
                </Typography>
                <Typography variant="caption" display="block">
                  Card: <strong>4222222222222222</strong> | PIN: <strong>5678</strong>
                </Typography>
                <Typography variant="caption" display="block">
                  Card: <strong>4333333333333333</strong> | PIN: <strong>9012</strong>
                </Typography>
              </Paper>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                placeholder="admin"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                placeholder="Enter password"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                color="secondary"
                sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
              >
                Login as Admin
              </Button>

              <Paper sx={{ mt: 3, p: 2, bgcolor: '#fff5f5' }} elevation={0}>
                <Typography variant="caption" display="block" fontWeight={600}>
                  Demo Admin Account:
                </Typography>
                <Typography variant="caption" display="block">
                  Username: <strong>admin</strong> | Password: <strong>admin123</strong>
                </Typography>
              </Paper>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
