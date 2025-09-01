import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  useTheme,
  alpha,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Switch,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Spa,
  Email,
  Phone,
  Edit,
  Add,
  CheckCircle,
  Pending,
  WorkspacePremium,
  Instagram,
  Facebook,
  YouTube,
  Save,
  Cancel,
  Delete,
  Person,
  Link
} from '@mui/icons-material';
import { CloudUpload } from '@mui/icons-material';
import HomeApiService from '../../../home/homeService';
import TeacherApiService from '../teacherApiService';

// ------------------ Types ------------------
interface Certification {
  name: string;
  file: string;
  is_verified: boolean;
  certFile: File | null;
}

interface InstructorData {
  name: string;
  user_type: string;
  email: string;
  profile_image: string;
  country_code: string;
  mobile: string;
  about: string;
  experience: number;
  instagram_link: string;
  facebook_link: string;
  youtube_link: string;
  certification: Certification[];
}

interface CertState {
  name: string;
  file: string;
  is_verified: boolean;
  certFile: File | null;
}

// ------------------ Dialog Components ------------------
const EditProfileDialog = ({
  open,
  onClose,
  instructor,
  setInstructor,
  profileImageFile,
  setProfileImageFile,
  isLoading,
  handleSaveProfile
}: any) => {
  console.log(profileImageFile);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="600">Edit Profile</Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{xs:12}}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={instructor.profile_image}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                disabled={isLoading}
              >
                Upload Profile Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setProfileImageFile(file);
                      const imageUrl = URL.createObjectURL(file);
                      setInstructor({ ...instructor, profile_image: imageUrl });
                    }
                  }}
                />
              </Button>
            </Box>
          </Grid>

          <Grid size={{xs:12, sm:6}}>
            <TextField
              fullWidth
              label="Full Name"
              value={instructor.name}
              onChange={(e) => setInstructor({ ...instructor, name: e.target.value })}
              disabled={isLoading}
            />
          </Grid>

          <Grid size={{xs:12, sm:6}}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={instructor.email}
              onChange={(e) => setInstructor({ ...instructor, email: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
              disabled={isLoading}
            />
          </Grid>

          <Grid size={{xs:12, sm:6}}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl sx={{ width: '30%' }}>
                <InputLabel>Country Code</InputLabel>
                <Select
                  value={instructor.country_code}
                  label="Country Code"
                  onChange={(e) => setInstructor({ ...instructor, country_code: e.target.value })}
                  disabled={isLoading}
                >
                  <MenuItem value="+91">+91 (India)</MenuItem>
                  <MenuItem value="+1">+1 (USA)</MenuItem>
                  <MenuItem value="+44">+44 (UK)</MenuItem>
                </Select>
              </FormControl>
              <TextField
                sx={{ width: '70%' }}
                label="Mobile Number"
                value={instructor.mobile}
                onChange={(e) => setInstructor({ ...instructor, mobile: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
                disabled={isLoading}
              />
            </Box>
          </Grid>

          <Grid size={{xs:12, sm:6}}>
            <TextField
              fullWidth
              label="Years of Experience"
              type="number"
              value={instructor.experience}
              onChange={(e) => setInstructor({ ...instructor, experience: parseInt(e.target.value) || 0 })}
              disabled={isLoading}
            />
          </Grid>

          <Grid size={{xs:12}}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="About Me"
              value={instructor.about}
              onChange={(e) => setInstructor({ ...instructor, about: e.target.value })}
              disabled={isLoading}
            />
          </Grid>

          <Grid size={{xs:12 , sm:6}}>
            <TextField
              fullWidth
              label="Instagram Link"
              value={instructor.instagram_link}
              onChange={(e) => setInstructor({ ...instructor, instagram_link: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Instagram />
                  </InputAdornment>
                ),
              }}
              disabled={isLoading}
            />
          </Grid>

          <Grid size={{xs:12, sm:6}}>
            <TextField
              fullWidth
              label="Facebook Link"
              value={instructor.facebook_link}
              onChange={(e) => setInstructor({ ...instructor, facebook_link: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Facebook />
                  </InputAdornment>
                ),
              }}
              disabled={isLoading}
            />
          </Grid>

          <Grid size={{xs:12}}>
            <TextField
              fullWidth
              label="YouTube Link"
              value={instructor.youtube_link}
              onChange={(e) => setInstructor({ ...instructor, youtube_link: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <YouTube />
                  </InputAdornment>
                ),
              }}
              disabled={isLoading}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<Cancel />} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={() => handleSaveProfile(instructor)}
          variant="contained"
          startIcon={<Save />}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CertificationDialog = ({
  open,
  onClose,
  newCert,
  setNewCert,
  editingCert,
  setEditingCert,
  handleAddCertification,
  handleEditCertification,
  isLoading
}: any) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight="600">
          {editingCert ? 'Edit Certification' : 'Add Certification'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Certification Name"
            value={editingCert ? editingCert.name : newCert.name}
            onChange={(e) => editingCert
              ? setEditingCert({ ...editingCert, name: e.target.value })
              : setNewCert({ ...newCert, name: e.target.value })
            }
            sx={{ mb: 3 }}
            disabled={isLoading}
          />

          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              disabled={isLoading}
            >
              Upload Certificate File
              <input
                type="file"
                hidden
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const fileUrl = URL.createObjectURL(file);
                    if (editingCert) {
                      setEditingCert({ ...editingCert, file: fileUrl, certFile: file });
                    } else {
                      setNewCert({ ...newCert, file: fileUrl, certFile: file });
                    }
                  }
                }}
              />
            </Button>
            {(editingCert?.file || newCert.file) && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                File selected: {(editingCert?.file || newCert.file).split('/').pop()}
              </Typography>
            )}
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={editingCert ? editingCert.is_verified : newCert.is_verified}
                onChange={(e) => editingCert
                  ? setEditingCert({ ...editingCert, is_verified: e.target.checked })
                  : setNewCert({ ...newCert, is_verified: e.target.checked })
                }
                disabled={isLoading}
              />
            }
            label="Verified Certification"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<Cancel />} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={editingCert ? handleEditCertification : handleAddCertification}
          variant="contained"
          startIcon={editingCert ? <Save /> : <Add />}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : (editingCert ? 'Update Certification' : 'Add Certification')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ------------------ Main Component ------------------
