const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// Register
exports.register = async (req, res) => {
  const { name, username, password, role } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, username, password, role });
    await user.save();

    if (role === 'student') {
      try {
        const existingStudent = await Student.findOne({ userId: user._id });
        if (!existingStudent) {
          const student = new Student({ name: user.name, userId: user._id, grades: [] });
          await student.save();
        }
      } catch (err) {
      }
    }

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};