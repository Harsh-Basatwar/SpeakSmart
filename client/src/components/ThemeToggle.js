import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary"
      style={{
        padding: '0.75rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: theme === 'dark' ? 'var(--gradient-primary)' : 'var(--bg-card)',
        color: theme === 'dark' ? 'white' : 'var(--text-primary)',
        border: `2px solid ${theme === 'dark' ? 'transparent' : 'var(--border)'}`,
        boxShadow: 'var(--shadow)'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px) scale(1.05)';
        e.target.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0) scale(1)';
        e.target.style.boxShadow = 'var(--shadow)';
      }}
    >
      {theme === 'light' ? (
        <>
          <Moon size={18} />
          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Dark</span>
        </>
      ) : (
        <>
          <Sun size={18} />
          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Light</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;