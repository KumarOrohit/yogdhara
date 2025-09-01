import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Avatar,
    Button,
    IconButton,
    TextField,
    Grid,
    Divider,
    Chip,
    useTheme,
    alpha,
    Fade,
    Slide,
    InputAdornment,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Edit,
    CameraAlt,
    Person,
    Email,
    Phone,
    School,
    CheckCircle,
    Cancel
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import StudentApiService from '../studentApiServie';
import HomeApiService from '../../../home/homeService';

interface StudentProfile {
    name: string;
    user_type: string;
    email: string;
    profile_image: string | null;
    country_code: string | null;
    mobile: string | null;
}

interface EditData extends StudentProfile {
    profile_image_file?: File | null;
}

const StudentProfilePage = () => {
    const theme = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<StudentProfile>({
        name: "None None",
        user_type: "Student",
        email: "idark1406@gmail.com",
        profile_image: null,
        country_code: null,
        mobile: null
    });

    const [editData, setEditData] = useState<EditData>({ ...profile });
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleEdit = () => {
        setEditData({ ...profile });
        setIsEditing(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Prepare form data for the API call
            const formData = new FormData();

            // Append all editable fields
            formData.append('name', editData.name);
            formData.append('email', editData.email);
            if (editData.country_code) {
                formData.append('country_code', editData.country_code);
            }
            if (editData.mobile) {
                formData.append('mobile', editData.mobile);
            }

             if (editData.profile_image_file) {
                formData.append('profile_image', editData.profile_image_file);
            }

            // Make API call to update profile
            const response = await StudentApiService.updateStudentProfile(formData);

            if (response.status === 200) {
                // Update local state with new data
                setProfile({ ...editData });
                setIsEditing(false);
                setPreviewImage(null);
                showSnackbar('Profile updated successfully!', 'success');
            } else {
                throw new Error(response.data?.message || 'Failed to update profile');
            }
        } catch (error: any) {
            console.error('Error updating profile:', error);
            showSnackbar(error.message || 'Failed to update profile. Please try again.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setPreviewImage(null);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploading(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                setPreviewImage(imageUrl);
                setEditData(prev => ({ 
                    ...prev, 
                    profile_image: imageUrl,
                    profile_image_file: file // Store the actual file object
                }));
                setUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (field: keyof StudentProfile, value: string) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    };

    const getStudentProfileData = async () => {
        try {
            setLoading(true);
            const response = await HomeApiService.getUserBasicInfoService();

            if (response.status === 200) {
                // Update profile state with API data
                setProfile({
                    name: response.name || "None None",
                    user_type: response.user_type || "Student",
                    email: response.email || "idark1406@gmail.com",
                    profile_image: response.profile_image || null,
                    country_code: response.country_code || null,
                    mobile: response.mobile || null
                });
            } else {
                showSnackbar('Failed to load profile data', 'error');
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            showSnackbar('Error loading profile data', 'error');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getStudentProfileData();
    }, []);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Slide direction="down" in={true} timeout={800}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h2" fontWeight="900" gutterBottom sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Student Profile
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Manage your personal information and account settings
                    </Typography>
                </Box>
            </Slide>

            <Grid container spacing={4}>
                {/* Left Side - Profile Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Fade in={true} timeout={1000}>
                        <Paper elevation={8} sx={{
                            borderRadius: 4,
                            overflow: 'hidden',
                            background: `linear-gradient(145deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                        }}>
                            {/* Profile Header */}
                            <Box sx={{
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                p: 4,
                                textAlign: 'center',
                                position: 'relative'
                            }}>
                                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Avatar
                                            src={isEditing ? previewImage || undefined : profile.profile_image || undefined}
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                border: `4px solid ${theme.palette.background.paper}`,
                                                backgroundColor: theme.palette.primary.main,
                                                fontSize: '2.5rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {getInitials(profile.name)}
                                        </Avatar>
                                    </motion.div>

                                    {isEditing && (
                                        <IconButton
                                            component="label"
                                            sx={{
                                                position: 'absolute',
                                                bottom: 8,
                                                right: 8,
                                                backgroundColor: theme.palette.background.paper,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.background.default
                                                }
                                            }}
                                        >
                                            {uploading ? (
                                                <CircularProgress size={20} />
                                            ) : (
                                                <CameraAlt color="primary" />
                                            )}
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>

                            {/* Profile Content */}
                            <Box sx={{ p: 4 }}>
                                <Typography variant="h5" fontWeight="700" gutterBottom align="center">
                                    {isEditing ? editData.name : profile.name}
                                </Typography>

                                <Chip
                                    icon={<School />}
                                    label={profile.user_type}
                                    color="primary"
                                    variant="filled"
                                    sx={{ mb: 3, fontWeight: 600 }}
                                />

                                <Box sx={{ mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Email sx={{ mr: 2, color: 'primary.main' }} />
                                        <Typography variant="body1">
                                            {isEditing ? editData.email : profile.email}
                                        </Typography>
                                    </Box>

                                    {(profile.mobile || isEditing) && (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Phone sx={{ mr: 2, color: 'primary.main' }} />
                                            <Typography variant="body1">
                                                {isEditing ? editData.mobile || 'Not set' : profile.mobile || 'Not set'}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                {!isEditing ? (
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<Edit />}
                                        onClick={handleEdit}
                                        size="large"
                                        sx={{
                                            borderRadius: 3,
                                            py: 1.5,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            startIcon={saving ? <CircularProgress size={16} /> : <CheckCircle />}
                                            onClick={handleSave}
                                            size="large"
                                            sx={{ borderRadius: 3, py: 1.5 }}
                                            disabled={saving}
                                        >
                                            {saving ? 'Saving...' : 'Save'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            startIcon={<Cancel />}
                                            onClick={handleCancel}
                                            size="large"
                                            sx={{ borderRadius: 3, py: 1.5 }}
                                            disabled={saving}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Fade>
                </Grid>

                {/* Right Side - Details and Stats */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Fade in={true} timeout={1200}>
                        <Box>
                            {/* Profile Details Card */}
                            <Paper elevation={4} sx={{
                                p: 4,
                                borderRadius: 4,
                                background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`
                            }}>
                                <Typography variant="h5" fontWeight="700" gutterBottom sx={{ mb: 3 }}>
                                    Profile Information
                                </Typography>

                                {isEditing ? (
                                    <Box component="form" sx={{ mt: 3 }}>
                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Full Name"
                                                    value={editData.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Person color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Email Address"
                                                    type="email"
                                                    value={editData.email}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Email color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Country Code"
                                                    placeholder="+91"
                                                    value={editData.country_code || ''}
                                                    onChange={(e) => handleInputChange('country_code', e.target.value)}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Mobile Number"
                                                    type="tel"
                                                    value={editData.mobile || ''}
                                                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Phone color="primary" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Box sx={{ mb: 3 }}>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Full Name
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="500">
                                                        {profile.name}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Box sx={{ mb: 3 }}>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Email Address
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="500">
                                                        {profile.email}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Box sx={{ mb: 3 }}>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Phone Number
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="500">
                                                        {profile.mobile || 'Not provided'}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Box sx={{ mb: 3 }}>
                                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                        Account Type
                                                    </Typography>
                                                    <Chip
                                                        label={profile.user_type}
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        <Divider sx={{ my: 3 }} />

                                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            Complete your profile by adding your contact information and updating your details.
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>

                            {/* Empty State Illustration */}
                            {!profile.mobile && !isEditing && (
                                <Fade in={true} timeout={1500}>
                                    <Paper sx={{
                                        p: 4,
                                        mt: 4,
                                        textAlign: 'center',
                                        background: `linear-gradient(145deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.info.main, 0.02)} 100%)`,
                                        border: `2px dashed ${alpha(theme.palette.info.main, 0.3)}`,
                                        borderRadius: 4
                                    }}>
                                        <Box sx={{ fontSize: 64, color: 'info.main', mb: 2 }}>
                                            📱
                                        </Box>
                                        <Typography variant="h6" color="info.main" gutterBottom>
                                            Complete Your Profile
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            Add your contact information to make your profile complete and stay connected.
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="info"
                                            startIcon={<Edit />}
                                            onClick={handleEdit}
                                        >
                                            Add Contact Info
                                        </Button>
                                    </Paper>
                                </Fade>
                            )}
                        </Box>
                    </Fade>
                </Grid>
            </Grid>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default StudentProfilePage;