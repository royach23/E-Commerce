import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Box,
  SelectChangeEvent,
  Grid2
} from '@mui/material';
import ProductCard from '../components/products/ProductCard';
import { Product } from '../types/Product';

const Products: React.FC = () => {
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const sockProducts: Product[] = [
    { id: 1, name: 'Classic Cotton Crew', price: 12.99, category: 'casual', image: 'https://socco78.com/cdn/shop/products/Socco-C1-TopView0266_cdc11079-7c39-4205-9484-15811efec52b.jpg?v=1631905682', description: '1', inStock: true },
    { id: 2, name: 'Athletic Performance', price: 15.99, category: 'sports', image: 'https://socco78.com/cdn/shop/products/Socco-C1-TopView0266_cdc11079-7c39-4205-9484-15811efec52b.jpg?v=1631905682', description: '2', inStock: true },
    { id: 3, name: 'Cozy Winter Wool', price: 18.99, category: 'winter', image: 'https://socco78.com/cdn/shop/products/Socco-C1-TopView0266_cdc11079-7c39-4205-9484-15811efec52b.jpg?v=1631905682', description: '3', inStock: false },
    { id: 4, name: 'Compression Running', price: 19.99, category: 'sports', image: 'https://socco78.com/cdn/shop/products/Socco-C1-TopView0266_cdc11079-7c39-4205-9484-15811efec52b.jpg?v=1631905682', description: '4', inStock: true },
    { id: 5, name: 'Dress Socks Set', price: 24.99, category: 'formal', image: 'https://socco78.com/cdn/shop/products/Socco-C1-TopView0266_cdc11079-7c39-4205-9484-15811efec52b.jpg?v=1631905682', description: '5', inStock: false }
  ];

  const filteredProducts = sockProducts.filter(
    (product) => category === 'all' || product.category === category
  );

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Our Sock Collection
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        my: 3 
      }}>
        <FormControl variant="outlined" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="all">All Socks</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="sports">Sports</MenuItem>
            <MenuItem value="winter">Winter</MenuItem>
            <MenuItem value="formal">Formal</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="pricelow">Price: Low to High</MenuItem>
            <MenuItem value="pricehigh">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid2>
        {filteredProducts.map((sock) => (
          <Grid2 key={sock.id}>
            <ProductCard 
                product={sock}
            />
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

export default Products;