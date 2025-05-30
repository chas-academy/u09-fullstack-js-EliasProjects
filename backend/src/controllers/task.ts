import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { Types } from 'mongoose';

// Get all tasks for the authenticated user
export const getTasks = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const tasks = await Task.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Get a single task
export const getTask = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const task = await Task.findOne({
      _id: new Types.ObjectId(req.params.id),
      createdBy: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Error fetching task' });
  }
};

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { title, description, priority, status, dueDate } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      status,
      dueDate,
      createdBy: req.user._id
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { title, description, priority, status, dueDate } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: new Types.ObjectId(req.params.id), createdBy: req.user._id },
      { title, description, priority, status, dueDate },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const task = await Task.findOneAndDelete({
      _id: new Types.ObjectId(req.params.id),
      createdBy: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
};

// Add comment to task
export const addComment = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { text } = req.body;
    const task = await Task.findOne({
      _id: new Types.ObjectId(req.params.id),
      createdBy: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.comments.push({
      text,
      createdBy: req.user._id,
      createdAt: new Date()
    });

    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
};

// Search tasks
export const searchTasks = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { query } = req.query;
    const tasks = await Task.find({
      createdBy: req.user._id,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(tasks);
  } catch (error) {
    console.error('Search tasks error:', error);
    res.status(500).json({ message: 'Error searching tasks' });
  }
}; 