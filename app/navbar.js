// app/components/Navbar.js
'use client'
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Typography, Box, Link, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { useAuth } from './context/authContext'; // Custom hook to access user data
import { signOut } from 'firebase/auth';
import { auth } from './firebase/config';
import { useRouter } from 'next/navigation';
// import SignIn from './signin/page';
// import SignUp from './signup/page';

const Navbar = () => {
  const { user } = useAuth(); // Access the user object
  // const [openSignIn, setOpenSignIn] = useState(false);
  // const [openSignUp, setOpenSignUp] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/'); // Redirect to home page immediately after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  

  // const handleOpenSignIn = () => setOpenSignIn(true);
  // const handleCloseSignIn = () => setOpenSignIn(false);

  // const handleOpenSignUp = () => setOpenSignUp(true);
  // const handleCloseSignUp = () => setOpenSignUp(false);

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
        // : (
        //   <>
        //     <Button color="inherit"  onClick={handleOpenSignIn} sx={{
        //       border:'2px solid white', marginRight:'13px','&:hover': {
        //         backgroundColor: 'grey'
        //       }, 
              
        //     }}>
        //       Sign In
        //     </Button>
        //     <Button color="inherit" onClick={handleOpenSignUp} sx={{
        //       border:'2px solid white','&:hover': {
        //         backgroundColor: 'grey'}
        //     }}>
        //       Sign Up
        //     </Button>
        //   </>
        // )
        :(<></>)
        }
      </Toolbar>


      {/* <Dialog open={openSignIn} onClose={handleCloseSignIn}>

        <DialogContent>
          <SignIn onClose={handleCloseSignIn} />
        </DialogContent>
      </Dialog>


      <Dialog open={openSignUp} onClose={handleCloseSignUp} >

        <DialogContent>
          <SignUp onClose={handleCloseSignUp} />
        </DialogContent>
      </Dialog> */}
    </AppBar>
  );
};

export default Navbar;
