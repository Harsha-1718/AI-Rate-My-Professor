import { Grid, Card, CardHeader, CardContent, Typography, Button, CardActions } from '@mui/material';
import Link from 'next/link';

function ProfessorList({ professordata }) {
  return (
    <Grid container spacing={3}>
      {professordata.map((professor) => (
        <Grid item xs={12} sm={6} key={professor.professor.name}>
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
              title={professor.professor.name} 
              subheader={professor.professor.university} 
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
                <strong>Quality Rating:</strong> {professor.professor.rating} ★
              </Typography>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                {professor.professor.department}
              </Typography>
            </CardContent>
            <CardActions sx={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <Link href={`/Professors/${encodeURIComponent(professor.professor.name)}`} passHref>
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
