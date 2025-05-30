import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

const Admin: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">User Management</Typography>
            {/* Add user management controls here */}
          </Paper>
        </Box>
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">System Settings</Typography>
            {/* Add system settings controls here */}
          </Paper>
        </Box>
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Activity Logs</Typography>
            {/* Add activity logs here */}
          </Paper>
        </Box>
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Analytics</Typography>
            {/* Add analytics data here */}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Admin; 