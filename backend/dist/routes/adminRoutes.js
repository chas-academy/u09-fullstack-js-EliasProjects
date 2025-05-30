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
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
// Get admin dashboard stats
router.get('/stats', auth_1.authenticateToken, auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield User_1.User.countDocuments();
        const adminUsers = yield User_1.User.countDocuments({ role: 'admin' });
        const regularUsers = yield User_1.User.countDocuments({ role: 'user' });
        res.json({
            totalUsers,
            adminUsers,
            regularUsers
        });
    }
    catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Error fetching admin stats' });
    }
}));
// Get all users (admin only)
router.get('/users', auth_1.authenticateToken, auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find().select('-password');
        res.json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
}));
// Update user
router.put('/users/:id', auth_1.authenticateToken, auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const user = yield User_1.User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        if (password) {
            const salt = yield bcryptjs_1.default.genSalt(10);
            user.password = yield bcryptjs_1.default.hash(password, salt);
        }
        yield user.save();
        const updatedUser = yield User_1.User.findById(user._id).select('-password');
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
}));
// Delete user
router.delete('/users/:id', auth_1.authenticateToken, auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        yield user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
}));
// Update user role (admin only)
router.put('/users/:id/role', auth_1.authenticateToken, auth_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { role } = req.body;
        const user = yield User_1.User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Error updating user role' });
    }
}));
exports.default = router;
