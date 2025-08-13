const Student = require('../models/Student');
const User = require('../models/User');

// Get all students 
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('userId', 'name username');
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
//update grades
exports.updateGrade = async (req, res) => {
  const { studentId, subject, score } = req.body;
  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ msg: 'Student not found' });

    const existingGradeIndex = student.grades.findIndex(g => g.subject === subject);
    if (existingGradeIndex >= 0) {
      student.grades[existingGradeIndex].score = score;
    } else {
      student.grades.push({ subject, score });
    }
    
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getOwnProfile = async (req, res) => {
  try {
    let student = await Student.findOne({ userId: req.user.userId })
      .populate({
        path: 'classId',
        select: 'name teacherId',
        populate: { path: 'teacherId', select: 'username' },
      });
    
    if (!student) {
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ msg: 'User not found' });
      student = new Student({ name: user.name, userId: user._id, grades: [] });
      await student.save();
      student = await Student.findById(student._id).populate({
        path: 'classId',
        select: 'name teacherId',
        populate: { path: 'teacherId', select: 'username' },
      });
    }
    
    const user = await User.findById(req.user.userId);
    if (user) {
      student.name = user.name;
    }
    
    const teachers = await User.find({ role: 'teacher', subject: { $exists: true, $ne: null } })
      .select('name username subject')
      .sort('subject');
    
    const response = {
      ...student.toObject(),
      teachers: teachers
    };
    
    res.json(response);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};