import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  createdBy: string;
  comments: any[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch users
        const usersResponse = await api.get('/admin/users');
        setUsers(usersResponse.data);

        // Fetch tasks
        const tasksResponse = await api.get('/tasks');
        setTasks(tasksResponse.data);
      } catch (err: any) {
        console.error('Dashboard data fetch error:', err);
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Users Section */}
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Users ({users.length})
            </Typography>
            {users.map((user) => (
              <Box key={user._id} sx={{ mb: 1, p: 1, bgcolor: 'background.default' }}>
                <Typography variant="subtitle1">{user.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email} - {user.role}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Box>

        {/* Tasks Section */}
        <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Tasks ({tasks.length})
            </Typography>
            {tasks.map((task) => (
              <Box key={task._id} sx={{ mb: 1, p: 1, bgcolor: 'background.default' }}>
                <Typography variant="subtitle1">{task.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Priority: {task.priority} | Status: {task.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 