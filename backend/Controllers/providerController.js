const Scholarship = require('../Models/Scholarships');
const Application = require('../Models/Application');
const User = require('../Models/User');

// Get provider dashboard data
const getProviderDashboard = async (req, res) => {
  try {
    const providerId = req.user._id;

    // Get scholarship stats
    const totalScholarships = await Scholarship.countDocuments({ provider: providerId });
    const activeScholarships = await Scholarship.countDocuments({ 
      provider: providerId, 
      status: 'active' 
    });

    // Get application stats
    const scholarshipIds = await Scholarship.find({ provider: providerId }).distinct('_id');
    const totalApplications = await Application.countDocuments({ 
      scholarship: { $in: scholarshipIds } 
    });
    const pendingApplications = await Application.countDocuments({ 
      scholarship: { $in: scholarshipIds },
      status: 'submitted'
    });

    // Get recent applications
    const recentApplications = await Application.find({
      scholarship: { $in: scholarshipIds }
    })
      .populate('student', 'firstName lastName email')
      .populate('scholarship', 'title amount')
      .sort({ submittedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalScholarships,
          activeScholarships,
          totalApplications,
          pendingApplications
        },
        recentApplications
      }
    });
  } catch (error) {
    console.error('Provider dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data'
    });
  }
};

// Get provider's scholarships
const getProviderScholarships = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { provider: req.user._id };
    
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const scholarships = await Scholarship.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
    console.error('Get provider scholarships error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching scholarships'
    });
  }
};

// Get applications for provider's scholarships
const getProviderApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get provider's scholarship IDs
    const scholarshipIds = await Scholarship.find({ provider: req.user._id }).distinct('_id');

    const filter = { scholarship: { $in: scholarshipIds } };
    
    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.scholarshipId) {
      filter.scholarship = req.query.scholarshipId;
    }

    const applications = await Application.find(filter)
      .populate('student', 'firstName lastName email studentProfile')
      .populate('scholarship', 'title amount deadline')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Application.countDocuments(filter);

    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get provider applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching applications'
    });
  }
};

// Get applications for specific scholarship
const getScholarshipApplications = async (req, res) => {
  try {
    const scholarshipId = req.params.scholarshipId;

    // Verify scholarship belongs to provider
    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    if (scholarship.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these applications'
      });
    }

    const applications = await Application.find({ scholarship: scholarshipId })
      .populate('student', 'firstName lastName email studentProfile')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Get scholarship applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching applications'
    });
  }
};

module.exports = {
  getProviderDashboard,
  getProviderScholarships,
  getProviderApplications,
  getScholarshipApplications
};
