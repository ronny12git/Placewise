const Company = require('../models/Company');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Create company
// @route   POST /api/companies
// @access  Private (Recruiter only)
exports.createCompany = async (req, res) => {
  try {
    const { name, description, website, location, industry, companySize } =
      req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Company with this name already exists',
      });
    }

    // Check if recruiter already has a company
    const recruiterCompany = await Company.findOne({
      recruiter: req.user.id,
    });
    if (recruiterCompany) {
      return res.status(400).json({
        success: false,
        message: 'You already have a company registered',
      });
    }

    const company = await Company.create({
      name,
      description,
      website,
      location,
      industry,
      companySize,
      recruiter: req.user.id,
    });

    // Update user's company reference
    await User.findByIdAndUpdate(req.user.id, { company: company._id });

    res.status(201).json({
      success: true,
      data: company,
      message: 'Company created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isApproved: true })
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate(
      'recruiter',
      'name email phone'
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private (Recruiter - own company only)
exports.updateCompany = async (req, res) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    // Make sure user is company owner
    if (company.recruiter.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this company',
      });
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: company,
      message: 'Company updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private (Admin or Company owner)
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    // Make sure user is company owner or admin
    if (
      company.recruiter.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this company',
      });
    }

    await company.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upload company logo
// @route   POST /api/companies/:id/logo
// @access  Private (Recruiter - own company only)
exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found',
      });
    }

    // Make sure user is company owner
    if (company.recruiter.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this company',
      });
    }

    // Delete old logo from cloudinary if exists
    if (company.logo) {
      const publicId = company.logo.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`company-logos/${publicId}`);
      } catch (error) {
        console.log('Error deleting old logo:', error);
      }
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'company-logos',
      width: 300,
      height: 300,
      crop: 'fill',
    });

    // Delete file from local storage
    fs.unlinkSync(req.file.path);

    // Update company logo
    company.logo = result.secure_url;
    await company.save();

    res.status(200).json({
      success: true,
      data: {
        logo: result.secure_url,
      },
      message: 'Logo uploaded successfully',
    });
  } catch (error) {
    // Delete file from local storage if error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get my company (for recruiter)
// @route   GET /api/companies/my/company
// @access  Private (Recruiter only)
exports.getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ recruiter: req.user.id });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'No company found',
      });
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
