import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';

const Profile: React.FC = () => {
  const { user, login } = useAuth();
  const [nameForm, setNameForm] = useState({
    name: user?.name || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameForm({
      ...nameForm,
      [e.target.name]: e.target.value,
    });
    setNameError('');
    setNameSuccess('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNameError('');
    setNameSuccess('');

    try {
      const response = await api.put('/auth/profile', {
        name: nameForm.name,
      });

      const { token, user: updatedUser } = response.data;
      await login(token, updatedUser);
      setNameSuccess('Name updated successfully');
    } catch (err: any) {
      console.error('Update name error:', err);
      setNameError(err.response?.data?.message || 'Failed to update name');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await api.put('/auth/profile/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordSuccess('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      console.error('Update password error:', err);
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Profile Settings
          </Typography>

          {/* Name Update Form */}
          <Box component="form" onSubmit={handleNameUpdate} sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Update Name
            </Typography>
            {nameError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {nameError}
              </Alert>
            )}
            {nameSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {nameSuccess}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={nameForm.name}
              onChange={handleNameChange}
              margin="normal"
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              Update Name
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Password Update Form */}
          <Box component="form" onSubmit={handlePasswordUpdate}>
            <Typography variant="h6" gutterBottom>
              Update Password
            </Typography>
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}
            {passwordSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {passwordSuccess}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              margin="normal"
              disabled={loading}
            />
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              margin="normal"
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              margin="normal"
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              Update Password
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 