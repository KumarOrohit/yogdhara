import { Box, Grid, Typography, useTheme, alpha, Paper, Container } from '@mui/material'
import CountUp from 'react-countup'
import {
  Spa,
  Diversity1,
  AccessTime,
  TrendingUp,
  People,
  EmojiEvents
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const stats = [
    {
      number: 25,
      suffix: "+",
      title: "Yoga Styles",
      desc: "From Hatha to Vinyasa, Yin to Ashtanga - diverse practices for every need",
      icon: <Spa sx={{ fontSize: 40 }} />
    },
    {
      number: 20,
      suffix: "+",
      title: "Structured Programs",
      desc: "Carefully designed journeys for beginners to advanced practitioners",
      icon: <EmojiEvents sx={{ fontSize: 40 }} />
    },
    {
      number: 45,
      suffix: "+",
      title: "Minute Classes",
      desc: "Perfect sessions for busy schedules or extended deep practices",
      icon: <AccessTime sx={{ fontSize: 40 }} />
    },
    {
      number: 10,
      suffix: "+",
      title: "Expert Instructors",
      desc: "Certified teachers with years of experience and specialized training",
      icon: <People sx={{ fontSize: 40 }} />
    },
    {
      number: 50,
      suffix: "+",
      title: "Active Members",
      desc: "Join our thriving community of yoga enthusiasts worldwide",
      icon: <Diversity1 sx={{ fontSize: 40 }} />
    },
    {
      number: 98,
      suffix: "%",
      title: "Satisfaction Rate",
      desc: "Our members consistently report life-changing experiences",
      icon: <TrendingUp sx={{ fontSize: 40 }} />
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        color: "white",
        textAlign: "center",
        mb: { xs: 10, md: 15 }
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
          backgroundImage: `radial-gradient(${alpha(theme.palette.common.white, 0.1)} 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          opacity: 0.3
        }}
      />
      
      <Container maxWidth="lg">
        {/* Section Heading */}
        <Box sx={{ position: 'relative', zIndex: 2, mb: { xs: 4, md: 8 } }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              mb: 2,
              fontSize: { xs: '2rem', md: '2.75rem' }
            }}
          >
            Transform Your Practice with Our
            <Box 
              component="span" 
              sx={{ 
                background: `linear-gradient(45deg, ${theme.palette.secondary.light}, ${theme.palette.common.white})`,
                backgroundClip: "text",
                textFillColor: "transparent",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: 'block'
              }}
            >
              Comprehensive Yoga Platform
            </Box>
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 400, 
              maxWidth: '800px', 
              mx: 'auto',
              opacity: 0.9,
              mb: 3
            }}
          >
            Discover why thousands of practitioners choose our platform for their yoga journey. 
            Experience the perfect blend of tradition and innovation.
          </Typography>
          
          {/* Decorative divider */}
          <Box 
            sx={{ 
              width: '80px', 
              height: '4px', 
              background: `linear-gradient(90deg, ${theme.palette.secondary.light}, ${theme.palette.common.white})`,
              mx: 'auto',
              borderRadius: 2
            }} 
          />
        </Box>

        {/* Stats Grid */}
        <Grid 
          container 
          spacing={4} 
          justifyContent="center"
          sx={{ position: 'relative', zIndex: 2 }}
        >
          {stats.map((stat, index) => (
            <Grid 
              key={index} 
              size={{
                xs:12,
                sm:6,
                md:4
              }}
              sx={{ 
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 5
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: alpha(theme.palette.common.white, 0.1),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    background: alpha(theme.palette.common.white, 0.15),
                    boxShadow: `0 12px 40px ${alpha(theme.palette.secondary.main, 0.3)}`
                  }
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${theme.palette.secondary.light}, ${theme.palette.primary.light})`,
                    mx: 'auto',
                    mb: 3,
                    color: theme.palette.common.white
                  }}
                >
                  {stat.icon}
                </Box>

                {/* Number with animation */}
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    background: `linear-gradient(45deg, ${theme.palette.common.white}, ${theme.palette.secondary.light})`,
                    backgroundClip: "text",
                    textFillColor: "transparent",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                    fontSize: { xs: '2.5rem', md: '3rem' }
                  }}
                >
                  <CountUp 
                    end={stat.number} 
                    duration={3} 
                    separator=","
                    decimals={stat.suffix === "%" ? 1 : 0}
                  />
                  {stat.suffix}
                </Typography>

                {/* Title */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    color: theme.palette.common.white
                  }}
                >
                  {stat.title}
                </Typography>

                {/* Description */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    opacity: 0.9,
                    lineHeight: 1.6
                  }}
                >
                  {stat.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Box 
          sx={{ 
            mt: 8, 
            position: 'relative', 
            zIndex: 2,
            background: alpha(theme.palette.common.black, 0.2),
            borderRadius: 4,
            p: 4,
            maxWidth: '800px',
            mx: 'auto',
            border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              mb: 2 
            }}
          >
            Ready to Begin Your Journey?
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              opacity: 0.9
            }}
          >
            Join our community today and experience the transformation that comes with consistent, guided practice.
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <Box
              component="button"
              onClick={() => navigate("/yoga-hub")}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                border: 'none',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                color: 'white',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${alpha(theme.palette.secondary.main, 0.4)}`
                }
              }}
            >
              Explore Classes
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Banner;