const express = require('express');
const {
  saveJob,
  getSavedJobs,
  unsaveJob,
  checkSavedJob,
} = require('../controllers/savedJobController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/:jobId', protect, authorize('student'), saveJob);
router.get('/', protect, authorize('student'), getSavedJobs);
router.delete('/:jobId', protect, authorize('student'), unsaveJob);
router.get('/check/:jobId', protect, authorize('student'), checkSavedJob);

module.exports = router;
