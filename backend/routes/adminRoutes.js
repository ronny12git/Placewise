const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllCompanies,
  approveCompany,
  getAllJobs,
  approveJob,
  getAllApplications,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/stats', getDashboardStats);

// Users management
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

// Companies management
router.get('/companies', getAllCompanies);
router.put('/companies/:id/approve', approveCompany);

// Jobs management
router.get('/jobs', getAllJobs);
router.put('/jobs/:id/approve', approveJob);

// Applications management
router.get('/applications', getAllApplications);

module.exports = router;
