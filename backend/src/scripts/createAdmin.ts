import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';

// Load environment variables
dotenv.config();

async function main() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'eliasnhunzwe@gmail.com' });
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

    const admin = new User(adminData);
    await admin.save();
    console.log('Admin user created successfully:', admin.email);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
main().catch(console.error); 