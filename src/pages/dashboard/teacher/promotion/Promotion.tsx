import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useTheme,
  alpha,
  Slide,
  Zoom,
  Fab,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tabs,
  Tab,
  CardMedia,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText as MuiListItemText,
  Fade
} from '@mui/material';
import {
  ArrowUpward,
  Visibility,
  VisibilityOff,
  TrendingUp,
  Info,
  Star,
  Download,
  Instagram,
  CheckCircle,
  Schedule,
  Publish,
  PlayArrow,
  Tag,
  Description,
  People,
  RecordVoiceOver,
  Campaign
} from '@mui/icons-material';
import type { TransitionProps } from '@mui/material/transitions';
import './Promotion.scss';
import TeacherApiService from '../teacherApiService';
import Slider from '@mui/material/Slider';

// Transition for dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Types based on the provided data structure
interface Batch {
  id: string;
  name: string;
  thumbnail: string | null;
  preview_video: string | null;
  description: string;
  rating: number;
  students: number;
  capacity: number;
  duration: string;
  level: string;
  price: number;
  learning: string[];
  schedule: string;
  is_active: boolean;
  isNew: boolean;
  isPopular: boolean;
  instructor: {
    name: string;
    profile: string | null;
  };
  students_data: Array<{
    profile_picture: string | null;
    name: string;
    email: string;
    duration: string;
    join_date: string;
    is_active: boolean;
    classes_attended: number;
  }>;
  attendance_data: Array<{
    student_name: string;
    class: string;
    joined_at: string;
    left_at: string;
    duration: string;
    status: string;
  }>;
}

interface InstagramPromotion {
  id: string;
  batchId?: string;
  contentDescription: string;
  targetAudience: string[];
  ageRange: [number, number];
  brandVoice: string[];
  callToAction: string;
  customContent: string[];
  status: 'processing' | 'ready' | 'promoted';
  createdAt: string;
  instagramHandle?: string;
  generatedContent: {
    videoUrl: string;
    caption: string;
    hashtags: string[];
  };
  promotionType: 'batch' | 'general';
}

