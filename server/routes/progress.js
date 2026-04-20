const express = require('express');
const { progress, flashcards } = require('../utils/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user progress
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const userProgress = progress[userId] || {
      totalWords: flashcards.length,
      learnedWords: 0,
      flashcardsLearned: [],
      lessonsCompleted: 0,
      totalStudyTime: 0,
      quizScores: [],
      lastUpdated: new Date().toISOString()
    };

    // Calculate additional stats
    const totalQuizzes = userProgress.quizScores.length;
    const avgScore = totalQuizzes > 0 ? 
      userProgress.quizScores.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes : 0;

    const enhancedProgress = {
      ...userProgress,
      totalQuizzes,
      avgQuizScore: Math.round(avgScore),
      overallProgress: Math.min(
        Math.round((userProgress.learnedWords * 2 + userProgress.lessonsCompleted * 3 + totalQuizzes * 5) / 2), 
        100
      )
    };

    res.json(enhancedProgress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;