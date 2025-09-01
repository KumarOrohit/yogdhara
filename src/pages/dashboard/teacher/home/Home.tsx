import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  useTheme,
  alpha,
  Chip,
  Avatar,
  IconButton,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from "recharts";
import {
  TrendingUp,
  Group,
  AccountBalance,
  Class,
  Schedule,
  Star,
  PlayArrow,
  Download,
  FilterList,
  PictureAsPdf,
  GridOn,
  ArrowDropDown
} from "@mui/icons-material";
import AnalyticsApiService from "./analyticsService";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface AnalyticsData {
  stats: {
    total_students: number;
    total_earnings: number;
    monthly_earnings: number;
    active_batches: number;
    avg_rating: number;
    total_classes: number;
    growth_rate: number;
  };
  charts: {
    monthly_trend: Array<{ month: string; earnings: number }>;
    batch_distribution: Array<{ name: string; value: number }>;
    performance_data: Array<{ day: string; attendance: number; revenue: number }>;
  };
  tables: {
    promoted_batches: Array<{ batch: string; rank: number; students: number; promotion: string }>;
    upcoming_classes: Array<{ subject: string; time: string; batch: string; duration: string; students: number }>;
  };
}

interface JSPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`teacher-tabpanel-${index}`}
      aria-labelledby={`teacher-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const TeacherHome = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportType, setExportType] = useState<'excel' | 'pdf'>('excel');
  const [exportRange, setExportRange] = useState<'current' | 'all'>('current');
  const navigate = useNavigate();

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setTabValue(newValue);
  };

  const getAnalytics = async () => {
    try {
      setLoading(true);
      const analytics = await AnalyticsApiService.getAnalyticsService();
      if (analytics) {
        setAnalyticsData(analytics);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (!analyticsData) return;

    const workbook = XLSX.utils.book_new();

    // Add stats sheet
    const statsData = [
      ['Metric', 'Value'],
      ['Total Students', analyticsData.stats.total_students],
      ['Total Earnings', analyticsData.stats.total_earnings],
      ['Monthly Earnings', analyticsData.stats.monthly_earnings],
      ['Active Batches', analyticsData.stats.active_batches],
      ['Average Rating', analyticsData.stats.avg_rating],
      ['Total Classes', analyticsData.stats.total_classes],
      ['Growth Rate', analyticsData.stats.growth_rate]
    ];

    const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistics');

    // Add promoted batches sheet
    const promotedBatchesData = [
      ['Batch', 'Rank', 'Students', 'Promotion'],
      ...analyticsData.tables.promoted_batches.map(batch => [
        batch.batch,
        batch.rank,
        batch.students,
        batch.promotion
      ])
    ];

    const batchesSheet = XLSX.utils.aoa_to_sheet(promotedBatchesData);
    XLSX.utils.book_append_sheet(workbook, batchesSheet, 'Promoted Batches');

    // Add upcoming classes sheet
    const classesData = [
      ['Subject', 'Time', 'Batch', 'Duration', 'Students'],
      ...analyticsData.tables.upcoming_classes.map(cls => [
        cls.subject,
        cls.time,
        cls.batch,
        cls.duration,
        cls.students
      ])
    ];

    const classesSheet = XLSX.utils.aoa_to_sheet(classesData);
    XLSX.utils.book_append_sheet(workbook, classesSheet, 'Upcoming Classes');

    // Generate file and download
    const fileName = `Yogdhara_Teacher_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const exportToPDF = () => {
    if (!analyticsData) return;

    const doc = new jsPDF() as JSPDFWithAutoTable;

    // Add Yogdhara branding
    doc.setFillColor(58, 42, 132); // Purple color
    doc.rect(0, 0, 210, 30, 'F');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('YOGDHARA', 105, 15, { align: 'center' });

    // Add title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Teacher Analytics Report', 105, 45, { align: 'center' });

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 55, { align: 'center' });

    // Add statistics table
    autoTable(doc, {
      startY: 65,
      head: [['Metric', 'Value']],
      body: [
        ['Total Students', analyticsData.stats.total_students.toString()],
        ['Total Earnings', `₹${analyticsData.stats.total_earnings.toLocaleString()}`],
        ['Monthly Earnings', `₹${analyticsData.stats.monthly_earnings.toLocaleString()}`],
        ['Active Batches', analyticsData.stats.active_batches.toString()],
        ['Average Rating', analyticsData.stats.avg_rating.toString()],
        ['Total Classes', analyticsData.stats.total_classes.toString()],
        ['Growth Rate', `${analyticsData.stats.growth_rate.toFixed(1)}%`]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [58, 42, 132],
        textColor: 255,
        fontStyle: 'bold'
      }
    });

    // Add promoted batches table
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Batch', 'Rank', 'Students', 'Promotion']],
      body: analyticsData.tables.promoted_batches.map(batch => [
        batch.batch,
        batch.rank.toString(),
        batch.students.toString(),
        batch.promotion
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [58, 42, 132],
        textColor: 255,
        fontStyle: 'bold'
      }
    });

    // Add upcoming classes table
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['Subject', 'Time', 'Batch', 'Duration', 'Students']],
      body: analyticsData.tables.upcoming_classes.map(cls => [
        cls.subject,
        cls.time,
        cls.batch,
        cls.duration,
        cls.students.toString()
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [58, 42, 132],
        textColor: 255,
        fontStyle: 'bold'
      }
    });

    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(
        `Page ${i} of ${pageCount} • Yogdhara Teacher Analytics Report`,
        105,
        287,
        { align: 'center' }
      );
    }

    // Save PDF
    doc.save(`Yogdhara_Teacher_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExportOption = (type: 'excel' | 'pdf') => {
    setExportType(type);
    setExportDialogOpen(true);
    handleExportClose();
  };

  const handleExportConfirm = () => {
    setExportDialogOpen(false);
    if (exportType === 'excel') {
      exportToExcel();
    } else {
      exportToPDF();
    }
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!analyticsData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Failed to load analytics data
        </Typography>
        <Button variant="contained" onClick={getAnalytics} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  const { stats, charts, tables } = analyticsData;

  const statsCards = [
    {
      title: "Total Students",
      value: stats.total_students,
      icon: <Group sx={{ fontSize: 30 }} />,
      color: theme.palette.primary.main,
      trend: stats.growth_rate > 0 ? `+${stats.growth_rate.toFixed(1)}% from last month` : `${stats.growth_rate.toFixed(1)}% from last month`
    },
    {
      title: "Total Earnings",
      value: `₹${stats.total_earnings.toLocaleString()}`,
      icon: <AccountBalance sx={{ fontSize: 30 }} />,
      color: theme.palette.secondary.main,
      trend: "Lifetime earnings"
    },
    {
      title: "This Month Earnings",
      value: `₹${stats.monthly_earnings.toLocaleString()}`,
      icon: <TrendingUp sx={{ fontSize: 30 }} />,
      color: theme.palette.success.main,
      trend: "Current month revenue"
    },
    {
      title: "Active Batches",
      value: stats.active_batches,
      icon: <Class sx={{ fontSize: 30 }} />,
      color: theme.palette.info.main,
      trend: `${tables.promoted_batches.length} promoted batches`
    },
  ];

  // Safe label function for Pie chart
  const renderCustomizedLabel = ({ name, percent }: { name: string; percent?: number }) => {
    return `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="700" color="primary">
            Teacher Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Welcome back! Here's your teaching overview
          </Typography>
        </Box>
        <Box>
          <IconButton sx={{ mr: 1 }}>
            {/* <Notifications /> */}
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Download />}
            endIcon={<ArrowDropDown />}
            onClick={handleExportClick}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            }}
          >
            Export Report
          </Button>

          <Menu
            anchorEl={exportMenuAnchor}
            open={Boolean(exportMenuAnchor)}
            onClose={handleExportClose}
          >
            <MenuItem onClick={() => handleExportOption('excel')}>
              <GridOn sx={{ mr: 1 }} /> Export as Excel
            </MenuItem>
            <MenuItem onClick={() => handleExportOption('pdf')}>
              <PictureAsPdf sx={{ mr: 1 }} /> Export as PDF
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
        <DialogTitle>
          Export {exportType.toUpperCase()} Report
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Data Range</InputLabel>
            <Select
              value={exportRange}
              label="Data Range"
              onChange={(e) => setExportRange(e.target.value as 'current' | 'all')}
            >
              <MenuItem value="current">Current View</MenuItem>
              <MenuItem value="all">All Data</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleExportConfirm} variant="contained">
            Export
          </Button>
        </DialogActions>
      </Dialog>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, i) => (
          <Grid size={{ xs: 12, md: 3, sm: 6 }} key={i}>
            <Card
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(stat.color, 0.1)} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                border: `1px solid ${alpha(stat.color, 0.2)}`,
                borderRadius: 3
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight="700" sx={{ color: stat.color }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{
                    color: stat.color,
                    backgroundColor: alpha(stat.color, 0.1),
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {stat.icon}
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {stat.trend}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs for different views */}
      <Paper sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<TrendingUp />} label="Overview" />
          <Tab icon={<BarChart />} label="Analytics" />
          <Tab icon={<Schedule />} label="Schedule" />
        </Tabs>
      </Paper>

      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Earnings Chart */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Monthly Earnings Trend
                  </Typography>
                  <Chip icon={<FilterList />} label="2025" variant="outlined" />
                </Box>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={charts.monthly_trend}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                    <XAxis dataKey="month" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 8,
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: theme.shadows[3]
                      }}
                    />
                    <Area type="monotone" dataKey="earnings" stroke={theme.palette.primary.main} fill="url(#colorEarnings)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Batch Distribution */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Batch Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={charts.batch_distribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={60}
                      label={renderCustomizedLabel}
                    >
                      {charts.batch_distribution.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Weekly Performance */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Weekly Performance
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={charts.performance_data}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                    <XAxis dataKey="day" stroke={theme.palette.text.secondary} />
                    <YAxis yAxisId="left" stroke={theme.palette.primary.main} />
                    <YAxis yAxisId="right" orientation="right" stroke={theme.palette.secondary.main} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="attendance" fill={theme.palette.primary.main} name="Attendance %" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="revenue" fill={theme.palette.secondary.main} name="Revenue (₹)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Promoted Batches Ranking */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Promoted Batches
                  </Typography>
                  <Chip icon={<Star />} label="Top Performing" color="secondary" size="small" />
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Batch</TableCell>
                      <TableCell>Rank</TableCell>
                      <TableCell>Students</TableCell>
                      <TableCell>Promotion</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tables.promoted_batches.map((b, i) => (
                      <TableRow key={i} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{
                              width: 30,
                              height: 30,
                              mr: 2,
                              bgcolor: COLORS[i % COLORS.length]
                            }}>
                              {b.batch.charAt(0)}
                            </Avatar>
                            {b.batch}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={`#${b.rank}`} color="primary" size="small" />
                        </TableCell>
                        <TableCell>{b.students}</TableCell>
                        <TableCell>
                          <Chip
                            label={b.promotion}
                            size="small"
                            color={
                              b.promotion === "Platinum" ? "secondary" :
                                b.promotion === "Gold" ? "warning" : "default"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Classes */}
          <Grid size={{ xs: 12 }}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Upcoming Classes
                  </Typography>
                  <Button variant="outlined" size="small" onClick={() => navigate("/dashboard/tea/class")}>
                    View All
                  </Button>
                </Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Class</TableCell>
                      <TableCell>Batch</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Students</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tables.upcoming_classes.map((c, i) => (
                      <TableRow key={i} hover>
                        <TableCell>
                          <Typography fontWeight="500">{c.subject}</Typography>
                        </TableCell>
                        <TableCell>{c.batch}</TableCell>
                        <TableCell>{c.time}</TableCell>
                        <TableCell>{c.duration}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Group sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                            {c.students}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            startIcon={<PlayArrow />}
                          >
                            Join
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Analytics Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Advanced Analytics Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Detailed analytics and insights will be available here.
          </Typography>
        </Box>
      </TabPanel>

      {/* Schedule Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Schedule Management Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Class scheduling and calendar view will be available here.
          </Typography>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default TeacherHome;