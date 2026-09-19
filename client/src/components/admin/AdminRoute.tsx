import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Paper, 
  Button 
} from '@mui/material';
import { Lock as LockIcon, Home as HomeIcon } from '@mui/icons-material';
import { useUser } from '../../contexts/UserContext';

interface AdminRouteProps {
  children: React.ReactElement;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading, login } = useUser();

  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}
      >
        <CircularProgress size={50} color="primary" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8, p: 2 }}>
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 3, 
            backgroundColor: 'background.paper' 
          }}
        >
          <LockIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
            Authentication Required
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You need to be logged in with an administrator account to access the Admin Dashboard.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => login()}
            >
              Log In
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              startIcon={<HomeIcon />}
              onClick={() => window.location.href = '/'}
            >
              Go to Home
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Box sx={{ maxWidth: 500, mx: 'auto', mt: 8, p: 2 }}>
        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 3, 
            backgroundColor: 'background.paper' 
          }}
        >
          <LockIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" color="error.main" gutterBottom sx={{ fontWeight: 'bold' }}>
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your account does not have the <strong>admin</strong> role assigned. Contact your store owner or configure your role in the Auth0 Dashboard.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<HomeIcon />}
            onClick={() => window.location.href = '/'}
          >
            Return to Home
          </Button>
        </Paper>
      </Box>
    );
  }

  return children;
};

export default AdminRoute;
