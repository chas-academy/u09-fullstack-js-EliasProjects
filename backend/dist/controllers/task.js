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
exports.searchTasks = exports.addComment = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTask = exports.getTasks = void 0;
const Task_1 = require("../models/Task");
const mongoose_1 = require("mongoose");
// Get all tasks for the authenticated user
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const tasks = yield Task_1.Task.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        res.json(tasks);
    }
    catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});
exports.getTasks = getTasks;
// Get a single task
const getTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const task = yield Task_1.Task.findOne({
            _id: new mongoose_1.Types.ObjectId(req.params.id),
            createdBy: req.user._id
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    }
    catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({ message: 'Error fetching task' });
    }
});
exports.getTask = getTask;
// Create a new task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { title, description, priority, status, dueDate } = req.body;
        const task = new Task_1.Task({
            title,
            description,
            priority,
            status,
            dueDate,
            createdBy: req.user._id
        });
        yield task.save();
        res.status(201).json(task);
    }
    catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Error creating task' });
    }
});
exports.createTask = createTask;
// Update a task
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { title, description, priority, status, dueDate } = req.body;
        const task = yield Task_1.Task.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(req.params.id), createdBy: req.user._id }, { title, description, priority, status, dueDate }, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    }
    catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Error updating task' });
    }
});
exports.updateTask = updateTask;
// Delete a task
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const task = yield Task_1.Task.findOneAndDelete({
            _id: new mongoose_1.Types.ObjectId(req.params.id),
            createdBy: req.user._id
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Error deleting task' });
    }
});
exports.deleteTask = deleteTask;
// Add comment to task
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { text } = req.body;
        const task = yield Task_1.Task.findOne({
            _id: new mongoose_1.Types.ObjectId(req.params.id),
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
        yield task.save();
        res.json(task);
    }
    catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ message: 'Error adding comment' });
    }
});
exports.addComment = addComment;
// Search tasks
const searchTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const { query } = req.query;
        const tasks = yield Task_1.Task.find({
            createdBy: req.user._id,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(tasks);
    }
    catch (error) {
        console.error('Search tasks error:', error);
        res.status(500).json({ message: 'Error searching tasks' });
    }
});
exports.searchTasks = searchTasks;
