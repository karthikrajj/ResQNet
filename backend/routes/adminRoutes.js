const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  getAnalytics, 
  getUsers, 
  approveUser, 
  getAllRequests,
  getResources,
  addResource
} = require('../controllers/adminController');

router.use(protect);
router.use(authorize('Admin'));

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id/approve', approveUser);
router.get('/requests', getAllRequests);
router.get('/resources', getResources);
router.post('/resources', addResource);

module.exports = router;
