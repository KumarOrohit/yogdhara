import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  useTheme,
  alpha,
  Divider,
  InputAdornment,
  Paper
} from "@mui/material";
import {
  Close,
  Email,
  VpnKey,
  ArrowBack,
  Spa,
  CheckCircle
} from "@mui/icons-material";

interface LoginModalProps {
  open: boolean;
  handleClose: () => void;
  handleGetOtp: (email: string) => Promise<boolean | undefined>;
  handleVerifyOtp: (email: string, otp: string) => void;
  loginType?: "STU" | "TEA" | null;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  open, 
  handleClose, 
  handleGetOtp, 
  handleVerifyOtp,
  loginType 
}) => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleGetOtpCall = async () => {
    if (email) {
      setIsLoading(true);
      const isOtpSent = await handleGetOtp(email);
      setIsLoading(false);
      
      if (isOtpSent) {
        setStep(2);
        setOtpSent(true);
      }
    }
  };

  const handleVerifyOtpCall = async () => {
    if (otp) {
      setIsLoading(true);
      await handleVerifyOtp(email, otp);
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    await handleGetOtp(email);
    setIsLoading(false);
  };

  const handleBackToEmail = () => {
    setStep(1);
    setOtp("");
    setOtpSent(false);
  };

  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 400 },
    bgcolor: "background.paper",
    borderRadius: 3,
    boxShadow: 24,
    overflow: "hidden",
    maxHeight: "90vh",
    overflowY: "auto"
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        {/* Header with Gradient */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: "white",
            p: 3,
            textAlign: "center",
            position: "relative"
          }}
        >
          <IconButton
            sx={{ 
              position: "absolute", 
              top: 10, 
              right: 10,
              color: "white"
            }}
            onClick={handleClose}
          >
            <Close />
          </IconButton>
          
          <Spa sx={{ fontSize: 40, mb: 1 }} />
          
          <Typography variant="h5" fontWeight="700" gutterBottom>
            Welcome to Arogya Ananta
          </Typography>
          
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {loginType === "TEA" 
              ? "Sign in to manage your yoga classes and students" 
              : "Sign in to continue your yoga journey"
            }
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Step Indicator */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: step >= 1 ? theme.palette.primary.main : theme.palette.grey[300],
                  color: step >= 1 ? "white" : theme.palette.text.secondary,
                  fontWeight: "bold"
                }}
              >
                1
              </Box>
              <Box 
                sx={{ 
                  width: 40, 
                  height: 2, 
                  backgroundColor: step >= 2 ? theme.palette.primary.main : theme.palette.grey[300],
                  mx: 1 
                }} 
              />
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: step >= 2 ? theme.palette.primary.main : theme.palette.grey[300],
                  color: step >= 2 ? "white" : theme.palette.text.secondary,
                  fontWeight: "bold"
                }}
              >
                2
              </Box>
            </Box>
          </Box>

          {/* Step 1: Email Input */}
          {step === 1 && (
            <Box>
              <Typography variant="h6" fontWeight="600" gutterBottom textAlign="center">
                Enter Your Email
              </Typography>
              
              <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                We'll send a verification code to your email
              </Typography>

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleGetOtpCall}
                disabled={!email || isLoading}
                sx={{ 
                  mt: 2, 
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }}
              >
                {isLoading ? "Sending..." : "Continue with Email"}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Secure Login
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  Your privacy is important to us. We use secure encryption to protect your data.
                </Typography>
              </Box>
            </Box>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <Box>
              <IconButton 
                onClick={handleBackToEmail}
                sx={{ mb: 1 }}
              >
                <ArrowBack />
              </IconButton>

              <Typography variant="h6" fontWeight="600" gutterBottom textAlign="center">
                Check Your Email
              </Typography>
              
              <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                We've sent a 6-digit code to <strong>{email}</strong>
              </Typography>

              {otpSent && (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    mb: 2, 
                    backgroundColor: alpha(theme.palette.success.main, 0.1),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="success.main">
                    Verification code sent successfully!
                  </Typography>
                </Paper>
              )}

              <TextField
                fullWidth
                label="Enter Verification Code"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
                placeholder="123456"
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleVerifyOtpCall}
                disabled={otp.length !== 6 || isLoading}
                sx={{ 
                  mt: 2, 
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }}
              >
                {isLoading ? "Verifying..." : "Verify & Login"}
              </Button>

              <Button
                fullWidth
                variant="text"
                color="primary"
                onClick={handleResendOtp}
                disabled={isLoading}
                sx={{ mt: 1 }}
              >
                Resend Code
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Didn't receive the code? Check your spam folder or try again.
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box 
          sx={{ 
            p: 2, 
            backgroundColor: alpha(theme.palette.grey[100], 0.5),
            textAlign: 'center'
          }}
        >
          <Typography variant="caption" color="text.secondary">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default LoginModal;