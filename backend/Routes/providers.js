const express = require('express');
const {
  getProviderDashboard,
  getProviderScholarships,
  getProviderApplications,
  getScholarshipApplications
} = require('../Controllers/providerController');
const { protect, providerOnly } = require('../Middleware/Auth');

const router = express.Router();

// All routes are protected and provider-only
router.use(protect);
router.use(providerOnly);

router.get('/dashboard', getProviderDashboard);
router.get('/scholarships', getProviderScholarships);
router.get('/applications', getProviderApplications);
router.get('/scholarships/:scholarshipId/applications', getScholarshipApplications);

module.exports = router;