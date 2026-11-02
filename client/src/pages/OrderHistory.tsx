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
  CircularProgress,
  IconButton,
  Collapse
} from '@mui/material';
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  LocalShipping as ShippingIcon
} from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';
import { Transaction } from '../types/Transaction';

const OrderHistoryPage: React.FC = () => {
  const { user, isLoading: isUserLoading, getUserTransactions } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expandedTxId, setExpandedTxId] = useState<number | null>(null);
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
          console.error(err);
          setError('Failed to fetch order history');
          setIsLoading(false);
        }
      } else if (!isUserLoading) {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user, isUserLoading, getUserTransactions]);

  const getStatusChipColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return { bg: '#e8f5e9', color: '#2e7d32', border: '#a5d6a7' };
      case 'PENDING':
        return { bg: '#fff3e0', color: '#e65100', border: '#ffb74d' };
      case 'CANCELED':
      case 'CANCELLED':
        return { bg: '#ffebee', color: '#c62828', border: '#ef9a9a' };
      default:
        return { bg: '#f5f5f5', color: '#616161', border: '#e0e0e0' };
    }
  };

  if (isLoading || isUserLoading) {
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
        Order History
      </Typography>

      {transactions.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            No orders found.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ bgcolor: 'primary.light' }}>
              <TableRow>
                <TableCell sx={{ width: 40 }} />
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Purchase Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Shipping Address</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Total Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => {
                const isExpanded = expandedTxId === tx.transactionId;
                const statusColors = getStatusChipColor(tx.orderStatus);
                const itemsCount = tx.cart?.items?.reduce((sum, it) => sum + it.quantity, 0) || 0;
                const toggleExpand = () =>
                  setExpandedTxId(isExpanded ? null : tx.transactionId);

                return (
                  <React.Fragment key={tx.transactionId}>
                    <TableRow
                      hover
                      onClick={toggleExpand}
                      sx={{ cursor: 'pointer', '& > *': { borderBottom: 'unset' } }}
                    >
                      <TableCell sx={{ width: 40 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand();
                          }}
                        >
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                        #{tx.transactionId}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(tx.purchaseTime).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {tx.address || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${itemsCount} item${itemsCount === 1 ? '' : 's'}`}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '1.05rem' }}>
                        ${(tx.cart?.total || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tx.orderStatus.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: statusColors.bg,
                            color: statusColors.color,
                            border: `1px solid ${statusColors.border}`,
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                    </TableRow>

                    {/* Expanded items */}
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2, p: 2, bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #eee' }}>
                            {/* Order Delivery Info */}
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                mb: 2,
                                p: 1.5,
                                bgcolor: '#ffffff',
                                borderRadius: 1.5,
                                border: '1px solid #e0e0e0',
                                flexWrap: 'wrap'
                              }}
                            >
                              <ShippingIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                              <Box>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 'bold',
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    display: 'block'
                                  }}
                                >
                                  Delivery / Shipping Address
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                  {tx.address || 'No address recorded'}
                                </Typography>
                              </Box>
                            </Box>

                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5, color: 'primary.main' }}>
                              Order Items Breakdown:
                            </Typography>
                            {!tx.cart?.items || tx.cart.items.length === 0 ? (
                              <Typography variant="body2" color="text.secondary">
                                No items recorded for this order.
                              </Typography>
                            ) : (
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Size</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {tx.cart.items.map((item, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box
                                          component="img"
                                          src={item.image}
                                          alt={item.name}
                                          sx={{ width: 34, height: 34, borderRadius: 1, objectFit: 'cover' }}
                                          onError={(e: any) => {
                                            e.target.src = 'https://placehold.co/100x100?text=Sock';
                                          }}
                                        />
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                          {item.name}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>{item.size}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>${item.price.toFixed(2)}</TableCell>
                                      <TableCell sx={{ fontWeight: 'bold' }}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default OrderHistoryPage;