import React from 'react';
import { 
  Box, 
  Container, 
  Grid2, 
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
        backgroundColor: 'background.default',
        py: 6,
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="lg">
        <Grid2 container spacing={22} >
          <Grid2>
            <Typography variant="h6" gutterBottom color='primary'>
              Sock Haven
            </Typography>
            <Typography variant="body2" color='primary'>
              Premium socks for every occasion. Comfort meets style.
            </Typography>
          </Grid2>

          <Grid2>
            <Typography variant="subtitle1" gutterBottom color='primary'>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/" color='primary' underline="hover">Home</Link>
              <Link href="/products" color='primary' underline="hover">Products</Link>
              <Link href="/cart" color='primary' underline="hover">Cart</Link>
            </Box>
          </Grid2>

          <Grid2>
            <Typography variant="subtitle1" gutterBottom color='primary'>
              Connect With Us
            </Typography>
            <Typography variant="body2" color='primary'>
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
          </Grid2>
        </Grid2>

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