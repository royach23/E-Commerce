import React from 'react';
import { 
  Routes, 
  Route 
} from 'react-router-dom';
import { 
  Container, 
  Box,
  Alert
} from '@mui/material';
import Header from './Header'; 
import Footer from './Footer'; 
import { Home, Products, ProductDetail, Cart, Checkout, Register, OrderCompletion, OrderHistory, UserDetails, AdminDashboard } from '../../pages';
import AdminRoute from '../admin/AdminRoute';
import { useUser } from '../../contexts/UserContext';

const Layout: React.FC = () => {
  const { auth0Error } = useUser();

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
        {auth0Error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Auth0 Error: {auth0Error.message}
          </Alert>
        )}
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
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
        </Routes>
      </Container>


      <Footer />
    </Box>
  );
};

export default Layout;