const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getProfile,
  updateProfile,
  uploadResume,
  uploadProfileImage,
  getPublicProfile,
} = require('../controllers/profileController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'resume') {
    // Accept PDF only for resumes
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for resume'), false);
    }
  } else if (file.fieldname === 'profileImage') {
    // Accept images only for profile
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for profile'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.get('/', protect, getProfile);
router.put('/', protect, authorize('student'), updateProfile);
router.post(
  '/resume',
  protect,
  authorize('student'),
  upload.single('resume'),
  uploadResume
);
router.post(
  '/image',
  protect,
  upload.single('profileImage'),
  uploadProfileImage
);
router.get('/:id', getPublicProfile);

module.exports = router;
