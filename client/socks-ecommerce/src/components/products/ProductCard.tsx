import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  CardActions, 
  Button, 
} from '@mui/material';
import { Product } from '../../types/Product';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: {
        ...product,
        quantity: 1,
        size: 'M'
      }
    });
  };

  const navigate = useNavigate();

  return (
    <Card>
      <CardMedia
        component="img"
        height="250"
        image={product.image}
        alt={product.name}
        onClick={() => navigate(`/product/${product.product_id}`)}
        sx={{cursor: 'pointer'}}
/>
      <CardContent 
        onClick={() => navigate(`/product/${product.product_id}`)}
        sx={{ cursor: 'pointer', pb: 0}}
      >
        <Typography gutterBottom variant="h5">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary">
          ${product.price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="large" 
          color="primary" 
          onClick={handleAddToCart}
          disabled={!product.in_stock}
        >
          {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;