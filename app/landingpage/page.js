'use client'
import Image from "next/image";
import { Button } from "@mui/material";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from 'next/navigation';

export default function Landingpage() {
    const router = useRouter();

  const handleButtonClick = () => {
    router.push('/landerpage'); // Navigate to the /lander page
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
      <div style={{ textAlign: 'center', marginRight:'120px' }}>
        <h1>Welcome to Rate My <br /> Professor AI</h1>
        <h6>Your AI Companion is ready</h6>

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
            }}  onClick={handleButtonClick}
          >
            Ask our AI <FaArrowRight />
          </Button>

      </div>

      <div style={{ marginLeft: '20px', textAlign: 'center' }}> {/* Adjust margin for spacing */}
        <h3>Rate My Professor AI</h3>
        <Image
          src="/Screen.png"
          width={600}
          height={400}
          alt="Screen"
          style={{ objectFit: 'contain', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}
        />
      </div>
    </div>
  );
}
