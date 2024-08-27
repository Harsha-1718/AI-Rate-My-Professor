'use client';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      width="100vw"
      bgcolor="rgba(0, 0, 0, 0.8)" // Black background with some transparency
      position="fixed" // Overlay the entire page
      top={0}
      left={0}
      zIndex={1000} // Ensure it overlays on top of other content
    >
      <motion.div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ color: 'white' }} // White color for the spinner
        />
      </motion.div>
      
      <motion.div
        style={{
          position: 'absolute',
          bottom: '10%',
          textAlign: 'center',
          width: '100%',
          color: 'white',
          fontSize: '1.2rem',
          letterSpacing: '0.1rem',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        Loading, please wait...
      </motion.div>
    </Box>
  );
}
