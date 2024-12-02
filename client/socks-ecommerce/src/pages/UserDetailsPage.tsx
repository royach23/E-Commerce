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
  DialogActions 
} from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { User } from '../types/User';

const UserDetailsPage: React.FC = () => {
  const { user, updateUser, deleteUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<Partial<User>>({});
  const [newPassword, setNewPassword] = useState('');

  if (!user) {
    return <Typography>Please log in to view your details</Typography>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const userToUpdate: User = {
        ...user,
        ...updatedUser,
        ...(newPassword ? { password: newPassword } : {})
      };

      await updateUser(userToUpdate);
      setIsEditing(false);
      setNewPassword('');
    } catch (error) {
      console.error('Error updating user', error);
      // TODO: Add error handling (e.g., show error message to user)
    }
  };

  const handleDelete = async () => {
    if (user.id) {
      await deleteUser(user.id);
    }
    setIsDeleteDialogOpen(false);
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
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  defaultValue={user.lastName}
                  onChange={handleInputChange}
                  sx={{width: '47%'}}
                />
              </Grid2>
              <Grid2>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  defaultValue={user.email}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  defaultValue={user.phoneNumber}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  defaultValue={user.address}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  name="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank if no change"
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
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
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
    </Box>
  );
};

export default UserDetailsPage;