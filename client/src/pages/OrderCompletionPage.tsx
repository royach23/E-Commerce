import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderCompletion: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const orderDetails = location.state?.orderDetails || {};

  return (
    <Container maxWidth="sm" sx={{ 
      textAlign: 'center', 
      mt: 8, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center' 
    }}>
      <CheckCircleOutlineIcon 
        color="success" 
        sx={{ fontSize: 100, mb: 3 }} 
      />
      
      <Typography variant="h4" gutterBottom color='primary'>
        Order Completed Successfully!
      </Typography>
      
      <Box sx={{ 
        bgcolor: 'primary.light', 
        p: 3, 
        borderRadius: 2, 
        boxShadow: 1,
        width: '100%',
        mb: 3 
      }}>
        <Typography variant="h6" gutterBottom color='primary'>
          Order Summary
        </Typography>
        
        <Typography variant="body1" color='primary'>
          Order Number: {orderDetails.orderId || 'N/A'}
        </Typography>
        <Typography variant="body1" color='primary'>
          Total Amount: ${orderDetails.total?.toFixed(2) || 'N/A'}
        </Typography>
        <Typography variant="body1" color='primary'>
          Estimated Delivery: {orderDetails.estimatedDelivery || 'Within 5-7 business days'}
        </Typography>
      </Box>
      
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Continue Shopping
      </Button>
    </Container>
  );
};

export default OrderCompletion;