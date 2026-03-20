import React from 'react';

export default function Header({ onClose, title }) {
  return (
    <div style={{
      background: 'var(--header-grad)',
      color: 'white',
      padding: '24px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '4px' }}>{title || 'Serenity Springs Spa Analytics'}</h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Last 30 Days Performance</p>
      </div>
      <button onClick={onClose} style={{ 
        background: 'transparent',
        border: 'none',
        color: 'white',
        fontSize: '1.5rem',
        cursor: 'pointer',
        padding: '0 8px',
        lineHeight: 1
      }}>✕</button>
    </div>
  );
}
