import React, { useState, useEffect } from "react";
import {
  DataGrid,
  type GridColDef,
  GridToolbar,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  Avatar,
  Typography,
  Box,
  Chip,
  Paper,
  IconButton,
  InputAdornment,
  TextField,
  Card,
  CardContent,
  useTheme,
  alpha,
  Tabs,
  Tab,
  CircularProgress
} from "@mui/material";
import {
  Search,
  FilterList,
  Email,
  CalendarToday,
  Person,
  Group
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";

interface StudentData {
  profile_picture: string | null;
  name: string;
  email: string;
  duration: string;
  join_date: string;
  is_active: boolean;
  classes_attended: number;
}

// Helper function to generate consistent avatar numbers from names
const getAvatarNumber = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 50 + 1;
};

const Student: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const { batchName, batchData } = location.state || {};
  const [searchText, setSearchText] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (batchData?.students_data) {
      setStudents(batchData.students_data);
      setLoading(false);
    }
  }, [batchData]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setTabValue(newValue);
  };

  // Filter students based on search text and tab
  const filteredStudents = students
    .filter(student => {
      if (tabValue === 1) return student.is_active;
      if (tabValue === 2) return !student.is_active;
      return true;
    })
    .filter(student =>
      student.name.toLowerCase().includes(searchText.toLowerCase()) ||
      student.email.toLowerCase().includes(searchText.toLowerCase())
    );

  const columns: GridColDef[] = [
    {
      field: "profile_picture",
      headerName: "Profile",
      width: 80,
      renderCell: (params: GridRenderCellParams) => (
        <Avatar 
          src={params.value || `https://i.pravatar.cc/150?img=${getAvatarNumber(params.row.name || 'user')}`} 
          alt="student" 
          sx={{ width: 40, height: 40 }}
        />
      ),
      sortable: false,
      filterable: false,
    },
    { 
      field: "name", 
      headerName: "Name", 
      width: 180,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body1" fontWeight="500">
          {params.value}
        </Typography>
      )
    },
    { 
      field: "email", 
      headerName: "Email", 
      width: 220,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Email sx={{ fontSize: 18, mr: 1, color: theme.palette.text.secondary }} />
          <Typography variant="body2">
            {params.value}
          </Typography>
        </Box>
      )
    },
    {
      field: "join_date",
      headerName: "Join Date",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarToday sx={{ fontSize: 16, mr: 0.5, color: theme.palette.text.secondary }} />
          <Typography variant="body2">
            {new Date(params.value).toLocaleDateString()}
          </Typography>
        </Box>
      )
    },
    {
      field: "is_active",
      headerName: "Status",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip 
          label={params.value ? 'Active' : 'Inactive'} 
          size="small" 
          color={params.value ? 'success' : 'default'}
          variant={params.value ? 'filled' : 'outlined'}
        />
      )
    },
    {
      field: "classes_attended",
      headerName: "Classes",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" fontWeight="500">
          {params.value}
        </Typography>
      )
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {params.value}
        </Typography>
      )
    },
  ];

  // Calculate statistics
  const activeStudents = students.filter(s => s.is_active).length;
  const totalClassesAttended = students.reduce((total, student) => total + student.classes_attended, 0);
  const avgClassesPerStudent = students.length > 0 ? Math.round(totalClassesAttended / students.length) : 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="primary">
          Students in {batchName || "Batch"}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
            {students.length} students
          </Typography>
          <Chip 
            icon={<Person />} 
            label={`${activeStudents} active`} 
            variant="outlined" 
            size="small" 
            sx={{ mr: 1 }}
          />
        </Box>
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
            <Typography color="text.secondary" gutterBottom>
              Total Students
            </Typography>
            <Typography variant="h4" fontWeight="700">
              {students.length}
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
            <Typography color="text.secondary" gutterBottom>
              Active Students
            </Typography>
            <Typography variant="h4" fontWeight="700" color="success.main">
              {activeStudents}
            </Typography>
          </CardContent>
        </Card>
        <Card 
          sx={{ 
            minWidth: 200, 
            flexGrow: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
          }}
        >
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Total Classes
            </Typography>
            <Typography variant="h4" fontWeight="700" color="secondary.main">
              {totalClassesAttended}
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
            <Typography color="text.secondary" gutterBottom>
              Avg. Classes
            </Typography>
            <Typography variant="h4" fontWeight="700" color="info.main">
              {avgClassesPerStudent}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs for different views */}
      <Paper sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<Group />} label="All Students" />
          <Tab icon={<Person />} label="Active" />
          <Tab icon={<FilterList />} label="Inactive" />
        </Tabs>
      </Paper>

      {/* Search and Filter Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <TextField
          placeholder="Search students..."
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

      {/* Data Grid */}
      <Paper 
        sx={{ 
          height: 500, 
          width: "100%", 
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <DataGrid
          rows={filteredStudents}
          columns={columns}
          getRowId={(row) => row.name + row.email}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
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
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Summary Footer */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredStudents.length} of {students.length} students
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last updated: {new Date().toLocaleDateString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default Student;