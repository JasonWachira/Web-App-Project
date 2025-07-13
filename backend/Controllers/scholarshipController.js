const Scholarship = require('../Models/Scholarships');
const Application = require('../Models/Application');

// Get all scholarships with filtering and pagination
const getScholarships = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { status: 'active' };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.minAmount && req.query.maxAmount) {
      filter.amount = {
        $gte: parseInt(req.query.minAmount),
        $lte: parseInt(req.query.maxAmount)
      };
    }
    
    if (req.query.deadline) {
      filter.deadline = { $gte: new Date(req.query.deadline) };
    }
    
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Get scholarships
    const scholarships = await Scholarship.find(filter)
      .populate('provider', 'firstName lastName providerProfile.organizationName')
      .sort({ featured: -1, deadline: 1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Scholarship.countDocuments(filter);

    res.json({
      success: true,
      data: {
        scholarships,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get scholarships error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching scholarships'
    });
  }
};

// Get single scholarship
const getScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id)
      .populate('provider', 'firstName lastName providerProfile.organizationName providerProfile.description');

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    // Increment view count
    scholarship.views += 1;
    await scholarship.save();

    res.json({
      success: true,
      data: scholarship
    });
  } catch (error) {
    console.error('Get scholarship error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching scholarship'
    });
  }
};

// Create scholarship (Provider only)
const createScholarship = async (req, res) => {
  try {
    const scholarshipData = {
      ...req.body,
      provider: req.user._id
    };

    const scholarship = await Scholarship.create(scholarshipData);

    res.status(201).json({
      success: true,
      message: 'Scholarship created successfully',
      data: scholarship
    });
  } catch (error) {
    console.error('Create scholarship error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating scholarship'
    });
  }
};

// Update scholarship
const updateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    // Check if user is the provider of this scholarship or admin
    if (scholarship.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this scholarship'
      });
    }

    const updatedScholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Scholarship updated successfully',
      data: updatedScholarship
    });
  } catch (error) {
    console.error('Update scholarship error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating scholarship'
    });
  }
};

// Delete scholarship
const deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    // Check if user is the provider of this scholarship or admin
    if (scholarship.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this scholarship'
      });
    }

    await Scholarship.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Scholarship deleted successfully'
    });
  } catch (error) {
    console.error('Delete scholarship error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting scholarship'
    });
  }
};

// Get featured scholarships
const getFeaturedScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find({
      status: 'active',
      featured: true,
      deadline: { $gte: new Date() }
    })
      .populate('provider', 'firstName lastName providerProfile.organizationName')
      .sort({ deadline: 1 })
      .limit(6);

    res.json({
      success: true,
      data: scholarships
    });
  } catch (error) {
    console.error('Get featured scholarships error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching featured scholarships'
    });
  }
};

const getActiveScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find({
      status: 'active'}).select('title amount');
    
    res.json({
      success: true,
      data: scholarships
    });
  } catch (error) {
    console.error('Get active scholarships error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching active scholarships'
    });
  }
};



module.exports = {
  getScholarships,
  getScholarship,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  getFeaturedScholarships,
  getActiveScholarships
};