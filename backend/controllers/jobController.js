const Job = require('../models/Job');
const Company = require('../models/Company');

// @desc    Create job
// @route   POST /api/jobs
// @access  Private (Recruiter only)
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      responsibilities,
      salary,
      salaryType,
      location,
      jobType,
      experienceLevel,
      skills,
      positions,
      applicationDeadline,
    } = req.body;

    // Get recruiter's company
    const company = await Company.findOne({ recruiter: req.user.id });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'Please create a company profile first',
      });
    }

    if (!company.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Your company is not approved yet',
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : JSON.parse(requirements),
      responsibilities: Array.isArray(responsibilities) ? responsibilities : JSON.parse(responsibilities),
      salary,
      salaryType,
      location,
      jobType,
      experienceLevel,
      skills: Array.isArray(skills) ? skills : JSON.parse(skills),
      positions,
      company: company._id,
      recruiter: req.user.id,
      applicationDeadline,
    });

    res.status(201).json({
      success: true,
      data: job,
      message: 'Job created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      jobType,
      experienceLevel,
      minSalary,
      maxSalary,
      skills,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    let query = { isApproved: true, status: 'active' };

    // Search by title, description, or location
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by job type
    if (jobType) {
      query.jobType = jobType;
    }

    // Filter by experience level
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    // Filter by salary range
    if (minSalary || maxSalary) {
      query['salary.min'] = {};
      if (minSalary) query['salary.min'].$gte = Number(minSalary);
      if (maxSalary) query['salary.max'] = { $lte: Number(maxSalary) };
    }

    // Filter by skills
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.skills = { $in: skillsArray };
    }

    // Pagination
    const startIndex = (page - 1) * limit;

    // Execute query
    const jobs = await Job.find(query)
      .populate('company', 'name logo location')
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(Number(limit));

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('recruiter', 'name email phone');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter - own job only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

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
        message: 'Not authorized to update this job',
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: job,
      message: 'Job updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter - own job only or Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    // Make sure user is job owner or admin
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this job',
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get jobs posted by recruiter
// @route   GET /api/jobs/my/jobs
// @access  Private (Recruiter only)
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id })
      .populate('company', 'name logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get recommended jobs for student
// @route   GET /api/jobs/recommended
// @access  Private (Student only)
exports.getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get jobs matching user's skills
    const jobs = await Job.find({
      isApproved: true,
      status: 'active',
      skills: { $in: user.profile.skills },
    })
      .populate('company', 'name logo location')
      .limit(10)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
