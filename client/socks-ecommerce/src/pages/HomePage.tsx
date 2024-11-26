import React from 'react';
import { 
  Container, 
  Typography, 
  Grid2, 
  Button, 
  Box 
} from '@mui/material';
import ProductCard from '../components/products/ProductCard';
import { Product } from '../types/Product';

const HomePage: React.FC = () => {
  const featuredSocks: Product[] = [
    { id: 1, name: 'Classic Cotton Crew', price: 12.99, image: 'https://socco78.com/cdn/shop/products/Socco-C1-TopView0266_cdc11079-7c39-4205-9484-15811efec52b.jpg?v=1631905682', description: '1', inStock: true },
    { id: 2, name: 'Athletic Performance', price: 15.99, image: 'https://socco78.com/cdn/shop/products/Socco-C1-TopView0266_cdc11079-7c39-4205-9484-15811efec52b.jpg?v=1631905682', description: '2', inStock: false },
    { id: 3, name: 'Cozy Winter Wool', price: 18.99, image: 'https://socco78.com/cdn/shop/products/Socco-C1-TopView0266_cdc11079-7c39-4205-9484-15811efec52b.jpg?v=1631905682', description: '3', inStock: true }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        my: 4, 
        textAlign: 'center',
        py: 4 
      }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          Sock Haven
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
        >
          Comfort and Style for Your Feet
        </Typography>
      </Box>

      <Grid2 container spacing={3} justifyContent="center">
        {featuredSocks.map((sock) => (
          <Grid2 key={sock.id}>
            <ProductCard
            product={sock}
            />
          </Grid2>
        ))}
      </Grid2>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 4 
      }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          sx={{ px: 4, py: 1.5 }}
        >
          Shop All Socks
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;