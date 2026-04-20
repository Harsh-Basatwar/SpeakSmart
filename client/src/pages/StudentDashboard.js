import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { BookOpen, Brain, MessageCircle, BarChart3, Award, Play, Trophy, Clock, Target, TrendingUp, Calendar, Users, Zap } from 'lucide-react';
import axios from 'axios';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProgress: 0,
    completedModules: 0,
    quizScores: [],
    flashcardsLearned: 0,
    streakDays: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/student/dashboard');
      setStats(response.data.stats);
      setRecentActivity(response.data.recentActivity);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const quickActions = [
    {
      title: 'Continue Learning',
      description: 'Resume your current lesson',
      icon: <BookOpen className="w-6 h-6" />,
      link: '/learning',
      color: 'var(--primary)',
      progress: 75
    },
    {
      title: 'Take Quiz',
      description: 'Test your knowledge',
      icon: <Brain className="w-6 h-6" />,
      link: '/quiz',
      color: '#10b981',
      badge: 'New'
    },
    {
      title: 'Practice Speaking',
      description: 'Chat with AI assistant',
      icon: <MessageCircle className="w-6 h-6" />,
      link: '/chatbot',
      color: '#f59e0b',
      badge: 'AI'
    },
    {
      title: 'Review Flashcards',
      description: 'Study vocabulary',
      icon: <Award className="w-6 h-6" />,
      link: '/flashcards',
      color: '#8b5cf6',
      count: 25
    }
  ];

  const skillAreas = [
    { name: 'Grammar', progress: 75, color: '#2563eb' },
    { name: 'Vocabulary', progress: 60, color: '#10b981' },
    { name: 'Speaking', progress: 45, color: '#f59e0b' },
    { name: 'Listening', progress: 80, color: '#8b5cf6' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-secondary)', padding: '2rem 0' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{ 
          marginBottom: '2rem',
          background: 'var(--gradient-primary)',
          color: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }} />
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '800', 
            marginBottom: '0.5rem',
            position: 'relative',
            zIndex: 1,
            color: 'white'
          }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, position: 'relative', zIndex: 1 }}>
            Ready to continue your English learning journey? You're doing great!
          </p>
          <div style={{
            display: 'flex',
            gap: '2rem',
            marginTop: '1.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.streakDays}</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Day Streak</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.totalProgress}%</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Progress</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.completedModules}</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Lessons Done</div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ 
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              color: 'var(--primary)',
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Target className="w-6 h-6" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {stats.totalProgress}%
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Overall Progress
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ 
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {stats.completedModules}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Modules Completed
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ 
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              color: '#f59e0b',
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Trophy className="w-6 h-6" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {stats.flashcardsLearned}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Cards Mastered
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ 
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              color: '#8b5cf6',
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Clock className="w-6 h-6" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              {stats.streakDays}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Day Streak
            </p>
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: '2rem' }}>
          {/* Quick Actions */}
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              Quick Actions
            </h2>
            <div className="grid" style={{ gap: '1rem' }}>
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="card"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow)';
                  }}
                >
                  <div style={{ 
                    backgroundColor: `${action.color}20`,
                    color: action.color,
                    padding: '0.75rem',
                    borderRadius: '0.5rem'
                  }}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '0.25rem'
                    }}>
                      {action.title}
                    </h3>
                    <p style={{ 
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem'
                    }}>
                      {action.description}
                    </p>
                  </div>
                  <Play className="w-4 h-4" style={{ color: 'var(--text-secondary)', marginLeft: 'auto' }} />
                </Link>
              ))}
            </div>
          </div>

          {/* Skill Progress */}
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              Skill Progress
            </h2>
            <div className="card">
              {skillAreas.map((skill, index) => (
                <div key={index} style={{ marginBottom: index < skillAreas.length - 1 ? '1.5rem' : 0 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ 
                      fontWeight: '500',
                      color: 'var(--text-primary)'
                    }}>
                      {skill.name}
                    </span>
                    <span style={{ 
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)'
                    }}>
                      {skill.progress}%
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${skill.progress}%`,
                        backgroundColor: skill.color
                      }}
                    />
                  </div>
                </div>
              ))}
              
              <Link 
                to="/progress" 
                className="btn btn-secondary"
                style={{ 
                  width: '100%',
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <BarChart3 className="w-4 h-4" />
                View Detailed Progress
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;