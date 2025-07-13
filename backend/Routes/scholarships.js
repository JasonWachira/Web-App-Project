const express = require('express');
const {
  getScholarships,
  getScholarship,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  getFeaturedScholarships,
  getActiveScholarships
} = require('../Controllers/scholarshipController');
const { protect, providerOrAdmin } = require('../Middleware/Auth');

const router = express.Router();

// Public routes
router.get('/', getScholarships);
router.get('/featured', getFeaturedScholarships);
router.get('/active', getActiveScholarships); 
router.get('/:id', getScholarship);



// Protected routes
router.post('/', protect, providerOrAdmin, createScholarship);
router.put('/:id', protect, providerOrAdmin, updateScholarship);
router.delete('/:id', protect, providerOrAdmin, deleteScholarship);

module.exports = router;