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
  CircularProgress
} from '@mui/material';
import {
  ArrowUpward,
  Visibility,
  VisibilityOff,
  TrendingUp,
  Info,
  Star,
} from '@mui/icons-material';
import type { TransitionProps } from '@mui/material/transitions';
import './Promotion.scss';
import TeacherApiService from '../teacherApiService';

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

const BatchPromotionPage: React.FC = () => {
  const theme = useTheme();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'promoted' | 'notPromoted'>('all');

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
          Boost your batch visibility! Promote your most popular batches to appear first in student searches and listings.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUp sx={{ mr: 1, color: theme.palette.secondary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Promotion Benefits
          </Typography>
        </Box>
        <Typography variant="body1">
          Promoted batches appear at the top of search results and category listings, increasing visibility by up to 70%.
          You can promote up to 3 batches at a time. Promoting a new batch will automatically adjust the ranking of your currently promoted batches.
        </Typography>
      </Paper>

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
          <Grid size={{ xs: 12, md: 6 }} key={batch.id}>
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
                      <Button
                        variant="contained"
                        endIcon={<ArrowUpward />}
                        onClick={() => handlePromote(batch)}
                        disabled={batches.filter(b => b.isPopular).length >= 3}
                      >
                        Promote
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

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