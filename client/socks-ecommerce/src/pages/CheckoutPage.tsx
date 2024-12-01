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
  StepLabel,
  Snackbar,
  Alert
} from '@mui/material';
import { useUser } from '../contexts/UserContext';
import { useTransaction } from '../hooks/UseTransaction';
import { useNavigate } from 'react-router-dom';

interface CheckoutFormData {
  cardName: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

interface FormErrors {
  cardName: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

const Checkout: React.FC = () => {
  const { user, isAuthenticated } = useUser(); 
  const { createTransaction } = useTransaction();
  const [activeStep, setActiveStep] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CheckoutFormData>({
    cardName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: ''
  });

  const [errors, setErrors] = useState<FormErrors>({
    cardName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: ''
  });

  const steps = ['Payment Information', 'Review Order'];

  const validateCardName = (name: string) => {
    if (!name.trim()) return 'Cardholder name is required';
    if (name.trim().length < 3) return 'Name must be at least 3 characters';
    return '';
  };

  const validateCardNumber = (number: string) => {
    const cleanedNumber = number.replace(/\s+/g, '');
    if (!cleanedNumber) return 'Card number is required';
    if (!/^\d{16}$/.test(cleanedNumber)) return 'Card number must be 16 digits';
    return '';
  };

  const validateCVV = (cvv: string) => {
    if (!cvv.trim()) return 'CVV is required';
    if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3 or 4 digits';
    return '';
  };

  const validateExpirationMonth = (month: string) => {
    if (!month) return 'Expiration month is required';
    return '';
  };

  const validateExpirationYear = (year: string) => {
    if (!year) return 'Expiration year is required';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    switch (name) {
      case 'cardName':
        setErrors(prev => ({ ...prev, cardName: validateCardName(value) }));
        break;
      case 'cardNumber':
        setErrors(prev => ({ ...prev, cardNumber: validateCardNumber(value) }));
        break;
      case 'cvv':
        setErrors(prev => ({ ...prev, cvv: validateCVV(value) }));
        break;
      case 'expMonth':
        setErrors(prev => ({ ...prev, expMonth: validateExpirationMonth(value) }));
        break;
      case 'expYear':
        setErrors(prev => ({ ...prev, expYear: validateExpirationYear(value) }));
        break;
    }
  };

  const validateForm = () => {
    const formErrors = {
      cardName: validateCardName(formData.cardName),
      cardNumber: validateCardNumber(formData.cardNumber),
      expMonth: validateExpirationMonth(formData.expMonth),
      expYear: validateExpirationYear(formData.expYear),
      cvv: validateCVV(formData.cvv)
    };

    setErrors(formErrors);

    return !Object.values(formErrors).some(error => error !== '');
  };

  const handleNext = () => {
    if (validateForm()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const transaction = await createTransaction();
        
        if (transaction) {
          navigate('/order-completion', {
            state: {
              orderDetails: {
                orderId: transaction.transactionId,
                total: transaction.cart?.total,
                estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
              }
            }
          });
        } else {
          setSnackbarMessage('Failed to place order. Please try again.');
          setOpenSnackbar(true);
        }
      } catch (error) {
        setSnackbarMessage('An error occurred while placing the order.');
        setOpenSnackbar(true);
        console.error('Order submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid2 sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
          <Grid2 container spacing={5} marginY={1}>
            <Grid2>
              <TextField
                required
                name="cardName"
                label="Name on Card"
                fullWidth
                value={formData.cardName}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.cardName}
                helperText={errors.cardName}
                sx={{ 
                  height: '80px',
                  width: '250px',
                  '& .MuiInputBase-root': { height: '56px' }
                }}
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
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
                sx={{ 
                  height: '80px', 
                  width: '250px',
                  '& .MuiInputBase-root': { height: '56px' }
                }}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={5} marginY={1}>
            <Grid2>
              <FormControl 
                fullWidth 
                variant="outlined" 
                error={!!errors.expMonth}
                sx={{ 
                  height: '80px',
                  width: '180px',
                  '& .MuiInputBase-root': { height: '56px' }
                }}
              >
                <InputLabel>Month</InputLabel>
                <Select
                  name="expMonth"
                  value={formData.expMonth}
                  onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                  label="Month"
                >
                  {[...Array(12)].map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
                {errors.expMonth && (
                  <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                    {errors.expMonth}
                  </Typography>
                )}
              </FormControl>
            </Grid2>
            <Grid2>
              <FormControl 
                fullWidth 
                variant="outlined" 
                error={!!errors.expYear}
                sx={{ 
                  height: '80px', 
                  width: '180px', 
                  '& .MuiInputBase-root': { height: '56px' }
                }}
              >
                <InputLabel>Year</InputLabel>
                <Select
                  name="expYear"
                  value={formData.expYear}
                  onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                  label="Year"
                >
                  {[2024, 2025, 2026, 2027, 2028].map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
                {errors.expYear && (
                  <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                    {errors.expYear}
                  </Typography>
                )}
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
                error={!!errors.cvv}
                helperText={errors.cvv}
                sx={{ 
                  height: '80px', 
                  width: '180px', 
                  '& .MuiInputBase-root': { height: '56px' }
                }}
              />
            </Grid2>
          </Grid2>
          </Grid2>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h5" gutterBottom color='primary' fontWeight={'bold'}>
              Order Summary
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2>
                <Typography variant="h6" color='primary' fontWeight={'bold'}>
                  Customer Information
                </Typography>
                <Typography color='primary'>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography color='primary'>
                  {user?.email}
                </Typography>
                <Typography color='primary'>
                  {user?.phoneNumber}
                </Typography>
                <Typography color='primary'>
                  {user?.address}
                </Typography>
              </Grid2>
              <Grid2>
                <Typography variant="h6" color='primary' fontWeight={'bold'}>
                  Payment Method
                </Typography>
                <Typography color='primary'>
                  {formData.cardName}
                </Typography>
                <Typography color='primary'>
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
        variant="h3" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          mb: 4 
        }}
        color='primary' 
      >
        Checkout
      </Typography>

      {!isAuthenticated ? (
        <Typography 
          variant="h5" 
          align="center" 
          color="error"
          sx={{ mt: 4 }}
        >
          Please sign in to proceed to checkout
        </Typography>
      ) : (
        <>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label} >
                <StepLabel 
                  sx={{
                    color: index === activeStep ? "primary.main" : "text.secondary",
                    "& .MuiStepLabel-label": {
                      color: index === activeStep ? "primary.main" : "text.secondary",
                    },
                  }}
                >
                  {label}
                </StepLabel>
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
              disabled={isSubmitting}
            >
              {activeStep === steps.length - 1 
                ? (isSubmitting ? 'Placing Order...' : 'Place Order') 
                : 'Next'}
            </Button>
          </Box>
        </>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarMessage.includes('successfully') ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Checkout;