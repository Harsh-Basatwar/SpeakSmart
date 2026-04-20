import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { BookOpen, Users, Brain, MessageCircle, BarChart3, Award, Play, CheckCircle, Star, Globe, Zap, Trophy, Target, Clock, Headphones } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      title: "Interactive Learning",
      description: "Engage with comprehensive English content organized by Grammar, Vocabulary, Speaking, and Listening with real-time feedback.",
      stats: "500+ Lessons"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop",
      title: "Smart Quizzes",
      description: "Test your knowledge with multiple-choice, fill-in-the-blank, and listening-based questions powered by AI.",
      stats: "200+ Quizzes"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop",
      title: "AI Chatbot",
      description: "Practice conversations with our advanced AI-powered voice assistant supporting speech-to-text and natural dialogue.",
      stats: "24/7 Available"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics, progress charts, and personalized skill assessments.",
      stats: "Real-time Analytics"
    },
    {
      icon: <Award className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop",
      title: "Digital Flashcards",
      description: "Master vocabulary with interactive flashcards featuring native pronunciation, examples, and spaced repetition.",
      stats: "5000+ Words"
    },
    {
      icon: <Users className="w-8 h-8" />,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      title: "Teacher Dashboard",
      description: "Comprehensive tools for educators to track student progress, create custom content, and manage classes efficiently.",
      stats: "Advanced Tools"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Professional",
      image: "👩‍💼",
      text: "This platform transformed my English skills in just 3 months! The AI chatbot feels like talking to a real teacher.",
      rating: 5
    },
    {
      name: "Miguel Rodriguez",
      role: "University Student",
      image: "👨‍🎓",
      text: "The interactive lessons and progress tracking kept me motivated. I improved my IELTS score by 2 bands!",
      rating: 5
    },
    {
      name: "Li Wei",
      role: "Software Engineer",
      image: "👨‍💻",
      text: "Perfect for busy professionals. I can practice during breaks and the voice recognition is incredibly accurate.",
      rating: 5
    }
  ];

  const learningPaths = [
    {
      title: "Beginner Path",
      duration: "3-6 months",
      icon: <Target size={24} />,
      color: "#10b981",
      features: ["Basic Grammar", "Essential Vocabulary", "Simple Conversations", "Pronunciation Basics"]
    },
    {
      title: "Intermediate Path",
      duration: "6-12 months",
      icon: <Clock size={24} />,
      color: "#f59e0b",
      features: ["Complex Grammar", "Business English", "Fluent Speaking", "Listening Comprehension"]
    },
    {
      title: "Advanced Path",
      duration: "12+ months",
      icon: <Trophy size={24} />,
      color: "#8b5cf6",
      features: ["Native Fluency", "Academic Writing", "Professional Communication", "Cultural Nuances"]
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section style={{ 
        background: 'var(--bg-primary)',
        color: 'white',
        padding: '6rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '150px',
          height: '150px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '20%',
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float 7s ease-in-out infinite'
        }} />

        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&crop=center" 
              alt="Students learning" 
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '20px',
                objectFit: 'cover',
                border: '3px solid rgba(255,255,255,0.3)',
                boxShadow: 'var(--shadow-lg)'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop&crop=center" 
              alt="Online learning" 
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '20px',
                objectFit: 'cover',
                border: '3px solid rgba(255,255,255,0.2)',
                boxShadow: 'var(--shadow-lg)'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&crop=center" 
              alt="Language learning" 
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '20px',
                objectFit: 'cover',
                border: '3px solid rgba(255,255,255,0.25)',
                boxShadow: 'var(--shadow-lg)'
              }}
            />
          </div>
          
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '800', 
            marginBottom: '1.5rem',
            lineHeight: '1.1',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <span style={{ color: 'white' }}>
              {user ? `Welcome back, ${user.name}!` : 'Master English with'}
            </span>
            <br />
            <span className="gradient-text" style={{ 
              background: 'linear-gradient(45deg, #FFFFFF, #E0E7FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>SpeakSmart</span>
          </h1>
          
          <p style={{ 
            fontSize: '1.4rem', 
            marginBottom: '3rem', 
            opacity: 0.95,
            maxWidth: '700px',
            margin: '0 auto 3rem',
            lineHeight: '1.6',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            {user ? 
              'Ready to continue your English learning journey? Access your personalized dashboard and pick up where you left off.' :
              'Transform your English skills with our comprehensive learning platform featuring interactive lessons, smart quizzes, AI conversation practice, and detailed progress tracking designed for your success.'
            }
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            {user ? (
              <Link 
                to={user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'}
                className="btn"
                style={{ 
                  backgroundColor: 'white',
                  color: 'var(--primary)',
                  fontSize: '1.2rem',
                  padding: '1.2rem 2.5rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Play size={20} />
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/signup" 
                  className="btn"
                  style={{ 
                    backgroundColor: 'white',
                    color: 'var(--primary)',
                    fontSize: '1.2rem',
                    padding: '1.2rem 2.5rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Zap size={20} />
                  Start Learning Free
                </Link>
                <Link 
                  to="/login" 
                  className="btn"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.3)',
                    fontSize: '1.2rem',
                    padding: '1.2rem 2.5rem',
                    fontWeight: '600',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Play size={20} />
                  Sign In
                </Link>
              </>
            )}
          </div>
          
          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap',
            opacity: 0.9
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>500+</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Lessons</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>200+</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Quizzes</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>24/7</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>AI Support</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Free</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Access</div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </section>

      {/* Learning Paths Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              Choose Your Learning Path
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Personalized learning journeys designed for every skill level
            </p>
          </div>

          <div className="grid grid-3">
            {learningPaths.map((path, index) => (
              <div key={index} className="card" style={{ 
                textAlign: 'center',
                border: `2px solid ${path.color}20`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  backgroundColor: path.color
                }} />
                
                <div style={{ 
                  color: path.color,
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {path.icon}
                </div>
                
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  {path.title}
                </h3>
                
                <p style={{ 
                  color: 'var(--text-secondary)',
                  marginBottom: '1.5rem',
                  fontWeight: '500'
                }}>
                  {path.duration}
                </p>
                
                <div style={{ textAlign: 'left' }}>
                  {path.features.map((feature, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      color: 'var(--text-primary)'
                    }}>
                      <CheckCircle size={16} style={{ color: path.color }} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              Everything You Need to Learn English
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Our comprehensive platform provides all the tools and resources you need 
              for effective English language learning.
            </p>
          </div>

          <div className="grid grid-3">
            {features.map((feature, index) => (
              <div key={index} className="card card-interactive animate-fade-in" style={{ 
                textAlign: 'center',
                animationDelay: `${index * 0.1}s`,
                overflow: 'hidden'
              }}>
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    marginBottom: '1rem'
                  }}
                />
                <div style={{ 
                  color: 'var(--primary)', 
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  marginBottom: '0.75rem',
                  color: 'var(--text-primary)'
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  marginBottom: '1rem'
                }}>
                  {feature.description}
                </p>
                <div style={{
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  color: 'var(--primary)',
                  padding: '0.5rem 1rem',
                  borderRadius: '1rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  display: 'inline-block'
                }}>
                  {feature.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              What Our Students Say
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: 'var(--text-secondary)'
            }}>
              Real success stories from learners around the world
            </p>
          </div>

          <div className="grid grid-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card card-interactive animate-fade-in" style={{ 
                textAlign: 'center',
                animationDelay: `${index * 0.1}s`
              }}>
                <div style={{ 
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  {testimonial.image}
                </div>
                
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  marginBottom: '1rem'
                }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                  ))}
                </div>
                
                <p style={{ 
                  color: 'var(--text-primary)',
                  fontStyle: 'italic',
                  marginBottom: '1rem',
                  lineHeight: '1.6'
                }}>
                  "{testimonial.text}"
                </p>
                
                <h4 style={{ 
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: '0.25rem'
                }}>
                  {testimonial.name}
                </h4>
                <p style={{ 
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}>
                  {testimonial.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="card" style={{ 
            maxWidth: '700px', 
            margin: '0 auto',
            background: 'var(--gradient-primary)',
            color: 'white',
            border: 'none',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '200px',
              height: '200px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '50%'
            }} />
            
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '1rem',
              position: 'relative',
              zIndex: 1
            }}>
              Ready to Start Your English Journey?
            </h2>
            <p style={{ 
              fontSize: '1.2rem', 
              marginBottom: '2rem',
              opacity: 0.9,
              position: 'relative',
              zIndex: 1
            }}>
              Join our community of learners and teachers. Create your account today 
              and begin improving your English skills with personalized AI-powered lessons.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 1
            }}>
              {user ? (
                <Link 
                  to={user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'}
                  className="btn"
                  style={{ 
                    backgroundColor: 'white',
                    color: 'var(--primary)',
                    fontSize: '1.2rem',
                    padding: '1rem 2rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Play size={20} />
                  Continue Learning
                </Link>
              ) : (
                <Link 
                  to="/signup" 
                  className="btn"
                  style={{ 
                    backgroundColor: 'white',
                    color: 'var(--primary)',
                    fontSize: '1.2rem',
                    padding: '1rem 2rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Zap size={20} />
                  Get Started Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;