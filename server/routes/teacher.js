const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { User, Quiz, Progress } = require('../models');

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole('teacher'));

// Get teacher dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const students = await User.findAll('student');
    const quizzes = await Quiz.findAll();

    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        const progress = await Progress.get(student.id);
        return {
          id: student.id,
          name: student.name,
          email: student.email,
          progress: progress.total_progress || 0,
          lastActive: student.last_active || 'Never',
          completedModules: progress.completed_modules || 0
        };
      })
    );

    const stats = {
      totalStudents: students.length,
      totalQuizzes: quizzes.length,
      avgProgress: students.length > 0
        ? Math.round(studentsWithProgress.reduce((sum, s) => sum + s.progress, 0) / students.length)
        : 0,
      activeToday: studentsWithProgress.filter(s => {
        if (!s.lastActive || s.lastActive === 'Never') return false;
        const today = new Date().toDateString();
        return new Date(s.lastActive).toDateString() === today;
      }).length
    };

    res.json({ students: studentsWithProgress, stats });
  } catch (error) {
    console.error('Teacher dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all students with detailed progress
router.get('/students', async (req, res) => {
  try {
    const students = await User.findAll('student');
    
    const studentsWithProgress = await Promise.all(
      students.map(async (student) => {
        const progress = await Progress.get(student.id);
        const quizAttempts = await Quiz.getUserAttempts(student.id);
        
        return {
          id: student.id,
          name: student.name,
          email: student.email,
          createdAt: student.created_at,
          progress: {
            totalProgress: progress.total_progress || 0,
            completedModules: progress.completed_modules || 0,
            quizScores: quizAttempts.map(a => ({ quizId: a.quiz_id, score: a.score, date: a.completed_at })),
            flashcardsLearned: progress.flashcards_learned || 0,
            streakDays: progress.streak_days || 0
          },
          lastActive: student.last_active || 'Never'
        };
      })
    );

    res.json(studentsWithProgress);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific student details
router.get('/students/:studentId', async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);
    
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const progress = await Progress.get(student.id);
    const quizAttempts = await Quiz.getUserAttempts(student.id);

    const { password, ...studentData } = student;
    studentData.progress = {
      totalProgress: progress.total_progress || 0,
      completedModules: progress.completed_modules || 0,
      quizScores: quizAttempts,
      flashcardsLearned: progress.flashcards_learned || 0,
      streakDays: progress.streak_days || 0
    };

    res.json(studentData);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new quiz
router.post('/quizzes', async (req, res) => {
  try {
    const { title, description, difficulty, timeLimit, questions } = req.body;

    if (!title || !description || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Title, description, and questions are required' });
    }

    const newQuiz = await Quiz.create(
      { title, description, difficulty, timeLimit, questions },
      req.user.userId
    );

    res.status(201).json({ message: 'Quiz created successfully', quiz: newQuiz });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update quiz
router.put('/quizzes/:quizId', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.created_by !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this quiz' });
    }

    const updatedQuiz = await Quiz.update(req.params.quizId, req.body);
    res.json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete quiz
router.delete('/quizzes/:quizId', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (quiz.created_by !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this quiz' });
    }

    await Quiz.delete(req.params.quizId);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student progress (teacher override)
router.put('/students/:studentId/progress', async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);
    
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Progress.update(req.params.studentId, req.body);
    const updatedProgress = await Progress.get(req.params.studentId);

    res.json({ message: 'Progress updated', progress: updatedProgress });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset student progress
router.delete('/students/:studentId/progress', async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId);
    
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Progress.reset(req.params.studentId);
    res.json({ message: 'Progress reset' });
  } catch (error) {
    console.error('Reset progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get class analytics
router.get('/analytics', async (req, res) => {
  try {
    const students = await User.findAll('student');
    
    const studentsWithProgress = await Promise.all(
      students.map(async (s) => {
        const progress = await Progress.get(s.id);
        const quizAttempts = await Quiz.getUserAttempts(s.id);
        return { ...s, progress, quizAttempts };
      })
    );

    const analytics = {
      totalStudents: students.length,
      averageProgress: students.length > 0
        ? studentsWithProgress.reduce((sum, s) => sum + (s.progress.total_progress || 0), 0) / students.length
        : 0,
      completionRates: {
        grammar: studentsWithProgress.filter(s => (s.progress.completed_modules || 0) >= 5).length,
        vocabulary: studentsWithProgress.filter(s => (s.progress.flashcards_learned || 0) >= 50).length,
        quizzes: studentsWithProgress.filter(s => s.quizAttempts.length >= 3).length
      },
      progressDistribution: {
        beginner: studentsWithProgress.filter(s => (s.progress.total_progress || 0) < 30).length,
        intermediate: studentsWithProgress.filter(s => {
          const progress = s.progress.total_progress || 0;
          return progress >= 30 && progress < 70;
        }).length,
        advanced: studentsWithProgress.filter(s => (s.progress.total_progress || 0) >= 70).length
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
