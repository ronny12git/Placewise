const express = require('express');
const multer = require('multer');
const {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
  uploadLogo,
  getMyCompany,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for logo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

router.post('/', protect, authorize('recruiter'), createCompany);
router.get('/', getCompanies);
router.get('/my/company', protect, authorize('recruiter'), getMyCompany);
router.get('/:id', getCompany);
router.put('/:id', protect, authorize('recruiter'), updateCompany);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteCompany);
router.post(
  '/:id/logo',
  protect,
  authorize('recruiter'),
  upload.single('logo'),
  uploadLogo
);

module.exports = router;
