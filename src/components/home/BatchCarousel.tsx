import { 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Divider, 
  IconButton, 
  LinearProgress, 
  Typography,
  Chip,
  Rating,
  useTheme,
  alpha,
  Button
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  People,
  Schedule,
  TrendingUp
} from "@mui/icons-material";

interface DataSet {
  heading: string;
  description?: string;
  list: any[];
}

interface CarouselProps {
  dataSet: DataSet;
}

const BatchCarousel: React.FC<CarouselProps> = ({ dataSet }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [showArrows, setShowArrows] = useState(false);

  const cardWidth = 320; // card width (px)
  const cardGap = 24; // gap between cards (px)
  const totalCardWidth = cardWidth + cardGap;
  const visibleCards = 3.5; // show 3 full + half of next

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

  useEffect(() => {
    const checkArrows = () => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current;
        setShowArrows(scrollWidth > clientWidth);
      }
    };

    checkArrows();
    window.addEventListener('resize', checkArrows);
    return () => window.removeEventListener('resize', checkArrows);
  }, [dataSet]);

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
          {dataSet?.heading}
        </Typography>
        
        {dataSet?.description && (
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
            {dataSet.description}
          </Typography>
        )}
        
        <Divider 
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
        {showArrows && (
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
            maxWidth: { xs: "100%", md: `${totalCardWidth * visibleCards}px` },
            px: { xs: 1, md: 2 },
            py: 3,
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {dataSet?.list.map((data: any) => (
            <Card
              key={data?.id}
              sx={{
                minWidth: cardWidth,
                maxWidth: cardWidth,
                height: 420,
                flexShrink: 0,
                borderRadius: 4,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                scrollSnapAlign: "start",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                "&:hover": { 
                  transform: "translateY(-8px)",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
                  '& .play-icon': {
                    opacity: 1,
                    transform: 'scale(1.1)'
                  }
                },
                position: 'relative'
              }}
            >
              {/* Image with overlay */}
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={data.thumbnail ? data.thumbnail : data.profile_image}
                  alt={data.name}
                  sx={{ 
                    borderTopLeftRadius: 16, 
                    borderTopRightRadius: 16,
                    objectFit: 'cover'
                  }}
                />
                
                {/* Hover play button */}
                {/* <Box 
                  className="play-icon"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0,
                    transition: 'all 0.3s ease',
                    color: 'white',
                    backgroundColor: alpha(theme.palette.common.black, 0.6),
                    borderRadius: '50%',
                    p: 1
                  }}
                >
                  <PlayCircle sx={{ fontSize: 48 }} />
                </Box> */}

                {/* Top badges */}
                <Box sx={{ 
                  position: 'absolute', 
                  top: 12, 
                  left: 12, 
                  display: 'flex', 
                  gap: 1 
                }}>
                  {data.isPopular && (
                    <Chip 
                      icon={<TrendingUp />} 
                      label="Popular" 
                      size="small" 
                      color="secondary"
                      sx={{ backgroundColor: alpha(theme.palette.secondary.main, 0.9), color: 'white' }}
                    />
                  )}
                  {data.isNew && (
                    <Chip 
                      label="New" 
                      size="small" 
                      color="primary"
                      sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.9), color: 'white' }}
                    />
                  )}
                </Box>
              </Box>

              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Typography 
                  variant="h6" 
                  color="text.primary" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    height: 28,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {data.name}
                </Typography>

                {/* Rating and students */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating 
                      value={data.rating || 4.5} 
                      readOnly 
                      size="small" 
                      precision={0.5}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      ({data.rating || 4.5})
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <People sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {data.students || 10}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Description or learnings */}
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    height: 40,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    mb: 2
                  }}
                >
                  {data.description || data.learning?.join(' • ')}
                </Typography>

                {/* Duration and level */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  {data.duration && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {data.duration}
                      </Typography>
                    </Box>
                  )}
                  
                  {data.level && (
                    <Chip 
                      label={data.level} 
                      size="small" 
                      variant="outlined" 
                      color="primary"
                    />
                  )}
                </Box>

                {/* Price and action */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary.main" fontWeight={600}>
                    {data.price ? `₹${data.price}` : 'Free'}
                  </Typography>
                  
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Enroll Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Right Arrow */}
        {showArrows && (
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

        {/* View All Button */}
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => navigate('/yoga-hub')}
          sx={{ 
            borderRadius: 3,
            px: 3
          }}
        >
          View All
        </Button>
      </Box>
    </Box>
  );
};

export default BatchCarousel;