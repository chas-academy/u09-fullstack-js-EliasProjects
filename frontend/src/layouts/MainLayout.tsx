import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, CssBaseline, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 220;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Tasks', icon: <AssignmentIcon />, path: '/tasks' },
  { text: 'Team', icon: <GroupIcon />, path: '/team' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ bgcolor: '#111', boxShadow: 'none' }}>
        <Toolbar sx={{ minHeight: 56, px: 1 }}>
          <IconButton color="inherit" edge="start" onClick={() => setOpen(true)} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 700, letterSpacing: 1 }}>
            TaskFlow Pro
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" sx={{ ml: 1 }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: '#181818',
            color: '#fff',
            borderRight: '1px solid #222',
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                onClick={() => setOpen(false)}
                sx={{ borderRadius: 1, mx: 1, my: 0.5, minHeight: 44 }}
              >
                <ListItemIcon sx={{ color: '#00bcd4', minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 2, pt: 8, minHeight: '100vh', bgcolor: 'background.default' }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 