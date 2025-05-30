import express, { Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { getCurrentUser, updateProfile, updatePassword } from '../controllers/auth';

const router = express.Router();

// Auth routes
router.post('/login', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // For admin panel, only allow admin users to login
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: 'Error logging in' });
  }
});

router.post('/register', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password, role: 'admin' }); // Set role to admin for admin panel
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.status(201).json({ token, user: userResponse });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: 'Error registering user' });
  }
});

router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

router.put('/profile', authenticateToken, updateProfile);
router.put('/profile/password', authenticateToken, updatePassword);

export default router; 