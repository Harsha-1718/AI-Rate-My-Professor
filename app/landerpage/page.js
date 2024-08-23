'use client'
import { useState } from "react";
import { Button } from "@mui/material";
import SignIn from "../signin/page"; // Adjust the import if necessary
import Image from "next/image";
// import Screen from "../public/Screen.png";
import SignUp from "../signup/page";

export default function landerpage() {

  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', 
        padding:'25px'
      }}
    >
      
      <div style={{ marginRight: '20px', textAlign:'center' }}> {/* Add margin to space between image and sign-in */}
      <h3>Rate My Professor AI</h3>
        <Image 
         src="/Screen.png"
          width={600} 
          height={400} 
          alt="Screen" 
          style={{ objectFit: 'contain',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', }} 
        />
      </div>
      
      {isSignUp ? (
        <SignUp toggleForm={toggleForm} />
      ) : (
        <SignIn toggleForm={toggleForm} />
      )}


    </div>

    
  );
}
