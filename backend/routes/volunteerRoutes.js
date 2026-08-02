const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  getPendingRequests, 
  getMyTasks, 
  acceptRequest, 
  updateRequestStatus,
  toggleAvailability
} = require('../controllers/volunteerController');

router.use(protect);
router.use(authorize('Volunteer', 'Admin'));

router.get('/requests', getPendingRequests);
router.get('/tasks', getMyTasks);
router.put('/requests/:id/accept', acceptRequest);
router.put('/requests/:id/status', updateRequestStatus);
router.put('/availability', toggleAvailability);

module.exports = router;
