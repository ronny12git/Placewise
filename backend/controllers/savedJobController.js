const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');

// @desc    Save a job
// @route   POST /api/saved-jobs/:jobId
// @access  Private (Student only)
exports.saveJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Check if already saved
    const existingSavedJob = await SavedJob.findOne({
      user: req.user.id,
      job: jobId,
    });

    if (existingSavedJob) {
      return res.status(400).json({
        success: false,
        message: 'Job already saved',
      });
    }

    const savedJob = await SavedJob.create({
      user: req.user.id,
      job: jobId,
    });

    res.status(201).json({
      success: true,
      data: savedJob,
      message: 'Job saved successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all saved jobs
// @route   GET /api/saved-jobs
// @access  Private (Student only)
exports.getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user.id })
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          select: 'name logo location',
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: savedJobs.length,
      data: savedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove saved job
// @route   DELETE /api/saved-jobs/:jobId
// @access  Private (Student only)
exports.unsaveJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({
      user: req.user.id,
      job: req.params.jobId,
    });

    if (!savedJob) {
      return res.status(404).json({
        success: false,
        message: 'Saved job not found',
      });
    }

    await savedJob.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job removed from saved list',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Check if job is saved
// @route   GET /api/saved-jobs/check/:jobId
// @access  Private (Student only)
exports.checkSavedJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({
      user: req.user.id,
      job: req.params.jobId,
    });

    res.status(200).json({
      success: true,
      isSaved: !!savedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
