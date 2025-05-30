import React from 'react';
import { Box, Typography, Paper, Avatar, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Mock data for team members
const teamMembers = [
  { id: 1, name: 'John Doe', role: 'Project Manager', avatar: 'JD' },
  { id: 2, name: 'Jane Smith', role: 'Developer', avatar: 'JS' },
  { id: 3, name: 'Mike Johnson', role: 'Designer', avatar: 'MJ' },
];

const Team: React.FC = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Team Members
        </Typography>
        <IconButton color="primary" sx={{ bgcolor: 'rgba(0, 188, 212, 0.1)' }}>
          <AddIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {teamMembers.map((member) => (
          <Paper 
            key={member.id} 
            sx={{ 
              p: 2, 
              bgcolor: '#181818', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              flex: '1 1 300px',
              minWidth: '300px',
              maxWidth: '100%'
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              {member.avatar}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {member.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {member.role}
              </Typography>
            </Box>
            <Box>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Team; 