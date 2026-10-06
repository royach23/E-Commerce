import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid2,
  CircularProgress
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  ShoppingCart as CartIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle as CompletedIcon
} from '@mui/icons-material';
import { Transaction } from '../../types/Transaction';
import { TransactionService } from '../../services/TransactionService';
import TransactionRow from './TransactionRow';

interface TransactionsManagementProps {
  transactions: Transaction[];
  loading: boolean;
  onTransactionsUpdate: (updatedList: Transaction[]) => void;
  onNotify: (message: string, severity: 'success' | 'error' | 'info') => void;
}

export const TransactionsManagement: React.FC<TransactionsManagementProps> = ({
  transactions,
  loading,
  onTransactionsUpdate,
  onNotify
}) => {
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [expandedTxId, setExpandedTxId] = useState<number | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesStatus = statusFilter === 'ALL' || t.orderStatus.toUpperCase() === statusFilter.toUpperCase();
      const matchesSearch =
        String(t.transactionId).includes(orderSearch) ||
        (t.userId && t.userId.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (t.address && t.address.toLowerCase().includes(orderSearch.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [transactions, statusFilter, orderSearch]);

  // KPI Metrics
  const totalRevenue = useMemo(() => {
    return transactions
      .filter((t) => t.orderStatus.toUpperCase() !== 'CANCELED')
      .reduce((sum, t) => sum + (t.cart?.total || 0), 0);
  }, [transactions]);

  const pendingCount = useMemo(() => {
    return transactions.filter((t) => t.orderStatus.toUpperCase() === 'PENDING').length;
  }, [transactions]);

  const completedCount = useMemo(() => {
    return transactions.filter((t) => t.orderStatus.toUpperCase() === 'COMPLETED').length;
  }, [transactions]);

  const handleStatusChange = async (transactionId: number, newStatus: string) => {
    try {
      const updated = await TransactionService.updateTransactionStatus(transactionId, newStatus);
      const updatedList = transactions.map((t) => (t.transactionId === transactionId ? updated : t));
      onTransactionsUpdate(updatedList);
      onNotify(`Order #${transactionId} status updated to ${newStatus}`, 'success');
    } catch (err: any) {
      onNotify(err?.response?.data?.detail || 'Failed to update transaction status', 'error');
    }
  };

  return (
    <Box>
      {/* KPI Summary Cards */}
      <Grid2 container spacing={2} sx={{ mb: 3 }}>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2} sx={{ borderRadius: 2, bgcolor: '#ffffff', borderLeft: '5px solid #1976d2' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="overline" color="text.secondary">Total Orders</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  {transactions.length}
                </Typography>
              </Box>
              <CartIcon sx={{ fontSize: 40, color: '#1976d2' }} />
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2} sx={{ borderRadius: 2, bgcolor: '#ffffff', borderLeft: '5px solid #2e7d32' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="overline" color="text.secondary">Total Revenue</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  ${totalRevenue.toFixed(2)}
                </Typography>
              </Box>
              <MoneyIcon sx={{ fontSize: 40, color: '#2e7d32' }} />
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2} sx={{ borderRadius: 2, bgcolor: '#ffffff', borderLeft: '5px solid #e65100' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="overline" color="text.secondary">Pending Orders</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  {pendingCount}
                </Typography>
              </Box>
              <PendingIcon sx={{ fontSize: 40, color: '#e65100' }} />
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card elevation={2} sx={{ borderRadius: 2, bgcolor: '#ffffff', borderLeft: '5px solid #388e3c' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="overline" color="text.secondary">Completed Orders</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  {completedCount}
                </Typography>
              </Box>
              <CompletedIcon sx={{ fontSize: 40, color: '#388e3c' }} />
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Filter Bar */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          label="Search Orders"
          placeholder="Search by Order #, Customer, or Address..."
          value={orderSearch}
          onChange={(e) => setOrderSearch(e.target.value)}
          sx={{ minWidth: 260, flexGrow: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            label="Status Filter"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="PENDING">Pending Only</MenuItem>
            <MenuItem value="COMPLETED">Completed Only</MenuItem>
            <MenuItem value="CANCELED">Canceled Only</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Transactions Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : filteredTransactions.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            No orders match your filter criteria.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead sx={{ bgcolor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ width: 40 }} />
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Total Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Current Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Change Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TransactionRow
                  key={tx.transactionId}
                  transaction={tx}
                  isExpanded={expandedTxId === tx.transactionId}
                  onToggleExpand={() => setExpandedTxId(expandedTxId === tx.transactionId ? null : tx.transactionId)}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TransactionsManagement;
