import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Avatar,
  IconButton,
  useTheme,
  alpha,
  Paper,
  TextField,
  InputAdornment,
  Fab,
  Zoom,
  Fade,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import {
  PlayCircle,
  Favorite,
  FavoriteBorder,
  Search,
  FilterList,
  Star,
  People,
  Schedule,
  KeyboardArrowUp,
  Spa,
  EmojiEvents,
  AutoAwesome,
  Description,
  Close
} from '@mui/icons-material';
import PromotionVideo from '../../assets/PromotionVideo.mp4';
import HomeApiService from '../home/homeService';
import VideoModal from './PreviewVideoModal';
import { useLocation } from 'react-router-dom';
import StripePaymentWrapper from '../payment/Payment';

// Define the batch interface based on the provided structure
interface Batch {
  id: number;
  name: string;
  thumbnail: string | null;
  preview_video: string | null,
  description: string;
  rating: number;
  students: number;
  duration: string;
  level: string;
  price: number;
  learning: string[]; // Always an array of strings
  schedule: string;
  isNew: boolean;
  isPopular: boolean;
  instructor: {
    name: string;
    profile: string | null;
  };
}

const YogaHub = () => {
  const theme = useTheme();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [batches, setBatches] = useState<Batch[]>([] as Batch[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedBatchForPreview, setSelectedBatchForPreview] = useState<Batch | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const location = useLocation();
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);

  const handleReadMoreClick = (batch: Batch) => {
    setSelectedBatch(batch);
    setDescriptionDialogOpen(true);
  };

  const handleCloseDescriptionDialog = () => {
    setDescriptionDialogOpen(false);
    setSelectedBatch(null);
  };

  const handleEnrollClick = (batch: Batch | null) => {
    setSelectedBatch(batch);
    setShowPaymentModal(true);
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
  };

  const handlePreviewClick = (batch: Batch) => {
    setSelectedBatchForPreview(batch);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBatchForPreview(null);
  };

  const getFeaturedBatches = async () => {
    const batchesData = await HomeApiService.getBatchList();
    setBatches(batchesData.batches);
  }

  useEffect(() => {
    getFeaturedBatches();
    // Play video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
    const queryParams = new URLSearchParams(location.search);
    const selectedCat = queryParams.get("selectedCat");
    if (selectedCat) {
      setActiveCategory(selectedCat);
    }
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  // Generate categories from all batch learnings (unique)
  const allLearnings = batches.flatMap(batch => batch.learning || []);
  const uniqueLearnings = [...new Set(allLearnings)].filter(learning => learning.trim() !== '');

  const learningCategories = uniqueLearnings.map(learning => ({
    id: learning.toLowerCase().replace(/\s+/g, '-'),
    name: learning,
    icon: <Spa />
  }));

  // Base categories + learning categories
  const categories = [
    { id: 'all', name: 'All Styles', icon: <Spa /> },
    ...learningCategories
  ];

  const filteredBatches = activeCategory === 'all'
    ? batches
    : batches.filter(batch =>
      (batch.learning || []).some(learning =>
        learning.toLowerCase().replace(/\s+/g, '-') === activeCategory
      )
    );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      {/* Hero Section with Video Background */}
      <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        {/* Video Background */}
        <video
          ref={videoRef}
          src={PromotionVideo}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.4)'
          }}
        />

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, ${alpha(theme.palette.primary.dark, 0.7)} 0%, ${alpha(theme.palette.secondary.dark, 0.7)} 100%)`
          }}
        />

        {/* Hero Content */}
        <Container sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Fade in={true} timeout={2000}>
            <Box sx={{ textAlign: 'center', color: 'white', maxWidth: '800px', mx: 'auto' }}>
              <Chip
                icon={<AutoAwesome />}
                label="Transform Your Practice"
                sx={{
                  backgroundColor: alpha(theme.palette.secondary.main, 0.9),
                  color: 'white',
                  mb: 3,
                  px: 1,
                  py: 2
                }}
              />

              <Typography variant="h1" fontWeight="800" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '4rem' } }}>
                Discover Your
                <Box component="span" sx={{
                  background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.light})`,
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'block'
                }}>
                  Yoga Journey
                </Box>
              </Typography>

              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}>
                Join thousands of practitioners transforming their lives through our expert-led yoga batches.
                Find your perfect practice with world-class instructors.
              </Typography>

            </Box>
          </Fade>
        </Container>

        {/* Scroll Indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            textAlign: 'center',
            animation: 'bounce 2s infinite'
          }}
        >
          <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
            Scroll to explore
          </Typography>
          <Box sx={{ width: 20, height: 30, border: '2px solid white', borderRadius: 10, position: 'relative' }}>
            <Box sx={{
              width: 2,
              height: 6,
              backgroundColor: 'white',
              position: 'absolute',
              top: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              animation: 'scroll 2s infinite'
            }} />
          </Box>
        </Box>
      </Box>

      {/* Stats Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4} sx={{ textAlign: 'center' }}>
          {[
            { number: '100+', label: 'Happy Students', icon: <People /> },
            { number: '50+', label: 'Expert Instructors', icon: <EmojiEvents /> },
            { number: batches.length.toString(), label: 'Yoga Batches', icon: <Spa /> },
            { number: '98%', label: 'Success Rate', icon: <Star /> }
          ].map((stat, index) => (
            <Grid size={{ xs: 6, md: 3, }} key={index}>
              <Box sx={{
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                height: '100%'
              }}>
                <Box sx={{
                  fontSize: 40,
                  color: theme.palette.primary.main,
                  mb: 1
                }}>
                  {stat.icon}
                </Box>
                <Typography variant="h3" fontWeight="800" color="primary.main" gutterBottom>
                  {stat.number}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {stat.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Batches Gallery Section */}
      <Box sx={{ py: 8, backgroundColor: alpha(theme.palette.background.default, 0.5) }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" fontWeight="800" gutterBottom>
              Featured Yoga Batches
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Discover our most popular batches taught by certified yoga instructors with years of experience
            </Typography>
          </Box>

          {/* Category Filters */}
          <Paper sx={{ p: 2, mb: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {categories.map(category => (
                <Chip
                  key={category.id}
                  icon={category.icon}
                  label={category.name}
                  onClick={() => setActiveCategory(category.id)}
                  color={activeCategory === category.id ? 'primary' : 'default'}
                  variant={activeCategory === category.id ? 'filled' : 'outlined'}
                  sx={{
                    px: 2,
                    py: 2,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search batches, instructors, or styles..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <FilterList />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              mb: 4,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                fontSize: '1.1rem',
                padding: '8px 16px'
              }
            }}
          />

          {/* Batches Grid */}
          <Grid container spacing={4}>
            {filteredBatches.map((batch, index) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={batch.id}>
                <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                    }
                  }}>
                    {/* Batch Image */}
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="240"
                        image={batch.thumbnail || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"}
                        alt={batch.name}
                        sx={{ objectFit: 'cover' }}
                      />

                      {/* Overlay Gradient */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)'
                        }}
                      />

                      {/* Top Badges */}
                      <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 1 }}>
                        {batch.isNew && (
                          <Chip
                            label="New"
                            size="small"
                            color="primary"
                            sx={{
                              backgroundColor: theme.palette.primary.main,
                              color: 'white'
                            }}
                          />
                        )}
                        {batch.isPopular && (
                          <Chip
                            icon={<Star />}
                            label="Featured"
                            size="small"
                            color="secondary"
                            sx={{
                              backgroundColor: theme.palette.secondary.main,
                              color: 'white'
                            }}
                          />
                        )}
                      </Box>

                      {/* Favorite Button */}
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          backgroundColor: alpha(theme.palette.background.paper, 0.9),
                          '&:hover': {
                            backgroundColor: theme.palette.background.paper
                          }
                        }}
                        onClick={() => toggleFavorite(batch.id)}
                      >
                        {favorites.includes(batch.id) ? (
                          <Favorite color="error" />
                        ) : (
                          <FavoriteBorder />
                        )}
                      </IconButton>

                      {/* Level Badge */}
                      <Chip
                        label={batch.level}
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          left: 16,
                          backgroundColor: alpha(theme.palette.primary.main, 0.9),
                          color: 'white',
                          fontWeight: '600'
                        }}
                      />
                    </Box>

                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Batch Name and Instructor */}
                      <Typography
                        variant="h5"
                        fontWeight="700"
                        gutterBottom
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '64px'
                        }}
                      >
                        {batch.name}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={batch.instructor.profile || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"}
                          sx={{ width: 32, height: 32, mr: 1.5 }}
                        />
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          By {batch.instructor.name}
                        </Typography>
                      </Box>

                      {/* Description with expandable functionality */}
                      <Box sx={{ mb: 2, flexGrow: 1 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            minHeight: '60px'
                          }}
                        >
                          {batch.description}
                        </Typography>
                        {batch.description && batch.description.length > 150 && (
                          <Button
                            size="small"
                            sx={{ mt: 0.5, fontSize: '0.75rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReadMoreClick(batch);
                            }}
                          >
                            Read more
                          </Button>
                        )}
                      </Box>

                      {/* Schedule and Duration */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Schedule sx={{ fontSize: 18, mr: 1, color: 'text.secondary', flexShrink: 0 }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {batch.schedule} • {batch.duration}
                        </Typography>
                      </Box>

                      {/* Rating and Students */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Star color="warning" sx={{ fontSize: 18, mr: 0.5, flexShrink: 0 }} />
                          <Typography variant="body2" fontWeight="600">
                            {batch.rating}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                            ({batch.students || 58})
                          </Typography>
                        </Box>

                        <Typography variant="h5" color="primary.main" fontWeight="800">
                          ₹{batch.price}
                        </Typography>
                      </Box>

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          size="large"
                          sx={{
                            borderRadius: 2,
                            py: 1.2
                          }}
                          onClick={() => handleEnrollClick(batch)}
                        >
                          Enroll Now
                        </Button>

                        {/* Preview Video Section */}
                        {batch.preview_video && (
                          <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            sx={{
                              minWidth: 'auto',
                              borderRadius: 2,
                              px: 2,
                              flexShrink: 0
                            }}
                            onClick={() => handlePreviewClick(batch)}
                          >
                            <PlayCircle />
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>

          {/* Video Modal */}
          {selectedBatchForPreview && (
            <VideoModal
              videoUrl={selectedBatchForPreview.preview_video || ""}
              open={isModalOpen}
              onClose={handleCloseModal}
            />
          )}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{
        py: 12,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        color: 'white',
        textAlign: 'center'
      }}>
        <Container>
          <Typography variant="h2" fontWeight="800" gutterBottom>
            Ready to Begin Your Journey?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Join thousands of students who have transformed their lives through our yoga batches.
            Your path to wellness starts here.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<Spa />}
            sx={{
              px: 6,
              py: 1.8,
              fontSize: '1.2rem',
              borderRadius: 2
            }}
          >
            Start Your Journey today
          </Button>
        </Container>
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="scroll-to-top"
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.dark
          }
        }}
      >
        <KeyboardArrowUp />
      </Fab>

      {/* Add keyframes for animations */}
      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
            40% {transform: translateY(-10px);}
            60% {transform: translateY(-5px);}
          }
          
          @keyframes scroll {
            0% {opacity: 1; top: 8px;}
            100% {opacity: 0; top: 18px;}
          }
        `}
      </style>

      {selectedBatch && (
        <StripePaymentWrapper
          batch={selectedBatch}
          onCancel={handlePaymentCancel}
          open={showPaymentModal}
        />
      )}


      {descriptionDialogOpen && (
        <Dialog
          open={descriptionDialogOpen}
          onClose={handleCloseDescriptionDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: `linear-gradient(, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
            }
          }}
        >
          <DialogTitle sx={{
            m: 0,
            p: 3,
            display: 'flex',
            alignItems: 'center',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white'
          }}>
            <Description sx={{ mr: 2 }} />
            Batch Description
            <IconButton
              aria-label="close"
              onClick={handleCloseDescriptionDialog}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: 'white',
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers sx={{ p: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" fontWeight="700" gutterBottom color="primary">
                {selectedBatch?.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={selectedBatch?.instructor.profile || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">
                    {selectedBatch?.instructor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Yoga Instructor
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{
              p: 3,
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
                <Description color="primary" sx={{ mr: 1 }} />
                About This Batch
              </Typography>

              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                {selectedBatch?.description}
              </Typography>

              {selectedBatch?.description && (
                <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: '1.1rem' }}>
                  {selectedBatch.description}
                </Typography>
              )}
            </Box>


          </DialogContent>

          <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                handleCloseDescriptionDialog();
                handleEnrollClick(selectedBatch);
              }}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
              }}
            >
              Enroll Now
            </Button>
          </DialogActions>
        </Dialog>
      )}

    </Box>
  );
};

export default YogaHub;