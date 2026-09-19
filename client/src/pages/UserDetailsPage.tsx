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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  if (!user) {
    return (
      <Typography
        variant="h5" 
        align="center"
        sx={{ mt: 4 }}
        color='primary'
      >
        Please log in to view your details
      </Typography>
    );
  }

  const validateField = (name: string, value: string | number) => {
    if (typeof value === 'number') {
      return value.toString();
    }
    
    switch (name) {
      case 'email': {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())) {
          return 'Please enter a valid email address';
        }
        return '';
      }
      case 'phoneNumber': {
        if (value && !/^[\d\s()+-]{7,25}$/.test(String(value).trim())) {
          return 'Please enter a valid phone number';
        }
        return '';
      }
      // Relaxed validation for first name, last name, and address
      case 'firstName':
      case 'lastName':
      case 'address':
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

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const formErrors: { [key: string]: string } = {};
    const fieldsToValidate = ['email', 'phoneNumber'];
    
    fieldsToValidate.forEach(field => {
      const rawValue = updatedUser[field as keyof User] ?? user?.[field as keyof User] ?? '';
      const value = typeof rawValue === 'string' ? rawValue : String(rawValue);
      const error = validateField(field, value);
      if (error) formErrors[field] = error;
    });


    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        const userToUpdate: User = {
          ...user,
          ...updatedUser,
        };

        await updateUser(userToUpdate);
        setIsEditing(false);
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
      navigate(`/`);
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
                Hello {user.firstName || user.username || 'User'}!
              </Typography>
              <Grid2 container spacing={2} display={'flex'} flexDirection={'column'}>
                <Grid2>
                  <Typography fontSize={22} color='primary'><strong>User ID:</strong> {user.id}</Typography>
                </Grid2>
                <Grid2>
                  <Typography fontSize={22} color='primary'><strong>Username:</strong> {user.username}</Typography>
                </Grid2>
                <Grid2>
                  <Typography fontSize={22} color='primary'><strong>First Name:</strong> {user.firstName || <em>Not set</em>}</Typography>
                </Grid2>
                <Grid2>
                  <Typography fontSize={22} color='primary'><strong>Last Name:</strong> {user.lastName || <em>Not set</em>}</Typography>
                </Grid2>
                <Grid2>
                  <Typography fontSize={22} color='primary'><strong>Email:</strong> {user.email || <em>Not set</em>}</Typography>
                </Grid2>
                <Grid2>
                  <Typography fontSize={22} color='primary'><strong>Phone Number:</strong> {user.phoneNumber || <em>Not set</em>}</Typography>
                </Grid2>
                <Grid2>
                  <Typography fontSize={22} color='primary'><strong>Address:</strong> {user.address || <em>Not set</em>}</Typography>
                </Grid2>
              </Grid2>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => {
                    setUpdatedUser({
                      firstName: user.firstName || '',
                      lastName: user.lastName || '',
                      email: user.email || '',
                      phoneNumber: user.phoneNumber || '',
                      address: user.address || '',
                    });
                    setErrors({});
                    setIsEditing(true);
                  }}
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
                    value={updatedUser.firstName ?? user.firstName ?? ''}
                    onChange={handleInputChange}
                    sx={{width: '47%'}}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={updatedUser.lastName ?? user.lastName ?? ''}
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
                    value={updatedUser.email ?? user.email ?? ''}
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
                    value={updatedUser.phoneNumber ?? user.phoneNumber ?? ''}
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
                    value={updatedUser.address ?? user.address ?? ''}
                    onChange={handleInputChange}
                    error={!!errors.address}
                    helperText={errors.address}
                  />
                </Grid2>
                <Grid2 sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
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