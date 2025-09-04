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
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import {
  Spa,
  AccountBalance,
  HelpOutline,
  ContactSupport,
  Cancel,
  CheckCircle,
  Warning
} from '@mui/icons-material';

const CancellationRefundPolicy = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      py: 4, 
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      minHeight: '100vh'
    }}>
      <Container maxWidth="lg">
        <Paper elevation={2} sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Spa sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" fontWeight="800" gutterBottom color="primary">
              Cancellation & Refund Policy
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Last Updated: {new Date().toLocaleDateString()}
            </Typography>
            <Chip 
              icon={<HelpOutline />} 
              label="Understanding our policy" 
              sx={{ mt: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }} 
            />
          </Box>

          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Typography variant="h5" color="text.secondary" fontStyle="italic" paragraph>
              "At Yogdhara, we strive to create harmonious relationships between teachers and students. 
              Our refund policy is designed to respect the autonomy of our instructors while maintaining 
              transparency with our community."
            </Typography>
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" fontWeight="700" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountBalance sx={{ mr: 2 }} />
              General Policy
            </Typography>
            <Typography variant="body1" paragraph>
              Yogdhara operates as a platform that connects yoga instructors with students. We facilitate 
              transactions but do not interfere with the teacher-student relationship, including matters 
              related to cancellations and refunds.
            </Typography>
            
            <Box sx={{ 
              p: 3, 
              my: 3, 
              bgcolor: alpha(theme.palette.info.main, 0.1), 
              borderRadius: 2,
              borderLeft: `4px solid ${theme.palette.info.main}`
            }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Warning color="info" sx={{ mr: 1 }} />
                Important Note
              </Typography>
              <Typography variant="body1">
                Yogdhara does not process or issue refunds directly. All refund requests must be directed 
                to your instructor, who has sole discretion over refund decisions.
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" fontWeight="700" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
              <Cancel sx={{ mr: 2 }} />
              For Students
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Class Cancellations"
                  secondary="If you need to cancel a class, please contact your instructor directly as soon as possible. Each instructor sets their own cancellation policy."
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Refund Requests"
                  secondary="Refund eligibility is determined solely by your instructor. Please communicate directly with them regarding any refund inquiries."
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Platform Fees"
                  secondary="Yogdhara's 15% platform fee covers transaction processing and platform maintenance costs. This fee is non-refundable in all circumstances."
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Exceptional Circumstances"
                  secondary="In cases of technical issues preventing class access, please contact Yogdhara support within 24 hours of the scheduled class time."
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ 
            p: 3, 
            my: 4, 
            bgcolor: alpha(theme.palette.warning.main, 0.1), 
            borderRadius: 2,
            textAlign: 'center'
          }}>
            <Typography variant="h6" gutterBottom>
              Before Purchasing
            </Typography>
            <Typography variant="body1">
              We encourage students to review each instructor's specific cancellation and refund policies 
              before enrolling in classes or workshops.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" fontWeight="700" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountBalance sx={{ mr: 2 }} />
              For Instructors
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Setting Your Policy"
                  secondary="As an instructor, you have complete autonomy to establish your own cancellation and refund policies for your classes."
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Processing Refunds"
                  secondary="If you choose to issue a refund, you may do so through your instructor dashboard. The refunded amount will be deducted from your future earnings."
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Promotional Fees"
                  secondary="Fees paid for promotional services on Yogdhara are non-refundable, as these services are rendered immediately upon purchase."
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Clear Communication"
                  secondary="We strongly recommend clearly communicating your cancellation and refund policies to students before they enroll in your classes."
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ 
            p: 3, 
            my: 4, 
            bgcolor: alpha(theme.palette.success.main, 0.1), 
            borderRadius: 2,
            textAlign: 'center'
          }}>
            <Typography variant="h6" gutterBottom>
              Building Trust
            </Typography>
            <Typography variant="body1">
              Clear policies and open communication help build trusting relationships between instructors 
              and students, creating a better experience for everyone in our community.
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 5 }}>
            <Typography variant="h5" fontWeight="600" gutterBottom color="primary">
              Frequently Asked Questions
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <HelpOutline color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="What if my instructor is unresponsive to my refund request?"
                  secondary="Please allow 3-5 business days for instructors to respond. If you haven't received a response after this time, contact Yogdhara support and we'll help facilitate communication."
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <HelpOutline color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Can I get a refund if I'm unsatisfied with a class?"
                  secondary="This is at the discretion of your instructor. We encourage you to provide constructive feedback directly to your instructor about your experience."
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <HelpOutline color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="What happens if a class is cancelled by the instructor?"
                  secondary="If an instructor cancels a class, they are responsible for communicating their refund policy to enrolled students. Most instructors offer rescheduling or full refunds in these cases."
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ 
            textAlign: 'center', 
            mt: 6, 
            p: 4, 
            bgcolor: alpha(theme.palette.primary.main, 0.1), 
            borderRadius: 3 
          }}>
            <ContactSupport sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Need Further Assistance?
            </Typography>
            <Typography variant="body1" paragraph>
              If you have questions about our policy or need help communicating with an instructor, 
              our support team is here to help.
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

export default CancellationRefundPolicy;