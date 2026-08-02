const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  createSOSRequest, 
  getMyRequests, 
  reportDisaster, 
  getShelters, 
  getHospitals,
  getNotifications
} = require('../controllers/citizenController');

router.use(protect);
router.use(authorize('Citizen', 'Admin')); // Admins can also act as citizens

router.post('/sos', createSOSRequest);
router.get('/requests', getMyRequests);
router.post('/report', reportDisaster);
router.get('/shelters', getShelters);
router.get('/hospitals', getHospitals);
router.get('/notifications', getNotifications);

module.exports = router;
