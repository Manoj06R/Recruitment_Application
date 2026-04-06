const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// GET /api/jobs — Fetch all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    // Map MongoDB documents to frontend-compatible format
    const formatted = jobs.map(job => ({
      id: job._id.toString(),
      position: job.position,
      organization: job.organization,
      officeLocation: job.officeLocation,
      compensation: job.compensation,
      employmentType: job.employmentType,
      seniority: job.seniority,
      requirements: job.requirements,
      description: job.description,
      techStack: job.techStack,
      benefits: job.benefits,
      applicantCount: job.applicantCount,
      deadline: job.deadline,
      createdAt: getTimeAgo(job.createdAt),
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Fetch jobs error:', error);
    res.status(500).json({ message: 'Failed to fetch jobs.' });
  }
});

// POST /api/jobs — Create a new job
router.post('/', async (req, res) => {
  try {
    const job = await Job.create(req.body);

    res.status(201).json({
      id: job._id.toString(),
      position: job.position,
      organization: job.organization,
      officeLocation: job.officeLocation,
      compensation: job.compensation,
      employmentType: job.employmentType,
      seniority: job.seniority,
      requirements: job.requirements,
      description: job.description,
      techStack: job.techStack,
      benefits: job.benefits,
      applicantCount: job.applicantCount,
      deadline: job.deadline,
      createdAt: 'Just now',
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Failed to create job.' });
  }
});

// Helper: Convert date to "time ago" string
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}

module.exports = router;
