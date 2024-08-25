'use client';
import { useState } from "react";
import { Button } from "@mui/material";
import SignIn from "../signin/page"; // Adjust the import if necessary
import Image from "next/image";
import SignUp from "../signup/page";
import { motion } from "framer-motion";
import { useAuth } from '../context/authContext'; // Import your auth hook
import { useRouter } from 'next/navigation';

export default function Landerpage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { user } = useAuth(); // Get the user from auth context
  const router = useRouter();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '25px'
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        style={{ marginRight: '20px', textAlign: 'center' }}
      >
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Rate My Professor AI
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/Screen.png"
            width={600}
            height={400}
            alt="Screen"
            style={{ objectFit: 'contain', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        {user ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoToDashboard}
            fullWidth
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: 'grey',
                color:'black'
              }, 
            }}
          >
            Go to Dashboard
          </Button>
        ) : isSignUp ? (
          <SignUp toggleForm={toggleForm} />
        ) : (
          <SignIn toggleForm={toggleForm} />
        )}
      </motion.div>
    </div>
  );
}
