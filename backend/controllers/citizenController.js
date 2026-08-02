const EmergencyRequest = require('../models/EmergencyRequest');
const DisasterReport = require('../models/DisasterReport');
const Shelter = require('../models/Shelter');
const Hospital = require('../models/Hospital');
const Notification = require('../models/Notification');

// @desc    Create emergency SOS request
// @route   POST /api/citizen/sos
// @access  Private (Citizen)
const createSOSRequest = async (req, res) => {
  try {
    const { type, description, location, priority } = req.body;
    
    const request = await EmergencyRequest.create({
      citizen: req.user._id,
      type,
      description,
      location,
      priority: priority || 'High'
    });

    // Notify admins about new SOS
    // In a real app, we'd use websockets. Here we just create DB records.

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get citizen's requests
// @route   GET /api/citizen/requests
// @access  Private (Citizen)
const getMyRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find({ citizen: req.user._id }).populate('volunteer', 'name phone');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Report disaster
// @route   POST /api/citizen/report
// @access  Private (Citizen)
const reportDisaster = async (req, res) => {
  try {
    const { title, type, description, location, severity, images } = req.body;

    const report = await DisasterReport.create({
      reporter: req.user._id,
      title,
      type,
      description,
      location,
      severity,
      images
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get nearby shelters
// @route   GET /api/citizen/shelters
// @access  Private (Citizen)
const getShelters = async (req, res) => {
  try {
    const shelters = await Shelter.find(); // In a real app, filter by geo-location
    res.json(shelters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get nearby hospitals
// @route   GET /api/citizen/hospitals
// @access  Private (Citizen)
const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get notifications
// @route   GET /api/citizen/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSOSRequest,
  getMyRequests,
  reportDisaster,
  getShelters,
  getHospitals,
  getNotifications
};
