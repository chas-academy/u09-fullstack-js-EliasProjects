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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const task_1 = require("../controllers/task");
const Task_1 = require("../models/Task");
const router = express_1.default.Router();
// All routes are protected with auth middleware
router.use(auth_1.authenticateToken);
// Get all tasks
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
// Get a single task
router.get('/:id', task_1.getTask);
// Create a new task
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
// Update a task
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
// Delete a task
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
exports.default = router;
