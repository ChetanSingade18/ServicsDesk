import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const VideoPlayer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // New state for visibility

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setIsVisible(false); // Update visibility state to false
  };

  if (!isVisible) return null; // Conditionally render the component

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        width: isExpanded ? '80vw' : '320px',
        height: isExpanded ? '80vh' : '180px',
        backgroundColor: 'black',
        zIndex: 1300,
        transition: 'all 0.3s ease-in-out',
        overflow: 'hidden',
        borderRadius: '16px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          position: 'absolute',
          top: 0,
          width: '100%',
          zIndex: 1,
        }}
      >
        {/* Close Button */}
        <IconButton
          size="small"
          onClick={handleClose} // Change to handleClose
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(50, 50, 50, 0.5)',
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Expand/Collapse Button */}
        <IconButton
          color="inherit"
          size="small"
          onClick={handleToggle}
          sx={{
            backgroundColor: 'rgba(50, 50, 50, 0.5)',
            color: 'white',
          }}
        >
          {isExpanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Box>

      {/* YouTube iframe */}
      <iframe
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/RlPNh_PBZb4?autoplay=1&rel=0&modestbranding=1&showinfo=0&fs=0&iv_load_policy=3&disablekb=1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="YouTube Video"
      />
    </Box>
  );
};

export default VideoPlayer;
