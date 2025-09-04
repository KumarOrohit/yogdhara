import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  useTheme,
  alpha,
  Grid,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Spa,
  Email,
  Message,
  PriorityHigh,
  Send,
  SupportAgent
} from '@mui/icons-material';
import HomeApiService from '../home/homeService';

interface SupportFormData {
  email: string;
  query: string;
  priority: 'low' | 'medium' | 'high';
}

interface FormErrors {
  email?: string;
  query?: string;
}

const CustomerSupport = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState<SupportFormData>({
    email: '',
    query: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Query validation
    if (!formData.query) {
      newErrors.query = 'Please describe your issue';
    } else if (formData.query.length < 10) {
      newErrors.query = 'Please provide more details (at least 10 characters)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handlePriorityChange = (priority: 'low' | 'medium' | 'high') => {
    setFormData(prev => ({
      ...prev,
      priority
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Simulate API call - replace with your actual API service
      const response = await HomeApiService.sendCustomerSupportQuery(formData);
      
      if (response.status == 200) {
        setSubmitStatus('success');
        setFormData({ email: '', query: '', priority: 'medium' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting support request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ 
      py: 8, 
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      minHeight: '100vh'
    }}>
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 3,
            background: `linear-gradient(to bottom, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <SupportAgent sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" fontWeight="800" gutterBottom color="primary">
              Customer Support
            </Typography>
            <Typography variant="h6" color="text.secondary">
              We're here to help you with any questions or issues
            </Typography>
          </Box>

          {submitStatus === 'success' && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Your support request has been submitted successfully! We'll get back to you within 24 hours.
            </Alert>
          )}
          
          {submitStatus === 'error' && (
            <Alert severity="error" sx={{ mb: 3 }}>
              There was an error submitting your request. Please try again or email us directly at yogdhara.ananta@gmail.com.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{xs:12}}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter your email address"
                />
              </Grid>
              
              <Grid size={{xs:12}}>
                <TextField
                  fullWidth
                  label="How can we help you?"
                  name="query"
                  multiline
                  rows={6}
                  value={formData.query}
                  onChange={handleInputChange}
                  error={!!errors.query}
                  helperText={errors.query}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignItems: 'flex-start', mt: 1 }}>
                        <Message color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Please describe your issue or question in detail..."
                />
              </Grid>
              
              <Grid size={{xs:12}}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <PriorityHigh color="primary" sx={{ mr: 1 }} />
                  Priority Level
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant={formData.priority === 'low' ? 'contained' : 'outlined'}
                    onClick={() => handlePriorityChange('low')}
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: formData.priority === 'low' ? alpha(theme.palette.success.main, 0.8) : undefined
                    }}
                  >
                    Low Priority
                  </Button>
                  <Button
                    variant={formData.priority === 'medium' ? 'contained' : 'outlined'}
                    onClick={() => handlePriorityChange('medium')}
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: formData.priority === 'medium' ? alpha(theme.palette.warning.main, 0.8) : undefined
                    }}
                  >
                    Medium Priority
                  </Button>
                  <Button
                    variant={formData.priority === 'high' ? 'contained' : 'outlined'}
                    onClick={() => handlePriorityChange('high')}
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: formData.priority === 'high' ? alpha(theme.palette.error.main, 0.8) : undefined
                    }}
                  >
                    High Priority
                  </Button>
                </Box>
              </Grid>
              
              <Grid size={{xs:12}} sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                    }
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Send Support Request'}
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ 
            mt: 6, 
            p: 3, 
            bgcolor: alpha(theme.palette.primary.main, 0.1), 
            borderRadius: 3,
            textAlign: 'center'
          }}>
            <Spa sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Need Immediate Assistance?
            </Typography>
            <Typography variant="body1" paragraph>
              For urgent matters, please email us directly at:
            </Typography>
            <Typography variant="body1" fontWeight="600" color="primary">
              yogdhara.ananta@gmail.com
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              We typically respond within 24 hours.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CustomerSupport;