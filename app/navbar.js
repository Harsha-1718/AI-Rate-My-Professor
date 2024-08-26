// app/components/Navbar.js
'use client'
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Typography, Box, Link, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useAuth } from './context/authContext'; // Custom hook to access user data
import { signOut } from 'firebase/auth';
import { auth } from './firebase/config';
import { useRouter } from 'next/navigation';


const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to home page immediately after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  


  return (
    <AppBar position="static"  sx={{ backgroundColor: 'black' }} >
      <Toolbar>
      <Link href={user ? '/dashboard' : '/landerpage'}>
      <Box
              component="img"
              src="/ProfessorLogo.jpg" // Update with your logo's path
              alt="RateGenius Logo"
              sx={{ width: 45, height: 45, mr: 1 }} // Adjust size and spacing
            />
        </Link>
        <Typography variant="h6" style={{ flexGrow: 1 }} textAlign={'center'}>
          RateGenius
        </Typography>
        {user ? (
          <>
            <Typography  style={{ marginRight: '20px' }}>
              {`Welcome, ${user.email}`}
            </Typography>
            <Button color="inherit" onClick={handleSignOut} sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: 'red',
              }, border:'2px solid white'
            }}>
              Sign Out
            </Button>
          </>
        ) 
        :(<></>)
        }
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
