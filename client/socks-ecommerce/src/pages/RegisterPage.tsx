import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/User';
import { useUser } from '../contexts/UserContext';

type ValidationErrors = Partial<Record<keyof User, string>> & { 
  submit?: string 
};

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<User>({
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    address: '',
    phone_number: '',
    email: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();
  const { register } = useUser();

  const validateField = (name: keyof User, value: string | number | undefined) => {
    if (typeof value === 'number') {
      return value.toString();
    }

    switch (name) {
      case 'username':
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters long';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores';
        return '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters long';
        if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(value)) 
          return 'Password must include uppercase, lowercase, number, and special character';
        return '';

      case 'email':
        { if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return ''; }

      case 'first_name':
        if (!value) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters long';
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        return '';

      case 'last_name':
        if (!value) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters long';
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        return '';

      case 'phone_number':
        { if (!value) return 'Phone number is required';
        const phoneRegex = /^\+?[\d\s()-]{10,15}$/;
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
        return ''; }

      case 'address':
        if (!value) return 'Address is required';
        if (value.trim().length < 5) return 'Please provide a valid address';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    const fieldError = validateField(name as keyof User, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    
    (Object.keys(formData) as Array<keyof User>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await register(formData);
        navigate('/');
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          submit: 'Registration failed. Please check your information and try again.'
        }));
        console.error(err);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        sx={{ 
          marginTop: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ mt: 3, width: '100%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            error={!!errors.first_name}
            helperText={errors.first_name}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            error={!!errors.last_name}
            helperText={errors.last_name}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Phone Number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            error={!!errors.phone_number}
            helperText={errors.phone_number}
          />
          {errors.submit && <Typography color="error">{errors.submit}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;