import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Stepper,
    Step,
    StepLabel,
    Grid,
    Card,
    CardContent,
    Avatar,
    Divider,
    useTheme,
    alpha,
    CircularProgress,
    Alert,
    Dialog
} from '@mui/material';
import {
    CheckCircle,
    AccountBalance,
    Spa,
    Lock
} from '@mui/icons-material';
import HomeApiService from '../home/homeService';
import { useAuth } from '../../context/authContext';
import LoginModal from '../../components/home/LoginModal';
import PaymentApiService from './paymentApiService';

const steps = ['Batch Details', 'Payment'];

interface Batch {
    id: number;
    name: string;
    price: number;
    duration: string;
    level: string;
    schedule: string;
    students: number;
    instructor: {
        name: string;
        profile: string | null;
    };
    description: string;
}

interface StripePaymentWrapperProps {
    batch: Batch;
    onCancel: () => void;
    open: boolean;
}

const BatchEnrollmentPayment: React.FC<StripePaymentWrapperProps> = ({
    batch,
    onCancel,
    open
}) => {
    const theme = useTheme();
    const { isAuthenticated } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        // Reset steps when modal opens/closes
        if (open) {
            setActiveStep(0);
            setPaymentError('');
        }
    }, [open]);

    const handleNext = () => {
        if (activeStep === 0) {
            // Check if user is authenticated before proceeding to payment
            if (!isAuthenticated) {
                setShowLoginModal(true);
                return;
            }
            setActiveStep(1);
        } else if (activeStep === 1) {
            handlePayment();
        }
    };

    const handleBack = () => {
        if (activeStep === 0) {
            onCancel();
        } else {
            setActiveStep(activeStep - 1);
        }
    };

    const handlePayment = async () => {
        setLoading(true);
        setPaymentError('');

        try {
            // Create Stripe Checkout Session
            const response = await PaymentApiService.createCheckoutSession(
                batch.id, batch.price
            );

            console.log(response);

            if (response.status === 200 && response.session_url) {
                // Redirect to Stripe Checkout
                window.location.href = response.session_url;
            } else {
                setPaymentError('Failed to create payment session. Please try again.');
            }
        } catch (error) {
            console.error('Payment error:', error);
            setPaymentError('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSuccess = () => {
        setShowLoginModal(false);
        // After successful login, proceed to payment step
        setActiveStep(1);
    };

    const handleGetOtp = async (email: string) => {
        // Default to student login for batch enrollment
        const response = await HomeApiService.getOtpService(email, 'STU');
        return response.status === 200;
    };

    const handleVerifyOtp = async (email: string, otp: string) => {
        const response = await HomeApiService.verifyOtpService(email, otp);
        if (response.status === 200) {
            localStorage.setItem("auth_token", response.access_token);
            localStorage.setItem("refresh_token", response.refresh_token);
            window.dispatchEvent(new Event('localStorageAccesChange'));
            handleLoginSuccess();
        }
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <BatchDetailsStep batch={batch} />;
            case 1:
                return <PaymentStep batch={batch} loading={loading} />;
            case 2:
                return <ConfirmationStep batch={batch} />;
            default:
                return null;
        }
    };

    if (!open) return null;

    return (
        <>
            <Dialog open={open} onClose={onCancel} maxWidth="md" fullWidth>
                <Container maxWidth="md" sx={{ p: 0 }}>
                    <Paper elevation={3} sx={{ borderRadius: 3 }}>
                        {/* Stepper */}
                        <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>

                        {/* Step Content */}
                        <Box sx={{ p: 4 }}>
                            {renderStepContent(activeStep)}

                            {/* Error Message */}
                            {paymentError && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {paymentError}
                                </Alert>
                            )}

                            {/* Navigation Buttons */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                <Button
                                    onClick={handleBack}
                                    disabled={loading}
                                >
                                    {activeStep === 0 ? 'Cancel' : 'Back'}
                                </Button>

                                {activeStep < 2 && (
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={16} /> : null}
                                    >
                                        {activeStep === 0 ? 'Continue to Payment' : 'Pay Now'}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Dialog>

            {/* Login Modal */}
            <LoginModal
                open={showLoginModal}
                handleClose={() => setShowLoginModal(false)}
                handleGetOtp={handleGetOtp}
                handleVerifyOtp={handleVerifyOtp}
                loginType="STU"
            />
        </>
    );
};

interface BatchDetailsStepProps {
    batch: Batch;
}

const BatchDetailsStep: React.FC<BatchDetailsStepProps> = ({ batch }) => {
    const theme = useTheme();

    return (
        <Box>
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                Batch Details
            </Typography>

            <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            src={batch.instructor.profile || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"}
                            sx={{ width: 60, height: 60, mr: 2 }}
                        />
                        <Box>
                            <Typography variant="h6">{batch.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                by {batch.instructor.name}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                                Duration
                            </Typography>
                            <Typography variant="body1">{batch.duration}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                                Level
                            </Typography>
                            <Typography variant="body1">{batch.level}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                                Schedule
                            </Typography>
                            <Typography variant="body1">{batch.schedule}</Typography>
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                                Students Enrolled
                            </Typography>
                            <Typography variant="body1">{batch.students}</Typography>
                        </Grid>
                    </Grid>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        {batch.description}
                    </Typography>
                </CardContent>
            </Card>

            <Box sx={{
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                p: 3,
                borderRadius: 2,
                textAlign: 'center'
            }}>
                <Typography variant="h4" color="primary.main" gutterBottom>
                    ₹{batch.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    One-time payment for full batch access
                </Typography>
            </Box>
        </Box>
    );
};

interface PaymentStepProps {
    batch: Batch;
    loading: boolean;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ batch, loading }) => {
    const theme = useTheme();
    console.log(loading);

    return (
        <Box>
            <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                Secure Payment
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Box sx={{
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    p: 3,
                    borderRadius: 2,
                    mb: 3,
                    textAlign: 'center'
                }}>
                    <Lock sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                        Secure Payment Processing
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Your payment will be processed securely through Stripe
                    </Typography>
                </Box>

                <Box sx={{
                    p: 3,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    textAlign: 'center'
                }}>
                    <Typography variant="h5" color="primary.main" gutterBottom>
                        Total Amount: ₹{batch.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        You will be redirected to Stripe's secure checkout page
                    </Typography>
                </Box>
            </Box>

            <Box sx={{
                backgroundColor: alpha(theme.palette.success.main, 0.05),
                p: 2,
                borderRadius: 2
            }}>
                <Typography variant="body2" gutterBottom>
                    <CheckCircle sx={{ fontSize: 16, color: 'success.main', mr: 1, verticalAlign: 'middle' }} />
                    Secure payment processed by Stripe
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Your payment information is encrypted and secure. We don't store your card details.
                </Typography>
            </Box>
        </Box>
    );
};

interface ConfirmationStepProps {
    batch: Batch;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ batch }) => {
    return (
        <Box sx={{ textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
                Enrollment Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                You have successfully enrolled in <strong>{batch.name}</strong>
            </Typography>

            <Box sx={{
                backgroundColor: 'success.light',
                color: 'success.contrastText',
                p: 3,
                borderRadius: 2,
                mb: 3
            }}>
                <Typography variant="h6" gutterBottom>
                    Welcome to the batch!
                </Typography>
                <Typography variant="body2">
                    Check your email for enrollment details and access instructions.
                    Your batch will begin as scheduled.
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button variant="outlined" startIcon={<Spa />}>
                    View Batch Details
                </Button>
                <Button variant="contained" startIcon={<AccountBalance />}>
                    Go to Dashboard
                </Button>
            </Box>
        </Box>
    );
};

// Main wrapper component
const StripePaymentWrapper: React.FC<StripePaymentWrapperProps> = (props) => {
    return <BatchEnrollmentPayment {...props} />;
};

export default StripePaymentWrapper;