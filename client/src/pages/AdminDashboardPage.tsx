import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Inventory as ProductsIcon,
  ReceiptLong as OrdersIcon,
  Refresh as RefreshIcon,
  AdminPanelSettings as AdminBadgeIcon
} from '@mui/icons-material';
import { useProducts } from '../contexts/ProductContext';
import { Transaction } from '../types/Transaction';
import { TransactionService } from '../services/TransactionService';
import ProductsManagement from '../components/admin/ProductsManagement';
import TransactionsManagement from '../components/admin/TransactionsManagement';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { products, fetchProducts } = useProducts();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const notify = (message: string, severity: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const loadTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const data = await TransactionService.getAllTransactions();
      setTransactions(data);
    } catch (err: any) {
      notify(err?.response?.data?.detail || 'Failed to load transactions', 'error');
    } finally {
      setTransactionsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleRefresh = async () => {
    await Promise.all([fetchProducts(), loadTransactions()]);
    notify('Dashboard data refreshed', 'info');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      {/* Header Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AdminBadgeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage product inventory and customer transaction fulfillment
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Box>

      {/* Tabs Navigation */}
      <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newVal) => setActiveTab(newVal)}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<ProductsIcon />}
            iconPosition="start"
            label={`Products Management (${products.length})`}
            sx={{ fontSize: '1.05rem', fontWeight: 'bold', py: 1.5 }}
          />
          <Tab
            icon={<OrdersIcon />}
            iconPosition="start"
            label={`Transactions Management (${transactions.length})`}
            sx={{ fontSize: '1.05rem', fontWeight: 'bold', py: 1.5 }}
          />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      {activeTab === 0 && <ProductsManagement onNotify={notify} />}
      {activeTab === 1 && (
        <TransactionsManagement
          transactions={transactions}
          loading={transactionsLoading}
          onTransactionsUpdate={setTransactions}
          onNotify={notify}
        />
      )}

      {/* Feedback Toast */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboardPage;
