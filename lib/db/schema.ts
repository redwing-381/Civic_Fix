import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 255
  },
  description: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    maxlength: 100
  },
  location: {
    type: String,
    required: true,
    maxlength: 255
  },
  imageUrl: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['urgent', 'pending', 'in-progress', 'bidding', 'completed'],
    default: 'pending'
  },
  costEstimate: {
    min: Number,
    max: Number
  },
  currency: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
reportSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Report = mongoose.models.Report || mongoose.model('Report', reportSchema); 