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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_2 = require("../controllers/auth");
const router = express_1.default.Router();
// Auth routes
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.User.findOne({ email });
        if (!user || !(yield user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.json({ token, user: Object.assign(Object.assign({}, user.toJSON()), { password: undefined }) });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ message: 'Error logging in' });
    }
}));
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const user = new User_1.User({ name, email, password });
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.status(201).json({ token, user: Object.assign(Object.assign({}, user.toJSON()), { password: undefined }) });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ message: 'Error registering user' });
    }
}));
router.get('/me', auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
router.put('/profile', auth_1.authenticateToken, auth_2.updateProfile);
router.put('/profile/password', auth_1.authenticateToken, auth_2.updatePassword);
exports.default = router;
