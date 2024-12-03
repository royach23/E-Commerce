import { 
  Container, 
  Typography, 
  Grid2, 
  Button, 
  Box,
  CircularProgress
} from '@mui/material';
import ProductCard from '../components/products/ProductCard';
import SockHavenLogo from '../assets/logoNoBg.png';
import { useProducts } from '../contexts/ProductContext';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { products, loading, error } = useProducts();
  const navigate = useNavigate();

  const featuredSocks = products.slice(0, 3);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        mb: 3, 
        textAlign: 'center',
        py: 2,
        color: 'primary',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      >
        <Box display={'flex'} gap={5} alignItems={'center'}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            color='primary'
            sx={{ fontWeight: 'bold', mt: 2 }}
          >
            Sock Haven
          </Typography>
          <img width={160} height={160} src={SockHavenLogo} style={{ borderRadius: '50%'}}/>
        </Box>
        <Typography 
          variant="h5" 
          color='primary'
        >
          Comfort and Style for Your Feet
        </Typography>
      </Box>

      <Grid2 container spacing={3} justifyContent="center">
        {featuredSocks.map((sock) => (
          <Grid2 key={sock.productId}>
            <ProductCard
              product={sock}
            />
          </Grid2>
        ))}
      </Grid2>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 4 
      }}>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          sx={{ px: 4, py: 1.5 }}
          onClick={() => navigate('/products')}
        >
          Shop All Socks
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;