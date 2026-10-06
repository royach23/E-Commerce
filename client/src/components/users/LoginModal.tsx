import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button, 
  DialogActions,
  Typography,
  Box
} from '@mui/material';
import { useUser } from '../../contexts/UserContext';
import { Login as LoginIcon, PersonAdd as RegisterIcon } from '@mui/icons-material';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const { login, register } = useUser();

  const handleLogin = async () => {
    onClose();
    await login();
  };

  const handleRegister = async () => {
    onClose();
    await register();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}       
      sx={{
        '& .MuiDialog-paper': {
          width: '35vw',
          maxWidth: '500px',
          padding: 3,
          backgroundColor: 'background.default',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle fontSize={32} color='primary' textAlign='center' fontWeight='bold'>
        Welcome to Sock Haven
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Sign in or create an account using secure authentication with Auth0.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button 
            onClick={handleLogin} 
            variant="contained" 
            color="primary" 
            size='large'
            startIcon={<LoginIcon />}
            fullWidth
            sx={{ py: 1.5, fontSize: '1.1rem' }}
          >
            Log In with Auth0
          </Button>
          <Button 
            onClick={handleRegister} 
            variant="outlined" 
            color="primary" 
            size='large'
            startIcon={<RegisterIcon />}
            fullWidth
            sx={{ py: 1.5, fontSize: '1.1rem' }}
          >
            Create New Account
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', mt: 1 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;