const InstructorProfile = () => {
  const theme = useTheme();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [newCert, setNewCert] = useState<CertState>({
    name: '',
    file: '',
    is_verified: false,
    certFile: null,
  });
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isLoading, setIsLoading] = useState(true);

  const [instructor, setInstructor] = useState<InstructorData>({
    name: "",
    user_type: "",
    email: "",
    profile_image: "",
    country_code: "",
    mobile: "",
    about: "",
    experience: 0,
    instagram_link: "",
    facebook_link: "",
    youtube_link: "",
    certification: []
  });

  // Fetch instructor data from API
  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        setIsLoading(true);
        const response = await HomeApiService.getUserBasicInfoService();

        if (response.status === 200) {
          setInstructor({
            name: response.name || "",
            user_type: response.user_type || "",
            email: response.email || "",
            profile_image: response.profile_image || "",
            country_code: response.country_code || "+91",
            mobile: response.mobile || "",
            about: response.about || "",
            experience: response.experience || 0,
            instagram_link: response.instagram_link || "",
            facebook_link: response.facebook_link || "",
            youtube_link: response.youtube_link || "",
            certification: response.certification || []
          });
        } else {
          setSnackbar({ open: true, message: 'Failed to load profile data', severity: 'error' });
        }
      } catch (error) {
        console.error('Error fetching instructor data:', error);
        setSnackbar({ open: true, message: 'Error loading profile data', severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstructorData();
  }, []);

  const handleSaveProfile = async (updatedData: Partial<InstructorData>) => {
    try {
      setIsLoading(true);
      // Prepare form data for API call
      const formData = new FormData();

      // Append all updated fields to formData
      Object.entries(updatedData).forEach(([key, value]) => {
        if (key !== 'certification' && key !== 'profile_image') {
          formData.append(key, value as string);
        }
      });

      // If a new profile image was selected, append it
      if (profileImageFile) {
        formData.append('profile_image', profileImageFile);
      }

      // Make API call to update profile
      const response = await HomeApiService.updateUserProfileService(formData);

      if (response.status === 200) {
        setInstructor({ ...instructor, ...updatedData });
        setEditDialogOpen(false);
        setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({ open: true, message: 'Error updating profile', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCertification = async () => {
    if (newCert.name && newCert.file) {
      try {
        setIsLoading(true);
        // Prepare certification data for API
        const certData = new FormData();
        certData.append("name", newCert.name)
        if (newCert.certFile)
          certData.append("file", newCert.certFile)
        certData.append("is_verified", newCert.is_verified.toString())

        // API call to add certification
        const response = await TeacherApiService.addCertificate(certData);

        if (response.status === 200) {
          setInstructor({
            ...instructor,
            certification: [
              ...instructor.certification,
              newCert
            ]
          });
          setNewCert({ name: '', file: '', is_verified: false, certFile: null });
          setCertDialogOpen(false);
          setSnackbar({ open: true, message: 'Certification added successfully', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: 'Failed to add certification', severity: 'error' });
        }
      } catch (error) {
        console.error('Error adding certification:', error);
        setSnackbar({ open: true, message: 'Error adding certification', severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditCertification = async () => {
    if (editingCert && editingCert.name && editingCert.file) {
      try {
        setIsLoading(true);

        const certData = new FormData();
        certData.append("name", editingCert.name)
        if (editingCert.certFile)
          certData.append("file", editingCert.certFile)
        certData.append("is_verified", editingCert.is_verified.toString())
        // API call to update certification
        const response = await TeacherApiService.addCertificate(certData);

        if (response.status === 200) {
          setInstructor({
            ...instructor,
            certification: instructor.certification.map(cert =>
              cert === editingCert ? editingCert : cert
            )
          });
          setEditingCert(null);
          setCertDialogOpen(false);
          setSnackbar({ open: true, message: 'Certification updated successfully', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: 'Failed to update certification', severity: 'error' });
        }
      } catch (error) {
        console.error('Error updating certification:', error);
        setSnackbar({ open: true, message: 'Error updating certification', severity: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteCertification = async (certToDelete: Certification) => {
    try {
      setIsLoading(true);
      // API call to delete certification
      const response = await TeacherApiService.deleteCertificationService(certToDelete);

      if (response.status === 200) {
        setInstructor({
          ...instructor,
          certification: instructor.certification.filter(cert => cert !== certToDelete)
        });
        setSnackbar({ open: true, message: 'Certification deleted successfully', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to delete certification', severity: 'error' });
      }
    } catch (error) {
      console.error('Error deleting certification:', error);
      setSnackbar({ open: true, message: 'Error deleting certification', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditCertDialog = (cert: Certification) => {
    setEditingCert(cert);
    setCertDialogOpen(true);
  };

  const openAddCertDialog = () => {
    setEditingCert(null);
    setNewCert({ name: '', file: '', is_verified: false, certFile: null });
    setCertDialogOpen(true);
  };
  if (isLoading && !instructor.name) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Profile Header */}
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
          <Box sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar
                    src={instructor.profile_image}
                    sx={{
                      width: 150,
                      height: 150,
                      border: `4px solid ${theme.palette.background.paper}`,
                      boxShadow: theme.shadows[4],
                      mb: 2
                    }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setEditDialogOpen(true)}
                    sx={{ mb: 3 }}
                    disabled={isLoading}
                  >
                    Edit Profile
                  </Button>

                  {/* Social Media */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    {instructor.instagram_link && (
                      <IconButton
                        color="primary"
                        onClick={() => window.open(instructor.instagram_link, '_blank')}
                        disabled={isLoading}
                      >
                        <Instagram />
                      </IconButton>
                    )}
                    {instructor.facebook_link && (
                      <IconButton
                        color="primary"
                        onClick={() => window.open(instructor.facebook_link, '_blank')}
                        disabled={isLoading}
                      >
                        <Facebook />
                      </IconButton>
                    )}
                    {instructor.youtube_link && (
                      <IconButton
                        color="primary"
                        onClick={() => window.open(instructor.youtube_link, '_blank')}
                        disabled={isLoading}
                      >
                        <YouTube />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h3" fontWeight="800" gutterBottom>
                      {instructor.name}
                    </Typography>
                    <Chip
                      icon={<Person />}
                      label={instructor.user_type}
                      sx={{ mb: 2, mr: 1 }}
                    />
                    <Chip
                      icon={<Spa />}
                      label={`${instructor.experience} years experience`}
                      sx={{ mb: 2 }}
                    />
                  </Box>
                </Box>

                <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                  {instructor.about}
                </Typography>

                {/* Contact Information */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>Contact Information</Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Email sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">{instructor.email}</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body1">{instructor.country_code} {instructor.mobile}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Certifications Section */}
        <Paper elevation={2} sx={{ borderRadius: 3, p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight="700">
              Certifications
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={openAddCertDialog}
              disabled={isLoading}
            >
              Add Certification
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            {instructor.certification.map((cert, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: `2px solid ${cert.is_verified ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.warning.main, 0.2)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <WorkspacePremium
                          sx={{
                            fontSize: 32,
                            color: cert.is_verified ? 'success.main' : 'warning.main',
                            mr: 2
                          }}
                        />
                        <Box>
                          <Typography variant="h6" fontWeight="600">
                            {cert.name}
                          </Typography>
                          <Button
                            size="small"
                            startIcon={<Link />}
                            onClick={() => window.open(cert.file, '_blank')}
                            sx={{ mt: 0.5 }}
                            disabled={isLoading}
                          >
                            View Certificate
                          </Button>
                        </Box>
                      </Box>
                      <Chip
                        icon={cert.is_verified ? <CheckCircle /> : <Pending />}
                        label={cert.is_verified ? "Verified" : "Pending"}
                        color={cert.is_verified ? "success" : "warning"}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => openEditCertDialog(cert)}
                        disabled={isLoading}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteCertification(cert)}
                        disabled={isLoading}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {instructor.certification.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <WorkspacePremium sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No certifications added yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add your certifications to showcase your expertise to students
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={openAddCertDialog}
                disabled={isLoading}
              >
                Add Your First Certification
              </Button>
            </Box>
          )}
        </Paper>
        <EditProfileDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          instructor={instructor}
          setInstructor={setInstructor}
          profileImageFile={profileImageFile}
          setProfileImageFile={setProfileImageFile}
          isLoading={isLoading}
          handleSaveProfile={handleSaveProfile}
        />

        {/* Certification Dialog */}
        <CertificationDialog
          open={certDialogOpen}
          onClose={() => {
            setCertDialogOpen(false);
            setEditingCert(null);
          }}
          newCert={newCert}
          setNewCert={setNewCert}
          editingCert={editingCert}
          setEditingCert={setEditingCert}
          handleAddCertification={handleAddCertification}
          handleEditCertification={handleEditCertification}
          isLoading={isLoading}
        />


        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity as any}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default InstructorProfile;