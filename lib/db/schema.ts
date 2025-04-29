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
  },
  assignedContractor: {
    type: String,
    default: null
  },
  progress: {
    type: Number,
    default: 0
  }
});

// Update the updatedAt field before saving
reportSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

const bidSchema = new mongoose.Schema({
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    required: true
  },
  contractor: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Bid = mongoose.models.Bid || mongoose.model('Bid', bidSchema); 