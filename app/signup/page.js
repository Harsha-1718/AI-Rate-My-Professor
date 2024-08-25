'use client'
import { useState } from 'react';
import { Button, TextField, Container, Typography, Alert, Box } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebase/config'; // Import Firestore
import { doc, setDoc } from 'firebase/firestore';
import { FcGoogle } from "react-icons/fc"; // Import Google icon

export default function SignUp({ toggleForm }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

      router.push('/dashboard');
    } catch (error) {
      setError('Error signing up. Please try again.');
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

      router.push('/dashboard');
    } catch (error) {
      setError('Error signing up with Google. Please try again.');
      console.error('Error signing up with Google:', error);
    }
  };

  return (
    <Container
      sx={{
        backgroundColor: 'black',
        color: 'white',
        width: '100%',
        maxWidth: '400px',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: '20px', color: 'white' }}>
        Sign Up
      </Typography>
      <Typography
        variant="body2"
        onClick={toggleForm}
        sx={{
          color: 'white',
          textDecoration: 'underline',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Already have an account?
      </Typography>
      {error && <Alert severity="error" variant="filled" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSignUp} style={{ width: '100%' }}>
        <Box sx={{ marginBottom: '20px' }}>
          <Typography variant="body1" sx={{ color: 'white', marginBottom: '5px' }}>Email</Typography>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: 'white' } }}
            sx={{
              input: { color: 'white', backgroundColor: 'black', border: '1px solid white', borderRadius: '5px' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
              },
            }}
          />
        </Box>
        <Box sx={{ marginBottom: '20px' }}>
          <Typography variant="body1" sx={{ color: 'white', marginBottom: '5px' }}>Password</Typography>
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: 'white' } }}
            sx={{
              input: { color: 'white', backgroundColor: 'black', border: '1px solid white', borderRadius: '5px' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white' },
              },
            }}
          />
        </Box>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: 'white',
              color: 'black',
              '&:hover': {
                backgroundColor: 'black',
                color: 'white',
              },
              flex: '1',
              marginRight: '10px',
            }}
          >
            Sign Up
          </Button>
          <Button
            variant="outlined"
            onClick={handleGoogleSignUp}
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                backgroundColor: 'white',
                color: 'black',
              },
              flex: '1',
            }}
          >
            <FcGoogle style={{ fontSize: '24px' }} />
          </Button>
        </div>
      </form>
    </Container>
  );
}
