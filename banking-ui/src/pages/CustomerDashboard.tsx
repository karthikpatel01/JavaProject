import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  AccountBalance,
  Refresh,
  Logout,
  TrendingUp,
  TrendingDown,
  CreditCard,
} from '@mui/icons-material';
import type { CardDetails, Transaction, TransactionRequest, TransactionResponse } from '../types';
import { coreApi, gatewayApi } from '../services/api';

interface Props {
  cardNumber: string;
  onLogout: () => void;
}

const CustomerDashboard: React.FC<Props> = ({ cardNumber, onLogout }) => {
  const [details, setDetails] = useState<CardDetails | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string>('');
  const [pin, setPin] = useState('');
  const [type, setType] = useState<'topup' | 'withdraw'>('topup');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cardRes, transRes] = await Promise.all([
        coreApi.get<CardDetails>(`/card/${cardNumber}`),
        coreApi.get<Transaction[]>(`/transactions/${cardNumber}`),
      ]);
      setDetails(cardRes.data);
      setTransactions(transRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      setMessage({ type: 'error', text: 'Failed to load account data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [cardNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!pin) {
      setMessage({ type: 'error', text: 'PIN is required' });
      return;
    }

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount greater than 0' });
      return;
    }

    try {
      const requestData: TransactionRequest = {
        cardNumber,
        pin,
        amount: numAmount,
        type,
      };

      const response = await gatewayApi.post<TransactionResponse>('/transactions/process', requestData);

      if (response.data.success) {
        setMessage({ type: 'success', text: response.data.message });
        setPin('');
        setAmount('');
        setTimeout(() => loadData(), 500);
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Transaction failed';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <AccountBalance sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Customer Portal
          </Typography>
          <IconButton color="inherit" onClick={loadData}>
            <Refresh />
          </IconButton>
          <Button color="inherit" startIcon={<Logout />} onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Balance Card */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                height: '100%',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CreditCard sx={{ mr: 1 }} />
                  <Typography variant="h6">Account Balance</Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold" mb={1}>
                  ${details?.balance.toFixed(2) || '0.00'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Card: •••• {cardNumber.slice(-4)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                  {details?.customerName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Transaction Form */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                New Transaction
              </Typography>

              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <ToggleButtonGroup
                    value={type}
                    exclusive
                    onChange={(_, val) => val && setType(val)}
                    fullWidth
                  >
                    <ToggleButton value="topup">
                      <TrendingUp sx={{ mr: 1 }} />
                      Top Up
                    </ToggleButton>
                    <ToggleButton value="withdraw">
                      <TrendingDown sx={{ mr: 1 }} />
                      Withdraw
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      inputProps={{ step: '0.01', min: '0.01' }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="PIN"
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      inputProps={{ maxLength: 4 }}
                      required
                    />
                  </Grid>
                </Grid>

                {message && (
                  <Alert severity={message.type} sx={{ mt: 2 }}>
                    {message.text}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 3 }}
                  disabled={loading}
                >
                  {type === 'topup' ? 'Add Funds' : 'Withdraw Funds'}
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Transaction History */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Transaction History</Typography>
                <Button size="small" startIcon={<Refresh />} onClick={loadData}>
                  Refresh
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Balance After</TableCell>
                      <TableCell>Date & Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No transactions yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>{tx.id}</TableCell>
                          <TableCell>
                            <Chip
                              label={tx.type.toUpperCase()}
                              size="small"
                              color={tx.type === 'topup' ? 'success' : 'primary'}
                            />
                          </TableCell>
                          <TableCell align="right">${tx.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip
                              label={tx.status}
                              size="small"
                              color={tx.status === 'SUCCESS' ? 'success' : 'error'}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {tx.balanceAfter ? `$${tx.balanceAfter.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomerDashboard;