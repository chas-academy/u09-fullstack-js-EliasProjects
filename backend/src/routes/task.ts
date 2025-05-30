import express, { Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import {
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/task';
import { Task } from '../models/Task';

const router = express.Router();

// All routes are protected with auth middleware
router.use(authenticateToken);

// Get all tasks
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const tasks = await Task.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Get a single task
router.get('/:id', getTask);

// Create a new task
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
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
});

// Update a task
router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
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
});

// Delete a task
router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
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
});

export default router; 