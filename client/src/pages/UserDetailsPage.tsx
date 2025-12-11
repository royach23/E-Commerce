import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Grid2, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { User } from '../types/User';
import { useNavigate } from 'react-router-dom';

const UserDetailsPage: React.FC = () => {
  const { user, updateUser, deleteUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<Partial<User>>({});
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  if (!user) {
    return <Typography
        variant="h5" 
        align="center"
        sx={{ mt: 4 }}
        color='primary'>Please log in to view your details
      </Typography>;
  }

  const validateField = (name: string, value: string | number) => {
    if (typeof value === 'number') {
        return value.toString();
      }
    
    switch (name) {
      case 'email':
        { if (!value) return 'Email is required';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Please enter a valid email address';
            return ''; }

      case 'firstName':
      case 'lastName':
        if (!value) return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        if (value.length < 2) return `${name === 'firstName' ? 'First' : 'Last'} name is too short`;
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        return '';

      case 'phoneNumber':
        { if (!value) return 'Phone number is required';
        const phoneRegex = /^\+?[\d\s()-]{10,15}$/;
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
        return ''; }

      case 'address':
        if (!value) return 'Address is required';
        if (value.trim().length < 5) return 'Please provide a valid address';
        return '';

      case 'password':
        if (value) {
          if (value.length >= 1 && value.length < 8) return 'Password must be at least 8 characters long';
          if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(value)) 
            return 'Password must include uppercase, lowercase, number, and special character';
        }
        return '';

      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUser(prev => ({
      ...prev,
      [name]: value
    }));

    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const validateForm = () => {
    const formErrors: { [key: string]: string } = {};
    
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'phoneNumber', 'address'];
    
    fieldsToValidate.forEach(field => {
      const value = updatedUser[field as keyof User] || user?.[field as keyof User] || '';
      const error = validateField(field, value);
      if (error) formErrors[field] = error;
    });

    if (newPassword) {
      const passwordError = validateField('password', newPassword);
      if (passwordError) formErrors['password'] = passwordError;
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        const userToUpdate: User = {
          ...user,
          ...updatedUser,
          ...(newPassword ? { password: newPassword } : {})
        };

        await updateUser(userToUpdate);
        setIsEditing(false);
        setNewPassword('');
        setSnackbarMessage('User details updated successfully');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      } catch (error) {
        console.error('Error updating user', error);
        setSnackbarMessage('Failed to update user details');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    }
  };

  const handleDelete = async () => {
    try {
      if (user.id) {
        await deleteUser(user.id);
      }
      setSnackbarMessage('Account deleted successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate(`/`)
    } catch (error) {
      console.error('Error deleting user', error);
      setSnackbarMessage('Failed to delete account');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4, p: 2 }}>
      <Card sx={{ backgroundColor: 'primary.light' }}>
        <CardContent>
          {!isEditing ? (
            <>
              <Typography variant="h3" gutterBottom color='primary' textAlign={'center'}>
                Hello {user.firstName}!
              </Typography>
              <Grid2 container spacing={2} display={'flex'} flexDirection={'column'}>
                <Grid2>
                  <Typography fontSize={22} color='primary'><strong>Username:</strong> {user.username}</Typography>
                </Grid2>
                <Grid2>
                  <Typography fontSize={22} color='primary'><strong>First Name:</strong> {user.firstName}</Typography>
                </Grid2>
                <Grid2>
                  <Typography fontSize={22} color='primary'><strong>Last Name:</strong> {user.lastName}</Typography>
                </Grid2>
                <Grid2 >
                  <Typography fontSize={22} color='primary'><strong>Email:</strong> {user.email}</Typography>
                </Grid2>
                <Grid2>
                  <Typography fontSize={22} color='primary'><strong>Phone Number:</strong> {user.phoneNumber}</Typography>
                </Grid2>
                <Grid2>
                  <Typography fontSize={22} color='primary'><strong>Address:</strong> {user.address}</Typography>
                </Grid2>
              </Grid2>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => setIsEditing(true)}
                >
                  Edit Details
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete Account
                </Button>
              </Box>
            </>
          ) : (
            <>
            <Typography variant="h3" gutterBottom color='primary' textAlign={'center'}>
                Edit Your Info
            </Typography>
              <Grid2 container spacing={2} display={'flex'} flexDirection={'column'}>
                <Grid2 container spacing={'6%'}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    defaultValue={user.firstName}
                    onChange={handleInputChange}
                    sx={{width: '47%'}}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    defaultValue={user.lastName}
                    onChange={handleInputChange}
                    sx={{width: '47%'}}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </Grid2>
                <Grid2>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    defaultValue={user.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid2>
                <Grid2>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    defaultValue={user.phoneNumber}
                    onChange={handleInputChange}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                  />
                </Grid2>
                <Grid2>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    defaultValue={user.address}
                    onChange={handleInputChange}
                    error={!!errors.address}
                    helperText={errors.address}
                  />
                </Grid2>
                <Grid2>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    name="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      const passwordError = validateField('password', e.target.value);
                      setErrors(prev => ({
                        ...prev,
                        password: passwordError
                      }));
                    }}
                    placeholder="Leave blank if no change"
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                </Grid2>
                <Grid2 sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </Grid2>
              </Grid2>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'background.default'
          }
        }}
      >
        <DialogTitle fontSize={24} color='primary'>Delete Account</DialogTitle>
        <DialogContent>
          <Typography color='primary'>
            Are you sure you want to delete your account? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsDeleteDialogOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserDetailsPage;