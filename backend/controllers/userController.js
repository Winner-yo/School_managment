const User = require('../models/User');
const Student = require('../models/Student');

exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const allowed = ['student', 'teacher', 'admin'];
    const filter = allowed.includes(role) ? { role } : {};
    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const me = await User.findById(req.user.userId).select('-password');
    if (!me) return res.status(404).json({ msg: 'User not found' });
    res.json(me);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (name) user.name = name;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ msg: 'Current password is required to change password' });
      }

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Current password is incorrect' });
      }

      // Update password
      user.password = newPassword;
    }

    await user.save();
    
    const updatedUser = await User.findById(userId).select('-password');
    res.json({ msg: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update teacher subject
exports.updateTeacherSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject } = req.body;
    
    if (!subject) {
      return res.status(400).json({ msg: 'Subject is required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    if (user.role !== 'teacher') {
      return res.status(400).json({ msg: 'Can only assign subjects to teachers' });
    }

    // Update the teachers subject
    user.subject = subject;
    await user.save();
    
    res.json({ msg: 'Teacher subject updated successfully', user: { _id: user._id, name: user.name, username: user.username, role: user.role, subject: user.subject } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update user info
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, username } = req.body;
    
    if (!name || !username) {
      return res.status(400).json({ msg: 'Name and username are required' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if username is being changed and if it's already taken
    if (username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ msg: 'Username already exists' });
      }
    }

    // Update user information
    user.name = name;
    user.username = username;
    await user.save();
    
    const updatedUser = await User.findById(id).select('-password');
    res.json({ msg: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role === 'student') {
      await Student.findOneAndDelete({ userId: id });
    }

    // Delete the user
    await User.findByIdAndDelete(id);
    
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

