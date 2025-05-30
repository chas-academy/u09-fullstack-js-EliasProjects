import React from 'react';
import { Box, Typography } from '@mui/material';

const Notifications: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
        Notifications
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Here you will see your notifications and activity feed.
      </Typography>
    </Box>
  );
};

export default Notifications; 