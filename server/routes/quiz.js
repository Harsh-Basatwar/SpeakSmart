const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { Quiz } = require('../models');

const router = express.Router();

router.use(authenticateToken);

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.findAll();
    res.json(quizzes);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific quiz
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit quiz answers
router.post('/:id/submit', async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let correctCount = 0;
    const results = quiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correct_answer;
      if (isCorrect) correctCount++;

      return {
        questionId: question.id,
        correct: isCorrect,
        userAnswer,
        correctAnswer: question.correct_answer
      };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);

    // Record attempt
    await Quiz.recordAttempt(
      req.user.userId,
      quiz.id,
      score,
      quiz.questions.length,
      timeTaken
    );

    res.json({
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      results,
      passed: score >= 70
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
