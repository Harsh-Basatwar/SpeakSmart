import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Menu, X, BookOpen, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = user ? (
    user.role === 'student' ? [
      { to: '/student-dashboard', label: 'Dashboard' },
      { to: '/learning', label: 'Learning' },
      { to: '/quiz', label: 'Quiz' },
      { to: '/flashcards', label: 'Flashcards' },
      { to: '/progress', label: 'Progress' },
      { to: '/chatbot', label: 'Chatbot' }
    ] : user.role === 'teacher' ? [
      { to: '/teacher-dashboard', label: 'Dashboard' }
    ] : user.role === 'admin' ? [
      { to: '/admin-dashboard', label: 'Dashboard' }
    ] : []
  ) : [];

  return (
    <nav style={{ 
      background: 'var(--bg-navbar)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-lg)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '1rem' 
      }}>
        {/* Logo */}
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          textDecoration: 'none',
          color: 'var(--text-navbar)',
          fontWeight: '700',
          fontSize: '1.25rem',
          fontFamily: 'Poppins, sans-serif'
        }}>
          <BookOpen size={28} />
          SpeakSmart
        </Link>

        {/* Desktop Navigation */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2rem'
        }} className="desktop-nav">
          {navLinks.map(link => (
            <Link 
              key={link.to}
              to={link.to} 
              style={{ 
                textDecoration: 'none',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: '500',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-navbar)'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* User Actions */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: '500'
              }} className="desktop-nav">
                <User size={16} />
                {user.name}
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <LogOut size={16} />
                <span className="desktop-nav">Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }} className="desktop-nav">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: 'rgba(255, 255, 255, 0.8)',
              display: 'none'
            }}
            className="mobile-menu-btn"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{
          background: 'var(--gradient-glass)',
          borderTop: '1px solid var(--border)',
          padding: '1rem',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }} className="mobile-menu">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {navLinks.map(link => (
              <Link 
                key={link.to}
                to={link.to} 
                onClick={() => setIsMenuOpen(false)}
                style={{ 
                  textDecoration: 'none',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: '500',
                  padding: '0.5rem 0'
                }}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                <Link to="/login" className="btn btn-secondary" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;