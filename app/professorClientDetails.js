'use client';

import { useRouter } from 'next/navigation';
import { Box, Grid, Button, Typography, Paper, Divider } from '@mui/material';
import Sentiment from 'sentiment';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function ProfessorDetailClient({ professorData }) {
  const router = useRouter();
  const sentiment = new Sentiment();

  // Sentiment analysis on reviews
  const sentimentData = analyzeReviews(professorData.reviews);

  // Create chart data
  const chartData = createChartData(sentimentData);

  function OnClickButton() {
    router.push('/dashboard');
  }

  return (
    <Box sx={{ padding: 4, bgcolor: '#f0f2f5', minHeight: '100vh' }}>
      <Grid container spacing={4}>
        {/* Top Section */}
        <Grid item xs={12} textAlign="left">
          <Button 
            variant="contained" 
            onClick={OnClickButton}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              borderRadius: '8px',
              padding: '10px 20px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                backgroundColor: 'grey',
              },
            }}
          >
            Back to Dashboard
          </Button>
        </Grid>

        {/* Middle Section */}
        <Grid item xs={12}>
          <Grid container spacing={4}>
            {/* Middle Left Section (70%) */}
            <Grid item xs={8.4}>
              <Paper sx={{ backgroundColor: 'black', padding: 6, borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Typography 
                  variant="h2" 
                  sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold', color: 'white', marginBottom: 2 }}
                >
                  {professorData.name}
                </Typography>
                <Divider sx={{ marginBottom: 2, borderColor: 'white' }} />
                <Typography 
                  variant="h4" 
                  sx={{ fontFamily: 'Roboto, sans-serif', color: 'white' }}
                >
                  {<b>Department:</b>} {professorData.department}
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ fontFamily: 'Roboto, sans-serif', color: 'white' }}
                >
                  {<b>Rating:</b>} {professorData.rating}
                </Typography>
              </Paper>
            </Grid>

            {/* Middle Right Section (30%) */}
            <Grid item xs={3.6}>
              <Paper sx={{ backgroundColor: 'black', padding: 2, borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Typography color='white' variant='h5'>
                  {<b>Sentiment Analysis</b>}
                </Typography>
                <Pie 
                  data={chartData} 
                  options={{ 
                    plugins: { 
                      legend: { 
                        display: true, 
                        position: 'bottom',
                        labels: {
                          color: 'white', // Change legend text color to white
                        },
                      } 
                    }, 
                    aspectRatio: 1 
                  }} 
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Grid item xs={12}>
          <Paper sx={{ backgroundColor: 'black', padding: 2, borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <Typography 
              variant="h4" 
              sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold', color: 'white', marginBottom: 2 }}
            >
              Reviews:
            </Typography>
            <Divider sx={{ marginBottom: 2, borderColor: 'white' }} />
            {professorData.reviews.map((review, index) => (
              <Typography 
                key={index}
                variant="h6" 
                sx={{ fontFamily: 'Roboto, sans-serif', color: 'white', marginBottom: 1 }}
              >
                {review}
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

function analyzeReviews(reviews) {
  const sentiment = new Sentiment();
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;

  reviews.forEach(review => {
    const result = sentiment.analyze(review);
    if (result.score > 0) {
      positiveCount += 1;
    } else if (result.score < 0) {
      negativeCount += 1;
    } else {
      neutralCount += 1;
    }
  });

  return { positive: positiveCount, negative: negativeCount, neutral: neutralCount };
}

function createChartData(sentimentData) {
  return {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [sentimentData.positive, sentimentData.negative, sentimentData.neutral],
        backgroundColor: ['#4caf50', '#f44336', '#ffeb3b'], // Colors for positive, negative, neutral
      },
    ],
  };
}

export default ProfessorDetailClient;
