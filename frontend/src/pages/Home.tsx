import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to TaskFlow Pro
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your all-in-one task management solution
        </Typography>
        {!isAuthenticated && (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/register')}
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Box>
        )}
        {isAuthenticated && (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/tasks')}
            >
              Go to Tasks
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Home; 