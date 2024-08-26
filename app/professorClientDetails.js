'use client';

import { useRouter } from 'next/navigation';
import { Box, Grid, Button, Typography } from '@mui/material';
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
            <Grid item xs={3.5} textAlign="center">
              <Pie data={chartData} />
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
          {professorData.reviews.map((review, index) => (
            <Typography 
              key={index}
              variant="body1" 
              sx={{ fontFamily: 'Arial, sans-serif', color: 'gray' }}
            >
              {review}
            </Typography>
          ))}
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
        label: 'Sentiment Analysis',
        data: [sentimentData.positive, sentimentData.negative, sentimentData.neutral],
        backgroundColor: ['#4caf50', '#f44336', '#ffeb3b'], // Colors for positive, negative, neutral
      },
    ],
  };
}

export default ProfessorDetailClient;
