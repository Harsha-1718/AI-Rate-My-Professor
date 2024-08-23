'use client'
import { useState } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebase/config'; // Import Firestore
import { doc, setDoc } from 'firebase/firestore';
import { FcGoogle } from "react-icons/fc"; // Import Google icon

export default function SignUp({toggleForm}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: new Date(),
      });

      // onClose();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        createdAt: new Date(),
      });

      // onClose();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing up with Google:', error);
    }
  };

  return (
    <Container
    sx={{
      backgroundColor: 'white',
      color: 'black',
      width: '400px',
      height: '300px',
      // border: '3px solid black',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      // alignItems: 'center',
      padding: '20px',
    }}
    >
      <h2 variant="h5" fontSize={'20px'}  mb={3}>
        Sign Up
      </h2>
      <Typography variant='p'
          onClick={toggleForm}
          style={{
            color: 'blue',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          Already have an account?
        </Typography>
      <form onSubmit={handleSignUp} style={{ width: '100%' }}>
      <h5>Email</h5>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: '20px' }}
        />
        <h5>Password</h5>
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: '20px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: '#9FE2BF',
                color: 'black',
              },
              flex: 1, // Allow buttons to share space equally
              marginRight: '10px',
            }}
          >
            Sign Up
          </Button>
          <Button
            variant="contained"
            onClick={handleGoogleSignUp}
            sx={{
              backgroundColor: 'white', // Google's red color
              color: 'white',
              '&:hover': {
                backgroundColor: '#9FE2BF',
              },
              flex: 1, // Allow buttons to share space equally
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FcGoogle style={{ fontSize: '24px' }} /> {/* Increase the icon size */}
          </Button>
        </div>
      </form>
    </Container>
  );
}
