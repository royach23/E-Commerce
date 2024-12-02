import React from 'react';
import { 
  Routes, 
  Route 
} from 'react-router-dom';
import { 
  Container, 
  Box
} from '@mui/material';
import Header from './Header'; 
import Footer from './Footer'; 
import { Home, Products, ProductDetail, Cart, Checkout, Register, OrderCompletion, OrderHistory, UserDetails } from '../../pages';

const Layout: React.FC = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      width: '100vw'
    }}>
      <Header />
      <Container 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: 4 
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-completion" element={<OrderCompletion />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/user" element={<UserDetails />} />
        </Routes>
      </Container>

      <Footer />
    </Box>
  );
};

export default Layout;