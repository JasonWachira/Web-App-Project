const express = require('express');
const {
  submitApplication,
  getMyApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication,
  getProviderApplications
} = require('../Controllers/applicationController');
const { protect, studentOnly, providerOrAdmin } = require('../Middleware/Auth');

const router = express.Router();

// Provider routes (before :id to avoid conflicts)
router.get('/provider/all-applications', protect, providerOrAdmin, getProviderApplications);

// Student routes
router.post('/', protect, studentOnly, submitApplication);
router.get('/my-applications', protect, studentOnly, getMyApplications);
router.delete('/:id', protect, deleteApplication);

// General protected routes
router.get('/:id', protect, getApplication);

// Provider/Admin routes
router.put('/:id/status', protect, providerOrAdmin, updateApplicationStatus);

module.exports = router;