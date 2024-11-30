import React, { useState, useEffect } from 'react';
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
  SelectChangeEvent,
  CircularProgress
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../types/Product';
import { useCart } from '../contexts/CartContext';

const ProductDetail: React.FC = () => {
  const { products, loading, error } = useProducts();
  const { product_id } = useParams<{ product_id: string }>();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [size, setSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundProduct = products.find(
      (p) => p.product_id == parseInt(product_id || '0')
    );
    setProduct(foundProduct || null);
  }, [product_id, products]);

  const handleSizeChange = (event: SelectChangeEvent) => {
    setSize(event.target.value);
  };

  const handleQuantityChange = (event: SelectChangeEvent) => {
    setQuantity(Number(event.target.value));
  };

  const { dispatch } = useCart();

  const handleAddToCart = () => {
    if (product) {
      dispatch({ 
        type: 'ADD_TO_CART', 
        payload: {
          ...product,
          quantity: quantity,
          size: size
        }
      });
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!product) return <Typography>Product not found</Typography>;

  return (
    <Container maxWidth="lg">
      <Grid2 container spacing={4}>
        <Grid2>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ 
              width: '500px', 
              borderRadius: '8px' 
            }} 
          />
        </Grid2>
        <Grid2>
          <Typography variant="h3" gutterBottom color='primary'>
            {product.name}
          </Typography>
          <Typography variant="h5" color="primary">
            ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="h6" color='primary'>
            {product.description}
          </Typography>

          <Box sx={{ 
            my: 2, 
            display: 'flex', 
            gap: 2 
          }}>
            <FormControl variant="outlined" sx={{ minWidth: 120 }} color='primary'>
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
                )) || [
                  <MenuItem key="M" value="M">M</MenuItem>
                ]}
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
            disabled={!product.in_stock}
          >
            {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default ProductDetail;