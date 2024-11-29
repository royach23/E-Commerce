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
      
      <Typography variant="h4" gutterBottom>
        Order Completed Successfully!
      </Typography>
      
      <Box sx={{ 
        bgcolor: 'background.paper', 
        p: 3, 
        borderRadius: 2, 
        boxShadow: 1,
        width: '100%',
        mb: 3 
      }}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        
        <Typography variant="body1">
          Order Number: {orderDetails.orderId || 'N/A'}
        </Typography>
        <Typography variant="body1">
          Total Amount: ${orderDetails.total?.toFixed(2) || 'N/A'}
        </Typography>
        <Typography variant="body1">
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