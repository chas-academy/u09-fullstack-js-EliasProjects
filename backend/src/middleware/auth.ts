import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Types } from 'mongoose';

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: Types.ObjectId;
    name: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const isAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Error checking admin status' });
  }
}; 