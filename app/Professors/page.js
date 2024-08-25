import { Grid, Card, CardHeader, CardContent, Typography, Button, CardActions } from '@mui/material';
import Link from 'next/link';

const professors = [
  { id: 1, name: 'Dr. John Doe', university: 'University of Texas', rating: 4.5, shortDescription: 'Expert in AI and Machine Learning.' },
  { id: 2, name: 'Dr. Jane Smith', university: 'University of Colorado', rating: 4.2, shortDescription: 'Specializes in Quantum Computing.' },
  // Add more professor data here
];

function ProfessorList() {
  return (
    <Grid container spacing={3}>
      {professors.map(professor => (
        <Grid item xs={12} sm={6} md={4} key={professor.id}>
          <Card 
            sx={{ 
              cursor: 'pointer', 
              bgcolor: "black", 
              color: "white", 
              borderRadius: 2, 
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', 
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.5)',
              }
            }} 
            elevation={8}
          >
            <CardHeader 
              title={professor.name}
              subheader={professor.university}
              sx={{
                color: "white",
                backgroundImage: 'linear-gradient(to right, #434343, #000000)',
                padding: 'px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              subheaderTypographyProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
            />
            <CardContent sx={{ padding: '16px' }}>
              <Typography variant="body1" color="white" sx={{ marginBottom: 1 }}>
                <strong>Quality Rating:</strong> {professor.rating} ★
              </Typography>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                {professor.shortDescription}
              </Typography>
            </CardContent>
            <CardActions sx={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <Link href={`/professor/${professor.id}`} passHref>
                <Button 
                  size="small" 
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    backgroundColor: '#1e1e1e',
                    '&:hover': {
                      backgroundColor: '#3d3d3d',
                    }
                  }}
                  variant="outlined"
                >
                  View More
                </Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ProfessorList;
