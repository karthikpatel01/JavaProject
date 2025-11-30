import React, { useEffect, useState } from 'react';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, TextField, Alert, CircularProgress
} from '@mui/material';
import type { Transaction } from '../types';
import { coreApi } from '../services/api';

interface Props { onLogout: () => void; }

const AdminDashboard: React.FC<Props> = ({ onLogout }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cardFilter, setCardFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const params = cardFilter ? { cardNumber: cardFilter } : {};
      const res = await coreApi.get<Transaction[]>('/transactions', { params });
      setTransactions(res.data ?? []);
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? 'Failed to load transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Super Admin</Typography>
        <Button variant="outlined" onClick={onLogout}>Logout</Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="Card Number (optional)"
            value={cardFilter}
            onChange={(e) => setCardFilter(e.target.value)}
            size="small"
            sx={{ maxWidth: 360 }}
          />
          <Button variant="contained" onClick={load}>Refresh</Button>
        </Box>
        {err && <Alert severity="error" sx={{ mt: 2 }}>{err}</Alert>}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography variant="h6">All Transactions</Typography>
          {loading && <CircularProgress size={20} />}
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Card</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map(t => (
              <TableRow key={t.id}>
                <TableCell>{t.id}</TableCell>
                <TableCell>{t.cardNumber}</TableCell>
                <TableCell>{t.type}</TableCell>
                <TableCell>{t.amount}</TableCell>
                <TableCell>{t.status}</TableCell>
                {/* <TableCell>{t.reason}</TableCell> */}
                <TableCell>{t.timestamp}</TableCell>
              </TableRow>
            ))}
            {!loading && !transactions.length && (
              <TableRow><TableCell colSpan={7}>No transactions</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
