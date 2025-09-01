import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    CircularProgress,
    Paper,
    useTheme,
    alpha,
    Grid
} from '@mui/material';
import {
    CheckCircle,
    Spa,
    AccountBalance,
    Error
} from '@mui/icons-material';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PaymentApiService from './paymentApiService';

const SuccessPaymentPage: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { paymentId } = useParams<{ paymentId: string }>();
    const [searchParams] = useSearchParams();
    const userType = searchParams.get('userType');
    
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log(success);
        const confirmPayment = async () => {
            if (!paymentId) {
                setError('Invalid payment session');
                setLoading(false);
                return;
            }

            try {
                // Call API to confirm payment
                const response = await PaymentApiService.confirmPayment(paymentId);
                
                if (response.status === 200) {
                    setSuccess(true);
                    
                    // Redirect based on user type after a short delay
                    setTimeout(() => {
                        if (userType === 'TEA') {
                            navigate('/dashboard/tea/promotion');
                        } else {
                            navigate('/dashboard/stu/batch');
                        }
                    }, 3000);
                } else {
                    setError('Payment confirmation failed');
                }
            } catch (err) {
                console.error('Payment confirmation error:', err);
                setError('Failed to confirm payment. Please contact support.');
            } finally {
                setLoading(false);
            }
        };

        confirmPayment();
    }, [paymentId, userType, navigate]);

    if (loading) {
        return (
            <Box sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`
            }}>
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                        <CircularProgress size={60} sx={{ mb: 3, color: theme.palette.primary.main }} />
                        <Typography variant="h5" gutterBottom>
                            Verifying Payment...
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Please wait while we confirm your payment details.
                        </Typography>
                    </Paper>
                </Container>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.1)} 100%)`
            }}>
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                        <Error sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                        <Typography variant="h4" gutterBottom color="error.main">
                            Payment Failed
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>
                            {error}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/yoga-hub')}
                            sx={{ mr: 2 }}
                        >
                            Try Again
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/')}
                        >
                            Go Home
                        </Button>
                    </Paper>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
            py: 8
        }}>
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    {/* Header Section */}
                    <Box sx={{ 
                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
                        color: 'white',
                        p: 4,
                        textAlign: 'center'
                    }}>
                        <CheckCircle sx={{ fontSize: 80, mb: 2 }} />
                        <Typography variant="h3" gutterBottom fontWeight="bold">
                            Payment Successful!
                        </Typography>
                        <Typography variant="h6">
                            Thank you for your enrollment
                        </Typography>
                    </Box>

                    {/* Content Section */}
                    <Box sx={{ p: 4 }}>
                        <Grid container spacing={4}>

                            <Grid size={{xs:12, md:6}}>
                                <Box sx={{ 
                                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                                    p: 3,
                                    borderRadius: 2,
                                    height: '100%'
                                }}>
                                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                        What's Next?
                                    </Typography>
                                    
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body1" gutterBottom fontWeight="bold">
                                            📧 Check Your Email
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            We've sent you a confirmation email with all the details about your batch.
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body1" gutterBottom fontWeight="bold">
                                            🗓️ Mark Your Calendar
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            The batch starts on the scheduled date. Make sure to join on time!
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body1" gutterBottom fontWeight="bold">
                                            🧘‍♀️ Prepare for Class
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Have your yoga mat ready and wear comfortable clothing.
                                        </Typography>
                                    </Box>

                                    <Box sx={{ 
                                        backgroundColor: alpha(theme.palette.warning.main, 0.1),
                                        p: 2,
                                        borderRadius: 1,
                                        mt: 3
                                    }}>
                                        <Typography variant="caption" color="text.secondary">
                                            You will be redirected to your dashboard in a few seconds...
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>

                        <Box sx={{ textAlign: 'center', mt: 4 }}>
                            <Button
                                variant="contained"
                                startIcon={<AccountBalance />}
                                onClick={() => {
                                    if (userType === 'TEA') {
                                        navigate('/dashboard/tea/promotion');
                                    } else {
                                        navigate('/dashboard/stu/batches');
                                    }
                                }}
                                sx={{ mr: 2 }}
                            >
                                Go to Dashboard Now
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Spa />}
                                onClick={() => navigate('/yoga-hub')}
                            >
                                Browse More Batches
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default SuccessPaymentPage;