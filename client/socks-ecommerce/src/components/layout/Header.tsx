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
  Box,
  MenuItem,
  Menu
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  ShoppingCart as CartIcon, 
  Home as HomeIcon, 
  Storefront as ProductsIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  ReceiptLong as OrderHistoryIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useUser } from '../../contexts/UserContext';
import LoginModal from '../users/LoginModal';
import Logo from '../../../public/logo.svg';

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { state: { items: cartItems } } = useCart();
  const { isAuthenticated, logout, user } = useUser();
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
    handleMenuClose();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateToOrderHistory = () => {
    navigate('/order-history');
    handleMenuClose();
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

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1 
            }}
          >
            <img width={50} height={50} src={Logo} alt='Logo' onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ ml: 2, cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              Sock Haven
            </Typography>
          </Box>

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
            <>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
              >
                <AccountIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleNavigateToOrderHistory}>
                  <OrderHistoryIcon sx={{ mr: 1 }} />
                  Order History
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
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