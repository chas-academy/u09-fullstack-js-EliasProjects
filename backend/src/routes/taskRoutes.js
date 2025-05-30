const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { auth } = require('../middleware/auth');
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment,
  searchTasks
} = require('../controllers/taskController');

// Create task route
router.post(
  '/',
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ],
  createTask
);

// Get all tasks route
router.get('/', auth, getAllTasks);

// Get task by ID route
router.get('/:id', auth, getTaskById);

// Update task route
router.put('/:id', auth, updateTask);

// Delete task route
router.delete('/:id', auth, deleteTask);

// Add comment route
router.post(
  '/:id/comments',
  auth,
  [
    check('text', 'Comment text is required').not().isEmpty()
  ],
  addComment
);

// Search tasks route
router.get('/search', auth, searchTasks);

module.exports = router; 