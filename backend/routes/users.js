const express = require('express');
const router = express.Router();
const { 
  getUsersByRole, 
  getMe, 
  updateProfile, 
  updateTeacherSubject, 
  deleteUser, 
  updateUser 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { role } = require('../middleware/role');

// Current user profile
router.get('/me', protect, getMe);

// Update current user profile
router.put('/profile', protect, updateProfile);
router.get('/', protect, role('admin'), getUsersByRole);

// Admin only: update user information
router.put('/:id', protect, role('admin'), updateUser);
router.put('/:id/subject', protect, role('admin'), updateTeacherSubject);
router.delete('/:id', protect, role('admin'), deleteUser);

module.exports = router;

