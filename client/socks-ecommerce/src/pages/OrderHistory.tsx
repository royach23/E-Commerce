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
      <Typography variant="h4" gutterBottom color='primary'>
        Order History
      </Typography>

      {transactions.length === 0 ? (
        <Typography variant="body1" color='primary'>No orders found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{backgroundColor: 'primary.light'}}>
          <Table>
            <TableHead>
              <TableRow sx={{textAlign: 'center'}}>
                <TableCell sx={{color: 'primary.main', textAlign: 'center', fontWeight: 'bold', fontSize: '1.4em'}}>Order ID</TableCell>
                <TableCell sx={{color: 'primary.main', textAlign: 'center', fontWeight: 'bold', fontSize: '1.4em'}}>Purchase Date</TableCell>
                <TableCell sx={{color: 'primary.main', textAlign: 'center', fontWeight: 'bold', fontSize: '1.4em'}}>Total Price</TableCell>
                <TableCell sx={{color: 'primary.main', textAlign: 'center', fontWeight: 'bold', fontSize: '1.4em'}}>Status</TableCell>
                <TableCell sx={{color: 'primary.main', textAlign: 'center', fontWeight: 'bold', fontSize: '1.4em'}}>Items</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell sx={{color: 'primary.main', textAlign: 'center', fontSize: '1.2em'}}>#{transaction.transactionId}</TableCell>
                  <TableCell sx={{color: 'primary.main', textAlign: 'center', fontSize: '1.2em'}}>
                    {new Date(transaction.purchaseTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{color: 'primary.main', textAlign: 'center', fontSize: '1.2em'}}>
                    ${transaction.cart?.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.orderStatus} 
                      color={getStatusColor(transaction.orderStatus)} 
                      size="small"
                      sx={{textAlign: 'center', width: '100%', fontSize: '1.2em'}} 
                    />
                  </TableCell>
                  <TableCell sx={{color: 'primary.main', textAlign: 'center'}}>
                    {transaction.cart?.items?.map((item) => (
                      <Box key={item.product_id} sx={{ display: 'flex', alignItems: 'center', mb: 1, textAlign: 'center' }}>
                        <Typography variant="body1" sx={{textAlign: 'center', width: '100%', fontSize: '1.2em'}}>
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