const BatchPromotionPage: React.FC = () => {
  const theme = useTheme();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'promoted' | 'notPromoted'>('all');
  const [instagramDialogOpen, setInstagramDialogOpen] = useState(false);
  const [viewPromotionDialogOpen, setViewPromotionDialogOpen] = useState(false);
  const [instagramPromotions, setInstagramPromotions] = useState<InstagramPromotion[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<InstagramPromotion | null>(null);
  const [promotionType, setPromotionType] = useState<'batch' | 'general'>('batch');
  const [processingProgress, setProcessingProgress] = useState(0);

  // Instagram promotion form state
  const [contentDescription, setContentDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 35]);
  const [brandVoice, setBrandVoice] = useState<string[]>([]);
  const [callToAction, setCallToAction] = useState('handle');
  const [customInstagramHandle, setCustomInstagramHandle] = useState('');

  // Filter batches based on current filter
  const filteredBatches = batches.filter(batch => {
    if (filter === 'promoted') return batch.isPopular;
    if (filter === 'notPromoted') return !batch.isPopular;
    return true;
  });

  // Sort batches by ranking (position in the array)
  const sortedBatches = [...filteredBatches];

  const handlePromote = (batch: Batch) => {
    setSelectedBatch(batch);
    setPromoteDialogOpen(true);
  };

  const confirmPromotion = () => {
    if (selectedBatch) {
      // In a real app, this would be an API call
      const updatedBatches = batches.map(batch => {
        if (batch.id === selectedBatch.id) {
          return {
            ...batch,
            isPopular: true,
          };
        }
        return batch;
      });

      setBatches(updatedBatches);
      setPromoteDialogOpen(false);
      setSelectedBatch(null);
    }
  };

  const toggleVisibility = (batchId: string) => {
    // In a real app, this would be an API call
    const updatedBatches = batches.map(batch =>
      batch.id === batchId ? { ...batch, is_active: !batch.is_active } : batch
    );
    setBatches(updatedBatches);
  };

  const showBatchInfo = (batch: Batch) => {
    setSelectedBatch(batch);
    setInfoDialogOpen(true);
  };

  // Extract time from schedule string
  const getTimeFromSchedule = (schedule: string) => {
    const timePart = schedule.split('•')[1] || '';
    return timePart.trim();
  };

  // Get first learning category
  const getFirstCategory = (learning: string[]) => {
    return learning.length > 0 ? learning[0] : "Yoga";
  };

  // Instagram promotion handlers
  const startInstagramPromotion = (batch: Batch | null, type: 'batch' | 'general') => {
    setSelectedBatch(batch);
    setPromotionType(type);
    setInstagramDialogOpen(true);
    
    // Reset form
    setContentDescription('');
    setTargetAudience([]);
    setAgeRange([18, 35]);
    setBrandVoice([]);
    setCallToAction('handle');
    setCustomInstagramHandle('');
  };

  const createInstagramPromotion = () => {
    setProcessingProgress(0);
    
    // Simulate processing
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // In a real app, this would be an API call
    setTimeout(() => {
      const newPromotion: InstagramPromotion = {
        id: `ig-${Date.now()}`,
        batchId: promotionType === 'batch' ? selectedBatch!.id : undefined,
        contentDescription,
        targetAudience,
        ageRange,
        brandVoice,
        callToAction,
        customContent: [],
        status: promotionType === 'batch' ? 'processing' : 'ready',
        createdAt: new Date().toISOString(),
        instagramHandle: callToAction === 'handle' ? customInstagramHandle : undefined,
        generatedContent: {
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', // Sample video
          caption: promotionType === 'batch' 
            ? `Join my ${selectedBatch!.name} batch! Perfect for ${targetAudience.join(', ')} aged ${ageRange[0]}-${ageRange[1]}. ${contentDescription}`
            : `${contentDescription}`,
          hashtags: promotionType === 'batch' 
            ? ['#Yoga', '#Fitness', '#Wellness', '#OnlineClasses', getFirstCategory(selectedBatch?.learning || []).replace(/\s+/g, '')]
            : ['#Wellness', '#Lifestyle', '#Motivation', '#SelfCare']
        },
        promotionType
      };

      setInstagramPromotions([...instagramPromotions, newPromotion]);
      setInstagramDialogOpen(false);
      setViewPromotionDialogOpen(true);
      setSelectedPromotion(newPromotion);
      clearInterval(interval);
    }, 3000);
  };

  const downloadContent = (promotion: InstagramPromotion) => {
    // In a real app, this would download the actual content
    alert('Download functionality would be implemented here');
  };

  const viewPromotion = (promotion: InstagramPromotion) => {
    setSelectedPromotion(promotion);
    setViewPromotionDialogOpen(true);
  };

  const getPromotionStatusIcon = (status: InstagramPromotion['status']) => {
    switch (status) {
      case 'processing':
        return <CircularProgress size={16} />;
      case 'ready':
        return <CheckCircle color="info" />;
      case 'promoted':
        return <CheckCircle color="success" />;
      default:
        return <Info color="info" />;
    }
  };

  const promoteOnInstagram = (promotion: InstagramPromotion) => {
    // Simulate promotion process
    const updatedPromotions = instagramPromotions.map(p => 
      p.id === promotion.id ? {...p, status: 'promoted'} : p
    );
    setInstagramPromotions(updatedPromotions);
    setSelectedPromotion({...promotion, status: 'promoted'});
  };

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const batchesData = await TeacherApiService.getBatchList();
        setBatches(batchesData.batches);
      } catch (error) {
        console.error("Error fetching batches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            textAlign: 'center'
          }}
        >
          Promote Your Batches
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: 'center',
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Boost your batch visibility! Promote your most popular batches to appear first in student searches and listings or create Instagram content.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUp sx={{ mr: 1, color: theme.palette.secondary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Promotion Benefits
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          Promoted batches appear at the top of search results and category listings, increasing visibility by up to 70%.
          You can promote up to 3 batches at a time. Promoting a new batch will automatically adjust the ranking of your currently promoted batches.
        </Typography>
        <Typography variant="body1">
          Now you can also create professional Instagram content to promote your batches! Get personalized videos, captions, and hashtags to share on your social media.
        </Typography>
      </Paper>

      {/* Instagram Promotions Section */}
      {instagramPromotions.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Your Instagram Promotions
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<Instagram />}
              onClick={() => startInstagramPromotion(null, 'general')}
            >
              Create New Content
            </Button>
          </Box>
          <Grid container spacing={2}>
            {instagramPromotions.map(promotion => {
              const batch = promotion.batchId ? batches.find(b => b.id === promotion.batchId) : null;
              return (
                <Grid item xs={12} md={6} key={promotion.id}>
                  <Card sx={{ display: 'flex', height: '100%', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                    <Box sx={{ width: 100, position: 'relative' }}>
                      {batch?.thumbnail ? (
                        <CardMedia
                          component="img"
                          height="100%"
                          image={batch.thumbnail}
                          alt={batch.name}
                          sx={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'grey.100'
                          }}
                        >
                          <Instagram sx={{ fontSize: 40, color: 'grey.400' }} />
                        </Box>
                      )}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'background.paper',
                          borderRadius: '50%',
                          p: 0.5
                        }}
                      >
                        {getPromotionStatusIcon(promotion.status)}
                      </Box>
                    </Box>
                    <Box sx={{ flexGrow: 1, p: 2 }}>
                      <Typography variant="h6" noWrap>
                        {batch?.name || 'General Promotion'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Created: {new Date(promotion.createdAt).toLocaleDateString()}
                      </Typography>
                      <Chip
                        label={promotion.status.charAt(0).toUpperCase() + promotion.status.slice(1)}
                        size="small"
                        color={
                          promotion.status === 'processing' ? 'info' :
                          promotion.status === 'ready' ? 'primary' :
                          promotion.status === 'promoted' ? 'success' : 'default'
                        }
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={promotion.promotionType === 'batch' ? 'Batch Promotion' : 'General Content'}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                      <Button
                        size="small"
                        onClick={() => viewPromotion(promotion)}
                        sx={{ mt: 1, display: 'block' }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Your Batches
        </Typography>
        <Box>
          <Button
            variant={filter === 'all' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setFilter('all')}
            sx={{ mr: 1 }}
          >
            All Batches
          </Button>
          <Button
            variant={filter === 'promoted' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setFilter('promoted')}
            sx={{ mr: 1 }}
          >
            Promoted
          </Button>
          <Button
            variant={filter === 'notPromoted' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setFilter('notPromoted')}
          >
            Not Promoted
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {sortedBatches.map((batch, index) => (
          <Grid item xs={12} md={6} key={batch.id}>
            <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: batch.isPopular ? `2px solid ${theme.palette.secondary.main}` : 'none',
                  position: 'relative',
                  overflow: 'visible',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                {batch.isPopular && (
                  <Chip
                    icon={<Star />}
                    label="Promoted"
                    color="secondary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: 16,
                      fontWeight: 600
                    }}
                  />
                )}

                <Box
                  sx={{
                    height: 4,
                    background: batch.isPopular
                      ? `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`
                      : theme.palette.grey[300],
                    width: '100%'
                  }}
                />

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mr: 1 }}>
                      {batch.name}
                    </Typography>
                    <Chip
                      label={getFirstCategory(batch.learning)}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {getTimeFromSchedule(batch.schedule)}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2">
                        Enrollment: {batch.students}/{batch.capacity}
                      </Typography>
                      <Box sx={{ width: '100%', height: 8, bgcolor: 'grey.200', borderRadius: 4, overflow: 'hidden', mt: 0.5 }}>
                        <Box
                          sx={{
                            height: '100%',
                            bgcolor: batch.students / batch.capacity > 0.8 ? 'success.main' : 'primary.main',
                            width: `${(batch.students / batch.capacity) * 100}%`
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => showBatchInfo(batch)}
                        sx={{ color: 'text.secondary' }}
                      >
                        <Info />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => toggleVisibility(batch.id)}
                        color={batch.is_active ? 'primary' : 'default'}
                      >
                        {batch.is_active ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </Box>

                    {batch.isPopular ? (
                      <Chip
                        icon={<Star />}
                        label="Promoted"
                        color="secondary"
                        variant="outlined"
                      />
                    ) : (
                      <Box>
                        <Button
                          variant="outlined"
                          startIcon={<Instagram />}
                          onClick={() => startInstagramPromotion(batch, 'batch')}
                          sx={{ mr: 1 }}
                        >
                          Instagram
                        </Button>
                        <Button
                          variant="contained"
                          endIcon={<ArrowUpward />}
                          onClick={() => handlePromote(batch)}
                          disabled={batches.filter(b => b.isPopular).length >= 3}
                        >
                          Promote
                        </Button>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {/* Create Instagram Promotion Button */}
      {instagramPromotions.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Instagram />}
            onClick={() => startInstagramPromotion(null, 'general')}
            sx={{ px: 4, py: 1.5 }}
          >
            Create Instagram Content
          </Button>
        </Box>
      )}

      {/* Promotion Dialog */}
      <Dialog
        open={promoteDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setPromoteDialogOpen(false)}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1, color: theme.palette.secondary.main }} />
            Promote Batch
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to promote <strong>{selectedBatch?.name}</strong>?
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            This will move your batch to the top of search results and listings.
            Your previously promoted batches will move down in ranking.
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Promotion fee: <Box component="span" sx={{ color: theme.palette.secondary.main, fontWeight: 600 }}>FREE</Box>
            (limited time offer)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPromoteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmPromotion}
            variant="contained"
            startIcon={<Star />}
          >
            Promote Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Instagram Promotion Dialog */}
      <Dialog
        open={instagramDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setInstagramDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Instagram sx={{ mr: 1, color: theme.palette.secondary.main }} />
            {promotionType === 'batch' ? `Create Instagram Promotion for ${selectedBatch?.name}` : 'Create Instagram Content'}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              We'll create personalized Instagram content for you to share. {promotionType === 'batch' && 'Your batch details will be automatically included.'}
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Target Audience</InputLabel>
              <Select
                multiple
                value={targetAudience}
                onChange={(e) => setTargetAudience(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                input={<OutlinedInput label="Target Audience" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {['Beginners', 'Intermediate', 'Advanced', 'Professionals', 'Students', 'Working Adults', 'Seniors', 'Teens'].map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={targetAudience.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
              Age Range: {ageRange[0]} - {ageRange[1]}
            </Typography>
            <Box sx={{ width: '100%', px: 1, mb: 2 }}>
              <Slider
                value={ageRange}
                onChange={(e, newValue) => setAgeRange(newValue as [number, number])}
                valueLabelDisplay="auto"
                min={14}
                max={70}
              />
            </Box>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Brand Voice</InputLabel>
              <Select
                multiple
                value={brandVoice}
                onChange={(e) => setBrandVoice(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                input={<OutlinedInput label="Brand Voice" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {['Inspirational', 'Professional', 'Friendly', 'Casual', 'Educational', 'Energetic', 'Calm', 'Motivational'].map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={brandVoice.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              multiline
              rows={3}
              fullWidth
              value={contentDescription}
              onChange={(e) => setContentDescription(e.target.value)}
              label="Content Description"
              placeholder="Describe what makes your content special..."
              sx={{ mb: 2 }}
            />

            <FormControl component="fieldset" fullWidth>
              <Typography variant="body2" gutterBottom>Call to Action</Typography>
              <RadioGroup
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
              >
                <FormControlLabel
                  value="handle"
                  control={<Radio />}
                  label="Include my Instagram handle"
                />
                <FormControlLabel
                  value="join"
                  control={<Radio />}
                  label="Join my batch/classes"
                />
                <FormControlLabel
                  value="learnmore"
                  control={<Radio />}
                  label="Learn more"
                />
              </RadioGroup>
            </FormControl>

            {callToAction === 'handle' && (
              <TextField
                fullWidth
                value={customInstagramHandle}
                onChange={(e) => setCustomInstagramHandle(e.target.value)}
                label="Your Instagram Handle"
                placeholder="@yourhandle"
                sx={{ mt: 1, mb: 2 }}
              />
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              {promotionType === 'batch' 
                ? 'Your first Instagram promotion is free! Additional promotions cost ₹399 for 5 videos or ₹899 for 10 videos.'
                : 'Creating Instagram content costs ₹399 for 5 videos or ₹899 for 10 videos.'
              }
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInstagramDialogOpen(false)}>Cancel</Button>
          <Button onClick={createInstagramPromotion} variant="contained" startIcon={<Instagram />}>
            Create Content
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Instagram Promotion Dialog */}
      <Dialog
        open={viewPromotionDialogOpen}
        onClose={() => setViewPromotionDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Instagram sx={{ mr: 1, color: theme.palette.secondary.main }} />
            Instagram {selectedPromotion?.promotionType === 'batch' ? 'Promotion' : 'Content'}
            <Chip
              label={selectedPromotion?.status}
              color={
                selectedPromotion?.status === 'processing' ? 'info' :
                selectedPromotion?.status === 'ready' ? 'primary' :
                selectedPromotion?.status === 'promoted' ? 'success' : 'default'
              }
              sx={{ ml: 2 }}
              size="small"
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPromotion && (
            <Box>
              {selectedPromotion.status === 'processing' ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress size={60} sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Creating your Instagram content
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    This usually takes a few minutes. We're generating a personalized video and caption for your promotion.
                  </Typography>
                  <LinearProgress variant="determinate" value={processingProgress} sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    {processingProgress}% Complete
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Box sx={{ width: '100%', maxWidth: 400, position: 'relative' }}>
                      <CardMedia
                        component="video"
                        controls
                        src={selectedPromotion.generatedContent.videoUrl}
                        sx={{
                          borderRadius: 2,
                          overflow: 'hidden',
                          bgcolor: 'black'
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          borderRadius: 1,
                          px: 1,
                          py: 0.5
                        }}
                      >
                        <Instagram />
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Description sx={{ mr: 1 }} /> Caption
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2">
                        {selectedPromotion.generatedContent.caption}
                      </Typography>
                    </Paper>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tag sx={{ mr: 1 }} /> Hashtags
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedPromotion.generatedContent.hashtags.map((tag, index) => (
                        <Chip key={index} label={tag} variant="outlined" />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={() => downloadContent(selectedPromotion)}
                    >
                      Download Video
                    </Button>
                    
                    {selectedPromotion.promotionType === 'batch' && selectedPromotion.status === 'ready' && (
                      <Button
                        variant="contained"
                        startIcon={<Publish />}
                        onClick={() => promoteOnInstagram(selectedPromotion)}
                      >
                        Promote on Our Instagram
                      </Button>
                    )}
                    
                    {selectedPromotion.promotionType === 'batch' && selectedPromotion.status === 'promoted' && (
                      <Chip
                        icon={<CheckCircle />}
                        label="Promoted on Our Instagram"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {selectedPromotion.promotionType === 'batch' && selectedPromotion.status === 'ready' && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Your content is ready! You can download it for your own Instagram or let us promote it on our channel.
                    </Alert>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewPromotionDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Batch Info Dialog */}
      <Dialog
        open={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedBatch?.name}
          <Chip
            label={selectedBatch ? getFirstCategory(selectedBatch.learning) : ''}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ ml: 2 }}
          />
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {selectedBatch?.schedule}
          </Typography>
          <Typography variant="body1" paragraph>
            {selectedBatch?.description}
          </Typography>
          <Typography variant="body2">
            Enrollment: {selectedBatch?.students}/{selectedBatch?.capacity} students
          </Typography>
          <Typography variant="body2">
            Level: {selectedBatch?.level}
          </Typography>
          <Typography variant="body2">
            Duration: {selectedBatch?.duration}
          </Typography>
          {selectedBatch?.isPopular && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Star sx={{ color: theme.palette.secondary.main, mr: 1 }} />
              <Typography variant="body2" color="secondary.main">
                Currently promoted
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          bgcolor: theme.palette.primary.main,
          '&:hover': {
            bgcolor: theme.palette.primary.dark
          }
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUpward />
      </Fab>
    </Container>
  );
};

export default BatchPromotionPage;