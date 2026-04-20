import React, { useState } from 'react';
import { BookOpen, Play, CheckCircle, Lock, Clock, Star, Award, Users, Target, Zap, Video, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import LessonCard from '../components/LessonCard';
import LearningVideos from './LearningVideos';

const Learning = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTab, setActiveTab] = useState('lessons');
  
  const topics = [
    {
      id: 1,
      title: 'Grammar',
      description: 'Master English grammar rules and structures with interactive exercises',
      icon: <BookOpen className="w-6 h-6" />,
      color: '#2563eb',
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      estimatedTime: '6 hours',
      difficulty: 'Beginner to Advanced',
      lessons: [
        { 
          id: 1, 
          title: 'Present Tense Mastery', 
          description: 'Learn all forms of present tense with real-world examples',
          duration: '12 min', 
          completed: true, 
          locked: false,
          difficulty: 'easy',
          points: 50,
          completedBy: 1250,
          rating: 4.8,
          progress: 100,
          videoUrl: 'https://www.youtube.com/embed/FIcNG3uoqCo',
          hasVideo: true
        },
        { 
          id: 2, 
          title: 'Past Tense Complete Guide', 
          description: 'Master all past tense forms including simple past, past continuous, and past perfect',
          duration: '15 min', 
          completed: true, 
          locked: false,
          difficulty: 'easy',
          points: 60,
          completedBy: 980,
          rating: 4.7,
          progress: 100,
          videoUrl: 'https://www.youtube.com/embed/12vvBvr1ouc',
          hasVideo: true
        },
        { 
          id: 3, 
          title: 'Future Tense Explained', 
          description: 'Understand all future tense forms and when to use them correctly in English',
          duration: '14 min', 
          completed: false, 
          locked: false,
          difficulty: 'medium',
          points: 70,
          completedBy: 750,
          rating: 4.9,
          progress: 45,
          isNew: true,
          videoUrl: 'https://www.youtube.com/embed/qMRy0MvVZUA',
          hasVideo: true
        },
        { 
          id: 4, 
          title: 'Perfect Tenses Deep Dive', 
          description: 'Advanced lesson on present, past, and future perfect tenses',
          duration: '25 min', 
          completed: false, 
          locked: true,
          difficulty: 'hard',
          points: 100,
          rating: 4.6
        }
      ]
    },
    {
      id: 2,
      title: 'Vocabulary',
      description: 'Expand your English word knowledge with smart learning techniques',
      icon: <Star className="w-6 h-6" />,
      color: '#10b981',
      progress: 60,
      totalLessons: 15,
      completedLessons: 9,
      estimatedTime: '8 hours',
      difficulty: 'All Levels',
      lessons: [
        { 
          id: 5, 
          title: 'Daily Life Essentials', 
          description: 'Essential vocabulary for everyday conversations and situations',
          duration: '12 min', 
          completed: true, 
          locked: false,
          difficulty: 'easy',
          points: 40,
          completedBy: 2100,
          rating: 4.9,
          progress: 100
        },
        { 
          id: 6, 
          title: 'Business Communication', 
          description: 'Professional vocabulary for workplace success',
          duration: '22 min', 
          completed: false, 
          locked: false,
          difficulty: 'medium',
          points: 80,
          completedBy: 650,
          rating: 4.7,
          progress: 30
        },
        { 
          id: 7, 
          title: 'Academic Excellence', 
          description: 'Advanced vocabulary for academic and formal writing',
          duration: '30 min', 
          completed: false, 
          locked: true,
          difficulty: 'hard',
          points: 120,
          rating: 4.8
        }
      ]
    },
    {
      id: 3,
      title: 'Speaking',
      description: 'Improve pronunciation and conversation skills with AI feedback',
      icon: <Play className="w-6 h-6" />,
      color: '#f59e0b',
      progress: 45,
      totalLessons: 10,
      completedLessons: 4,
      estimatedTime: '5 hours',
      difficulty: 'Interactive',
      lessons: [
        { 
          id: 8, 
          title: 'Pronunciation Fundamentals', 
          description: 'Master basic English sounds and pronunciation patterns',
          duration: '10 min', 
          completed: true, 
          locked: false,
          difficulty: 'easy',
          points: 60,
          completedBy: 1800,
          rating: 4.8,
          progress: 100
        },
        { 
          id: 9, 
          title: 'Conversation Confidence', 
          description: 'Learn how to start and maintain engaging conversations',
          duration: '15 min', 
          completed: false, 
          locked: false,
          difficulty: 'medium',
          points: 75,
          completedBy: 920,
          rating: 4.9,
          progress: 60,
          isNew: true
        },
        { 
          id: 10, 
          title: 'Advanced Fluency', 
          description: 'Develop native-like fluency and natural speech patterns',
          duration: '25 min', 
          completed: false, 
          locked: true,
          difficulty: 'hard',
          points: 150,
          rating: 4.7
        }
      ]
    },
    {
      id: 4,
      title: 'Listening',
      description: 'Enhance your English listening comprehension with authentic content',
      icon: <Clock className="w-6 h-6" />,
      color: '#8b5cf6',
      progress: 80,
      totalLessons: 8,
      completedLessons: 6,
      estimatedTime: '4 hours',
      difficulty: 'Progressive',
      lessons: [
        { 
          id: 11, 
          title: 'Listening Foundations', 
          description: 'Build core listening skills with clear, slow speech',
          duration: '8 min', 
          completed: true, 
          locked: false,
          difficulty: 'easy',
          points: 45,
          completedBy: 2500,
          rating: 4.9,
          progress: 100
        },
        { 
          id: 12, 
          title: 'News & Media Comprehension', 
          description: 'Understand news broadcasts and media content',
          duration: '20 min', 
          completed: true, 
          locked: false,
          difficulty: 'medium',
          points: 85,
          completedBy: 1200,
          rating: 4.6,
          progress: 100
        },
        { 
          id: 13, 
          title: 'Native Speaker Mastery', 
          description: 'Comprehend fast, natural conversations between native speakers',
          duration: '18 min', 
          completed: false, 
          locked: false,
          difficulty: 'hard',
          points: 110,
          completedBy: 450,
          rating: 4.8,
          progress: 75
        }
      ]
    }
  ];

  if (selectedTopic) {
    const topic = topics.find(t => t.id === selectedTopic);
    
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem 0' }}>
        <div className="container">
          <div style={{ marginBottom: '2rem' }}>
            <button 
              onClick={() => setSelectedTopic(null)}
              className="btn btn-secondary"
              style={{ marginBottom: '1.5rem' }}
            >
              ← Back to Topics
            </button>
            
            <div className="card" style={{ 
              background: `linear-gradient(135deg, ${topic.color} 0%, ${topic.color}dd 100%)`,
              color: 'white',
              marginBottom: '2rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '150px',
                height: '150px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '50%'
              }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  padding: '1.5rem',
                  borderRadius: '1rem'
                }}>
                  {topic.icon}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h1 style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: '800', 
                    marginBottom: '0.75rem'
                  }}>
                    {topic.title}
                  </h1>
                  <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '1rem' }}>
                    {topic.description}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
                    <div>
                      <strong>{topic.completedLessons}/{topic.totalLessons}</strong> Lessons
                    </div>
                    <div>
                      <strong>{topic.estimatedTime}</strong> Total Time
                    </div>
                    <div>
                      <strong>{topic.difficulty}</strong> Level
                    </div>
                  </div>
                </div>
              </div>
            
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600' }}>Overall Progress</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: '700' }}>{topic.progress}%</span>
                </div>
                <div className="progress-bar" style={{ height: '0.75rem' }}>
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${topic.progress}%`,
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,1) 100%)'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid" style={{ gap: '1.5rem' }}>
            {topic.lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isLocked={lesson.locked}
                isCompleted={lesson.completed}
                onStart={(lesson) => console.log('Starting lesson:', lesson.title)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="neon-text" style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            marginBottom: '1rem',
            color: 'var(--text-heading)'
          }}>
            Learning Hub
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Master English through interactive lessons and engaging video content
          </p>
          
          {/* Tab Navigation */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => setActiveTab('lessons')}
              className={`btn ${activeTab === 'lessons' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem'
              }}
            >
              <BookOpen size={20} />
              Interactive Lessons
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`btn ${activeTab === 'videos' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem'
              }}
            >
              <Video size={20} />
              Learning Videos
            </button>
          </div>
        </div>
        
        {activeTab === 'videos' ? (
          <LearningVideos />
        ) : (

          <div className="grid grid-2">
            {topics.map((topic, index) => (
              <motion.div 
                key={topic.id} 
                className="card card-interactive"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedTopic(topic.id)}
                whileHover={{ scale: 1.02, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ 
                    backgroundColor: `${topic.color}20`,
                    color: topic.color,
                    padding: '1rem',
                    borderRadius: '0.75rem'
                  }}>
                    {topic.icon}
                  </div>
                  <div>
                    <h3 className="gradient-text" style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '600',
                      marginBottom: '0.25rem'
                    }}>
                      {topic.title}
                    </h3>
                    <p style={{ 
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem'
                    }}>
                      {topic.lessons.length} lessons
                    </p>
                  </div>
                </div>
                
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  marginBottom: '1rem',
                  lineHeight: '1.6'
                }}>
                  {topic.description}
                </p>
                
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>Progress</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{topic.progress}%</span>
                  </div>
                  <div className="progress-bar" style={{ marginTop: '0.5rem' }}>
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${topic.progress}%`,
                        backgroundColor: topic.color
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  <span>
                    {topic.lessons.filter(l => l.completed).length} of {topic.lessons.length} completed
                  </span>
                  <Play className="w-4 h-4" style={{ color: topic.color }} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Learning;