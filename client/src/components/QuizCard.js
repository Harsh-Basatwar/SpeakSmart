import React from 'react';
import { Brain, Clock, Star, Users, Play, Trophy, Target } from 'lucide-react';

const QuizCard = ({ quiz, onStart }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return 'var(--primary)';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return <Target size={16} />;
      case 'intermediate': return <Star size={16} />;
      case 'advanced': return <Trophy size={16} />;
      default: return <Brain size={16} />;
    }
  };

  return (
    <div 
      className="card"
      style={{
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
    >
      {/* Difficulty Badge */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        backgroundColor: getDifficultyColor(quiz.difficulty),
        color: 'white',
        padding: '0.5rem 0.75rem',
        borderRadius: '1rem',
        fontSize: '0.75rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        zIndex: 1
      }}>
        {getDifficultyIcon(quiz.difficulty)}
        {quiz.difficulty}
      </div>

      {/* Quiz Icon */}
      <div style={{ 
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        color: 'var(--primary)',
        padding: '1rem',
        borderRadius: '0.75rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        position: 'relative'
      }}>
        <Brain className="w-6 h-6" />
        {quiz.isNew && (
          <div style={{
            position: 'absolute',
            top: '-0.5rem',
            right: '-0.5rem',
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '1.5rem',
            height: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}>
            !
          </div>
        )}
      </div>
      
      {/* Quiz Title */}
      <h3 style={{ 
        fontSize: '1.5rem', 
        fontWeight: '600', 
        marginBottom: '0.75rem',
        color: 'var(--text-primary)',
        lineHeight: '1.3'
      }}>
        {quiz.title}
      </h3>
      
      {/* Quiz Description */}
      <p style={{ 
        color: 'var(--text-secondary)', 
        marginBottom: '1.5rem',
        lineHeight: '1.6',
        fontSize: '0.9rem'
      }}>
        {quiz.description}
      </p>
      
      {/* Quiz Stats */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '0.5rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.25rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            marginBottom: '0.25rem'
          }}>
            <Brain size={14} />
            Questions
          </div>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700',
            color: 'var(--text-primary)'
          }}>
            {quiz.questions}
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '0.25rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            marginBottom: '0.25rem'
          }}>
            <Clock size={14} />
            Duration
          </div>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700',
            color: 'var(--text-primary)'
          }}>
            {Math.floor(quiz.timeLimit / 60)}m
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      {(quiz.averageScore || quiz.completedBy) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          {quiz.averageScore && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={14} style={{ color: '#f59e0b' }} />
              Avg: {quiz.averageScore}%
            </div>
          )}
          {quiz.completedBy && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Users size={14} />
              {quiz.completedBy}+ completed
            </div>
          )}
        </div>
      )}

      {/* Personal Best */}
      {quiz.personalBest && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          🏆 Your Best: {quiz.personalBest}%
        </div>
      )}
      
      {/* Start Button */}
      <button 
        onClick={() => onStart && onStart(quiz)}
        className="btn btn-primary"
        style={{ 
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          padding: '0.875rem'
        }}
      >
        <Play size={18} />
        {quiz.personalBest ? 'Retake Quiz' : 'Start Quiz'}
      </button>
    </div>
  );
};

export default QuizCard;