const express = require('express');
const {
  submitApplication,
  getMyApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication
} = require('../Controllers/applicationController');
const { protect, studentOnly, providerOrAdmin } = require('../Middleware/Auth');

const router = express.Router();

// Student routes
router.post('/', protect, studentOnly, submitApplication);
router.get('/my-applications', protect, studentOnly, getMyApplications);
router.delete('/:id', protect, deleteApplication);

// General protected routes
router.get('/:id', protect, getApplication);

// Provider/Admin routes
router.put('/:id/status', protect, providerOrAdmin, updateApplicationStatus);

module.exports = router;