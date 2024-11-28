import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  Box
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  ShoppingCart as CartIcon, 
  Home as HomeIcon, 
  Storefront as ProductsIcon,
  Login as LoginIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useUser } from '../../contexts/UserContext';
import LoginModal from '../users/LoginModal';

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { state: { items: cartItems } } = useCart();
  const { isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenLoginModal = () => {
    setLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { 
      text: 'Home', 
      icon: <HomeIcon />, 
      path: '/' 
    },
    { 
      text: 'Products', 
      icon: <ProductsIcon />, 
      path: '/products' 
    }
  ];

  const drawer = (
    <Box 
      sx={{ width: 250 }} 
      role="presentation" 
      onClick={handleDrawerToggle}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
          >
            {item.icon}
            <ListItemText 
              primary={item.text} 
              sx={{ ml: 2 }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1 }}
          >
            Sock Haven
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                startIcon={item.icon}
                component={RouterLink}
                to={item.path}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          {isAuthenticated ? (
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          ) : (
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={handleOpenLoginModal}
            >
              Login
            </Button>
          )}

          <IconButton 
            color="inherit"
            onClick={() => navigate('/cart')}
          >
            <Badge 
              badgeContent={cartItems.length} 
              color="secondary"
            >
              <CartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, 
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      <LoginModal 
        open={loginModalOpen} 
        onClose={handleCloseLoginModal} 
      />
    </>
  );
};

export default Header;