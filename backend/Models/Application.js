const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scholarship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scholarship',
    required: true
  },
  
  // Application status
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under-review', 'approved', 'rejected', 'withdrawn'],
    default: 'draft'
  },
  
  // Application content
  personalStatement: String,
  essay: String,
  whyDeserve: String,
  careerGoals: String,
  achievements: [String],
  extracurriculars: [String],
  workExperience: [String],
  volunteerWork: [String],
  
  // Documents
  documents: [{
    type: {
      type: String,
      enum: ['transcript', 'recommendation', 'portfolio', 'resume', 'other']
    },
    filename: String,
    originalName: String,
    url: String,
    size: Number,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Financial information
  financialInfo: {
    householdIncome: Number,
    familySize: Number,
    currentFunding: String,
    otherScholarships: [String]
  },
  
  // Provider feedback
  providerNotes: String,
  reviewDate: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Important dates
  submittedAt: Date,
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure one application per student per scholarship
applicationSchema.index({ student: 1, scholarship: 1 }, { unique: true });

// Update lastModified on save
applicationSchema.pre('save', function(next) {
  this.lastModified = Date.now();
  next();
});

module.exports = mongoose.models.Application || mongoose.model('Application', applicationSchema);

