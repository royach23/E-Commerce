import React, { useState } from 'react';
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
  cardName: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

const Checkout: React.FC = () => {
  const { user, isAuthenticated } = useUser(); 
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CheckoutFormData>({
    cardName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: ''
  });

  const steps = ['Payment Information', 'Review Order'];

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
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2>
                <Typography variant="subtitle1">
                  Customer Information
                </Typography>
                <Typography>
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography>
                  {user?.email}
                </Typography>
                <Typography>
                  {user?.phone_number}
                </Typography>
                <Typography>
                  {user?.address}
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

      {!isAuthenticated ? (
        <Typography 
          variant="body1" 
          align="center" 
          color="error"
          sx={{ mt: 4 }}
        >
          Please sign in to proceed to checkout
        </Typography>
      ) : (
        <>
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
        </>
      )}
    </Container>
  );
};

export default Checkout;