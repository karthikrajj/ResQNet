const User = require('../models/User');
const EmergencyRequest = require('../models/EmergencyRequest');
const DisasterReport = require('../models/DisasterReport');
const Shelter = require('../models/Shelter');
const Hospital = require('../models/Hospital');
const Resource = require('../models/Resource');

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAnalytics = async (req, res) => {
  try {
    const totalCitizens = await User.countDocuments({ role: 'Citizen' });
    const totalVolunteers = await User.countDocuments({ role: 'Volunteer' });
    const activeEmergencies = await EmergencyRequest.countDocuments({ status: { $ne: 'Completed' } });
    const totalShelters = await Shelter.countDocuments();
    
    const requestStats = await EmergencyRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const typeStats = await EmergencyRequest.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({
      summary: {
        totalCitizens,
        totalVolunteers,
        activeEmergencies,
        totalShelters
      },
      requestStats,
      typeStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/Reject Volunteer
// @route   PUT /api/admin/users/:id/approve
// @access  Private (Admin)
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isApproved = req.body.isApproved;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all emergency requests
// @route   GET /api/admin/requests
// @access  Private (Admin)
const getAllRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find()
      .populate('citizen', 'name phone')
      .populate('volunteer', 'name phone')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get resources
// @route   GET /api/admin/resources
// @access  Private (Admin)
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add resource
// @route   POST /api/admin/resources
// @access  Private (Admin)
const addResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAnalytics,
  getUsers,
  approveUser,
  getAllRequests,
  getResources,
  addResource
};
