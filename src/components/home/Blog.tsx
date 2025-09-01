import { 
  KeyboardArrowLeft, 
  KeyboardArrowRight,
  CalendarToday,
  Person,
  AccessTime
} from '@mui/icons-material'
import { 
  Box, 
  Button, 
  MobileStepper, 
  Paper, 
  Typography, 
  useTheme,
  alpha,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Grid
} from '@mui/material'
import { useEffect, useState } from 'react'

interface Blog {
  title: string;
  content: string;
  author: string;
  image: string;
  link: string;
  date: string;
  readTime: string;
  category: string;
}

const BlogCarousel = () => {
  const theme = useTheme();
  
  const blogs: Blog[] = [
    {
      title: "The Transformative Power of Daily Yoga Practice",
      content: "Discover how incorporating just 15 minutes of yoga into your daily routine can significantly improve your mental clarity, physical health, and overall wellbeing...",
      author: "Priya Sharma",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      link: "/blog/transformative-power-yoga",
      date: "August 15, 2024",
      readTime: "5 min read",
      category: "Wellness"
    },
    {
      title: "7 Yoga Poses for Stress Relief and Mental Clarity",
      content: "In today's fast-paced world, these carefully selected yoga poses can help you find calm and center yourself amidst the chaos...",
      author: "Rohit Kumar",
      image: "https://images.unsplash.com/photo-1545389336-8c6dfde0de2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      link: "/blog/yoga-poses-stress-relief",
      date: "August 12, 2024",
      readTime: "7 min read",
      category: "Practice"
    },
    {
      title: "Mindfulness and Meditation: Integrating Ancient Wisdom into Modern Life",
      content: "Learn how to blend traditional meditation techniques with contemporary mindfulness practices for a balanced approach to mental health...",
      author: "Dr. Anika Patel",
      image: "https://images.unsplash.com/photo-1548600932-4ec9173ae1f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      link: "/blog/mindfulness-meditation",
      date: "August 8, 2024",
      readTime: "10 min read",
      category: "Meditation"
    },
    {
      title: "The Science Behind Yoga: How It Changes Your Brain and Body",
      content: "Explore the fascinating research that reveals the physiological and neurological benefits of consistent yoga practice...",
      author: "Dr. Vikram Singh",
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      link: "/blog/science-behind-yoga",
      date: "August 5, 2024",
      readTime: "8 min read",
      category: "Science"
    }
  ];
  
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = blogs.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
    }, 5000); // 5 seconds
    return () => clearInterval(timer);
  }, [maxSteps]);

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevStep) =>
      prevStep === 0 ? maxSteps - 1 : prevStep - 1
    );
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 6, mb: 8 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 800, 
            color: 'primary.main',
            mb: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            textFillColor: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Yoga Wisdom Blog
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary', 
            maxWidth: '600px', 
            mx: 'auto',
            mb: 3
          }}
        >
          Discover insights, tips, and inspiration from our expert teachers and community
        </Typography>
        <Box 
          sx={{ 
            width: '80px', 
            height: '4px', 
            backgroundColor: 'secondary.main', 
            mx: 'auto',
            borderRadius: 2
          }} 
        />
      </Box>

      {/* Main Carousel */}
      <Paper
        elevation={0}
        sx={{ 
          maxWidth: 1200, 
          margin: "auto", 
          p: { xs: 2, md: 4 }, 
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.7)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center">
          {/* Left Image */}
          <Box
            sx={{
              width: { xs: '100%', md: '45%' },
              height: { xs: 250, md: 350 },
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              mr: { md: 4 },
              mb: { xs: 3, md: 0 }
            }}
          >
            <Box
              component="img"
              src={blogs[activeStep].image}
              alt={blogs[activeStep].title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
            {/* Gradient Overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: `linear-gradient(to top, ${alpha(theme.palette.common.black, 0.7)} 0%, transparent 100%)`
              }}
            />
            {/* Category Chip */}
            <Chip
              label={blogs[activeStep].category}
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                backgroundColor: alpha(theme.palette.secondary.main, 0.9),
                color: 'white',
                fontWeight: 600
              }}
            />
          </Box>

          {/* Right Content */}
          <Box flex={1} sx={{ position: 'relative' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: 'text.primary',
                lineHeight: 1.2
              }}
            >
              {blogs[activeStep].title}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                color: 'text.secondary',
                lineHeight: 1.6
              }}
            >
              {blogs[activeStep].content}
            </Typography>
            
            {/* Meta Information */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  {blogs[activeStep].author}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  {blogs[activeStep].date}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">
                  {blogs[activeStep].readTime}
                </Typography>
              </Box>
            </Box>
            
            <Button
              variant="contained"
              color="secondary"
              size="large"
              href={blogs[activeStep].link}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`
              }}
            >
              Read Full Article
            </Button>
          </Box>
        </Box>

        {/* Enhanced Stepper */}
        <Box sx={{ mt: 4 }}>
          <MobileStepper
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            nextButton={
              <IconButton 
                onClick={handleNext} 
                size="large"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white'
                  }
                }}
              >
                <KeyboardArrowRight />
              </IconButton>
            }
            backButton={
              <IconButton 
                onClick={handleBack} 
                size="large"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white'
                  }
                }}
              >
                <KeyboardArrowLeft />
              </IconButton>
            }
            sx={{
              background: 'transparent',
              '& .MuiMobileStepper-dots': {
                gap: 1
              },
              '& .MuiMobileStepper-dot': {
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
                width: 10,
                height: 10,
                '&.Mui-active': {
                  backgroundColor: theme.palette.primary.main,
                  width: 20,
                  borderRadius: 5
                }
              }
            }}
          />
        </Box>
      </Paper>

      {/* Blog Preview Grid */}
      <Typography variant="h5" sx={{ fontWeight: 600, mt: 8, mb: 3, textAlign: 'center' }}>
        More Articles You Might Like
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {blogs.slice(0, 3).map((blog, index) => (
          <Grid size={{xs:12, md:4}} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={blog.image}
                alt={blog.title}
                sx={{ 
                  borderTopLeftRadius: 12, 
                  borderTopRightRadius: 12 
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Chip 
                  label={blog.category} 
                  size="small" 
                  color="secondary" 
                  sx={{ mb: 2 }} 
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1,
                    height: 64,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {blog.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    height: 40,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {blog.content}
                </Typography>
                <Button 
                  variant="text" 
                  color="primary" 
                  size="small"
                  href={blog.link}
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default BlogCarousel