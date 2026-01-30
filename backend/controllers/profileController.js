const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const {
      bio,
      skills,
      education,
      experience,
      github,
      linkedin,
      portfolio,
    } = req.body;

    const user = await User.findById(req.user.id);

    // Update profile fields
    if (bio !== undefined) user.profile.bio = bio;
    if (skills !== undefined) user.profile.skills = Array.isArray(skills) ? skills : JSON.parse(skills);
    if (education !== undefined) user.profile.education = Array.isArray(education) ? education : JSON.parse(education);
    if (experience !== undefined) user.profile.experience = Array.isArray(experience) ? experience : JSON.parse(experience);
    if (github !== undefined) user.profile.github = github;
    if (linkedin !== undefined) user.profile.linkedin = linkedin;
    if (portfolio !== undefined) user.profile.portfolio = portfolio;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Upload resume
// @route   POST /api/profile/resume
// @access  Private
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const user = await User.findById(req.user.id);

    // Delete old resume from cloudinary if exists
    if (user.profile.resume) {
      const publicId = user.profile.resume.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`resumes/${publicId}`, {
          resource_type: 'raw',
        });
      } catch (error) {
        console.log('Error deleting old resume:', error);
      }
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'resumes',
      resource_type: 'raw',
      public_id: `${user._id}_${Date.now()}`,
    });

    // Delete file from local storage
    fs.unlinkSync(req.file.path);

    // Update user resume
    user.profile.resume = result.secure_url;
    user.profile.resumeOriginalName = req.file.originalname;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        resume: result.secure_url,
        resumeOriginalName: req.file.originalname,
      },
      message: 'Resume uploaded successfully',
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

// @desc    Upload profile image
// @route   POST /api/profile/image
// @access  Private
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const user = await User.findById(req.user.id);

    // Delete old image from cloudinary if exists
    if (user.profile.profileImage) {
      const publicId = user.profile.profileImage.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`profiles/${publicId}`);
      } catch (error) {
        console.log('Error deleting old image:', error);
      }
    }

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profiles',
      width: 500,
      height: 500,
      crop: 'fill',
    });

    // Delete file from local storage
    fs.unlinkSync(req.file.path);

    // Update user profile image
    user.profile.profileImage = result.secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        profileImage: result.secure_url,
      },
      message: 'Profile image uploaded successfully',
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

// @desc    Get public profile
// @route   GET /api/profile/:id
// @access  Public
exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
