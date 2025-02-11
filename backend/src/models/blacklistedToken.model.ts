import mongoose from 'mongoose';

const blacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Auto-delete expired tokens
blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const BlacklistedTokenModel = mongoose.model('BlacklistedToken', blacklistedTokenSchema);