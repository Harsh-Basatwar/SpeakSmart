const express = require('express');
const bcrypt = require('bcryptjs');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { User, Class } = require('../models');

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole('admin'));

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [students, teachers, classes] = await Promise.all([
      User.findAll('student'),
      User.findAll('teacher'),
      Class.findAll()
    ]);

    const allUsers = await User.findAll();

    res.json({
      stats: {
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalClasses: classes.length,
        totalUsers: allUsers.length
      },
      recentUsers: allUsers.slice(0, 5)
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const { role } = req.query;
    const users = await User.findAll(role || null);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const newUser = await User.create({ name, email, password: hashed, role });

    res.status(201).json({ message: 'User created', user: newUser });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, role, password } = req.body;
    const updates = { name, email, role };
    
    if (password) {
      updates.password = await bcrypt.hash(password, 12);
    }

    const user = await User.update(req.params.id, updates);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated', user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin accounts' });
    }

    await User.delete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Class management
router.get('/classes', async (req, res) => {
  try {
    const classes = await Class.findAll();
    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/classes', async (req, res) => {
  try {
    const { name, teacherId, level } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Class name is required' });
    }

    const newClass = await Class.create({ name, level: level || 'Beginner', teacherId });
    res.status(201).json({ message: 'Class created', class: newClass });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/classes/:id', async (req, res) => {
  try {
    const { name, level, teacherId } = req.body;
    const updatedClass = await Class.update(req.params.id, { name, level, teacherId });
    
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({ message: 'Class updated', class: updatedClass });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/classes/:id', async (req, res) => {
  try {
    await Class.delete(req.params.id);
    res.json({ message: 'Class deleted' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign student to class
router.post('/classes/:id/assign', async (req, res) => {
  try {
    const { studentId } = req.body;
    const cls = await Class.assignStudent(req.params.id, studentId);
    
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({ message: 'Student assigned to class', class: cls });
  } catch (error) {
    console.error('Assign student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove student from class
router.delete('/classes/:id/assign/:studentId', async (req, res) => {
  try {
    const cls = await Class.removeStudent(req.params.id, req.params.studentId);
    res.json({ message: 'Student removed from class', class: cls });
  } catch (error) {
    console.error('Remove student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
