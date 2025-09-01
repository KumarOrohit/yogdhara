import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import HeroVideo from "../../assets/HeroVideo.mp4";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { alpha, useTheme } from "@mui/material/styles";
import {
  PlayCircle,
  TrendingUp,
  People,
  Spa,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface HeroProps {
  levels: Number[];
  learnings: string[];
}

const Hero: React.FC<HeroProps> = ({ levels, learnings }) => {
  const theme = useTheme();
  const [level, setLevel] = useState("");
  const [course, setCourse] = useState("");

  const navigate = useNavigate()

  const handleFilter = () => {
    navigate(`/yoga-hub?selectedCat=${course.toLowerCase().replace(/\s+/g, '-')}`);
  }

  const features = [
    { icon: <Spa />, text: "AI-Powered Personalization" },
    { icon: <PlayCircle />, text: "Personalized Sessions" },
    { icon: <People />, text: "Expert Instructors" },
    { icon: <TrendingUp />, text: "Progress Tracking" }
  ];

  return (
    <Box sx={{ width: "100%", overflow: "hidden", position: "relative"}}>
      {/* Hero Section with Video */}
      <Box sx={{ position: "relative", height: { xs: "90vh", md: "100vh" }, overflow: "hidden" }}>
        {/* Video Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `linear-gradient(to bottom, ${alpha(theme.palette.primary.dark, 0.7)} 0%, ${alpha(theme.palette.secondary.dark, 0.5)} 100%)`,
            zIndex: 1,
          }}
        />
        
        {/* Background Video */}
        <video
          src={HeroVideo}
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />

        {/* Hero Content */}
        <Container
          sx={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            p: 2,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
              fontWeight: 800,
              mb: 2,
              color: "white",
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            Transform Your Practice with{" "}
            <Box
              component="span"
              sx={{
                color: "secondary.main",
                background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.light})`,
                backgroundClip: "text",
                textFillColor: "transparent",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI Yoga
            </Box>
          </Typography>

          <Typography
            variant="h6"
            sx={{
              maxWidth: "800px",
              mb: 4,
              color: "grey.100",
              fontSize: { xs: "1rem", md: "1.25rem" },
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            Discover our intelligent yoga platform offering personalized sessions, 
            real-time feedback, and holistic wellness guidance. Embrace mindfulness 
            with technology designed to enhance your journey.
          </Typography>

          {/* Features Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
              gap: 2,
              mb: 4,
              maxWidth: "800px",
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  color: "white",
                  p: 1,
                }}
              >
                <Box
                  sx={{
                    color: "secondary.main",
                    fontSize: "2rem",
                    mb: 1,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                  {feature.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Floating Search Bar */}
      <Box sx={{ position: "relative", zIndex: 10, mt: { xs: -10, md: -10 } }}>
        <Container>
          <Paper
            elevation={16}
            sx={{
              p: 4,
              borderRadius: 4,
              bgcolor: "background.paper",
              backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.light, 0.2)}`,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Find Your Perfect Practice
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Personalized recommendations based on your goals and experience level
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                alignItems: { md: "end" },
                justifyContent: "center",
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              <FormControl size="medium" sx={{ minWidth: 120, flex: 1 }}>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={level}
                  label="Experience Level"
                  onChange={(e) => setLevel(e.target.value)}
                  sx={{ bgcolor: "white" }}
                >
                  <MenuItem value="">All Levels</MenuItem>
                  {levels.map((lvl) => (
                    <MenuItem key={lvl.toString()} value={lvl.toString()}>
                      {lvl.toString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="medium" sx={{ minWidth: 150, flex: 1 }}>
                <InputLabel>Focus Area</InputLabel>
                <Select
                  value={course}
                  label="Focus Area"
                  onChange={(e) => setCourse(e.target.value)}
                  sx={{ bgcolor: "white" }}
                >
                  <MenuItem value="">All Practices</MenuItem>
                  {learnings.map((learning) => (
                    <MenuItem key={learning} value={learning}>
                      {learning}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowForward />}
                sx={{ 
                  px: 4, 
                  py: 1.5,
                  minHeight: '40px',
                  flexShrink: 0 
                }}
                onClick={handleFilter}
              >
                Find My Practice
              </Button>
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
              Over 500+ classes available for all levels and goals
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container sx={{ py: 8 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 4,
            textAlign: "center",
          }}
        >
          {[
            { number: "10+", label: "Active Practitioners" },
            { number: "50+", label: "Expert Classes" },
            { number: "98%", label: "Satisfaction Rate" },
          ].map((stat, index) => (
            <Box key={index}>
              <Typography
                variant="h3"
                fontWeight="bold"
                color="primary.main"
                gutterBottom
              >
                {stat.number}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;