import React, { useState, useEffect } from "react";
import {
  DataGrid,
  type GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
  InputAdornment,
  FormHelperText,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  useTheme,
  alpha,
  Avatar,
  AvatarGroup,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  IconButton,
  Menu,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  DialogTitle
} from "@mui/material";
import {
  MoreVert,
  Group,
  Schedule,
  TrendingUp,
  Search,
  FilterList,
  Add,
  PlayArrow,
  Pause,
  Edit,
  Upload,
  VideoLibrary,
  Check,
  Close
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TeacherApiService from "../teacherApiService";

interface BatchData {
  id: string;
  name: string;
  thumbnail: string | null;
  preview_video: string | null;
  description: string;
  rating: number;
  students: number;
  duration: string;
  level: string;
  price: number;
  capacity: number;
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

interface BatchFormData {
  name: string;
  description: string;
  level: string;
  price: number;
  capacity: number;
  duration: string;
  learning: string[];
  days: string[];
  start_time: string;
  end_time: string;
  start_date: string | null,
  end_date: string | null,
  thumbnail: File | null;
  preview_video: File | null;
  is_active: boolean;
  is_free_trial_available: boolean;
  number_of_free_trial_class: number;
}

const TeacherBatch = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [batches, setBatches] = useState<BatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [newLearning, setNewLearning] = useState("");

  const [batchForm, setBatchForm] = useState<BatchFormData>({
    name: "",
    description: "",
    level: "beginner",
    price: 0,
    capacity: 10,
    duration: "60",
    learning: [],
    days: [],
    start_time: "06:00",
    end_time: "07:00",
    start_date: "",
    end_date: "",
    thumbnail: null,
    preview_video: null,
    is_active: true,
    is_free_trial_available: false,
    number_of_free_trial_class: 0
  });

  const levels = ["beginner", "intermediate", "advanced"];
  const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

  const handleAddLearning = () => {
    if (newLearning.trim() && !batchForm.learning.includes(newLearning.trim())) {
      setBatchForm(prev => ({
        ...prev,
        learning: [...prev.learning, newLearning.trim()]
      }));
      setNewLearning("");
    }
  };

  const handleRemoveLearning = (learningToRemove: string) => {
    if (batchForm.learning.length > 1) {
      setBatchForm(prev => ({
        ...prev,
        learning: prev.learning.filter(l => l !== learningToRemove)
      }));
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddLearning();
    }
  };


  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setTabValue(newValue);
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
    setActiveStep(0);
    setBatchForm({
      name: "",
      description: "",
      level: "beginner",
      price: 0,
      capacity: 10,
      duration: "60",
      learning: [],
      days: [],
      start_time: "06:00",
      end_time: "07:00",
      start_date: "",
      end_date: "",
      thumbnail: null,
      preview_video: null,
      is_active: true,
      is_free_trial_available: false,
      number_of_free_trial_class: 0
    });
    setThumbnailPreview(null);
    setVideoPreview(null);
  };

  const handleEditDialogOpen = () => {
    if (selectedRow) {
      setEditDialogOpen(true);
      setActiveStep(0);
      // Pre-fill form with existing data
      console.log(selectedRow);
      setBatchForm({
        name: selectedRow.name,
        description: selectedRow.description,
        level: selectedRow.level,
        price: selectedRow.price,
        capacity: selectedRow.capacity,
        duration: selectedRow.duration,
        learning: selectedRow.learning || [],
        days: selectedRow.days || [],
        start_time: selectedRow.start_time || "06:00",
        end_time: selectedRow.end_time || "07:00",
        start_date: selectedRow.start_date,
        end_date: selectedRow.end_date,
        thumbnail: null,
        preview_video: null,
        is_active: selectedRow.is_active,
        is_free_trial_available: selectedRow.is_free_trial_available || false,
        number_of_free_trial_class: selectedRow.number_of_free_trial_class || 0
      });
      setThumbnailPreview(selectedRow.thumbnail);
      setVideoPreview(selectedRow.preview_video);
    }
    handleClose();
  };

  const handleDialogClose = () => {
    setAddDialogOpen(false);
    setEditDialogOpen(false);
    setActiveStep(0);
  };

  const handleNextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleInputChange = (field: keyof BatchFormData, value: any) => {
    setBatchForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDaysToggle = (day: string) => {
    setBatchForm(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBatchForm(prev => ({ ...prev, thumbnail: file }));
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBatchForm(prev => ({ ...prev, preview_video: file }));
      const reader = new FileReader();
      reader.onload = (e) => setVideoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Append all form data
      Object.entries(batchForm).forEach(([key, value]) => {
        if (key === 'learning' || key === 'days') {
          // For array fields, append each value with the same key
          formData.append(key, JSON.stringify(value));
        } else if (key === 'thumbnail' || key === 'preview_video') {
          // For file fields, append the file directly
          if (value) {
            formData.append(key, value as File);
          }
        } else if (value !== null) {
          // For other fields, convert to string and append
          formData.append(key, value.toString());
        }
      });

      // Log the form data for debugging
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await TeacherApiService.updateCreateBatch(formData);

      // Refresh batches list
      const batchesData = await TeacherApiService.getBatchList();
      setBatches(batchesData.batches);

      handleDialogClose();
    } catch (error) {
      console.error("Error saving batch:", error);
    }
  };

  const handleToggleStatus = async () => {
    if (selectedRow) {
      try {
        const formData = new FormData();
        formData.append('is_active', (!selectedRow.is_active).toString());

        // await TeacherApiService.updateBatch(selectedRow.id, formData);

        // Refresh batches list
        const batchesData = await TeacherApiService.getBatchList();
        setBatches(batchesData.batches);
      } catch (error) {
        console.error("Error toggling batch status:", error);
      }
    }
    handleClose();
  };

  const steps = ['Basic Info', 'Schedule & Pricing', 'Media & Settings'];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Batch Name"
                  value={batchForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  value={batchForm.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={batchForm.level}
                    label="Level"
                    onChange={(e) => handleInputChange('level', e.target.value)}
                  >
                    {levels.map(level => (
                      <MenuItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  value={batchForm.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">min</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Learning Focus Areas *
                </Typography>

                {/* Display learning chips */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {batchForm.learning.map((learning, index) => (
                    <Chip
                      key={index}
                      label={learning}
                      color="primary"
                      variant="filled"
                      deleteIcon={batchForm.learning.length > 1 ? undefined : <Close />}
                      onDelete={batchForm.learning.length > 1 ? () => handleRemoveLearning(learning) : undefined}
                    />
                  ))}
                </Box>

                {/* Input for adding new learning */}
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add learning focus area..."
                  value={newLearning}
                  onChange={(e) => setNewLearning(e.target.value)}
                  onKeyPress={handleKeyPress}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleAddLearning}
                          disabled={!newLearning.trim() || batchForm.learning.includes(newLearning.trim())}
                          edge="end"
                        >
                          <Add />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText={batchForm.learning.length === 0 ? "At least one learning focus area is required" : "Press Enter or click + to add"}
                  error={batchForm.learning.length === 0}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Class Days
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {daysOptions.map(day => (
                    <Chip
                      key={day}
                      label={day}
                      clickable
                      color={batchForm.days.includes(day) ? 'primary' : 'default'}
                      variant={batchForm.days.includes(day) ? 'filled' : 'outlined'}
                      onClick={() => handleDaysToggle(day)}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="time"
                  value={batchForm.start_time}
                  onChange={(e) => handleInputChange('start_time', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="time"
                  value={batchForm.end_time}
                  onChange={(e) => handleInputChange('end_time', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={batchForm.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={batchForm.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Price (₹)"
                  type="number"
                  value={batchForm.price}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Capacity"
                  type="number"
                  value={batchForm.capacity}
                  onChange={(e) => handleInputChange('capacity', Number(e.target.value))}
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">students</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Thumbnail Image
                </Typography>
                <Box
                  sx={{
                    border: `2px dashed ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    minHeight: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                  />
                  {thumbnailPreview ? (
                    <>
                      <Avatar
                        src={thumbnailPreview}
                        sx={{ width: 120, height: 120, mb: 2 }}
                        variant="rounded"
                      />
                      <Typography variant="body2">
                        Click to change thumbnail
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Upload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Upload Thumbnail
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Recommended: 400x300px
                      </Typography>
                    </>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Preview Video
                </Typography>
                <Box
                  sx={{
                    border: `2px dashed ${theme.palette.divider}`,
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    minHeight: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={handleVideoUpload}
                  />
                  {videoPreview ? (
                    <>
                      <VideoLibrary sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2">
                        Video selected
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Click to change video
                      </Typography>
                    </>
                  ) : (
                    <>
                      <VideoLibrary sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Upload Preview Video
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        MP4, up to 100MB
                      </Typography>
                    </>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={batchForm.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    />
                  }
                  label="Batch Active"
                />
                <FormHelperText>
                  {batchForm.is_active ? 'Batch is visible to students' : 'Batch is hidden from students'}
                </FormHelperText>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={batchForm.is_free_trial_available}
                      onChange={(e) => handleInputChange('is_free_trial_available', e.target.checked)}
                    />
                  }
                  label="Free Trial Available"
                />
              </Grid>

              {batchForm.is_free_trial_available && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Free Trial Classes"
                    type="number"
                    value={batchForm.number_of_free_trial_class}
                    onChange={(e) => handleInputChange('number_of_free_trial_class', Number(e.target.value))}
                    helperText="Number of free classes for trial students"
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };
  const handleAttendanceClick = () => {
    if (selectedRow) {
      navigate(`/dashboard/tea/batch/attendance/${selectedRow.id}`, {
        state: {
          batchName: selectedRow.name,
          batchData: selectedRow
        },
      });
    }
    handleClose();
  };

  const handleStudentsClick = () => {
    if (selectedRow) {
      navigate(`/dashboard/tea/batch/students/${selectedRow.id}`, {
        state: {
          batchName: selectedRow.name,
          batchData: selectedRow
        },
      });
    }
    handleClose();
  };

  // Parse schedule to extract days and times
  const parseSchedule = (schedule: string) => {
    const [daysPart, timePart] = schedule.split(' • ');
    const [startTime, endTime] = timePart ? timePart.split('-') : ['', ''];
    return { days: daysPart, startTime, endTime };
  };

  const columns: GridColDef[] = [
    {
      field: "thumbnail",
      headerName: "",
      width: 80,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          alt="batch"
          sx={{ width: 50, height: 50, borderRadius: 2 }}
          variant="rounded"
        />
      ),
    },
    {
      field: "name",
      headerName: "Batch Name",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="body1" fontWeight="600">
            {params.value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: #{params.row.id.slice(0, 8)}
          </Typography>
        </Box>
      )
    },
    {
      field: "level",
      headerName: "Level",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={
            params.value.toLowerCase() === "advanced" ? "secondary" :
              params.value.toLowerCase() === "intermediate" ? "primary" : "default"
          }
          variant="outlined"
        />
      )
    },
    {
      field: "schedule",
      headerName: "Schedule",
      width: 150,
      renderCell: (params) => {
        const { days, startTime, endTime } = parseSchedule(params.value);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Schedule sx={{ fontSize: 18, mr: 1, color: theme.palette.text.secondary }} />
            <Box>
              <Typography variant="body2" fontWeight="500">
                {startTime} - {endTime}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {days}
              </Typography>
            </Box>
          </Box>
        );
      }
    },
    {
      field: "students",
      headerName: "Students",
      width: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Group sx={{ fontSize: 18, mr: 1, color: theme.palette.text.secondary }} />
          <Box>
            <Typography variant="body2" fontWeight="500">
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.capacity} capacity
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: "is_active",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Active" : "Inactive"}
          size="small"
          color={params.value ? "success" : "default"}
          variant={params.value ? "filled" : "outlined"}
        />
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      renderCell: (params) => (
        <IconButton
          onClick={(e) => handleMenuClick(e, params.row)}
          size="small"
        >
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  // Transform batch data for DataGrid
  const rows = batches.map(batch => ({
    ...batch,
    capacity: batch.capacity,
    schedule: batch.schedule,
    is_active: batch.is_active
  }));

  // Filter rows based on tab and search
  const filteredRows = rows
    .filter(row => {
      if (tabValue === 1) return row.is_active;
      if (tabValue === 2) return !row.is_active;
      return true;
    })
    .filter(row =>
      row.name.toLowerCase().includes(searchText.toLowerCase()) ||
      row.level.toLowerCase().includes(searchText.toLowerCase())
    );

  // Calculate statistics
  const totalBatches = rows.length;
  const activeBatches = rows.filter(b => b.is_active).length;
  const totalStudents = rows.reduce((sum, batch) => sum + batch.students, 0);
  const totalCapacity = rows.reduce((sum, batch) => sum + batch.capacity, 0);
  const occupancyRate = Math.round((totalStudents / totalCapacity) * 100);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="700" color="primary">
            Batch Management
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your yoga classes and student groups
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddDialogOpen}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          }}
        >
          New Batch
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Card
          sx={{
            minWidth: 200,
            flexGrow: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Group sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography color="text.secondary">
                Total Batches
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="700">
              {totalBatches}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            minWidth: 200,
            flexGrow: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PlayArrow sx={{ mr: 1, color: theme.palette.success.main }} />
              <Typography color="text.secondary">
                Active Batches
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="700" color="success.main">
              {activeBatches}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            minWidth: 200,
            flexGrow: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUp sx={{ mr: 1, color: theme.palette.warning.main }} />
              <Typography color="text.secondary">
                Occupancy Rate
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="700" color="warning.main">
              {occupancyRate}%
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            minWidth: 200,
            flexGrow: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Group sx={{ mr: 1, color: theme.palette.info.main }} />
              <Typography color="text.secondary">
                Total Students
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="700" color="info.main">
              {totalStudents}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Info Panel */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: 2
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          About Batch Management
        </Typography>
        <Typography variant="body1" paragraph>
          This dashboard helps you organize and manage your yoga classes. Create different batches for various skill levels,
          track student enrollment, monitor attendance, and manage schedules all in one place.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <AvatarGroup max={4} sx={{ mr: 2 }}>
            {rows.slice(0, 4).map(row => (
              <Avatar key={row.id} src={row.thumbnail || undefined} alt={row.name} />
            ))}
          </AvatarGroup>
          <Typography variant="body2" color="text.secondary">
            Manage {rows.length} batches with {totalStudents} students
          </Typography>
        </Box>
      </Paper>

      {/* Tabs for different views */}
      <Paper sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<Group />} label="All Batches" />
          <Tab icon={<PlayArrow />} label="Active" />
          <Tab icon={<Pause />} label="Paused" />
        </Tabs>
      </Paper>

      {/* Search and Filter Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          placeholder="Search batches..."
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: '100%', sm: 300 } }}
        />
        <IconButton sx={{ display: { xs: 'none', sm: 'flex' } }}>
          <FilterList />
        </IconButton>
      </Box>

      {/* Batch Table */}
      <Paper
        sx={{
          height: 500,
          width: "100%",
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: {
              sortModel: [{ field: 'name', sort: 'asc' }],
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `1px solid ${theme.palette.divider}`,
            },
          }}
        />
      </Paper>


      {/* Add/Edit Batch Dialog */}
      <Dialog
        open={addDialogOpen || editDialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight="600">
              {editDialogOpen ? 'Edit Batch' : 'Create New Batch'}
            </Typography>
            <IconButton onClick={handleDialogClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleBackStep}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button
            onClick={activeStep === steps.length - 1 ? handleSubmit : handleNextStep}
            variant="contained"
            startIcon={activeStep === steps.length - 1 ? <Check /> : undefined}
          >
            {activeStep === steps.length - 1 ? 'Save Batch' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleAttendanceClick}>
          <Schedule sx={{ mr: 1.5 }} /> View Attendance
        </MenuItem>
        <MenuItem onClick={handleStudentsClick}>
          <Group sx={{ mr: 1.5 }} /> Manage Students
        </MenuItem>
        <MenuItem onClick={handleEditDialogOpen}>
          <Edit sx={{ mr: 1.5 }} /> Edit Batch
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          {selectedRow?.is_active ? (
            <>
              <Pause sx={{ mr: 1.5 }} /> Pause Batch
            </>
          ) : (
            <>
              <PlayArrow sx={{ mr: 1.5 }} /> Activate Batch
            </>
          )}
        </MenuItem>
      </Menu>

      {/* Summary Footer */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredRows.length} of {rows.length} batches
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last updated: {new Date().toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default TeacherBatch;