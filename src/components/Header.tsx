import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Login,
  Spa,
  Home,
} from '@mui/icons-material';
import { useAuth } from '../context/authContext';
import LoginModal from './home/LoginModal';
import HomeApiService from '../pages/home/homeService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProfileData } from '../context/profileDataContext';
import LogoWhite from './LogoWhite';

const pages = [
  { name: 'Home', path: '/', icon: <Home sx={{ fontSize: 18, mr: 1 }} /> },
  { name: 'Yoga Hub', path: '/yoga-hub', icon: <Spa sx={{ fontSize: 18, mr: 1 }} /> },
  // { name: 'Blog', path: '/blog', icon: <Article sx={{ fontSize: 18, mr: 1 }} /> }
];

const settings = [
  { name: 'Dashboard', icon: <Spa sx={{ fontSize: 20, mr: 1.5 }} /> },
  { name: 'Logout', icon: <Login sx={{ fontSize: 20, mr: 1.5 }} /> }
];

function Header() {
  const theme = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const { name, email, profileImage, userType } = useProfileData();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorElLogin, setAnchorElLogin] = React.useState<null | HTMLElement>(null);
  const [openLogin, setOpenLogin] = React.useState(false);
  const [loginType, setLoginType] = React.useState<"STU" | "TEA" | null>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);   
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (path?: string) => {
    setAnchorElNav(null);
    if (path) {
      navigate(path);
    }
  };

  const handleCloseUserMenu = (name: string) => {
    setAnchorElUser(null);
    if (name == "Dashboard") {
      if (loginType == "STU" || userType == "Student") {
        navigate("/dashboard/stu/home")
      }
      else{
        navigate("/dashboard/tea/home")
      }
    }
    if(name == "Logout") {
      logout();
    }
    
  };

  const handleOpenLoginMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLogin(event.currentTarget);
  };

  const handleCloseLoginMenu = () => {
    setAnchorElLogin(null);
  };

  const handleSelectLogin = (type: "STU" | "TEA") => {
    setLoginType(type);
    setAnchorElLogin(null);
    setOpenLogin(true);
  };

  const handleGetOtp = async (email: string) => {
    if (loginType) {
      const response = await HomeApiService.getOtpService(email, loginType);
      return response.status === 200;
    }
  };

  const handleVerifyOtp = async (email: string, otp: string) => {
    const response = await HomeApiService.verifyOtpService(email, otp);
    if (response.status === 200) {
      localStorage.setItem("auth_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
      window.dispatchEvent(new Event('localStorageAccesChange'));
      navigate("/dashboard/tea/home");
    }
  };

  React.useEffect(() => {
  }, [isAuthenticated])

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: alpha(theme.palette.primary.main, 0.95),
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderBottom: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 1 }}>
            {/* Logo and Brand Name */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
              <LogoWhite />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  ml: 1,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'inherit',
                  fontWeight: 700,
                  color: theme.palette.common.white,
                  textDecoration: 'none',
                  background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.common.white})`,
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Yogdhara
              </Typography>
            </Box>

            {/* Mobile Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                onClick={handleOpenNavMenu}
                sx={{ color: theme.palette.common.white }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={() => handleCloseNavMenu()}
                sx={{ display: { xs: 'block', md: 'none' } }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: theme.shadows[3]
                  }
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.name}
                    onClick={() => handleCloseNavMenu(page.path)}
                    selected={location.pathname === page.path}
                    sx={{
                      py: 1.5,
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {page.icon}
                      <Typography>{page.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Mobile Brand Name */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'inherit',
                fontWeight: 700,
                color: theme.palette.common.white,
                textDecoration: 'none',
              }}
            >
              Yogdhara
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => handleCloseNavMenu(page.path)}
                  startIcon={page.icon}
                  sx={{
                    my: 2,
                    mx: 0.5,
                    color: theme.palette.common.white,
                    borderRadius: 2,
                    px: 2,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.common.white, 0.1),
                    },
                    ...(location.pathname === page.path && {
                      backgroundColor: alpha(theme.palette.secondary.main, 0.2),
                      color: theme.palette.secondary.light,
                    })
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* Right side (user / login) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isAuthenticated ? (
                <>
                  {/* <Tooltip title="Notifications">
                    <IconButton sx={{ color: theme.palette.common.white }}>
                      <Badge badgeContent={4} color="secondary">
                        <Notifications />
                      </Badge>
                    </IconButton>
                  </Tooltip> */}

                  <Tooltip title="Account settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }}>
                      <Avatar
                        alt={name}
                        src={profileImage ? profileImage : "/static/images/avatar/2.jpg"}
                        sx={{
                          width: 40,
                          height: 40,
                          border: `2px solid ${alpha(theme.palette.secondary.main, 0.3)}`
                        }}
                      />
                    </IconButton>
                  </Tooltip>

                  <Menu
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: theme.shadows[3]
                      }
                    }}
                  >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <Typography variant="subtitle1" fontWeight="600">
                        {name  || "Welcome"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {email || "Member"}
                      </Typography>
                    </Box>

                    {settings.map((setting) => (
                      (
                        <MenuItem
                          key={setting.name}
                          onClick={() =>handleCloseUserMenu(setting.name)}
                          sx={{ py: 1.5 }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {setting.icon}
                            <Typography variant="body2">{setting.name}</Typography>
                          </Box>
                        </MenuItem>
                      )
                    ))}
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleOpenLoginMenu}
                    variant="outlined"
                    startIcon={<Login />}
                    sx={{
                      color: theme.palette.common.white,
                      borderColor: alpha(theme.palette.common.white, 0.3),
                      borderRadius: 2,
                      px: 3,
                      '&:hover': {
                        borderColor: theme.palette.common.white,
                        backgroundColor: alpha(theme.palette.common.white, 0.1),
                      }
                    }}
                  >
                    Login
                  </Button>

                  <Menu
                    anchorEl={anchorElLogin}
                    open={Boolean(anchorElLogin)}
                    onClose={handleCloseLoginMenu}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 160,
                        borderRadius: 2,
                        boxShadow: theme.shadows[3]
                      }
                    }}
                  >
                    <MenuItem
                      onClick={() => handleSelectLogin("STU")}
                      sx={{ py: 1.5 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccountCircle sx={{ mr: 1.5, color: theme.palette.primary.main }} />
                        <Typography variant="body2">Student Login</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleSelectLogin("TEA")}
                      sx={{ py: 1.5 }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Spa sx={{ mr: 1.5, color: theme.palette.secondary.main }} />
                        <Typography variant="body2">Teacher Login</Typography>
                      </Box>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Login Modal */}
      <LoginModal
        open={openLogin}
        handleClose={() => setOpenLogin(false)}
        handleGetOtp={handleGetOtp}
        handleVerifyOtp={handleVerifyOtp}
      />
    </>
  );
}

export default Header;