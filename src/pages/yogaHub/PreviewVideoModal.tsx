import React from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Paper,
  Fade
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface VideoModalProps {
  videoUrl: string;
  open: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperComponent={Paper}
      PaperProps={{
        elevation: 24,
        sx: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          overflow: 'visible',
          maxHeight: '80vh'
        }
      }}
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      {/* Close Button */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: -12,
          top: -12,
          backgroundColor: 'error.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'error.dark',
            transform: 'scale(1.1)'
          },
          zIndex: 1301,
          width: 40,
          height: 40
        }}
      >
        <Close />
      </IconButton>

      <DialogContent 
        sx={{ 
          p: 0, 
          overflow: 'hidden',
          '&:first-of-type': {
            paddingTop: 0
          }
        }}
      >
        <Box
          component="video"
          controls
          autoPlay
          src={videoUrl}
          sx={{
            width: '100%',
            height: 'auto',
            maxHeight: '70vh',
            display: 'block',
            outline: 'none',
            borderRadius: 1
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;