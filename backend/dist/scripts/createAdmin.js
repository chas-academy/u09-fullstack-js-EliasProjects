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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
// Load environment variables
dotenv_1.default.config();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management';
            console.log('Connecting to MongoDB...');
            yield mongoose_1.default.connect(mongoUri);
            console.log('Connected to MongoDB successfully');
            // Check if admin already exists
            const existingAdmin = yield User_1.User.findOne({ email: 'eliasnhunzwe@gmail.com' });
            if (existingAdmin) {
                console.log('Admin user already exists');
                return;
            }
            // Create admin user
            const adminData = {
                name: 'Admin User',
                email: 'eliasnhunzwe@gmail.com',
                password: 'Elias_Testing',
                role: 'admin',
            };
            const admin = new User_1.User(adminData);
            yield admin.save();
            console.log('Admin user created successfully:', admin.email);
        }
        catch (error) {
            console.error('Error:', error);
        }
        finally {
            // Close MongoDB connection
            yield mongoose_1.default.connection.close();
            console.log('MongoDB connection closed');
        }
    });
}
// Run the script
main().catch(console.error);
