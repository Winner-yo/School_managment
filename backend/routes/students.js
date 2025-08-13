const express = require('express');
const { protect } = require('../middleware/auth');
const { role } = require('../middleware/role');
const { getStudents, updateGrade, getOwnProfile } = require('../controllers/studentController');

const router = express.Router();

router.get('/', protect, role('admin', 'teacher'), getStudents);
router.post('/grade', protect, role('teacher'), updateGrade);
router.get('/profile', protect, role('student'), getOwnProfile);

module.exports = router;