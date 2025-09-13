import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

interface MeetingDetails {
    id: string;
    title: string;
    instructor: string;
    startTime: string;
    endTime: string;
}



const MeetingPreview: React.FC = () => {
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const location = useLocation();
  const meetingDeatils = location.state?.classData as MeetingDetails;
  const navigate = useNavigate();

  // Initialize webcam video preview on mount
  useEffect(() => {
    
    const initMedia = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(userStream);
        if (videoRef.current) {
          videoRef.current.srcObject = userStream;
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };

    initMedia();

    return () => {
      // Cleanup stream on unmount
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleClassClick = () => {
      navigate(`/meeting/${meetingDeatils.id}`, { state: { classData: meetingDeatils } });
    };

  // Toggle mute audio
  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = muted));
      setMuted(!muted);
    }
  };

  // Toggle video on/off
  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = videoOff));
      setVideoOff(!videoOff);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        my: 5,
        p: 3,
        borderRadius: 3,
        boxShadow: theme.shadows[4],
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Meeting Info */}
      {meetingDeatils && <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="700" gutterBottom>
          {meetingDeatils.title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 1 }}>
          {/* <Avatar src={dummyMeeting.instructor_avatar} alt={dummyMeeting.instructor} sx={{ width: 48, height: 48 }} /> */}
          <Box textAlign="left">
            <Typography variant="subtitle1" fontWeight="600">
              Instructor: {meetingDeatils.instructor}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {meetingDeatils.startTime} {meetingDeatils.endTime}
            </Typography>
          </Box>
        </Box>
      </Box>}

      {/* Video Preview with Controls */}
      <Box sx={{ position: "relative", mb: 3, borderRadius: 3, overflow: "hidden", boxShadow: theme.shadows[3] }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: "100%",
            height: 360,
            objectFit: "cover",
            filter: videoOff ? "brightness(0) saturate(100%)" : "none",
            backgroundColor: theme.palette.grey[900],
            transition: "filter 0.3s",
          }}
        />
        {videoOff && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: alpha(theme.palette.common.white, 0.85),
              backgroundColor: alpha(theme.palette.grey[900], 0.7),
              py: 1,
              px: 2,
              borderRadius: 1,
              fontWeight: 600,
              fontSize: "1.2rem",
            }}
          >
            Video Off
          </Box>
        )}
      </Box>

      {/* Controls */}
      <Stack direction="row" justifyContent="center" spacing={4} mb={4}>
        <Tooltip arrow title={muted ? "Unmute microphone" : "Mute microphone"}>
          <IconButton onClick={toggleMute} color={muted ? "error" : "primary"} sx={{ fontSize: 32 }}>
            {muted ? <MicOff fontSize="inherit" /> : <Mic fontSize="inherit" />}
          </IconButton>
        </Tooltip>
        <Tooltip arrow title={videoOff ? "Turn video on" : "Turn video off"}>
          <IconButton onClick={toggleVideo} color={videoOff ? "error" : "primary"} sx={{ fontSize: 32 }}>
            {videoOff ? <VideocamOff fontSize="inherit" /> : <Videocam fontSize="inherit" />}
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Join Button */}
      <Box textAlign="center">
        <Button variant="contained" size="large" color="primary" sx={{ px: 6, fontWeight: 700 }}
        onClick={() => handleClassClick()}>
          Join Meeting
        </Button>
      </Box>
    </Box>
  );
};

export default MeetingPreview;
