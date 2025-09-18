import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  AppBar,
  useTheme,
  alpha,
  Avatar,
  Divider,
  Chip,
  CircularProgress // Add CircularProgress
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft
} from "@mui/icons-material";
import { useProfileData } from "./context/profileDataContext";
import { useNavigate, useLocation } from "react-router-dom";
import { StudentMenu, TeacherMenu } from "./dashbaordMEnu";
import { useAuth } from "./context/authContext";
import LogoBlue from "./components/LogoBlue";

const drawerWidth = 280;
const collapsedWidth = 80;

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userType, name, profileImage, isLoading } = useProfileData(); // Add isLoading
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Use useMemo for menu items
  const menuItems = React.useMemo(() => {
    console.log("Calculating menu items for userType:", userType);
    return userType === "Teacher" ? TeacherMenu : StudentMenu;
  }, [userType]);

  const toggleDrawer = () => {
    setOpen(!open);
  };


  // Show loading state while profile data is being fetched
  if (isLoading || !userType) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress
          size={60}
          sx={{
            color: theme.palette.primary.main,
            mb: 2
          }}
        />
        <Typography variant="h6" color="textSecondary">
          Loading your dashboard...
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Please wait while we load your information
        </Typography>
      </Box>
    );
  }



  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
          ...(!open && {
            marginLeft: collapsedWidth,
            width: `calc(100% - ${collapsedWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2, color: theme.palette.primary.main }}
            >
              {open ? <ChevronLeft /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap sx={{
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {userType === "Teacher" ? "Teacher Dashboard" : "Student Dashboard"}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <Notifications sx={{ color: theme.palette.text.secondary }} />
              </Badge>
            </IconButton> */}
            <Chip
              avatar={<Avatar src={profileImage} sx={{ width: 30, height: 30 }} />}
              label={name || "User"}
              variant="outlined"
              sx={{
                borderColor: alpha(theme.palette.primary.main, 0.2),
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : collapsedWidth,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: "4px 0 20px rgba(0,0,0,0.05)",
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
          minHeight: '96px !important'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <LogoBlue />

            {open && (
              <Typography variant="h6" sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                textFillColor: "transparent",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                Arogya Ananta
              </Typography>
            )}
          </Box>
        </Toolbar>

        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />

        {/* User Info Section */}
        {open && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={profileImage}
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 2,
                border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            />
            <Typography variant="h6" fontWeight={600}>
              {name || "User Name"}
            </Typography>
            <Chip
              label={userType}
              size="small"
              color={userType === "Teacher" ? "secondary" : "primary"}
              sx={{ mt: 1 }}
            />
          </Box>
        )}

        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.1) }} />

        {/* Navigation Menu */}
        <List sx={{ px: open ? 2 : 1, py: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{
                display: "block",
                mb: 0.5
              }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 52,
                    borderRadius: 2,
                    justifyContent: open ? "initial" : "center",
                    px: open ? 3 : 2,
                    backgroundColor: isActive
                      ? alpha(theme.palette.primary.main, 0.1)
                      : "transparent",
                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                    border: isActive ? `1px solid ${alpha(theme.palette.primary.main, 0.2)}` : 'none',
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      color: theme.palette.primary.main,
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.text}
                      sx={{
                        '& .MuiTypography-root': {
                          fontWeight: isActive ? 600 : 400
                        }
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Footer Section */}
        {open && (
          <Box sx={{ mt: 'auto', p: 3, textAlign: 'center' }}>
            {/* 🚀 Logout Button */}
            <ListItem disablePadding sx={{ mb: 2 }}>
              <ListItemButton
                onClick={() => logout()} // replace with actual logout handler
                sx={{
                  minHeight: 48,
                  borderRadius: 2,
                  justifyContent: "center",
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                  color: theme.palette.error.main,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.error.main, 0.15),
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 2,
                    justifyContent: "center",
                    color: theme.palette.error.main,
                  }}
                >
                  <ChevronLeft /> {/* You can replace with Logout icon */}
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  sx={{
                    "& .MuiTypography-root": { fontWeight: 600 },
                  }}
                />
              </ListItemButton>
            </ListItem>

            <Typography variant="caption" color="text.secondary">
              Arogya Ananta Platform v2.0
            </Typography>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Transform your yoga journey
            </Typography>
          </Box>
        )}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: '96px',
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          color: theme.palette.text.primary,
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
          ...(!open && {
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;