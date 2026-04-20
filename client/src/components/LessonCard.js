import React, { useState } from 'react';
import { Play, CheckCircle, Lock, Clock, Star, BookOpen, Youtube, X } from 'lucide-react';

const LessonCard = ({ lesson, onStart, isLocked = false, isCompleted = false }) => {
  const [showVideo, setShowVideo] = useState(false);

  const handleStart = () => {
    if (lesson.hasVideo && lesson.videoUrl) {
      setShowVideo(true);
    } else if (onStart) {
      onStart(lesson);
    }
  };
  return (
    <div 
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.5rem',
        opacity: isLocked ? 0.6 : 1,
        cursor: isLocked ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        border: isCompleted ? '2px solid #10b981' : '1px solid var(--border)',
        background: isCompleted ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)' : 'var(--bg-card)'
      }}
      onClick={() => !isLocked && handleStart()}
      onMouseEnter={(e) => {
        if (!isLocked) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isLocked) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow)';
        }
      }}
    >
      {/* Lesson Icon */}
      <div style={{
        width: '4rem',
        height: '4rem',
        borderRadius: '50%',
        backgroundColor: isCompleted ? '#10b981' : 
                         isLocked ? 'var(--border)' : 'rgba(37, 99, 235, 0.1)',
        color: isCompleted ? 'white' : 
               isLocked ? 'var(--text-secondary)' : 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        fontWeight: '600',
        position: 'relative'
      }}>
        {isCompleted ? <CheckCircle size={24} /> :
         isLocked ? <Lock size={24} /> : 
         lesson.hasVideo ? <Youtube size={24} /> :
         <BookOpen size={24} />}
        
        {lesson.difficulty && !isLocked && (
          <div style={{
            position: 'absolute',
            top: '-0.5rem',
            right: '-0.5rem',
            width: '1.5rem',
            height: '1.5rem',
            borderRadius: '50%',
            backgroundColor: lesson.difficulty === 'easy' ? '#10b981' :
                           lesson.difficulty === 'medium' ? '#f59e0b' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Star size={12} style={{ color: 'white' }} />
          </div>
        )}
      </div>
      
      {/* Lesson Content */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}>
            {lesson.title}
          </h3>
          
          {lesson.isNew && (
            <span style={{
              backgroundColor: '#ef4444',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              NEW
            </span>
          )}
          
          {lesson.hasVideo && (
            <span style={{
              backgroundColor: '#ff0000',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Youtube size={12} />
              VIDEO
            </span>
          )}
        </div>
        
        <p style={{ 
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
          marginBottom: '0.75rem',
          lineHeight: '1.4'
        }}>
          {lesson.description}
        </p>
        
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={14} />
            {lesson.duration}
          </div>
          
          {lesson.points && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={14} />
              {lesson.points} points
            </div>
          )}
          
          {lesson.completedBy && (
            <div style={{ 
              color: '#10b981',
              fontWeight: '500'
            }}>
              ✓ Completed by {lesson.completedBy}+ students
            </div>
          )}
        </div>
        
        {lesson.progress && lesson.progress > 0 && (
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Progress</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{lesson.progress}%</span>
            </div>
            <div className="progress-bar" style={{ height: '0.25rem' }}>
              <div 
                className="progress-fill"
                style={{ 
                  width: `${lesson.progress}%`,
                  backgroundColor: '#10b981'
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Action Button */}
      {!isLocked && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            className="btn"
            style={{
              backgroundColor: lesson.hasVideo ? '#ff0000' : (isCompleted ? '#10b981' : 'var(--primary)'),
              color: 'white',
              padding: '0.75rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem'
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleStart();
            }}
          >
            {lesson.hasVideo ? <Youtube size={16} /> : <Play size={16} />}
            {lesson.hasVideo ? 'Watch Video' : (isCompleted ? 'Review' : 'Start')}
          </button>
          
          {lesson.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  style={{ 
                    color: i < lesson.rating ? '#f59e0b' : '#e5e7eb',
                    fill: i < lesson.rating ? '#f59e0b' : 'none'
                  }} 
                />
              ))}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>
                ({lesson.rating})
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Video Modal */}
      {showVideo && lesson.videoUrl && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }} onClick={() => setShowVideo(false)}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideo(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                color: 'white',
                borderRadius: '50%',
                width: '2.5rem',
                height: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 1001
              }}
            >
              <X size={20} />
            </button>
            
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: '0.5rem',
              marginBottom: '1rem'
            }}>
              <iframe
                src={lesson.videoUrl}
                title={lesson.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allowFullScreen
              />
            </div>
            
            <h2 style={{ 
              color: 'var(--text-heading)', 
              marginBottom: '0.5rem',
              fontSize: '1.5rem'
            }}>
              {lesson.title}
            </h2>
            <p style={{ 
              color: 'var(--text-secondary)', 
              lineHeight: '1.6',
              marginBottom: '1rem'
            }}>
              {lesson.description}
            </p>
            
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={14} />
                {lesson.duration}
              </div>
              
              {lesson.points && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Star size={14} />
                  {lesson.points} points
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonCard;