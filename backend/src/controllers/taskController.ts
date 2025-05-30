import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Task } from '../models/Task';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../middleware/auth';

// Extend Express Request type to include user
interface AuthRequest extends Request {
  user: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    role: string;
  };
}

// Create a new task
export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const task = new Task({
      ...req.body,
      createdBy: req.user._id
    });
    await task.save();
    await task.populate('createdBy', 'name email');
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ message: 'Error creating task' });
  }
};

// Get all tasks
export const getAllTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tasks = await Task.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Get task by ID
export const getTaskById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id).populate('createdBy', 'name email');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Error fetching task' });
  }
};

// Update task
export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(400).json({ message: 'Error updating task' });
  }
};

// Delete task
export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
};

// Add comment to task
export const addComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.comments.push({
      text: req.body.text,
      createdBy: req.user._id,
      createdAt: new Date()
    });

    await task.save();
    await task.populate('comments.createdBy', 'name email');
    res.json(task);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(400).json({ message: 'Error adding comment' });
  }
};

// Search tasks
export const searchTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query } = req.query;
    const tasks = await Task.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error searching tasks:', error);
    res.status(500).json({ message: 'Error searching tasks' });
  }
}; 