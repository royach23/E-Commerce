import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './styles/theme';
import Layout from './components/layout/Layout';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <ProductProvider>
          <Router>
            <Layout />
          </Router>
        </ProductProvider>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;