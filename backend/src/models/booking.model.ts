import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Booking } from '../types';

const bookingSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true, // Ensures uniqueness
  },
  customerId: { type: String, required: true }, // UUID instead of ObjectId
  serviceId: { type: String, required: true }, // UUID instead of ObjectId
  serviceProviderId: { type: String, required: true }, // UUID instead of ObjectId
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'inProgress', 'completed', 'cancelled'],
    default: 'pending'
  },
  appointmentDate: { type: Date, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const BookingModel = mongoose.model<Booking & mongoose.Document>('Booking', bookingSchema);
