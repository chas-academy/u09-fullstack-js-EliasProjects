"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTasks = exports.addComment = exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getAllTasks = exports.createTask = void 0;
const Task_1 = require("../models/Task");
// Create a new task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const task = new Task_1.Task(Object.assign(Object.assign({}, req.body), { createdBy: req.user._id }));
        yield task.save();
        yield task.populate('createdBy', 'name email');
        res.status(201).json(task);
    }
    catch (error) {
        console.error('Error creating task:', error);
        res.status(400).json({ message: 'Error creating task' });
    }
});
exports.createTask = createTask;
// Get all tasks
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield Task_1.Task.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(tasks);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});
exports.getAllTasks = getAllTasks;
// Get task by ID
const getTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.Task.findById(req.params.id).populate('createdBy', 'name email');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    }
    catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ message: 'Error fetching task' });
    }
});
exports.getTaskById = getTaskById;
// Update task
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('createdBy', 'name email');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    }
    catch (error) {
        console.error('Error updating task:', error);
        res.status(400).json({ message: 'Error updating task' });
    }
});
exports.updateTask = updateTask;
// Delete task
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task' });
    }
});
exports.deleteTask = deleteTask;
// Add comment to task
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const task = yield Task_1.Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.comments.push({
            text: req.body.text,
            createdBy: req.user._id,
            createdAt: new Date()
        });
        yield task.save();
        yield task.populate('comments.createdBy', 'name email');
        res.json(task);
    }
    catch (error) {
        console.error('Error adding comment:', error);
        res.status(400).json({ message: 'Error adding comment' });
    }
});
exports.addComment = addComment;
// Search tasks
const searchTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        const tasks = yield Task_1.Task.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(tasks);
    }
    catch (error) {
        console.error('Error searching tasks:', error);
        res.status(500).json({ message: 'Error searching tasks' });
    }
});
exports.searchTasks = searchTasks;
