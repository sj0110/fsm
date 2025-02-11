import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types';

const userSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: uuidv4,
        unique: true, // Ensures uniqueness
    },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer', 'serviceProvider'], required: true },
  name: { type: String, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema);