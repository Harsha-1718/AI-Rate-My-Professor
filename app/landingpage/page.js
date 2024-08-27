'use client';
import { useState } from 'react';
import Image from "next/image";
import { Button } from "@mui/material";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { useAuth } from '../context/authContext'; // Adjust the import path as needed
 // Import the Loading component

export default function Landingpage() {
  const { user } = useAuth(); // Get user from auth context
  const router = useRouter();
  
  const handleButtonClick = () => {
    
    setTimeout(() => {
      if (user) {
        router.push('/dashboard'); // Navigate to dashboard if user is signed in
      } else {
        router.push('/landerpage'); // Navigate to /landerpage if user is not signed in
      }
    }, 1000); // Simulate a short delay before navigation (optional)
  };

 
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '25px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        style={{ textAlign: 'center', marginRight: '120px' }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Welcome to RateGenius
        </motion.h1>
        <motion.h6
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Your Smart Professor Insight Engine is Ready to Assist
        </motion.h6>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Button
            color="inherit"
            sx={{
              border: '2px solid white',
              backgroundColor: 'black',
              color: 'white',
              marginRight: '13px',
              '&:hover': {
                backgroundColor: 'grey'
              },
            }}
            onClick={handleButtonClick}
          >
            Ask the Genius <FaArrowRight />
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        style={{ marginLeft: '20px', textAlign: 'center' }}
      >
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          RateGenius
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
    </div>
  );
}
