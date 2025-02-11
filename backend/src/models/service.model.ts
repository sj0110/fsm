import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Service } from '../types';

const serviceSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true, // Ensures uniqueness
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  serviceProviderId: { type: String, required: true }, // Now using uuid instead of ObjectId
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const ServiceModel = mongoose.model<Service & mongoose.Document>('Service', serviceSchema);
