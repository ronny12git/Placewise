const User = require('../models/User');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalRecruiters = await User.countDocuments({ role: 'recruiter' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({
      isApproved: true,
      status: 'active',
    });
    const pendingJobs = await Job.countDocuments({ isApproved: false });
    const totalCompanies = await Company.countDocuments();
    const approvedCompanies = await Company.countDocuments({
      isApproved: true,
    });
    const pendingCompanies = await Company.countDocuments({
      isApproved: false,
    });
    const totalApplications = await Application.countDocuments();

    // Recent activities
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('company', 'name')
      .select('title company status createdAt');

    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('applicant', 'name')
      .populate('job', 'title')
      .select('applicant job status createdAt');

    // Applications by status
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Jobs by type
    const jobsByType = await Job.aggregate([
      {
        $group: {
          _id: '$jobType',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalStudents,
          totalRecruiters,
          totalJobs,
          activeJobs,
          pendingJobs,
          totalCompanies,
          approvedCompanies,
          pendingCompanies,
          totalApplications,
        },
        recentActivities: {
          recentUsers,
          recentJobs,
          recentApplications,
        },
        charts: {
          applicationsByStatus,
          jobsByType,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 10 } = req.query;

    let query = {};

    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const startIndex = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin only)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all companies (including unapproved)
// @route   GET /api/admin/companies
// @access  Private (Admin only)
exports.getAllCompanies = async (req, res) => {
  try {
    const { isApproved, page = 1, limit = 10 } = req.query;

    let query = {};

    if (isApproved !== undefined) {
      query.isApproved = isApproved === 'true';
    }

    const startIndex = (page - 1) * limit;

    const companies = await Company.find(query)
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(Number(limit));

    const total = await Company.countDocuments(query);

    res.status(200).json({
      success: true,
      count: companies.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve/Reject company
// @route   PUT /api/admin/companies/:id/approve
// @access  Private (Admin only)
exports.approveCompany = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    company.isApproved = isApproved;
    await company.save();

    res.status(200).json({
      success: true,
      data: company,
      message: `Company ${isApproved ? 'approved' : 'rejected'} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all jobs (including unapproved)
// @route   GET /api/admin/jobs
// @access  Private (Admin only)
exports.getAllJobs = async (req, res) => {
  try {
    const { isApproved, status, page = 1, limit = 10 } = req.query;

    let query = {};

    if (isApproved !== undefined) {
      query.isApproved = isApproved === 'true';
    }

    if (status) {
      query.status = status;
    }

    const startIndex = (page - 1) * limit;

    const jobs = await Job.find(query)
      .populate('company', 'name')
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

// @desc    Approve/Reject job
// @route   PUT /api/admin/jobs/:id/approve
// @access  Private (Admin only)
exports.approveJob = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    job.isApproved = isApproved;
    job.status = isApproved ? 'active' : 'pending';
    await job.save();

    res.status(200).json({
      success: true,
      data: job,
      message: `Job ${isApproved ? 'approved' : 'rejected'} successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private (Admin only)
exports.getAllApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    const startIndex = (page - 1) * limit;

    const applications = await Application.find(query)
      .populate('applicant', 'name email')
      .populate('job', 'title')
      .populate('company', 'name')
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
