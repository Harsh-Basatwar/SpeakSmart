const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { User, Progress, Quiz } = require('../models');

const router = express.Router();

router.use(authenticateToken);
router.use(requireRole('student'));

// Get student dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const progress = await Progress.get(userId);
    const quizAttempts = await Quiz.getUserAttempts(userId);

    const dashboardData = {
      stats: {
        totalProgress: progress.total_progress || 0,
        completedModules: progress.completed_modules || 0,
        quizScores: quizAttempts.map(a => ({ quizId: a.quiz_id, score: a.score, date: a.completed_at })),
        flashcardsLearned: progress.flashcards_learned || 0,
        streakDays: progress.streak_days || 0
      },
      recentActivity: quizAttempts.slice(0, 5).map(a => ({
        type: 'quiz',
        title: a.quiz_title,
        score: a.score,
        date: a.completed_at
      }))
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student progress
router.post('/progress', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { type, data } = req.body;

    const currentProgress = await Progress.get(userId);

    let updatedProgress = { ...currentProgress };

    switch (type) {
      case 'quiz':
        await Quiz.recordAttempt(userId, data.quizId, data.score, data.totalQuestions, data.timeTaken);
        break;
      case 'lesson':
        updatedProgress.completed_modules = (currentProgress.completed_modules || 0) + 1;
        break;
      case 'flashcard':
        updatedProgress.flashcards_learned = (currentProgress.flashcards_learned || 0) + 1;
        break;
      default:
        return res.status(400).json({ message: 'Invalid progress type' });
    }

    // Recalculate total progress
    updatedProgress.total_progress = Math.min(
      Math.round((updatedProgress.completed_modules / 35) * 100),
      100
    );

    await Progress.update(userId, updatedProgress);
    const finalProgress = await Progress.get(userId);

    res.json({
      message: 'Progress updated successfully',
      progress: finalProgress
    });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get learning materials
router.get('/materials', async (req, res) => {
  try {
    const materials = {
      grammar: [
        { id: 1, title: 'Present Tense', type: 'lesson', duration: 15, completed: true },
        { id: 2, title: 'Past Tense', type: 'lesson', duration: 20, completed: false }
      ],
      vocabulary: [
        { id: 3, title: 'Daily Life Words', type: 'flashcards', count: 50, completed: true },
        { id: 4, title: 'Business English', type: 'flashcards', count: 75, completed: false }
      ]
    };

    res.json(materials);
  } catch (error) {
    console.error('Materials error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
