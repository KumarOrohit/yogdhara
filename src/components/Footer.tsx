import {
  Box,
  Typography,
  Link,
  Grid,
  IconButton,
  Divider,
  useTheme,
  alpha,
  Container
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Spa,
  Email,
  Phone,
  LocationOn
} from "@mui/icons-material";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.primary.dark,
        color: "grey.100",
        mt: 8,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
        }
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(${alpha(theme.palette.common.white, 0.05)} 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          opacity: 0.3
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={6} sx={{ py: 8 }}>
          {/* Company Info */}
          <Grid size={{ xs: 12, md: 4 }} >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Spa sx={{ fontSize: 32, color: theme.palette.secondary.main, mr: 1 }} />
              <Typography variant="h4" fontWeight="800" color="white">
                Arogya Ananta
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
              Transforming lives through the ancient wisdom of yoga combined with modern technology.
              Join our community to discover inner peace and physical wellbeing.
            </Typography>

            {/* Newsletter Subscription */}
            {/* <Box>
              <Typography variant="h6" color="white" gutterBottom>
                Stay Updated
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  placeholder="Your email"
                  size="small"
                  sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                      color: 'white',
                      '& fieldset': {
                        borderColor: alpha(theme.palette.common.white, 0.3),
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(theme.palette.common.white, 0.5),
                      },
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  color="secondary"
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  <Send />
                </Button>
              </Box>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Get yoga tips and updates delivered to your inbox
              </Typography>
            </Box> */}
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, md: 2, sm: 6 }}>
            <Typography variant="h6" gutterBottom color="white" sx={{ mb: 3 }}>
              Explore
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Link href="#" underline="none" color="inherit" sx={{ '&:hover': { color: theme.palette.secondary.main } }}>
                Home
              </Link>
              <Link href="#" underline="none" color="inherit" sx={{ '&:hover': { color: theme.palette.secondary.main } }}>
                Yoga Hub
              </Link>
            </Box>
          </Grid>

          {/* Resources */}
          <Grid size={{ xs: 12, md: 2, sm: 6 }} >
            <Typography variant="h6" gutterBottom color="white" sx={{ mb: 3 }}>
              Support
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Link href="/privacy-policy" underline="none" color="inherit" sx={{ '&:hover': { color: theme.palette.secondary.main } }}>
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" underline="none" color="inherit" sx={{ '&:hover': { color: theme.palette.secondary.main } }}>
                Terms of Service
              </Link>
              <Link href="/customer-support" underline="none" color="inherit" sx={{ '&:hover': { color: theme.palette.secondary.main } }}>
                Customer support
              </Link>
              <Link href="/canellation-refund" underline="none" color="inherit" sx={{ '&:hover': { color: theme.palette.secondary.main } }}>
                Cancellation & Refund Policy
              </Link>
              {/* <Link href="#" underline="none" color="inherit" sx={{ '&:hover': { color: theme.palette.secondary.main } }}>
                FAQs
              </Link>
              <Link href="#" underline="none" color="inherit" sx={{ '&:hover': { color: theme.palette.secondary.main } }}>
                Contact Support
              </Link> */}
            </Box>
          </Grid>

          {/* Contact & Social */}
          <Grid size={{ xs: 12, md: 4 }} >
            <Typography variant="h6" gutterBottom color="white" sx={{ mb: 3 }}>
              Connect With Us
            </Typography>

            {/* Contact Information */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                <Typography variant="body2">
                  Rishikesh, Uttarakhand 249201
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                <Typography variant="body2">
                  yogdhara.ananta@gmail.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ color: theme.palette.secondary.main, mr: 1 }} />
                <Typography variant="body2">
                  +91 9140432284
                </Typography>
              </Box>
            </Box>

            {/* Social Media */}
            <Box>
              <Typography variant="body2" gutterBottom color="white">
                Follow our journey
              </Typography>
              <Box>
                <IconButton
                  sx={{
                    color: 'white',
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    mr: 1,
                    '&:hover': { backgroundColor: '#1877F2', color: 'white' }
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  onClick={() => window.open("https://www.instagram.com/yogdhara.ananta?igsh=MTdobXkyczFta2FvaA==", "_blank")}
                  sx={{
                    color: 'white',
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    mr: 1,
                    '&:hover': { backgroundColor: '#E4405F', color: 'white' }
                  }}
                >
                  <Instagram />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ bgcolor: alpha(theme.palette.common.white, 0.2), my: 2 }} />

        {/* Bottom Copyright */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 3,
          gap: 1
        }}>
          <Typography variant="body2" color="grey.400">
            © {new Date().getFullYear()} Arogya Ananta. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="/privacy-policy" underline="none" color="grey.400" variant="body2">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" underline="none" color="grey.400" variant="body2">
              Terms of Service
            </Link>
            <Link href="/customer-support" underline="none" color="grey.400" variant="body2">
              Customer support
            </Link>
            <Link href="/canellation-refund" underline="none" color="grey.400" variant="body2">
              Cancellation & Refund Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}