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
  Grid2,
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductCard from '../components/products/ProductCard';
import { useProducts } from '../contexts/ProductContext';

const Products: React.FC = () => {
  const { products, loading, error, searchProducts, fetchProducts } = useProducts();
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      await fetchProducts();
      return;
    }

    await searchProducts(searchTerm);
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const sortedAndFilteredProducts = products
    .filter((product) => category === 'all' || product.category === category)
    .sort((a, b) => {
      switch (sortBy) {
        case 'pricelow':
          return a.price - b.price;
        case 'pricehigh':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom color= 'primary'>
        Our Sock Collection
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        my: 3
      }}>
        <TextField
          variant="outlined"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyPress}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
            )
            }
          }}
          sx={{ flexGrow: 1, mr: 2, color: 'primary' }}
        />

        <FormControl variant="outlined" sx={{ minWidth: 150, mr: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="all">All Socks</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Sports">Sports</MenuItem>
            <MenuItem value="Winter">Winter</MenuItem>
            <MenuItem value="Formal">Formal</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: 180 }}>
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : sortedAndFilteredProducts.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          No products found
        </Typography>
      ) : (
        <Grid2 container spacing={6}>
          {sortedAndFilteredProducts.map((sock) => (
            <Grid2 key={sock.product_id} >
              <ProductCard product={sock} />
            </Grid2>
          ))}
        </Grid2>
      )}
    </Container>
  );
};

export default Products;