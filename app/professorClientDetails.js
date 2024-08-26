'use client';

import { useRouter } from 'next/navigation';
import { Box, Grid, Button, Typography } from '@mui/material';

function ProfessorDetailClient({ professorData }) {
  const router = useRouter();

  function OnClickButton(){
    router.push('/dashboard');
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={4}>
        {/* Top Section */}
        <Grid item xs={12} textAlign="left">
          <Button 
            variant="contained" 
            onClick={OnClickButton}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              border: '1px solid white',
              '&:hover': {
                backgroundColor: 'white',
                color: 'black',
              },
            }}
          >
            Back to Dashboard
          </Button>
        </Grid>

        {/* Middle Section */}
        <Grid item xs={12}>
          <Grid container spacing={4}>
            {/* Middle Left Section */}
            <Grid item xs={6}>
              <Typography 
                variant="h4" 
                sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}
              >
                {professorData.name}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ fontFamily: 'Arial, sans-serif', color: 'gray' }}
              >
                Department: {professorData.department}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ fontFamily: 'Arial, sans-serif', color: 'gray' }}
              >
                Rating: {professorData.rating}
              </Typography>
            </Grid>

            {/* Middle Right Section */}
            <Grid item xs={6} textAlign="center">
              {/* Replace this with your actual graph */}
              <Typography variant="body1" sx={{ fontFamily: 'Arial, sans-serif' }}>
                [Graph Placeholder]
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Grid item xs={12}>
          <Typography 
            variant="h5" 
            sx={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}
          >
            Reviews:
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ fontFamily: 'Arial, sans-serif', color: 'gray' }}
          >
            {professorData.reviews}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfessorDetailClient;
