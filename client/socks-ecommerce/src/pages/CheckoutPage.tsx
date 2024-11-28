import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid2, 
  TextField, 
  Button, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useUser } from '../contexts/UserContext';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  cardName: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

const Checkout: React.FC = () => {
  const { user } = useUser(); 
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    cardName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phoneNumber: user.phone_number || '',
        address: user.address || ''
      }));
    }
  }, [user]);

  const steps = ['Shipping Details', 'Payment Information', 'Review Order'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order submitted', formData);
    // Implement order submission logic
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid2 container spacing={3} sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
            <Grid2>
              <TextField
                required
                name="firstName"
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid2>
            <Grid2>
              <TextField
                required
                name="lastName"
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid2>
            <Grid2 >
              <TextField
                required
                name="email"
                label="Email Address"
                fullWidth
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid2>
            {/* <Grid2 container spacing={3} sx={{display: 'flex', justifyContent: 'center', width: '100%'}}> */}
              <Grid2 >
                <TextField
                  required
                  name="phoneNumber"
                  label="Phone Number"
                  fullWidth
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid2>
              <Grid2 >
                <TextField
                  required
                  name="address"
                  label="Address"
                  fullWidth
                  value={formData.address}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid2>
            {/* </Grid2> */}
          </Grid2>
        );
      case 1:
        return (
          <Grid2 container spacing={3}>
            <Grid2 >
              <TextField
                required
                name="cardName"
                label="Name on Card"
                fullWidth
                value={formData.cardName}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid2>
            <Grid2>
              <TextField
                required
                name="cardNumber"
                label="Card Number"
                fullWidth
                type="text"
                value={formData.cardNumber}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid2>
            <Grid2 >
              <FormControl fullWidth variant="outlined">
                <InputLabel>Expiration Month</InputLabel>
                <Select
                  name="expMonth"
                  value={formData.expMonth}
                  onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                  label="Expiration Month"
                >
                  {[...Array(12)].map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 >
              <FormControl fullWidth variant="outlined">
                <InputLabel>Expiration Year</InputLabel>
                <Select
                  name="expYear"
                  value={formData.expYear}
                  onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                  label="Expiration Year"
                >
                  {[2024, 2025, 2026, 2027, 2028].map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
            <Grid2>
              <TextField
                required
                name="cvv"
                label="CVV"
                fullWidth
                type="text"
                value={formData.cvv}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid2>
          </Grid2>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2>
                <Typography variant="subtitle1">
                  Shipping Address
                </Typography>
                <Typography>
                  {formData.firstName} {formData.lastName}
                </Typography>
                <Typography>
                  {formData.phoneNumber}
                </Typography>
                <Typography>
                  {formData.address}
                </Typography>
              </Grid2>
              <Grid2>
                <Typography variant="subtitle1">
                  Payment Method
                </Typography>
                <Typography>
                  {formData.cardName}
                </Typography>
                <Typography>
                  Card ending in {formData.cardNumber.slice(-4)}
                </Typography>
              </Grid2>
            </Grid2>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          mb: 4 
        }}
      >
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, mb: 4 }}>
        {renderStepContent(activeStep)}
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mt: 4 
      }}>
        <Button 
          disabled={activeStep === 0} 
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
        >
          {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
        </Button>
      </Box>
    </Container>
  );
};

export default Checkout;