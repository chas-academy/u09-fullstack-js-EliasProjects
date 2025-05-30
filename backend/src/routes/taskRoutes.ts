import express, { Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  searchTasks
} from '../controllers/taskController';
import { Task } from '../models/Task';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// Task routes
router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/search', searchTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/comments', addComment);

// Get all tasks
router.get('/all', async (req: AuthenticatedRequest, res: Response) => {
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

// Create task
router.post('/all', async (req: AuthenticatedRequest, res: Response) => {
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

// Update task
router.put('/all/:id', async (req: AuthenticatedRequest, res: Response) => {
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

// Delete task
router.delete('/all/:id', async (req: AuthenticatedRequest, res: Response) => {
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