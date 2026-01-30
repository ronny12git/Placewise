const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide job title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide job description'],
    },
    requirements: {
      type: [String],
      required: [true, 'Please provide job requirements'],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    salary: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
    },
    salaryType: {
      type: String,
      enum: ['Monthly', 'Yearly'],
      default: 'Yearly',
    },
    location: {
      type: String,
      required: [true, 'Please provide job location'],
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      required: [true, 'Please provide job type'],
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Fresher'],
      default: 'Entry Level',
    },
    skills: {
      type: [String],
      default: [],
    },
    positions: {
      type: Number,
      default: 1,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicationDeadline: {
      type: Date,
      required: [true, 'Please provide application deadline'],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'pending'],
      default: 'pending',
    },
    views: {
      type: Number,
      default: 0,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
jobSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Job', jobSchema);
