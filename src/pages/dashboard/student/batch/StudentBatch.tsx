import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  useTheme,
  alpha,
  Tabs,
  Tab,
  IconButton,
  Divider,
  Paper,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardMedia,
  CircularProgress,
  Modal
} from '@mui/material';
import {
  PlayCircle,
  CalendarToday,
  AccessTime,
  ExpandMore,
  Close
} from '@mui/icons-material';
import StudentApiService from '../studentApiServie';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Recording {
  id: string;
  title: string;
  duration: string;
  date: string;
  formatted_date: string;
  thumbnail: string;
  recording_link: string;
  views: number;
  batch_name?: string;
  batch_id?: string;
}

interface EnrolledBatch {
  id: string;
  name: string;
  instructor: string;
  instructor_avatar: string;
  progress: number;
  next_class: string;
  thumbnail: string;
  level: string;
  start_date: string;
  end_date: string;
  schedule: string;
  recordings: Recording[];
  recording_count: number;
  total_classes: number;
  attended_classes: number;
}

interface ApiResponse {
  enrolled_batches: EnrolledBatch[];
  all_recordings: Recording[];
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`batch-tabpanel-${index}`}
      aria-labelledby={`batch-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const StudentEnrolledBatches = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setTabValue(newValue);
  };

  const handleBatchExpand = (batchId: string) => {
    setExpandedBatch(expandedBatch === batchId ? null : batchId);
  };

  const handlePlayRecording = (recording: Recording) => {
    setSelectedRecording(recording);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecording(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEnrolledBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await StudentApiService.getEnrolledBatches();
      
      if (response.status === 200 && response.batch_data) {
        setData(response.batch_data);
      } else {
        setError('Failed to load enrolled batches data');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error('Error fetching enrolled batches:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getEnrolledBatches();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
        <Button onClick={getEnrolledBatches} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>No data available</Typography>
      </Box>
    );
  }

  const { enrolled_batches, all_recordings } = data;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="800" gutterBottom>
          My Enrolled Batches
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Access all your batches, and recordings in one place
        </Typography>
      </Box>

      {/* Tabs for different views */}
      <Paper sx={{ borderRadius: 3, mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All Batches" />
          <Tab label="Recordings" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        {/* All Batches View */}
        <Grid container spacing={3}>
          {enrolled_batches.map((batch) => (
            <Grid size={{xs:12}} key={batch.id}>
              <Accordion 
                expanded={expandedBatch === batch.id}
                onChange={() => handleBatchExpand(batch.id)}
                sx={{ 
                  borderRadius: 3,
                  '&:before': { display: 'none' },
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  overflow: 'hidden'
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box
                      component="img"
                      src={batch.thumbnail}
                      alt={batch.name}
                      sx={{ 
                        width: 80, 
                        height: 60, 
                        objectFit: 'cover',
                        borderRadius: 2,
                        mr: 3
                      }}
                    />
                    
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="600">
                        {batch.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <Avatar 
                          src={batch.instructor_avatar} 
                          sx={{ width: 24, height: 24, mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          By {batch.instructor}
                        </Typography>
                        <Chip 
                          label={batch.level} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ ml: 2 }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: 'right', mr: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Progress
                      </Typography>
                      <Typography variant="h6" color="primary.main" fontWeight="600">
                        {batch.progress}%
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails>
                  <Grid container spacing={3}>
                    <Grid size={{xs:12, md:8}}>
                      {/* Batch Details */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Batch Details
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid size={{xs:6}}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                Started: {formatDate(batch.start_date)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{xs:6}}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                Ends: {formatDate(batch.end_date)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={{xs:12}}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                              <Typography variant="body2">
                                Schedule: {batch.schedule}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Progress Bar */}
                      <Box sx={{ mb: 3 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={batch.progress} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            mb: 1,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: theme.palette.primary.main,
                              borderRadius: 4
                            }
                          }} 
                        />
                        <Typography variant="body2" color="text.secondary">
                          {batch.progress}% complete ({batch.attended_classes}/{batch.total_classes} classes attended)
                        </Typography>
                      </Box>

                      {/* Quick Stats */}
                      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" color="primary.main">
                            {batch.recording_count}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Recordings
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                  
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Recent Content */}
                  <Typography variant="h6" gutterBottom>
                    Recent Content
                  </Typography>
                  
                  <Grid container spacing={2}>
                    {batch.recordings.slice(0, 2).map((recording) => (
                      <Grid size={{xs:12, sm:6}} key={recording.id}>
                        <Paper 
                          sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                            display: 'flex', 
                            alignItems: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.05)
                            }
                          }}
                          onClick={() => handlePlayRecording(recording)}
                        >
                          <PlayCircle color="primary" sx={{ mr: 2 }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" fontWeight="500">
                              {recording.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {recording.duration} • {recording.formatted_date}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Recordings View */}
        <Typography variant="h5" gutterBottom>
          All Recordings
        </Typography>
        <Grid container spacing={3}>
          {all_recordings.map((recording) => (
            <Grid size={{xs:12, md:6, lg: 4}} key={recording.id}>
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={recording.thumbnail}
                    alt={recording.title}
                    sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      p: 2
                    }}
                  >
                    <Typography variant="h6" fontWeight="600" color="white">
                      {recording.duration}
                    </Typography>
                  </Box>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: alpha(theme.palette.background.paper, 0.9),
                      '&:hover': {
                        backgroundColor: theme.palette.background.paper
                      }
                    }}
                    onClick={() => handlePlayRecording(recording)}
                  >
                    <PlayCircle color="primary" />
                  </IconButton>
                </Box>
                
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {recording.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    From: {recording.batch_name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {recording.formatted_date} • {recording.views} views
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Recording Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '80%',
            maxWidth: 800,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
            }}
            onClick={handleCloseModal}
          >
            <Close />
          </IconButton>
          
          {selectedRecording && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedRecording.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                From: {selectedRecording.batch_name} • {selectedRecording.duration}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <video
                  controls
                  controlsList="nodownload"
                  style={{
                    width: '100%',
                    borderRadius: 8,
                  }}
                  src={selectedRecording.recording_link}
                >
                  Your browser does not support the video tag.
                </video>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default StudentEnrolledBatches;