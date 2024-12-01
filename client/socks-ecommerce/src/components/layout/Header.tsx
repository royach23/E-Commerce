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
import Logo from '../../assets/logo.svg';

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
            sx={{color: 'primary.main'}}
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
      <AppBar position="sticky">
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
            <img width={70} height={70} src={Logo} alt='Logo' onClick={() => navigate('/')} style={{cursor: 'pointer'}} />
            <Typography 
              variant="h4" 
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
                sx={{mx: 1, fontSize: '1.4em', }}
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
                sx={{mx: 1}}
              >
                <AccountIcon sx={{fontSize: '1.4em'}} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                MenuListProps={{
                  sx: {
                    backgroundColor: "primary.light",
                  },
                }}
              >
                <MenuItem onClick={handleNavigateToOrderHistory} sx={{color: 'primary.main', fontSize: '1.2em'}}>
                  <OrderHistoryIcon sx={{ mr: 1, fontSize: '1.2em'}} />
                  Order History
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{color: 'primary.main', fontSize: '1.2em'}}>
                  <LogoutIcon sx={{ mr: 1, fontSize: '1.4em'}} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={handleOpenLoginModal}
              sx={{mx: 1, fontSize: '1.4em'}}
            >
              Login
            </Button>
          )}

          <IconButton 
            color="inherit"
            onClick={() => navigate('/cart')}
            sx={{ml: 1, mr: 2}}
          >
            <Badge 
              badgeContent={cartItems.length} 
              color="secondary"
            >
              <CartIcon sx={{fontSize: '1.4em'}} />
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250, backgroundColor: 'primary.light' },
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