import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  Card,
  CardContent
} from '@mui/material';
import { PersonAdd as RegisterIcon } from '@mui/icons-material';
import { useUser } from '../contexts/UserContext';

const RegisterPage: React.FC = () => {
  const { register } = useUser();

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          marginTop: 10, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
        }}
      >
        <Card sx={{ width: '100%', p: 4, textAlign: 'center', borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography component="h1" variant="h4" color='primary' fontWeight="bold" gutterBottom>
              Create an Account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2, mb: 4 }}>
              Join Sock Haven to start shopping. All registration and authentication is managed securely with Auth0.
            </Typography>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<RegisterIcon />}
              onClick={() => register()}
              sx={{ py: 1.8, fontSize: '1.1rem' }}
            >
              Sign Up with Auth0
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default RegisterPage;