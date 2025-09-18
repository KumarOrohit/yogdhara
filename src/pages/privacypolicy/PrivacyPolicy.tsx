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
  PrivacyTip,
  DataUsage,
  Security,
  Cookie
} from '@mui/icons-material';

const PrivacyPolicy = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 4, background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)` }}>
      <Container maxWidth="lg">
        <Paper elevation={2} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Spa sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" fontWeight="800" gutterBottom color="primary">
              Privacy Policy
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Last Updated: {new Date().toLocaleDateString()}
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" fontWeight="700" gutterBottom color="primary">
              Your Privacy Matters
            </Typography>
            <Typography variant="body1" paragraph>
              At Arogya Ananta, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <DataUsage sx={{ mr: 1, color: 'primary.main' }} />
              1. Information We Collect
            </Typography>
            <Typography variant="body1" paragraph fontWeight="600">
              We collect information you provide directly to us:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Account Information"
                  secondary="Name, email address, phone number, and profile details"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Payment Information"
                  secondary="Processed securely through Stripe (we do not store payment details)"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Yoga Practice Information"
                  secondary="Your preferences, goals, and progress tracking"
                />
              </ListItem>
            </List>

            <Typography variant="body1" paragraph fontWeight="600" sx={{ mt: 3 }}>
              We automatically collect certain information:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Usage Data"
                  secondary="How you interact with our platform, classes, and features"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Device Information"
                  secondary="IP address, browser type, device type, and operating system"
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <DataUsage sx={{ mr: 1, color: 'primary.main' }} />
              2. How We Use Your Information
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Provide and maintain our services"
                  secondary="To create and manage your account, process payments, and facilitate classes"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Personalize your experience"
                  secondary="To recommend classes and content based on your preferences and progress"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Communicate with you"
                  secondary="To send important updates, class reminders, and respond to your inquiries"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Improve our platform"
                  secondary="To analyze usage patterns and enhance user experience"
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Security sx={{ mr: 1, color: 'primary.main' }} />
              3. Data Security
            </Typography>
            <Typography variant="body1" paragraph>
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText primary="SSL encryption for all data transmissions" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText primary="Regular security assessments and monitoring" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText primary="Limited access to personal information on a need-to-know basis" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText primary="Secure payment processing through Stripe (we never store payment details)" />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Cookie sx={{ mr: 1, color: 'primary.main' }} />
              4. Cookies and Tracking Technologies
            </Typography>
            <Typography variant="body1" paragraph>
              We use cookies and similar tracking technologies to track activity on our platform and hold certain 
              information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
            </Typography>
            <Typography variant="body1" paragraph>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, 
              if you do not accept cookies, you may not be able to use some portions of our platform.
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <DataUsage sx={{ mr: 1, color: 'primary.main' }} />
              5. Data Sharing and Disclosure
            </Typography>
            <Typography variant="body1" paragraph>
              We do not sell your personal information to third parties. We may share your information with:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Instructors"
                  secondary="Limited information necessary for them to conduct classes you've enrolled in"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Service Providers"
                  secondary="Trusted third parties who assist us in operating our platform (e.g., Stripe for payments)"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Legal Requirements"
                  secondary="When required by law or to protect our rights, safety, or property"
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <PrivacyTip sx={{ mr: 1, color: 'primary.main' }} />
              6. Your Rights
            </Typography>
            <Typography variant="body1" paragraph>
              You have the right to:
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText primary="Access and update your personal information" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText primary="Delete your account and personal data" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText primary="Opt-out of marketing communications" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PrivacyTip color="primary" />
                </ListItemIcon>
                <ListItemText primary="Request a copy of your data" />
              </ListItem>
            </List>
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              To exercise these rights, please contact us at yogdhara.ananta@gmail.com.
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 6, p: 3, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body1">
              If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;