'use client'
import { useState } from 'react';
import { Button, TextField, Container, Typography, Alert } from '@mui/material';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebase/config'; // Ensure you have db (Firestore) imported
import { doc, getDoc } from 'firebase/firestore';
import { FcGoogle } from "react-icons/fc";

export default function SignIn({ toggleForm }) {     
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('User does not exist. Please check your email or register.');
      } else {
        setError('Error signing in. Please try again.');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDoc = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        setError('User does not exist. Please sign up first.');
        await auth.signOut();
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <Container
      sx={{
        backgroundColor: 'black',
        borderRadius: '12px',
        padding: '20px',
        width: '400px',
        color: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Optional shadow for a sleek look
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: '20px', color: 'white' }}>
        Welcome back!
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
         Don&apos;t have an account?
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2, backgroundColor: 'black', color: 'white', border: '1px solid white' }}>{error}</Alert>}
      <form onSubmit={handleSignIn} style={{ width: '100%' }}>
        <Typography variant="body1" sx={{ color: 'white', marginBottom: '10px' }}>Email</Typography>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{ style: { color: 'white' } }}
          sx={{
            marginBottom: '20px',
            input: { color: 'white', backgroundColor: 'black', border: '1px solid white', borderRadius: '5px' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
            },
          }}
        />
        <Typography variant="body1" sx={{ color: 'white', marginBottom: '10px' }}>Password</Typography>
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputLabelProps={{ style: { color: 'white' } }}
          sx={{
            marginBottom: '20px',
            input: { color: 'white', backgroundColor: 'black', border: '1px solid white', borderRadius: '5px' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
            },
          }}
        />
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
              flex: 1,
              marginRight: '10px',
            }}
          >
            Sign In
          </Button>
          <Button
            variant="outlined"
            onClick={handleGoogleSignIn}
            sx={{
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                backgroundColor: 'white',
                color: 'black',
              },
              flex: 1,
            }}
          >
            <FcGoogle style={{ fontSize: '24px' }} />
          </Button>
        </div>
      </form>
    </Container>
  );
}
