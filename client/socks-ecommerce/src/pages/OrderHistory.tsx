import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip,
  CircularProgress
} from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { Transaction } from '../types/Transaction';

const OrderHistoryPage: React.FC = () => {
  const { user, getUserTransactions } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const userTransactions = await getUserTransactions(user.id!);
          setTransactions(userTransactions);
          setIsLoading(false);
        } catch (err) {
          console.error(err)
          setError('Failed to fetch order history');
          setIsLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [user, getUserTransactions]);

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Order History
      </Typography>

      {transactions.length === 0 ? (
        <Typography variant="body1">No orders found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Purchase Date</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Items</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell>#{transaction.transactionId}</TableCell>
                  <TableCell>
                    {new Date(transaction.purchaseTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    ${transaction.cart?.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.orderStatus} 
                      color={getStatusColor(transaction.orderStatus)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {transaction.cart?.items?.map((item) => (
                      <Box key={item.product_id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2">
                          {item.name} (x{item.quantity}) - {item.size}
                        </Typography>
                      </Box>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default OrderHistoryPage;