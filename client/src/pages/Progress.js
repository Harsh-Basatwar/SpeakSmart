import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Clock, Target, Calendar, BookOpen, Zap, Trophy, Star, Users, Info, X } from 'lucide-react';
import axios from 'axios';

const Progress = () => {
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);

  useEffect(() => {
    fetchProgressData();
    
    // Listen for quiz completion events
    const handleQuizComplete = () => {
      console.log('Quiz completed, refreshing progress data');
      setTimeout(() => fetchProgressData(), 1000);
    };
    
    window.addEventListener('quizCompleted', handleQuizComplete);
    return () => window.removeEventListener('quizCompleted', handleQuizComplete);
  }, []);

  const fetchProgressData = async () => {
    try {
      const response = await axios.get('/api/progress');
      const data = response.data;
      
      const totalQuizzes = data.quizScores ? data.quizScores.length : 0;
      const avgScore = totalQuizzes > 0 ? 
        data.quizScores.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes : 0;
      
      const skillProgress = [
        { skill: 'Vocabulary', progress: Math.min(data.flashcardsLearned.length * 2, 100), color: '#10b981' },
        { skill: 'Grammar', progress: Math.min(data.lessonsCompleted * 10, 100), color: '#6366f1' },
        { skill: 'Quizzes', progress: Math.min(totalQuizzes * 15, 100), color: '#f59e0b' },
        { skill: 'Overall', progress: Math.min((data.flashcardsLearned.length + totalQuizzes * 5 + data.lessonsCompleted * 3), 100), color: '#8b5cf6' }
      ];
      
      const weeklyActivity = [
        { day: 'Mon', words: Math.floor(data.learnedWords * 0.1), score: 85 },
        { day: 'Tue', words: Math.floor(data.learnedWords * 0.15), score: 92 },
        { day: 'Wed', words: Math.floor(data.learnedWords * 0.12), score: 78 },
        { day: 'Thu', words: Math.floor(data.learnedWords * 0.18), score: 95 },
        { day: 'Fri', words: Math.floor(data.learnedWords * 0.14), score: 88 },
        { day: 'Sat', words: Math.floor(data.learnedWords * 0.16), score: 91 },
        { day: 'Sun', words: Math.floor(data.learnedWords * 0.15), score: 87 }
      ];
      
      setProgressData({
        ...data,
        totalQuizzes,
        avgQuizScore: Math.round(avgScore),
        learnedWords: data.flashcardsLearned.length,
        overallProgress: Math.min((data.flashcardsLearned.length + totalQuizzes * 5 + data.lessonsCompleted * 3), 100),
        skillProgress,
        weeklyActivity,
        achievements: [
          { title: 'First Word Learned', description: 'Learned your first vocabulary word', icon: '🎯', earned: data.flashcardsLearned.length > 0 },
          { title: 'Vocabulary Builder', description: 'Learned 10 new words', icon: '📚', earned: data.flashcardsLearned.length >= 10 },
          { title: 'Word Master', description: 'Learned 25 new words', icon: '🏆', earned: data.flashcardsLearned.length >= 25 },
          { title: 'Quiz Champion', description: 'Completed 5 quizzes', icon: '⭐', earned: totalQuizzes >= 5 }
        ]
      });
      
      if (data.overallProgress >= 50 && !showCelebration) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress data:', error);
      setLoading(false);
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
        <div className="animate-spin" style={{ fontSize: '3rem' }}>
          📊
        </div>
      </div>
    );
  };



  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      padding: '2rem 1rem',
      position: 'relative'
    }}>
      {/* Celebration Modal */}
      {showCelebration && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
            padding: '3rem',
            borderRadius: '2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}
        >
          <div
            className="animate-spin"
            style={{ fontSize: '4rem', marginBottom: '1rem' }}
          >
            🎉
          </div>
          <h2 style={{ color: '#333', fontWeight: 'bold', fontSize: '2rem', marginBottom: '1rem' }}>Keep Going!</h2>
          <p style={{ color: '#666', fontSize: '1.2rem' }}>You've reached 50% progress! Amazing work!</p>
        </div>
      )}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="animate-fade-in" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '700', 
            color: 'white',
            marginBottom: '1rem',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            📊 Your Learning Journey
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Track your progress and celebrate your achievements in real-time
          </p>
        </div>

        {/* Overview Stats */}
        <div 
          className="animate-fade-in"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}
        >
          {selectedStat && (
            <div
              className="animate-fade-in"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '2rem'
              }}
              onClick={() => setSelectedStat(null)}
            >
              <div
                className="animate-fade-in"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '3rem',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.2)',
                  maxWidth: '400px',
                  width: '100%'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedStat(null)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={20} />
                </button>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
                <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Progress Details</h3>
                <div style={{ color: '#10b981', fontSize: '3rem', fontWeight: '700', marginBottom: '1rem' }}>{progressData.overallProgress || 0}%</div>
                <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>Your overall learning progress across all modules</p>
              </div>
            </div>
          )}
          <div 
            className="hover-scale"
            onClick={() => setSelectedStat({})}
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <Info size={16} style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.5 }} />
            <div 
              className="animate-bounce"
              style={{ fontSize: '3rem', marginBottom: '1rem' }}
            >
              🎯
            </div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
              {progressData.overallProgress || 0}%
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>Overall Progress</p>
          </div>
          
          <div 
            className="hover-scale"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
              {progressData.learnedWords || 0}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>Words Learned</p>
          </div>
          
          <div 
            className="hover-scale"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
              {progressData.totalQuizzes || 0}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>Quizzes Completed</p>
          </div>
          
          <div 
            className="hover-scale"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
              {progressData.avgQuizScore || 0}%
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>Avg Quiz Score</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {/* Skill Progress */}
          <div 
            className="animate-fade-in"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '2rem',
              color: 'white'
            }}>
              🎯 Skill Progress
            </h3>
            {progressData.skillProgress?.map((skill, index) => (
              <div key={index} style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.75rem'
                }}>
                  <span style={{ 
                    fontWeight: '600',
                    color: 'white',
                    fontSize: '1.1rem'
                  }}>
                    {skill.skill}
                  </span>
                  <span style={{ 
                    fontSize: '1rem',
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: '600'
                  }}>
                    {Math.round(skill.progress)}%
                  </span>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '1rem',
                  height: '12px',
                  overflow: 'hidden'
                }}>
                  <div 
                    className="animate-progress"
                    style={{
                      background: `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)`,
                      height: '100%',
                      borderRadius: '1rem',
                      width: `${skill.progress}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Activity */}
          <div 
            className="animate-fade-in"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '2rem',
              color: 'white'
            }}>
              📈 Weekly Activity
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressData.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.8)" />
                <YAxis stroke="rgba(255,255,255,0.8)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }} 
                />
                <Bar dataKey="words" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>



        {/* Achievements */}
        <div 
          className="animate-fade-in"
          style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1.5rem',
            padding: '2rem',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            marginBottom: '2rem',
            color: 'white'
          }}>
            🏆 Achievements
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {progressData.achievements?.map((achievement, index) => (
              <div 
                key={index}
                className="animate-fade-in hover-scale"
                style={{
                  padding: '1.5rem',
                  background: achievement.earned 
                    ? 'linear-gradient(45deg, #10b981, #34d399)' 
                    : 'rgba(255,255,255,0.1)',
                  borderRadius: '1rem',
                  textAlign: 'center',
                  border: achievement.earned ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  opacity: achievement.earned ? 1 : 0.6
                }}
              >
                <div style={{ 
                  fontSize: '2.5rem',
                  marginBottom: '1rem'
                }}>
                  {achievement.icon}
                </div>
                <h4 style={{ 
                  fontWeight: '600',
                  color: achievement.earned ? 'white' : 'rgba(255,255,255,0.9)',
                  marginBottom: '0.5rem',
                  fontSize: '1rem'
                }}>
                  {achievement.title}
                </h4>
                <p style={{ 
                  fontSize: '0.875rem',
                  color: achievement.earned ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.7)',
                  lineHeight: '1.4'
                }}>
                  {achievement.description}
                </p>
                {achievement.earned && (
                  <div
                    className="animate-fade-in"
                    style={{
                      marginTop: '1rem',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      background: 'rgba(255,255,255,0.2)',
                      padding: '0.5rem',
                      borderRadius: '0.5rem'
                    }}
                  >
                    ✓ Earned!
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;