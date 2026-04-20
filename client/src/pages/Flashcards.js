import React, { useState, useEffect } from 'react';
import { Volume2, Check, X, Star, BookOpen, Trophy, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const response = await axios.get('/api/flashcards');
      setFlashcards(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      setLoading(false);
    }
  };

  const startStudying = () => {
    setStudyMode(true);
    setCurrentCard(0);
    setShowAnswer(false);
    setLearnedCount(0);
    setProgress(0);
  };

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      setStudyMode(false);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const markAsLearned = async () => {
    const card = flashcards[currentCard];
    try {
      await axios.post('/api/flashcards/learned', { flashcardId: card.id });
      setLearnedCount(prev => prev + 1);
      setProgress(((currentCard + 1) / flashcards.length) * 100);
      
      if ((learnedCount + 1) % 5 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
      
      setTimeout(nextCard, 500);
    } catch (error) {
      console.error('Error marking card as learned:', error);
    }
  };

  const markAsNeedsPractice = () => {
    setTimeout(nextCard, 500);
  };

  const playPronunciation = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6366f1';
    }
  };



  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ fontSize: '3rem' }}
        >
          📚
        </motion.div>
      </div>
    );
  };

  if (studyMode && flashcards.length > 0) {
    const card = flashcards[currentCard];
    const progressPercent = ((currentCard + 1) / flashcards.length) * 100;

    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 1rem'
      }}>
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
                background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                padding: '2rem',
                borderRadius: '1rem',
                textAlign: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ fontSize: '3rem', marginBottom: '1rem' }}
              >
                🎉
              </motion.div>
              <h2 style={{ color: '#333', fontWeight: 'bold', fontSize: '1.5rem' }}>Great Job!</h2>
              <p style={{ color: '#666' }}>Keep up the excellent work!</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Progress Header */}
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '600' }}>Vocabulary Practice</h2>
              <button 
                onClick={() => setStudyMode(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Exit
              </button>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>
              Card {currentCard + 1} of {flashcards.length} • {learnedCount} learned
            </p>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '1rem',
              height: '8px',
              overflow: 'hidden'
            }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
                style={{
                  background: 'linear-gradient(90deg, #10b981, #34d399)',
                  height: '100%',
                  borderRadius: '1rem'
                }}
              />
            </div>
          </motion.div>

          {/* Flashcard */}
          <motion.div
            key={currentCard}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'white',
              borderRadius: '1.5rem',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              position: 'relative',
              marginBottom: '2rem'
            }}
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: getDifficultyColor(card.level),
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '1rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'capitalize'
            }}>
              {card.level}
            </div>

            <AnimatePresence mode="wait">
              {!showAnswer ? (
                <motion.div
                  key="front"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.h1 
                    style={{ 
                      fontSize: '3rem', 
                      fontWeight: '700', 
                      color: '#333',
                      marginBottom: '1rem'
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {card.word}
                  </motion.h1>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playPronunciation(card.word);
                    }}
                    style={{
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      border: 'none',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '2rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      margin: '0 auto 2rem'
                    }}
                  >
                    <Volume2 size={20} />
                    Listen
                  </button>
                  <p style={{ color: '#666', fontSize: '1.1rem' }}>Tap to reveal meaning</p>
                </motion.div>
              ) : (
                <motion.div
                  key="back"
                  initial={{ opacity: 0, rotateY: 180 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -180 }}
                >
                  <h2 style={{ 
                    fontSize: '2rem', 
                    fontWeight: '600', 
                    color: '#333',
                    marginBottom: '1.5rem'
                  }}>
                    {card.meaning}
                  </h2>
                  <div style={{
                    background: 'linear-gradient(45deg, #f3f4f6, #e5e7eb)',
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <p style={{ 
                      fontSize: '1.1rem',
                      color: '#555',
                      fontStyle: 'italic',
                      lineHeight: '1.6'
                    }}>
                      "{card.example}"
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Action Buttons */}
          {showAnswer && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={markAsNeedsPractice}
                style={{
                  background: 'linear-gradient(45deg, #ef4444, #f87171)',
                  border: 'none',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                <X size={20} />
                Need Practice
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={markAsLearned}
                style={{
                  background: 'linear-gradient(45deg, #10b981, #34d399)',
                  border: 'none',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '2rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                <Check size={20} />
                I Know This
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            color: 'white',
            marginBottom: '1rem',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            🎯 Vocabulary Mastery
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Learn English vocabulary the Duolingo way with interactive flashcards and real-time progress tracking
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}
        >
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📚</div>
            <h3 style={{ color: 'white', fontSize: '2rem', fontWeight: '700' }}>{flashcards.length}</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Total Words</p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
            <h3 style={{ color: 'white', fontSize: '2rem', fontWeight: '700' }}>{learnedCount}</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Words Learned</p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
            <h3 style={{ color: 'white', fontSize: '2rem', fontWeight: '700' }}>{Math.round(progress)}%</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Progress</p>
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startStudying}
            style={{
              background: 'linear-gradient(45deg, #10b981, #34d399)',
              border: 'none',
              color: 'white',
              padding: '1.5rem 3rem',
              borderRadius: '2rem',
              fontSize: '1.25rem',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              margin: '0 auto'
            }}
          >
            <Zap size={24} />
            Start Learning Now
          </motion.button>
        </motion.div>

        {/* Word Preview Grid */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 style={{ 
            color: 'white', 
            fontSize: '2rem', 
            fontWeight: '600', 
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            Vocabulary Preview
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {flashcards.slice(0, 6).map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                style={{
                  background: 'var(--gradient-glass)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-lg)',
                  position: 'relative',
                  border: '1px solid var(--border)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: getDifficultyColor(card.level),
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {card.level}
                </div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  {card.word}
                </h3>
                <p style={{ 
                  color: '#666', 
                  marginBottom: '1rem',
                  lineHeight: '1.5'
                }}>
                  {card.meaning}
                </p>
                <p style={{ 
                  color: '#888',
                  fontSize: '0.875rem',
                  fontStyle: 'italic',
                  background: '#f8f9fa',
                  padding: '0.75rem',
                  borderRadius: '0.5rem'
                }}>
                  "{card.example}"
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Flashcards;