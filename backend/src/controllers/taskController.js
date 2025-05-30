const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// Create a new task
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = new Task({
      ...req.body,
      createdBy: req.user._id
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .populate('comments.createdBy', 'username email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is authorized to update
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assignedTo', 'username email')
     .populate('createdBy', 'username email');

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is authorized to delete
    if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await task.remove();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add comment to task
const addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const comment = {
      text: req.body.text,
      createdBy: req.user._id
    };

    task.comments.push(comment);
    await task.save();

    const updatedTask = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .populate('comments.createdBy', 'username email');

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Search tasks
const searchTasks = async (req, res) => {
  try {
    const { query } = req.query;
    const tasks = await Task.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    })
    .populate('assignedTo', 'username email')
    .populate('createdBy', 'username email')
    .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  searchTasks
}; 