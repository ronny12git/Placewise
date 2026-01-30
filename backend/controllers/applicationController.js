const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const emailTemplates = require('../utils/emailTemplates');

// @desc    Apply for job
// @route   POST /api/applications/:jobId
// @access  Private (Student only)
exports.applyForJob = async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const jobId = req.params.jobId;

    // Get job
    const job = await Job.findById(jobId).populate('company');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    if (!job.isApproved || job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job is not accepting applications',
      });
    }

    // Check deadline
    if (new Date() > new Date(job.applicationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed',
      });
    }

    // Get applicant
    const applicant = await User.findById(req.user.id);

    if (!applicant.profile.resume) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your resume first',
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job',
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      company: job.company._id,
      resume: applicant.profile.resume,
      coverLetter,
      statusHistory: [
        {
          status: 'pending',
          date: Date.now(),
          note: 'Application submitted',
        },
      ],
    });

    // Update job application count
    job.applicationsCount += 1;
    await job.save();

    // Send confirmation email to applicant
    try {
      await sendEmail({
        email: applicant.email,
        subject: 'Application Received',
        html: emailTemplates.applicationReceived(
          applicant.name,
          job.title,
          job.company.name
        ),
      });
    } catch (error) {
      console.log('Error sending email:', error);
    }

    res.status(201).json({
      success: true,
      data: application,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all applications for a job (for recruiter)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter - own job only)
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Make sure user is job owner
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view these applications',
      });
    }

    const { status, page = 1, limit = 10 } = req.query;

    let query = { job: req.params.jobId };

    if (status) {
      query.status = status;
    }

    const startIndex = (page - 1) * limit;

    const applications = await Application.find(query)
      .populate('applicant', 'name email phone profile')
      .populate('job', 'title')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(Number(limit));

    const total = await Application.countDocuments(query);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get my applications (for student)
// @route   GET /api/applications/my
// @access  Private (Student only)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job')
      .populate('company', 'name logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('applicant', 'name email phone profile')
      .populate('job')
      .populate('company');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Make sure user is application owner or job recruiter
    const job = await Job.findById(application.job._id);
    if (
      application.applicant._id.toString() !== req.user.id &&
      job.recruiter.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this application',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('applicant', 'name email')
      .populate('job', 'title')
      .populate('company', 'name');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Make sure user is job recruiter
    const job = await Job.findById(application.job._id);
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this application',
      });
    }

    // Update status
    application.status = status;
    application.statusHistory.push({
      status,
      date: Date.now(),
      note: note || `Status changed to ${status}`,
    });

    await application.save();

    // Send email notification to applicant
    try {
      await sendEmail({
        email: application.applicant.email,
        subject: 'Application Status Update',
        html: emailTemplates.applicationStatusUpdate(
          application.applicant.name,
          application.job.title,
          application.company.name,
          status
        ),
      });
    } catch (error) {
      console.log('Error sending email:', error);
    }

    res.status(200).json({
      success: true,
      data: application,
      message: 'Application status updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Student - own application only)
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Make sure user is application owner
    if (application.applicant.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this application',
      });
    }

    // Decrease job application count
    const job = await Job.findById(application.job);
    if (job) {
      job.applicationsCount -= 1;
      await job.save();
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get application statistics for recruiter
// @route   GET /api/applications/stats/overview
// @access  Private (Recruiter only)
exports.getApplicationStats = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id });
    const jobIds = jobs.map(job => job._id);

    const total = await Application.countDocuments({ job: { $in: jobIds } });
    const pending = await Application.countDocuments({
      job: { $in: jobIds },
      status: 'pending',
    });
    const shortlisted = await Application.countDocuments({
      job: { $in: jobIds },
      status: 'shortlisted',
    });
    const interview = await Application.countDocuments({
      job: { $in: jobIds },
      status: 'interview',
    });
    const hired = await Application.countDocuments({
      job: { $in: jobIds },
      status: 'hired',
    });
    const rejected = await Application.countDocuments({
      job: { $in: jobIds },
      status: 'rejected',
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        shortlisted,
        interview,
        hired,
        rejected,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
