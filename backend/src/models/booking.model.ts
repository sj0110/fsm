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
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }
}, 
{ 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual populate fields
bookingSchema.virtual('customer', {
  ref: 'User',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true
});

bookingSchema.virtual('service', {
  ref: 'Service',
  localField: 'serviceId',
  foreignField: '_id',
  justOne: true
});

bookingSchema.virtual('serviceProvider', {
  ref: 'User',
  localField: 'serviceProviderId',
  foreignField: '_id',
  justOne: true
});

export const BookingModel = mongoose.model<Booking & mongoose.Document>('Booking', bookingSchema);

