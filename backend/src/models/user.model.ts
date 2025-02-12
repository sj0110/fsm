import mongoose from 'mongoose';
import { User } from '../types';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer', 'serviceProvider'], required: true },
  name: { type: String, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

// Use MongoDB's default _id field
export const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema);
