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
exports.updatePassword = exports.updateProfile = exports.getCurrentUser = exports.register = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRATION = '5h'; // Set token expiration to 5 hours
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1d' });
        // Send response without password
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        res.json({
            token,
            user: userResponse,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        let user = yield User_1.User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user with admin role if registering through admin panel
        user = new User_1.User({
            name,
            email,
            password,
            role: 'admin', // Always set role to admin for admin panel registration
        });
        yield user.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1d' });
        // Send response without password
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        res.status(201).json({
            token,
            user: userResponse,
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.register = register;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const user = yield User_1.User.findById(req.user._id).select('-password');
        res.json(user);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user' });
    }
});
exports.getCurrentUser = getCurrentUser;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { name, email } = req.body;
        const user = yield User_1.User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        yield user.save();
        const updatedUser = yield User_1.User.findById(user._id).select('-password');
        res.json(updatedUser);
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(400).json({ message: 'Error updating profile' });
    }
});
exports.updateProfile = updateProfile;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        const { currentPassword, newPassword } = req.body;
        const user = yield User_1.User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = yield user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(newPassword, salt);
        yield user.save();
        res.json({ message: 'Password updated successfully' });
    }
    catch (error) {
        console.error('Error updating password:', error);
        res.status(400).json({ message: 'Error updating password' });
    }
});
exports.updatePassword = updatePassword;
