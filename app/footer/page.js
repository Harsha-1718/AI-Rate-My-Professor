'use client'
import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import { useAuth } from '../context/authContext';
import { useRouter } from 'next/navigation';

const Footer = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleAboutUsClick = (e) => {
    e.preventDefault();
    if (user) {
      router.push('/about'); 
    } else {
      router.push('/landerpage'); 
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        p: 2,
        backgroundColor: 'black',
        color: 'white',
        textAlign: 'center',
        borderTop: '5px solid white',
        mt: 'auto'
      }}
    >
      <Typography variant="body1">
        © 2024 RateGenius
      </Typography>
      <Link 
        href="/about"
        onClick={handleAboutUsClick} 
        sx={{ color: 'white', textDecoration: 'none', '&:hover': { color: 'grey' } }}
      >
        About Us
      </Link>
    </Box>
  );
};

export default Footer;
