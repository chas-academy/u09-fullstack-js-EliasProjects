import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './User';

export interface IComment {
  text: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

export interface ITask extends Document {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: Date;
  createdBy: Types.ObjectId;
  comments: IComment[];
}

const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [{
    text: {
      type: String,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export const Task = mongoose.model<ITask>('Task', taskSchema); 