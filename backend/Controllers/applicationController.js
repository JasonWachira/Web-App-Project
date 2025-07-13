const Application = require('../Models/Application');
const Scholarship = require('../Models/Scholarships');

// Submit application
const submitApplication = async (req, res) => {
  try {
    
    const { scholarshipTitle, ...applicationData } = req.body;

    
    const scholarship = await Scholarship.findOne({ title: scholarshipTitle });
    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found'
      });
    }

    if (scholarship.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Scholarship is not active'
      });
    }

    
    if (new Date() > scholarship.deadline) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      student: req.user._id,
      scholarship: scholarship._id 
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: `You have already applied for the scholarship titled "${scholarship.title}"`
      });
    }

    // Create application
    const application = await Application.create({
      student: req.user._id,
      scholarship: scholarship._id, 
      ...applicationData,
      status: 'submitted',
      submittedAt: new Date()
    });

    // Update scholarship application count
    scholarship.currentApplications += 1;
    await scholarship.save();

    // Populate application data
    const populatedApplication = await Application.findById(application._id)
      .populate('student', 'firstName lastName email studentProfile')
      .populate('scholarship', 'title amount deadline provider');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: populatedApplication
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting application'
    });
  }
};

// Get student's applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('scholarship', 'title amount deadline provider status')
      .populate({
        path: 'scholarship',
        populate: {
          path: 'provider',
          select: 'firstName lastName providerProfile.organizationName'
        }
      })
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching applications'
    });
  }
};

// Get single application
const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('student', 'firstName lastName email studentProfile')
      .populate('scholarship', 'title amount deadline provider requirements')
      .populate({
        path: 'scholarship',
        populate: {
          path: 'provider',
          select: 'firstName lastName providerProfile.organizationName'
        }
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is authorized to view this application
    if (application.student._id.toString() !== req.user._id.toString() && 
        application.scholarship.provider.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching application'
    });
  }
};

// Update application status (Provider/Admin only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, providerNotes } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('scholarship', 'provider');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is authorized to update this application
    if (application.scholarship.provider.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update application
    application.status = status;
    if (providerNotes) application.providerNotes = providerNotes;
    application.reviewDate = new Date();
    application.reviewedBy = req.user._id;

    await application.save();

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating application status'
    });
  }
};

// Delete application
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is authorized to delete this application
    if (application.student.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this application'
      });
    }

    // Only allow deletion if status is draft
    if (application.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete submitted application'
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting application'
    });
  }
};

module.exports = {
  submitApplication,
  getMyApplications,
  getApplication,
  updateApplicationStatus,
  deleteApplication
};
