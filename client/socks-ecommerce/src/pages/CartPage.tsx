import React, { useState } from 'react';
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
import { CartItem } from '../types/Cart';


const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
        id: 1,
        name: 'Classic Cotton Crew',
        price: 12.99,
        quantity: 2,
        size: 'M',
        description: '1',
        image: 'https://socco78.com/cdn/shop/products/Socco-C1-TopView0266_cdc11079-7c39-4205-9484-15811efec52b.jpg?v=1631905682',
        inStock: false
    },
    {
        id: 2,
        name: 'Athletic Performance',
        price: 15.99,
        quantity: 1,
        size: 'L',
        description: '2',
        image: 'https://socco78.com/cdn/shop/products/Socco-C1-TopView0266_cdc11079-7c39-4205-9484-15811efec52b.jpg?v=1631905682',
        inStock: true
    }
  ]);

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
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

      {cartItems.length === 0 ? (
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
            {cartItems.map((item) => (
              <React.Fragment key={item.id}>
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
                      <Typography variant="body2" color="text.secondary">
                        Size: {item.size} | ${item.price.toFixed(2)} each
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
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
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
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                        onClick={() => removeFromCart(item.id)}
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
              ${calculateTotal().toFixed(2)}
            </Typography>
          </Box>

          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            fullWidth
            sx={{ py: 1.5 }}
          >
            Proceed to Checkout
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Cart;