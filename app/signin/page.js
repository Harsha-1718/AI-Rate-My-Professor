'use client'
import { useState } from 'react';
import { Button, TextField, Container, Typography, Alert } from '@mui/material';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebase/config'; // Ensure you have db (Firestore) imported
import { doc, getDoc } from 'firebase/firestore';
import { FcGoogle } from "react-icons/fc";



//{ onClose }
export default function SignIn({ toggleForm }) {     
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onClose();
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
        await auth.signOut(); // Sign out the user if they do not exist
        return;
      }

      // onClose();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const handleSignUpRedirect = () => {
    router.push('/signup');
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
      <h2 variant="h4" >
        Welcome back!
      </h2>
      <Typography variant='p'
          onClick={toggleForm}
          style={{
            color: 'blue',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          Don't have an account?
        </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSignIn} style={{ width: '100%' }}>
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
            Sign In
          </Button>
          <Button
          variant="contained"
            onClick={handleGoogleSignIn}
            sx={{
              backgroundColor: 'white', // Google's red color
              color: 'white',
              '&:hover': {
                backgroundColor: '#9FE2BF',
              },
              flex: 1, // Allow buttons to share space equally
            }}
          >
              <FcGoogle  style={{ fontSize: '24px' }} />
          </Button>
        </div>
      </form>
    </Container>
  );
}
