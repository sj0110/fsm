import mongoose from 'mongoose';
import { Service } from '../types';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  serviceProviderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
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

// Add virtual populate for serviceProvider
serviceSchema.virtual('serviceProvider', {
  ref: 'User',
  localField: 'serviceProviderId',
  foreignField: '_id',
  justOne: true
});

export const ServiceModel = mongoose.model<Service & mongoose.Document>('Service', serviceSchema);