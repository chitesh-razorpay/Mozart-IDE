import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid, Button} from '@mui/material';
import { styled } from '@mui/system';



const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  boxShadow: theme.shadows[3],
  transition: 'box-shadow 0.3s',
  '&:hover': {
    boxShadow: theme.shadows[5],
  },
}));

const LearnPage = () => {
  const learnData = [
    {
      id: 1,
      title: 'Create Configs',
      description: 'Learn how to create configurations for your application using the Config tab.',
      image: 'https://dummyimage.com/300x200/ccc/000',
    },
    {
      id: 2,
      title: 'Manage Inputs',
      description: 'Discover how to create and manage inputs using the Input tab and JSON editor.',
      image: 'https://dummyimage.com/300x200/ccc/000',
    },
    {
      id: 3,
      title: 'Execute',
      description: 'Execute your configurations with selected inputs using the Execute tab.',
      image: 'https://dummyimage.com/300x200/ccc/000',
    },
    {
      id: 4,
      title: 'Settings',
      description: 'Customize and view your application settings in the Settings tab.',
      image: 'https://dummyimage.com/300x200/ccc/000',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {learnData.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <StyledCard>
              <CardMedia component="img" image={item.image} alt={item.title} height="200" />
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <Button variant="outlined" color="primary" fullWidth>
                More Info
              </Button>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LearnPage;
