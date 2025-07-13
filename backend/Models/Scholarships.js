const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 2000
  },
  amount: {
    type: Number,
    required: [false, 'Amount is required'],
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  
  // Provider information
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  
  // Eligibility criteria
  eligibility: {
    minGPA: {
      type: Number,
      min: 0,
      max: 4
    },
    maxAge: Number,
    minAge: Number,
    majors: [String],
    schoolLevel: {
      type: String,
      enum: ['high-school', 'undergraduate', 'graduate', 'postgraduate', 'any']
    },
    residency: String,
    citizenship: [String],
    gender: {
      type: String,
      enum: ['male', 'female', 'any']
    },
    ethnicity: [String],
    financialNeed: Boolean
  },
  
  // Application requirements
  requirements: {
    essay: {
      required: { type: Boolean, default: false },
      prompt: String,
      minWords: Number,
      maxWords: Number
    },
    transcript: { type: Boolean, default: false },
    recommendation: {
      required: { type: Boolean, default: false },
      count: { type: Number, default: 1 }
    },
    portfolio: { type: Boolean, default: false },
    interview: { type: Boolean, default: false },
    other: [String]
  },
  
  // Scholarship details
  category: {
    type: String,
    enum: ['academic', 'athletic', 'need-based', 'merit-based', 'creative', 'community-service', 'other']
  },
  renewable: {
    type: Boolean,
    default: false
  },
  renewalCriteria: String,
  maxApplications: Number,
  currentApplications: {
    type: Number,
    default: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'expired', 'cancelled'],
    default: 'draft'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search functionality
scholarshipSchema.index({ title: 'text', description: 'text', tags: 'text' });
scholarshipSchema.index({ deadline: 1 });
scholarshipSchema.index({ amount: -1 });
scholarshipSchema.index({ provider: 1 });

module.exports = mongoose.model('Scholarship', scholarshipSchema);