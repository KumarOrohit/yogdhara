import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  IconButton,
  useTheme,
  alpha,
  Button,
  CircularProgress,
  Modal
} from '@mui/material';
import {
  PlayCircle,
  People,
  TrendingUp,
  Schedule,
  Star,
  Bookmark,
  EmojiEvents,
  Spa,
  AccessTime,
  Close
} from '@mui/icons-material';
import StudentApiService from '../studentApiServie';
import { useNavigate } from 'react-router-dom';

// TypeScript interfaces
interface StudentStats {
  total_classes: number;
  completed_classes: number;
  enrolled_batches: number;
  hours_practiced: number;
  streak: number;
}

interface EnrolledBatch {
  id: string;
  name: string;
  instructor: string;
  progress: number;
  nextClass: string;
  thumbnail: string;
}

interface RecentRecording {
  id: string;
  title: string;
  duration: string;
  date: string;
  instructor: string;
  thumbnail: string;
  recording_link: string;
}

interface PromotedBatch {
  id: string;
  name: string;
  instructor: string;
  rating: number;
  students: number;
  price: number;
  thumbnail: string;
}

interface DashboardData {
  student_stats: StudentStats;
  enrolled_batches: EnrolledBatch[];
  recent_recordings: RecentRecording[];
  promoted_batches: PromotedBatch[];
}

// Custom Rating component
const Rating = ({ value, size = 'medium' }: { value: number; size?: 'small' | 'medium' }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex' }}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          sx={{
            fontSize: size === 'small' ? 18 : 24,
            color: index <= value ? theme.palette.warning.main : theme.palette.grey[300]
          }}
        />
      ))}
    </Box>
  );
};

const StudentDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<RecentRecording | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const getStudentAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await StudentApiService.getAnalytics();
      
      if (response.status === 200 && response.analytics) {
        setDashboardData(response.analytics);
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayRecording = (recording: RecentRecording) => {
    setSelectedRecording(recording);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecording(null);
  };

  useEffect(() => {
    getStudentAnalytics();
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
        <Button onClick={getStudentAnalytics} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!dashboardData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography>No data available</Typography>
      </Box>
    );
  }

  const { student_stats, enrolled_batches, recent_recordings, promoted_batches } = dashboardData;

  const statsConfig = [
    { 
      title: "Total Classes", 
      value: student_stats.total_classes, 
      icon: <Spa sx={{ fontSize: 30 }} />,
      color: theme.palette.primary.main,
      subtitle: "All time enrolled"
    },
    { 
      title: "Completed", 
      value: student_stats.completed_classes, 
      icon: <EmojiEvents sx={{ fontSize: 30 }} />,
      color: theme.palette.success.main,
      subtitle: "Classes finished"
    },
    { 
      title: "Enrolled Batches", 
      value: student_stats.enrolled_batches, 
      icon: <Bookmark sx={{ fontSize: 30 }} />,
      color: theme.palette.info.main,
      subtitle: "Active batches"
    },
    { 
      title: "Practice Streak", 
      value: `${student_stats.streak} days`, 
      icon: <TrendingUp sx={{ fontSize: 30 }} />,
      color: theme.palette.warning.main,
      subtitle: "Current streak"
    },
    { 
      title: "Hours Practiced", 
      value: student_stats.hours_practiced, 
      icon: <AccessTime sx={{ fontSize: 30 }} />,
      color: theme.palette.secondary.main,
      subtitle: "Total practice time"
    }
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          Welcome Back, Student!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Continue your yoga journey with personalized recommendations
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsConfig.map((stat, index) => (
          <Grid size={{xs:12, sm:6, md:2.4}} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                borderRadius: 3
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  color: stat.color,
                  backgroundColor: alpha(stat.color, 0.1),
                  borderRadius: '50%',
                  p: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" fontWeight="700" sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
                <Typography variant="h6" sx={{ mb: 0.5 }}>
                  {stat.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Enrolled Batches */}
        <Grid size={{xs:12, lg:6}}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="600">
                  Your Enrolled Batches
                </Typography>
                <Button color="primary" onClick={() => navigate("/dashboard/stu/batch")}>View All</Button>
              </Box>
              
              {enrolled_batches.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No enrolled batches yet
                </Typography>
              ) : (
                enrolled_batches.map((batch) => (
                  <Box 
                    key={batch.id} 
                    sx={{ 
                      mb: 2, 
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.03),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Avatar 
                      src={batch.thumbnail} 
                      variant="rounded"
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="600">
                        {batch.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        By {batch.instructor}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={batch.progress} 
                          sx={{ 
                            width: '100%', 
                            mr: 1, 
                            height: 6, 
                            borderRadius: 3,
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: theme.palette.primary.main,
                              borderRadius: 3
                            }
                          }} 
                        />
                        <Typography variant="body2" fontWeight="600">
                          {batch.progress}%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          Next class: {batch.nextClass}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Recordings */}
        <Grid size={{xs:12, lg:6}}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="600">
                  Recent Recordings
                </Typography>
              </Box>
              
              {recent_recordings.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No recent recordings available
                </Typography>
              ) : (
                recent_recordings.map((recording) => (
                  <Box 
                    key={recording.id} 
                    sx={{ 
                      mb: 2, 
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.background.default, 0.5),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Avatar 
                      src={recording.thumbnail} 
                      variant="rounded"
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="600">
                        {recording.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        With {recording.instructor} • {recording.duration}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Added {recording.date}
                      </Typography>
                    </Box>
                    <IconButton 
                      color="primary" 
                      onClick={() => handlePlayRecording(recording)}
                    >
                      <PlayCircle />
                    </IconButton>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Promoted Batches Store */}
        <Grid size={{xs:12}}>
          <Card sx={{ borderRadius: 3, mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h5" fontWeight="600">
                    Featured Batches
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Popular batches you might be interested in
                  </Typography>
                </Box>
                <Button color="primary" onClick={() => navigate("/dashboard/stu/store")}>Visit Store</Button>
              </Box>
              
              {promoted_batches.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No promoted batches available
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  {promoted_batches.map((batch) => (
                    <Grid size={{xs:12, md:4}} key={batch.id}>
                      <Card 
                        sx={{ 
                          borderRadius: 3,
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[4]
                          }
                        }}
                      >
                        <Box
                          component="img"
                          src={batch.thumbnail}
                          alt={batch.name}
                          sx={{
                            width: '100%',
                            height: 160,
                            objectFit: 'cover',
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12
                          }}
                        />
                        <CardContent>
                          <Typography variant="h6" fontWeight="600" gutterBottom>
                            {batch.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            By {batch.instructor}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Rating value={batch.rating} size="small" />
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              ({batch.rating.toFixed(1)})
                            </Typography>
                            <People sx={{ fontSize: 16, ml: 2, mr: 0.5 }} />
                            <Typography variant="body2">
                              {batch.students}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: '极', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" color="primary.main" fontWeight="600">
                              ₹{batch.price}
                            </Typography>
                            <Button variant="contained" color="primary" size="small">
                              Enroll Now
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                With {selectedRecording.instructor} • {selectedRecording.duration}
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

export default StudentDashboard;