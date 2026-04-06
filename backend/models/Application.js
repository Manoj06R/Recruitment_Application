const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  candidateName: {
    type: String,
    required: true,
  },
  candidateEmail: {
    type: String,
    required: true,
  },
  reviewStatus: {
    type: String,
    enum: ['In Review', 'Shortlisted', 'Declined', 'Interview', 'Offered'],
    default: 'In Review',
  },
  resumeLink: {
    type: String,
    default: '#',
  },
  relevanceScore: {
    type: Number,
    default: 0,
  },
  experienceYears: {
    type: Number,
    default: 0,
  },
  interviewDate: {
    type: String,
    default: '',
  },
  interviewTime: {
    type: String,
    default: '',
  },
  interviewLocation: {
    type: String,
    default: '',
  },
  interviewMode: {
    type: String,
    enum: ['Offline', 'Online', ''],
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true });
module.exports = mongoose.model('Application', applicationSchema);
