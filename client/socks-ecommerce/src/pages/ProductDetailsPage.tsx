import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid2, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Box,
  SelectChangeEvent
} from '@mui/material';
import { Product } from '../types/Product';


const ProductDetail: React.FC = () => {
  const [size, setSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  const product: Product = {
    id: 1,
    name: 'Classic Cotton Crew',
    price: 12.99,
    description: 'Comfortable everyday socks made from premium cotton blend.',
    sizes: ['S', 'M', 'L', 'XL'],
    image: '/socks-1.jpg',
    inStock: true
  };

  const handleSizeChange = (event: SelectChangeEvent) => {
    setSize(event.target.value);
  };

  const handleQuantityChange = (event: SelectChangeEvent) => {
    setQuantity(Number(event.target.value));
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} ${product.name} in size ${size} to cart`);
  };

  return (
    <Container maxWidth="lg">
      <Grid2 container spacing={4}>
        <Grid2>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ 
              width: '100%', 
              borderRadius: '8px' 
            }} 
          />
        </Grid2>
        <Grid2>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h6" color="primary">
            ${product.price}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Box sx={{ 
            my: 2, 
            display: 'flex', 
            gap: 2 
          }}>
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel>Size</InputLabel>
              <Select
                value={size}
                onChange={handleSizeChange}
                label="Size"
              >
                {product.sizes?.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel>Quantity</InputLabel>
              <Select
                value={quantity.toString()}
                onChange={handleQuantityChange}
                label="Quantity"
              >
                {[1, 2, 3, 4, 5].map((q) => (
                  <MenuItem key={q} value={q}>
                    {q}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default ProductDetail;