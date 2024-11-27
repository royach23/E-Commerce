import React, { useState } from 'react';
import axios from 'axios';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  Button, 
  DialogActions 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials } from '../../types/User';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post<{ access_token: string }>('/login', credentials);
      
      localStorage.setItem('token', response.data.access_token);
      
      onClose();
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sign In</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Username"
          name="username"
          type="username"
          fullWidth
          value={credentials.username}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Password"
          name="password"
          type="password"
          fullWidth
          value={credentials.password}
          onChange={handleChange}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleLogin} color="primary">
          Sign In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;