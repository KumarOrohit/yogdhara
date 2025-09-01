import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Spa,
  CheckCircle,
  AccountBalance,
  Security,
  Gavel,
  ContactSupport
} from '@mui/icons-material';

const TermsOfService = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 4, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)` }}>
      <Container maxWidth="lg">
        <Paper elevation={2} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Spa sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" fontWeight="800" gutterBottom color="primary">
              Terms of Service
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Last Updated: {new Date().toLocaleDateString()}
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" fontWeight="700" gutterBottom color="primary">
              Welcome to Yogdhara
            </Typography>
            <Typography variant="body1" paragraph>
              Thank you for choosing Yogdhara, your platform for connecting with certified yoga instructors and deepening your practice. 
              These Terms of Service govern your use of our platform, so please read them carefully.
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Gavel sx={{ mr: 1, color: 'primary.main' }} />
              1. Account Registration
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="You must be at least 18 years old to create an account"
                  secondary="By creating an account, you confirm that you meet this age requirement"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Provide accurate information"
                  secondary="You agree to provide accurate and complete information during registration"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Account security"
                  secondary="You are responsible for maintaining the confidentiality of your account credentials"
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
              2. Payments and Fees
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Secure payment processing"
                  secondary="All payments are processed through Stripe. We do not store any payment information on our servers."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Platform commission"
                  secondary="Yogdhara deducts a 15% platform fee from each student payment. The remaining 85% is transferred to the instructor."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Refund policy"
                  secondary="Refunds are handled on a case-by-case basis. Please contact support within 7 days of purchase for refund requests."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Teacher promotions"
                  secondary="Instructors may pay additional fees for promotional services on the platform."
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Security sx={{ mr: 1, color: 'primary.main' }} />
              3. User Conduct
            </Typography>
            <Typography variant="body1" paragraph>
              As a user of Yogdhara, you agree to:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText primary="Use the platform only for lawful purposes" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText primary="Respect all instructors and fellow students" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText primary="Not engage in any fraudulent activities" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText primary="Not share your account credentials with others" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText primary="Not upload or share inappropriate content" />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Gavel sx={{ mr: 1, color: 'primary.main' }} />
              4. Intellectual Property
            </Typography>
            <Typography variant="body1" paragraph>
              All content on the Yogdhara platform, including but not limited to logos, text, graphics, images, 
              and software, is the property of Yogdhara or its content suppliers and protected by international 
              copyright laws.
            </Typography>
            <Typography variant="body1" paragraph>
              Instructors retain ownership of their course materials but grant Yogdhara a license to host and 
              distribute their content through our platform.
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ContactSupport sx={{ mr: 1, color: 'primary.main' }} />
              5. Termination
            </Typography>
            <Typography variant="body1" paragraph>
              We reserve the right to terminate or suspend your account at our sole discretion, without notice, 
              for conduct that we believe violates these Terms of Service or is harmful to other users, us, or 
              third parties, or for any other reason.
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Gavel sx={{ mr: 1, color: 'primary.main' }} />
              6. Limitation of Liability
            </Typography>
            <Typography variant="body1" paragraph>
              Yogdhara shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting 
              from your access to or use of or inability to access or use the service.
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 6, p: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body1">
              If you have any questions about these Terms of Service, please contact us at:
            </Typography>
            <Typography variant="body1" fontWeight="600" color="primary">
              yogdhara.ananta@gmail.com
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsOfService;