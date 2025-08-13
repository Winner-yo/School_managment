const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { role } = require('../middleware/role');

// Only admins can register new users
router.post('/register', protect, role('admin'), register);
router.post('/login', login);

module.exports = router;