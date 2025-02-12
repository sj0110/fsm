import mongoose from 'mongoose';
import { Booking } from '../types';

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  serviceId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Service' },
  serviceProviderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'inProgress', 'completed', 'cancelled'],
    default: 'pending'
  },
  appointmentDate: { type: Date, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const BookingModel = mongoose.model<Booking & mongoose.Document>('Booking', bookingSchema);
