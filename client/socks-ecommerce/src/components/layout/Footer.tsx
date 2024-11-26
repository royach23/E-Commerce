import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  IconButton 
} from '@mui/material';
import { 
  Facebook as FacebookIcon, 
  Twitter as TwitterIcon, 
  Instagram as InstagramIcon 
} from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        py: 6,
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Sock Haven
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Premium socks for every occasion. Comfort meets style.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/" color="inherit" underline="hover">Home</Link>
              <Link href="/products" color="inherit" underline="hover">Products</Link>
              <Link href="/cart" color="inherit" underline="hover">Cart</Link>
              <Link href="/checkout" color="inherit" underline="hover">Checkout</Link>
            </Box>
          </Grid>

          {/* Contact & Social */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" gutterBottom>
              Connect With Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@sockhaven.com
              <br />
              Phone: (555) 123-4567
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="primary" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="primary" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          align="center" 
          sx={{ mt: 4 }}
        >
          © {new Date().getFullYear()} Sock Haven. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;