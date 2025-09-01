import { useState, useEffect } from "react";
import {
  DataGrid,
  type GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Paper,
  Chip,
  Card,
  CardContent,
  useTheme,
  alpha,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  Avatar,
  AvatarGroup,
  CircularProgress
} from "@mui/material";
import {
  Search,
  Group,
  CheckCircle,
  Cancel,
  AccessTime,
  TrendingUp,
  Download,
  Info
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";

interface AttendanceRecord {
  id: number;
  student_name: string;
  class: string;
  joined_at: string;
  left_at: string;
  status: string;
  duration: string;
  profile: string;
}

const Attendance = () => {
  const theme = useTheme();
  const location = useLocation();
  const { batchName, batchData } = location.state || {};
  const [tabValue, setTabValue] = useState(0);
  const [studentFilter, setStudentFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (batchData?.attendance_data) {
      const formattedData = batchData.attendance_data.map((item: any, index: number) => ({
        id: index + 1,
        student_name: item.student_name,
        class: item.class,
        joined_at: item.joined_at,
        left_at: item.left_at,
        status: item.status,
        duration: item.duration,
        profile: item.profile_picture ? item.profile_picture : `https://i.pravatar.cc/150?img=${index + 1}`
      }));
      setAttendanceData(formattedData);
      setLoading(false);
    }
  }, [batchData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setTabValue(newValue);
  };

  // Apply filters
  const filteredRows = attendanceData.filter((row) => {
    const matchesTab = tabValue === 0 ||
      (tabValue === 1 && row.status === "Completed") ||
      (tabValue === 2 && row.status !== "Completed");

    return matchesTab &&
      (studentFilter ? row.student_name === studentFilter : true) &&
      (classFilter ? row.class === classFilter : true) &&
      (searchText ? row.student_name.toLowerCase().includes(searchText.toLowerCase()) ||
        row.class.toLowerCase().includes(searchText.toLowerCase()) : true);
  });

  // Calculate statistics
  const totalStudents = new Set(attendanceData.map(r => r.student_name)).size;
  const presentStudents = new Set(attendanceData.filter(r => r.status === "Completed").map(r => r.student_name)).size;
  const attendanceRate = totalStudents > 0 ? Math.round((presentStudents / totalStudents) * 100) : 0;

  const completedSessions = attendanceData.filter(r => r.status === "Completed");
  const averageDuration = completedSessions.length > 0 ? Math.round(
    completedSessions
      .map(r => parseInt(r.duration?.split(' ')[0] || '0'))
      .reduce((acc, val) => acc + val, 0) / completedSessions.length
  ) : 0;

  const columns: GridColDef[] = [
    {
      field: "profile",
      headerName: "",
      width: 60,
      renderCell: (params) => (
        <Avatar src={params.value} sx={{ width: 40, height: 40 }} />
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: "student_name",
      headerName: "Student Name",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body1" fontWeight="500">
          {params.value}
        </Typography>
      )
    },
    {
      field: "class",
      headerName: "Class",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          variant="outlined"
          color="primary"
        />
      )
    },
    {
      field: "joined_at",
      headerName: "Joined At",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccessTime sx={{ fontSize: 18, mr: 1, color: theme.palette.text.secondary }} />
          <Typography variant="body2">
            {params.value ? new Date(params.value).toLocaleString() : '--'}
          </Typography>
        </Box>
      )
    },
    {
      field: "left_at",
      headerName: "Left At",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value ? new Date(params.value).toLocaleString() : '--'}
        </Typography>
      )
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="500">
          {params.value || '--'}
        </Typography>
      )
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          icon={params.value === "Completed" ? <CheckCircle /> : <Cancel />}
          label={params.value}
          color={params.value === "Completed" ? "success" : "error"}
          variant={params.value === "Completed" ? "filled" : "outlined"}
        />
      ),
    },
  ];

  // Extract unique values for dropdowns
  const uniqueStudents = Array.from(new Set(attendanceData.map((r) => r.student_name)));
  const uniqueClasses = Array.from(new Set(attendanceData.map((r) => r.class)));

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
            Attendance Tracking
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {batchName || "Batch"} • Monitor student participation
          </Typography>
        </Box>
        <IconButton sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
          }
        }}>
          <Download />
        </IconButton>
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
                Total Students
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="700">
              {totalStudents}
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
              <CheckCircle sx={{ mr: 1, color: theme.palette.success.main }} />
              <Typography color="text.secondary">
                Present Students
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="700" color="success.main">
              {presentStudents}
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
                Attendance Rate
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="700" color="warning.main">
              {attendanceRate}%
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
              <AccessTime sx={{ mr: 1, color: theme.palette.info.main }} />
              <Typography color="text.secondary">
                Avg. Duration
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="700" color="info.main">
              {averageDuration} min
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Info sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            About Attendance Tracking
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          This dashboard helps you monitor student participation in your classes. Track who attended each session,
          view participation duration, and identify patterns to improve student engagement.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <AvatarGroup max={4} sx={{ mr: 2 }}>
            {attendanceData.filter(r => r.status === "Completed").slice(0, 4).map(row => (
              <Avatar key={row.id} src={row.profile} alt={row.student_name} />
            ))}
          </AvatarGroup>
          <Typography variant="body2" color="text.secondary">
            {presentStudents} students attended recent classes
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
          <Tab icon={<Group />} label="All Attendance" />
          <Tab icon={<CheckCircle />} label="Present" />
          <Tab icon={<Cancel />} label="Absent" />
        </Tabs>
      </Paper>

      {/* Filters */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          placeholder="Search students or classes..."
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

        <TextField
          select
          label="Filter by Student"
          value={studentFilter}
          onChange={(e) => setStudentFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Students</MenuItem>
          {uniqueStudents.map((student) => (
            <MenuItem key={student} value={student}>
              {student}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Filter by Class"
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Classes</MenuItem>
          {uniqueClasses.map((cls) => (
            <MenuItem key={cls} value={cls}>
              {cls}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Attendance Table */}
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
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: {
              sortModel: [{ field: 'student_name', sort: 'asc' }],
            },
          }}
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
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Summary Footer */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredRows.length} of {attendanceData.length} records
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last updated: {new Date().toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default Attendance;