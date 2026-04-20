import React, { useState, useEffect } from 'react';
import { Brain, Clock, CheckCircle, XCircle, RotateCcw, ArrowRight, Trophy, Target, Star } from 'lucide-react';
import axios from 'axios';
import QuizCard from '../components/QuizCard';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      handleQuizComplete();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, showResult]);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('/api/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      // Mock data for demo
      setQuizzes([
        {
          id: 1,
          title: 'Grammar Fundamentals',
          description: 'Master the essential building blocks of English grammar with interactive exercises and real-world examples',
          questions: 15,
          difficulty: 'Beginner',
          timeLimit: 300,
          averageScore: 78,
          completedBy: 2450,
          personalBest: 85,
          isNew: false
        },
        {
          id: 2,
          title: 'Vocabulary Mastery',
          description: 'Expand your English vocabulary with advanced words and phrases used in professional contexts',
          questions: 20,
          difficulty: 'Intermediate',
          timeLimit: 450,
          averageScore: 72,
          completedBy: 1890,
          isNew: true
        },
        {
          id: 3,
          title: 'Advanced Grammar Structures',
          description: 'Challenge yourself with complex grammar patterns, conditional sentences, and advanced syntax',
          questions: 18,
          difficulty: 'Advanced',
          timeLimit: 600,
          averageScore: 65,
          completedBy: 750,
          personalBest: 92
        },
        {
          id: 4,
          title: 'Business English Essentials',
          description: 'Professional communication skills for workplace success and business correspondence',
          questions: 12,
          difficulty: 'Intermediate',
          timeLimit: 360,
          averageScore: 81,
          completedBy: 1200,
          isNew: true
        },
        {
          id: 5,
          title: 'Listening Comprehension',
          description: 'Test your ability to understand spoken English in various accents and contexts',
          questions: 10,
          difficulty: 'Intermediate',
          timeLimit: 480,
          averageScore: 69,
          completedBy: 980
        },
        {
          id: 6,
          title: 'Pronunciation Challenge',
          description: 'Perfect your English pronunciation with phonetic exercises and sound recognition',
          questions: 8,
          difficulty: 'Advanced',
          timeLimit: 240,
          averageScore: 58,
          completedBy: 420,
          personalBest: 75
        }
      ]);
    }
  };

  const startQuiz = async (quizId) => {
    try {
      const response = await axios.get(`/api/quizzes/${quizId}`);
      setCurrentQuiz(response.data);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setAnswers([]);
      setSelectedAnswer('');
      setShowResult(false);
      setTimeLeft(response.data.timeLimit || 300);
    } catch (error) {
      console.error('Error starting quiz:', error);
      // Mock quiz data for demo
      const mockQuizzes = {
        1: {
          id: 1,
          title: 'Grammar Basics',
          questions: [
            {
              id: 1,
              question: 'Which of the following is a correct sentence?',
              type: 'multiple-choice',
              options: [
                'She go to school every day.',
                'She goes to school every day.',
                'She going to school every day.',
                'She gone to school every day.'
              ]
            },
            {
              id: 2,
              question: 'Fill in the blank: "I _____ been waiting for an hour."',
              type: 'fill-blank',
              options: ['have', 'has', 'had', 'having']
            },
            {
              id: 3,
              question: 'Choose the correct past tense of "run":',
              type: 'multiple-choice',
              options: ['runned', 'ran', 'runed', 'running']
            }
          ]
        },
        2: {
          id: 2,
          title: 'Vocabulary Mastery',
          questions: [
            {
              id: 1,
              question: 'What does "ubiquitous" mean?',
              type: 'multiple-choice',
              options: ['Rare and unusual', 'Present everywhere', 'Very expensive', 'Difficult to understand']
            },
            {
              id: 2,
              question: 'Choose the synonym for "meticulous":',
              type: 'multiple-choice',
              options: ['Careless', 'Quick', 'Careful', 'Lazy']
            }
          ]
        }
      };
      const mockQuiz = mockQuizzes[quizId] || mockQuizzes[1];
      setCurrentQuiz(mockQuiz);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setAnswers([]);
      setSelectedAnswer('');
      setShowResult(false);
      setTimeLeft(mockQuiz.timeLimit || 300);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    setSelectedAnswer('');

    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    const finalAnswers = [...answers];
    finalAnswers[currentQuestion] = selectedAnswer;
    
    // Calculate score (mock calculation for demo)
    const correctAnswers = Math.floor(Math.random() * finalAnswers.length) + Math.floor(finalAnswers.length * 0.6);
    const calculatedScore = Math.round((correctAnswers / finalAnswers.length) * 100);
    
    try {
      // Save quiz score to progress
      await axios.post('/api/progress/quiz', {
        score: calculatedScore,
        totalQuestions: finalAnswers.length,
        quizTitle: currentQuiz.title,
        timeSpent: (currentQuiz.timeLimit || 300) - timeLeft
      });
      
      setScore(calculatedScore);
      setShowResult(true);
      setQuizStarted(false);
      
      // Trigger progress refresh
      window.dispatchEvent(new CustomEvent('quizCompleted'));
    } catch (error) {
      console.error('Error saving quiz score:', error);
      // Still show result even if saving fails
      setScore(calculatedScore);
      setShowResult(true);
      setQuizStarted(false);
      
      // Trigger progress refresh even on error
      window.dispatchEvent(new CustomEvent('quizCompleted'));
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setQuizStarted(false);
    setShowResult(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResult) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ 
              backgroundColor: score >= 70 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: score >= 70 ? '#10b981' : '#ef4444',
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              {score >= 70 ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>
            
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              Quiz Complete!
            </h2>
            
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: score >= 70 ? '#10b981' : '#ef4444',
              marginBottom: '1rem'
            }}>
              {score}%
            </div>
            
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: '2rem',
              fontSize: '1.125rem'
            }}>
              You scored {score}% on "{currentQuiz.title}"
              <br />
              {score >= 70 ? 'Great job! Keep up the good work!' : 'Keep practicing to improve your score!'}
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={resetQuiz}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <RotateCcw className="w-4 h-4" />
                Try Another Quiz
              </button>
              <button 
                onClick={() => startQuiz(currentQuiz.id)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentQuiz && quizStarted) {
    const question = currentQuiz.questions[currentQuestion];
    
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {/* Quiz Header */}
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {currentQuiz.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Question {currentQuestion + 1} of {currentQuiz.questions.length}
                </p>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: timeLeft < 60 ? '#ef4444' : 'var(--text-primary)',
                fontSize: '1.125rem',
                fontWeight: '600'
              }}>
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="progress-bar" style={{ marginTop: '1rem' }}>
              <div 
                className="progress-fill"
                style={{ width: `${((currentQuestion + 1) / currentQuiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="card">
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '1.5rem',
              color: 'var(--text-primary)'
            }}>
              {question.question}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  style={{
                    padding: '1rem',
                    border: `2px solid ${selectedAnswer === index ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: '0.5rem',
                    backgroundColor: selectedAnswer === index ? 'rgba(37, 99, 235, 0.1)' : 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ 
                    display: 'inline-block',
                    width: '1.5rem',
                    height: '1.5rem',
                    borderRadius: '50%',
                    backgroundColor: selectedAnswer === index ? 'var(--primary)' : 'var(--border)',
                    color: selectedAnswer === index ? 'white' : 'var(--text-secondary)',
                    textAlign: 'center',
                    lineHeight: '1.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginRight: '0.75rem'
                  }}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button 
                onClick={resetQuiz}
                className="btn btn-secondary"
              >
                Exit Quiz
              </button>
              
              <button 
                onClick={handleNextQuestion}
                disabled={selectedAnswer === ''}
                className="btn btn-primary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  opacity: selectedAnswer === '' ? 0.5 : 1
                }}
              >
                {currentQuestion < currentQuiz.questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              color: 'var(--primary)',
              padding: '1rem',
              borderRadius: '50%'
            }}>
              <Brain size={32} />
            </div>
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              padding: '1rem',
              borderRadius: '50%'
            }}>
              <Target size={32} />
            </div>
            <div style={{
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              color: '#f59e0b',
              padding: '1rem',
              borderRadius: '50%'
            }}>
              <Trophy size={32} />
            </div>
          </div>
          
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            background: 'linear-gradient(135deg, var(--primary) 0%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            English Quizzes
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--text-secondary)',
            maxWidth: '700px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            🎯 Test your English knowledge with our interactive quizzes. 
            Choose from different difficulty levels, track your progress, and compete with learners worldwide.
          </p>
          
          {/* Quick Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap',
            marginTop: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>50+</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Available Quizzes</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>15K+</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Quiz Attempts</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>4.8⭐</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Average Rating</div>
            </div>
          </div>
        </div>

        <div className="grid grid-3">
          {quizzes.map((quiz, index) => (
            <div
              key={quiz.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <QuizCard
                quiz={quiz}
                onStart={(quiz) => startQuiz(quiz.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;