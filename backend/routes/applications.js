const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');

// GET /api/applications — Fetch applications (optionally filter by candidateId)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.candidateId) {
      filter.candidateId = req.query.candidateId;
    }
    if (req.query.jobId) {
      filter.jobId = req.query.jobId;
    }

    const applications = await Application.find(filter).sort({ createdAt: -1 });

    const formatted = applications.map(app => ({
      id: app._id.toString(),
      jobId: app.jobId.toString(),
      candidateId: app.candidateId.toString(),
      candidateName: app.candidateName,
      candidateEmail: app.candidateEmail,
      submittedAt: new Date(app.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      }),
      reviewStatus: app.reviewStatus,
      resumeLink: app.resumeLink,
      relevanceScore: app.relevanceScore,
      experienceYears: app.experienceYears,
      notes: app.notes,
      interviewDate: app.interviewDate,
      interviewTime: app.interviewTime,
      interviewLocation: app.interviewLocation,
      interviewMode: app.interviewMode,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications.' });
  }
});

// POST /api/applications — Submit a new application
router.post('/', async (req, res) => {
  try {
    const { jobId, candidateId, candidateName, candidateEmail } = req.body;

    // Check if already applied
    const existing = await Application.findOne({ jobId, candidateId });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied to this job.' });
    }

    const application = await Application.create({
      jobId,
      candidateId,
      candidateName,
      candidateEmail,
      reviewStatus: 'In Review',
      resumeLink: '#',
      relevanceScore: Math.floor(Math.random() * 20) + 80,
      experienceYears: Math.floor(Math.random() * 6) + 2,
    });

    // Increment applicant count on the job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } });

    res.status(201).json({
      id: application._id.toString(),
      jobId: application.jobId.toString(),
      candidateId: application.candidateId.toString(),
      candidateName: application.candidateName,
      candidateEmail: application.candidateEmail,
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      }),
      reviewStatus: application.reviewStatus,
      resumeLink: application.resumeLink,
      relevanceScore: application.relevanceScore,
      experienceYears: application.experienceYears,
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: 'Failed to submit application.' });
  }
});

// PUT /api/applications/:id — Update application status and details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const application = await Application.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json({
      id: application._id.toString(),
      jobId: application.jobId.toString(),
      candidateId: application.candidateId.toString(),
      candidateName: application.candidateName,
      candidateEmail: application.candidateEmail,
      submittedAt: new Date(application.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      }),
      reviewStatus: application.reviewStatus,
      resumeLink: application.resumeLink,
      relevanceScore: application.relevanceScore,
      experienceYears: application.experienceYears,
      interviewDate: application.interviewDate,
      interviewTime: application.interviewTime,
      interviewLocation: application.interviewLocation,
      interviewMode: application.interviewMode,
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Failed to update application.' });
  }
});

module.exports = router;
