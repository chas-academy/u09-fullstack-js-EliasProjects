import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          TaskFlow Pro
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <Typography variant="body1" sx={{ ml: 2 }}>
            {user?.name}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 