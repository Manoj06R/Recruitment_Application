const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  position: {
    type: String,
    required: [true, 'Position title is required'],
    trim: true,
  },
  organization: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
  },
  officeLocation: {
    type: String,
    default: 'Remote',
  },
  compensation: {
    type: String,
    default: 'Competitive',
  },
  employmentType: {
    type: String,
    enum: ['Permanent', 'Part-time', 'Contract', 'Remote Only'],
    default: 'Permanent',
  },
  seniority: {
    type: String,
    default: 'Mid-Senior',
  },
  requirements: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  techStack: {
    type: [String],
    default: [],
  },
  benefits: {
    type: [String],
    default: [],
  },
  deadline: {
    type: String,
    default: '',
  },
  applicantCount: {
    type: Number,
    default: 0,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
