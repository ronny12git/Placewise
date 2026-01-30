const express = require('express');
const {
  applyForJob,
  getJobApplications,
  getMyApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/:jobId', protect, authorize('student'), applyForJob);
router.get('/my', protect, authorize('student'), getMyApplications);
router.get(
  '/stats/overview',
  protect,
  authorize('recruiter'),
  getApplicationStats
);
router.get(
  '/job/:jobId',
  protect,
  authorize('recruiter', 'admin'),
  getJobApplications
);
router.get('/:id', protect, getApplication);
router.put(
  '/:id/status',
  protect,
  authorize('recruiter', 'admin'),
  updateApplicationStatus
);
router.delete('/:id', protect, authorize('student'), deleteApplication);

module.exports = router;
