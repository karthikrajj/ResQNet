const EmergencyRequest = require('../models/EmergencyRequest');
const User = require('../models/User');

// @desc    Get nearby pending requests
// @route   GET /api/volunteer/requests
// @access  Private (Volunteer)
const getPendingRequests = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find({ status: 'Pending' })
      .populate('citizen', 'name phone')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get volunteer's assigned tasks
// @route   GET /api/volunteer/tasks
// @access  Private (Volunteer)
const getMyTasks = async (req, res) => {
  try {
    const tasks = await EmergencyRequest.find({ volunteer: req.user._id })
      .populate('citizen', 'name phone location')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept emergency request
// @route   PUT /api/volunteer/requests/:id/accept
// @access  Private (Volunteer)
const acceptRequest = async (req, res) => {
  try {
    const request = await EmergencyRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: 'Request is already assigned or completed' });
    }

    request.volunteer = req.user._id;
    request.status = 'Assigned';
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status
// @route   PUT /api/volunteer/requests/:id/status
// @access  Private (Volunteer)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await EmergencyRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.volunteer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle availability
// @route   PUT /api/volunteer/availability
// @access  Private (Volunteer)
const toggleAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.isAvailable = !user.isAvailable;
    await user.save();
    
    res.json({ isAvailable: user.isAvailable });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPendingRequests,
  getMyTasks,
  acceptRequest,
  updateRequestStatus,
  toggleAvailability
};
