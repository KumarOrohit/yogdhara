import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
  useTheme,
  alpha,
  Paper,
  IconButton,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Avatar,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search,
  FilterList,
  People,
  Schedule,
  Star,
  Spa,
  TrendingUp,
  Favorite,
  FavoriteBorder,
  CalendarToday,
  AccessTime
} from '@mui/icons-material';
import StudentApiService from '../studentApiServie';
import StripePaymentWrapper from '../../../payment/Payment';

// TypeScript interfaces
interface Batch {
  id: string;
  name: string;
  instructor: string;
  instructor_avatar: string;
  level: string;
  learnings: string[];
  description: string;
  price: number;
  rating: number;
  students: number;
  duration: string;
  schedule: string;
  thumbnail: string;
  is_popular: boolean;
  start_date: string;
}

interface ApiResponse {
  batches: Batch[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    has_next: boolean;
    has_previous: boolean;
  };
  filters: {
    levels: string[];
    learnings: string[];
    price_range: {
      min: number;
      max: number;
      step: number;
    };
    sort_options: Array<{
      value: string;
      label: string;
    }>;
  };
}

const BatchStore = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedLearning, setSelectedLearning] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Get store batches from API
  const getStoreBatch = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await StudentApiService.getStoreBatches();
      
      if (response.status === 200 && response.store_data) {
        setData(response.store_data);
      } else {
        setError('Failed to load store data');
      }
    } catch (err) {
      setError('An error occurred while fetching store data');
      console.error('Error fetching store batches:', err);
    } finally {
      setLoading(false);
    }
  }

  // Filter and sort batches based on UI state
  const filteredBatches = data?.batches
    ?.filter(batch => {
      const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           batch.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           batch.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = selectedLevel === 'all' || batch.level === selectedLevel;
      const matchesLearning = selectedLearning === 'all' || batch.learnings.includes(selectedLearning);
      const matchesPrice = batch.price >= priceRange[0] && batch.price <= priceRange[1];
      
      return matchesSearch && matchesLevel && matchesLearning && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        default:
          return b.students - a.students;
      }
    }) || [];

  const itemsPerPage = 6;
  const pageCount = Math.ceil(filteredBatches.length / itemsPerPage);
  const paginatedBatches = filteredBatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleEnrollClick = (batch: Batch) => {
    setSelectedBatch(batch);
    setShowPaymentModal(true);
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setSelectedBatch(null);
  };

  useEffect(() => {
    getStoreBatch();
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
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={getStoreBatch} sx={{ ml: 2 }}>
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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight="800" gutterBottom>
          Yoga Batch Store
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover and enroll in upcoming yoga batches taught by expert instructors
        </Typography>
      </Box>

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{xs:12, md:6}}>
            <TextField
              fullWidth
              placeholder="Search batches, instructors, or styles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Grid>
          
          <Grid size={{xs:12, md:6}}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Level</InputLabel>
                <Select
                  value={selectedLevel}
                  label="Level"
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  {data.filters.levels.map(level => (
                    <MenuItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Focus Area</InputLabel>
                <Select
                  value={selectedLearning}
                  label="Focus Area"
                  onChange={(e) => setSelectedLearning(e.target.value)}
                >
                  {data.filters.learnings.map(learning => (
                    <MenuItem key={learning} value={learning}>
                      {learning.charAt(0).toUpperCase() + learning.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {data.filters.sort_options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid size={{xs:12}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" fontWeight="500">
                Price Range:
              </Typography>
              <Slider
                value={priceRange}
                onChange={(_, newValue) => setPriceRange(newValue as number[])}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `₹${value}`}
                min={data.filters.price_range.min}
                max={data.filters.price_range.max}
                step={data.filters.price_range.step}
                sx={{ maxWidth: 300 }}
              />
              <Typography variant="body2">
                ₹{priceRange[0]} - ₹{priceRange[1]}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Count */}
      <Box sx={{ display: '极', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" color="text.secondary">
          {filteredBatches.length} batches found
        </Typography>
        <Chip 
          icon={<FilterList />} 
          label="Filters Applied" 
          variant="outlined" 
          onDelete={() => {
            setSelectedLevel('all');
            setSelectedLearning('all');
            setPriceRange([data.filters.price_range.min, data.filters.price_range.max]);
          }}
        />
      </Box>

      {/* Batches Grid */}
      {paginatedBatches.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {paginatedBatches.map((batch) => (
              <Grid size={{xs:12, md:6, lg:4}} key={batch.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4]
                    }
                  }}
                >
                  {/* Batch Image */}
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={batch.thumbnail}
                      alt={batch.name}
                      sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                    />
                    
                    {/* Favorite Button */}
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: alpha(theme.palette.background.paper, 0.8),
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

                    {/* Popular Badge */}
                    {batch.is_popular && (
                      <Chip
                        icon={<TrendingUp />}
                        label="Popular"
                        color="secondary"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          backgroundColor: alpha(theme.palette.secondary.main, 0.9),
                          color: 'white'
                        }}
                      />
                    )}

                    {/* Level Badge */}
                    <Chip
                      label={batch.level.charAt(0).toUpperCase() + batch.level.slice(1)}
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 10,
                        left: 10,
                        backgroundColor: alpha(theme.palette.primary.main, 0.9),
                        color: 'white'
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Batch Name and Instructor */}
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                      {batch.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={batch.instructor_avatar} 
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        By {batch.instructor}
                      </Typography>
                    </Box>

                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {batch.description}
                    </Typography>

                    {/* Learning Tags */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {batch.learnings.slice(0, 3).map((learning, index) => (
                        <Chip
                          key={index}
                          label={learning}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Batch Details */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star color="warning" sx={{ fontSize: 18, mr: 0.5 }} />
                        <Typography variant="body2">
                          {batch.rating}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <People sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {batch.students}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {batch.duration}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Schedule */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Schedule sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {batch.schedule}
                      </Typography>
                    </Box>

                    {/* Start Date */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <CalendarToday sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Starts: {formatDate(batch.start_date)}
                      </Typography>
                    </Box>

                    {/* Price and Enroll Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary.main" fontWeight="600">
                        ₹{batch.price}
                      </Typography>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => handleEnrollClick(batch)}
                      >
                        Enroll Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={(_, value) => setCurrentPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Spa sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No batches found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search terms to find what you're looking for.
          </Typography>
        </Paper>
      )}

      {/* Payment Modal */}
      {selectedBatch && (
        <StripePaymentWrapper
          batch={{
            id: parseInt(selectedBatch.id),
            name: selectedBatch.name,
            price: selectedBatch.price,
            duration: selectedBatch.duration,
            level: selectedBatch.level,
            schedule: selectedBatch.schedule,
            students: selectedBatch.students,
            instructor: {
              name: selectedBatch.instructor,
              profile: selectedBatch.instructor_avatar
            },
            description: selectedBatch.description
          }}
          onCancel={handlePaymentCancel}
          open={showPaymentModal}
        />
      )}
    </Box>
  );
};

export default BatchStore;