import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';
import { Task, TaskFormData } from '../types/task';

const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      setError(error.response?.data?.message || 'Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpen = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate.split('T')[0],
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTask(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, formData);
      } else {
        await api.post('/tasks', formData);
      }
      handleClose();
      fetchTasks();
    } catch (error: any) {
      console.error('Error saving task:', error);
      setError(error.response?.data?.message || 'Error saving task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await api.delete(`/tasks/${taskId}`);
        fetchTasks();
      } catch (error: any) {
        console.error('Error deleting task:', error);
        setError(error.response?.data?.message || 'Error deleting task');
      } finally {
        setLoading(false);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'todo':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Tasks
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          disabled={loading}
        >
          Add Task
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {tasks.map((task) => (
          <Card key={task._id}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {task.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {task.description}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={task.priority}
                  color={getPriorityColor(task.priority)}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={task.status}
                  color={getStatusColor(task.status)}
                  size="small"
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleOpen(task)}
                disabled={loading}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(task._id)}
                disabled={loading}
              >
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              margin="normal"
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              margin="normal"
              multiline
              rows={3}
              required
              disabled={loading}
            />
            <TextField
              fullWidth
              select
              label="Status"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'todo' | 'in-progress' | 'completed',
                })
              }
              margin="normal"
              required
              disabled={loading}
            >
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              label="Priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as 'low' | 'medium' | 'high',
                })
              }
              margin="normal"
              required
              disabled={loading}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              margin="normal"
              required
              disabled={loading}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? 'Saving...' : editingTask ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Tasks; 