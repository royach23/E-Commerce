import React from 'react';
import { 
  Container, 
  Typography, 
  List, 
  ListItem, 
  Grid2, 
  Button, 
  Divider, 
  Box,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  const removeFromCart = (productId: number, size: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: {id: productId, size} });
  };

  const updateQuantity = (productId: number, size: string, quantity: number) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { id: productId, size, quantity } 
    });
  };

  return (
    <Container maxWidth="lg">
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          mb: 4, 
          textAlign: 'center' 
        }}
      >
        Your Shopping Cart
      </Typography>

      {state.items.length === 0 ? (
        <Typography 
          variant="body1" 
          align="center"
          sx={{ mt: 4 }}
        >
          Your cart is empty
        </Typography>
      ) : (
        <Box>
          <List>
            {state.items.map((item) => (
              <React.Fragment key={item.product_id}>
                <ListItem 
                  sx={{ 
                    py: 2, 
                    px: 0, 
                    alignItems: 'center' 
                  }}
                >
                  <Grid2 container alignItems="center" spacing={2}>
                    <Grid2>
                      <Typography variant="subtitle1">
                        {item.name}
                      </Typography>
                      <Typography variant="subtitle2">
                        {item.size}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${item.price.toFixed(2)} each
                      </Typography>
                    </Grid2>
                    
                    <Grid2>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center' 
                      }}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => updateQuantity(item.product_id, item.size, Math.max(1, item.quantity - 1))}
                          sx={{ minWidth: 40, mr: 1 }}
                        >
                          -
                        </Button>
                        <Typography sx={{ mx: 1 }}>
                          {item.quantity}
                        </Typography>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => updateQuantity(item.product_id, item.size, item.quantity + 1)}
                          sx={{ minWidth: 40, ml: 1 }}
                        >
                          +
                        </Button>
                      </Box>
                    </Grid2>
                    
                    <Grid2>
                      <Typography variant="subtitle1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Grid2>
                    
                    <Grid2>
                      <IconButton 
                        edge="end" 
                        aria-label="delete"
                        onClick={() => removeFromCart(item.product_id, item.size)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid2>
                  </Grid2>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 3, 
            mb: 4 
          }}>
            <Typography variant="h6">
              Total
            </Typography>
            <Typography variant="h6">
              ${state.total.toFixed(2)}
            </Typography>
          </Box>

          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            fullWidth
            sx={{ py: 1.5 }}
            onClick={() => navigate(`/checkout`)}
          >
            Proceed to Checkout
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Cart;