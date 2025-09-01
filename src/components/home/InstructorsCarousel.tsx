import { 
  Box, 
  Card, 
  CardContent, 
  Avatar, 
  Typography,
  Chip,
  Rating,
  useTheme,
  alpha,
  IconButton,
  LinearProgress
} from "@mui/material";
import React, { useRef, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Spa,
  WorkspacePremium,
  Instagram,
  Facebook,
  YouTube
} from "@mui/icons-material";

interface Instructor {
  id: number;
  name: string;
  profile_image: string;
  specialty: string;
  experience: string;
  rating: number;
  students: number;
  classes: number;
  certifications?: string[];
  bio?: string;
  social_media?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}

interface InstructorsCarouselProps {
  instructors: Instructor[];
  title?: string;
  description?: string;
}

const InstructorsCarousel: React.FC<InstructorsCarouselProps> = ({ 
  instructors, 
  title = "Meet Our Expert Instructors",
  description = "Learn from certified yoga teachers with years of experience and specialized training."
}) => {
  const theme = useTheme();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  const cardWidth = 320;
  const cardGap = 24;
  const totalCardWidth = cardWidth + cardGap;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const scrolled = (scrollLeft / (scrollWidth - clientWidth)) * 100;
    setProgress(scrolled);
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = dir === "left" ? -totalCardWidth : totalCardWidth;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const displayInstructors = instructors.length > 0 ? instructors : [
    {
      id: 1,
      name: "Priya Sharma",
      profile_image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      specialty: "Hatha, Vinyasa & Prenatal Yoga",
      experience: "8",
      rating: 4.9,
      students: 1245,
      classes: 42,
      certifications: ["RYT 500", "Prenatal Yoga Certified", "Yin Yoga Teacher"],
      bio: "Specializing in helping students build strength and flexibility through mindful practice.",
      social_media: {
        instagram: "https://instagram.com/priyayoga",
        facebook: "https://facebook.com/priyayoga"
      }
    }
  ];

  return (
    <Box 
      sx={{ 
        px: { xs: 2, sm: 4, md: 8, lg: 12 }, 
        py: 6,
        background: `linear-gradient(180deg, ${alpha(theme.palette.background.default, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`,
        borderRadius: 4,
        mx: { xs: 1, md: 2 },
        mt: 4
      }}
    >
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "primary.main",
            mb: 1,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            textFillColor: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title}
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: "600px",
            mx: "auto",
            mb: 3,
            lineHeight: 1.6
          }}
        >
          {description}
        </Typography>
        
        <Box 
          sx={{ 
            width: '80px', 
            height: '4px', 
            backgroundColor: 'secondary.main', 
            mx: 'auto',
            borderRadius: 2,
            mb: 3
          }} 
        />
      </Box>

      {/* Carousel Container */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          '&:hover .carousel-arrow': {
            opacity: 1,
            transform: 'translateY(-50%) scale(1)'
          }
        }}
      >
        {/* Left Arrow */}
        {displayInstructors.length > 3 && (
          <IconButton
            className="carousel-arrow"
            onClick={() => scroll("left")}
            sx={{
              position: "absolute",
              left: { xs: -10, md: -20 },
              top: "50%",
              transform: "translateY(-50%) scale(0.9)",
              zIndex: 10,
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              boxShadow: 3,
              opacity: 0.7,
              transition: 'all 0.3s ease',
              width: 48,
              height: 48,
              '&:hover': { 
                backgroundColor: theme.palette.background.paper,
                transform: "translateY(-50%) scale(1.05)",
                opacity: 1
              },
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        )}

        {/* Carousel Content */}
        <Box
          ref={scrollRef}
          onScroll={handleScroll}
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: `${cardGap}px`,
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            maxWidth: { xs: "100%", md: `${totalCardWidth * 3.5}px` },
            px: { xs: 1, md: 2 },
            py: 3,
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {displayInstructors.map((instructor) => (
            <Card
              key={instructor.id}
              sx={{
                minWidth: cardWidth,
                maxWidth: cardWidth,
                flexShrink: 0,
                borderRadius: 4,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                scrollSnapAlign: "start",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                "&:hover": { 
                  transform: "translateY(-8px)",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
                },
                display: 'flex',
                flexDirection: 'column',
                // Remove fixed height to allow content to determine height
                minHeight: '500px', // Set a minimum instead of fixed height
              }}
            >
              {/* Instructor Image & Basic Info */}
              <Box sx={{ 
                p: 3, 
                textAlign: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.1)} 100%)`,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16
              }}>
                <Avatar
                  src={instructor.profile_image}
                  alt={instructor.name}
                  sx={{
                    width: 100,
                    height: 100,
                    mx: 'auto',
                    mb: 2,
                    border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`
                  }}
                />
                
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {instructor.name}
                </Typography>
                
                <Chip 
                  icon={<Spa />} 
                  label={instructor.specialty} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                  <Rating 
                    value={instructor.rating} 
                    readOnly 
                    size="small" 
                    precision={0.1}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({instructor.rating})
                  </Typography>
                </Box>
              </Box>

              <CardContent sx={{ 
                p: 3, 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                // Ensure content doesn't overflow
                overflow: 'hidden'
              }}>
                {/* Stats */}
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary.main" fontWeight={600}>
                      {instructor.experience}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Experience
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="secondary.main" fontWeight={600}>
                      {instructor.students || 10}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Students
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main" fontWeight={600}>
                      {instructor.classes || 58}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Classes
                    </Typography>
                  </Box>
                </Box>

                {/* Certifications */}
                {instructor.certifications && instructor.certifications.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Certifications:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {instructor.certifications.slice(0, 2).map((cert, index) => (
                        <Chip
                          key={index}
                          icon={<WorkspacePremium sx={{ fontSize: 16 }} />}
                          label={cert}
                          size="small"
                          variant="outlined"
                          color="secondary"
                          sx={{ fontSize: '0.7rem', height: 24 }}
                        />
                      ))}
                      {instructor.certifications.length > 2 && (
                        <Chip
                          label={`+${instructor.certifications.length - 2} more`}
                          size="small"
                          variant="filled"
                          sx={{ fontSize: '0.7rem', height: 24 }}
                        />
                      )}
                    </Box>
                  </Box>
                )}

                {/* Bio */}
                {instructor.bio && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      flexGrow: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {instructor.bio}
                  </Typography>
                )}

                {/* Social Media */}
                {instructor.social_media && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 1, 
                    mt: 'auto',
                    mb: 2
                  }}>
                    {instructor.social_media.instagram && (
                      <IconButton size="small" color="primary" onClick={() => window.open(instructor.social_media ? instructor.social_media.instagram : "", '_blank', 'noopener,noreferrer')}>
                        <Instagram />
                      </IconButton>
                    )}
                    {instructor.social_media.facebook && (
                      <IconButton size="small" color="primary" onClick={() => window.open(instructor.social_media ? instructor.social_media.facebook : "", '_blank', 'noopener,noreferrer')}>
                        <Facebook />
                      </IconButton>
                    )}
                    {instructor.social_media.youtube && (
                      <IconButton size="small" color="primary" onClick={() => window.open(instructor.social_media ? instructor.social_media.youtube : "", '_blank', 'noopener,noreferrer')}>
                        <YouTube />
                      </IconButton>
                    )}
                  </Box>
                )}

            
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Right Arrow */}
        {displayInstructors.length > 3 && (
          <IconButton
            className="carousel-arrow"
            onClick={() => scroll("right")}
            sx={{
              position: "absolute",
              right: { xs: -10, md: -20 },
              top: "50%",
              transform: "translateY(-50%) scale(0.9)",
              zIndex: 10,
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              boxShadow: 3,
              opacity: 0.7,
              transition: 'all 0.3s ease',
              width: 48,
              height: 48,
              '&:hover': { 
                backgroundColor: theme.palette.background.paper,
                transform: "translateY(-50%) scale(1.05)",
                opacity: 1
              },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        )}
      </Box>

      {/* Progress and navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mt: 3 }}>
        {/* Progress Bar */}
        <Box sx={{ flexGrow: 1, maxWidth: { xs: "100%", md: "400px" } }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              "& .MuiLinearProgress-bar": {
                borderRadius: 3,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
              backgroundColor: alpha(theme.palette.divider, 0.3),
            }}
          />
        </Box>

    
      </Box>
    </Box>
  );
};

export default InstructorsCarousel;