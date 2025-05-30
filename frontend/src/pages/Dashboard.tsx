import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Tasks Overview</Typography>
            {/* Add task statistics here */}
          </Paper>
        </Box>
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Team Activity</Typography>
            {/* Add team activity feed here */}
          </Paper>
        </Box>
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Recent Updates</Typography>
            {/* Add recent updates here */}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 