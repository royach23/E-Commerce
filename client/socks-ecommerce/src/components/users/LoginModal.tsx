import React, { useState } from 'react';
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
import { useUser } from '../../contexts/UserContext';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

type LoginErrors = Partial<Record<keyof LoginCredentials, string>> & {
  submit?: string
};

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const navigate = useNavigate();
  const { login } = useUser();

  const validateField = (name: keyof LoginCredentials, value: string) => {
    switch (name) {
      case 'username':
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters long';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters long';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));

    const fieldError = validateField(name as keyof LoginCredentials, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const validateForm = () => {
    const newErrors: LoginErrors = {};
    
    (Object.keys(credentials) as Array<keyof LoginCredentials>).forEach(key => {
      const error = validateField(key, credentials[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        await login(credentials);
        onClose();
        navigate('/');
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          submit: 'Invalid credentials. Please try again.'
        }));
        console.error(err);
      }
    }
  };

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}       
      sx={{
        '& .MuiDialog-paper': {
          width: '30vw',
          height: '35vh',
          maxWidth: 'none'
        }
      }}
    >
      <DialogTitle fontSize={30}>Sign In</DialogTitle>
      <DialogContent sx={{pb: '0'}}>
        <TextField
          autoFocus
          margin="dense"
          label="Username"
          name="username"
          type="username"
          fullWidth
          value={credentials.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
          sx={{height: '4.5em'}}
        />
        <TextField
          margin="dense"
          label="Password"
          name="password"
          type="password"
          fullWidth
          value={credentials.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        {errors.submit && <p style={{ color: 'red' }}>{errors.submit}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRegister} color="primary">
          Register
        </Button>
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