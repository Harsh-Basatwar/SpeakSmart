import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'var(--primary)', 
  trend, 
  trendValue, 
  subtitle,
  gradient = false 
}) => {
  return (
    <div 
      className="card" 
      style={{ 
        textAlign: 'center',
        background: gradient 
          ? `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`
          : 'var(--bg-card)',
        color: gradient ? 'white' : 'var(--text-primary)',
        border: gradient ? 'none' : '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {gradient && (
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }} />
      )}
      
      <div style={{ 
        backgroundColor: gradient ? 'rgba(255,255,255,0.2)' : `${color}20`,
        color: gradient ? 'white' : color,
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem',
        position: 'relative',
        zIndex: 1
      }}>
        {icon}
      </div>
      
      <h3 style={{ 
        fontSize: '2rem', 
        fontWeight: '700', 
        marginBottom: '0.5rem',
        color: gradient ? 'white' : 'var(--text-primary)',
        position: 'relative',
        zIndex: 1
      }}>
        {value}
      </h3>
      
      <p style={{ 
        color: gradient ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)', 
        fontSize: '0.875rem',
        fontWeight: '500',
        marginBottom: trend ? '0.5rem' : 0,
        position: 'relative',
        zIndex: 1
      }}>
        {title}
      </p>
      
      {subtitle && (
        <p style={{ 
          color: gradient ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)', 
          fontSize: '0.75rem',
          marginBottom: trend ? '0.5rem' : 0,
          position: 'relative',
          zIndex: 1
        }}>
          {subtitle}
        </p>
      )}
      
      {trend && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.25rem',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: trend === 'up' ? '#10b981' : '#ef4444',
          position: 'relative',
          zIndex: 1
        }}>
          {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trendValue}
        </div>
      )}
    </div>
  );
};

export default StatsCard;