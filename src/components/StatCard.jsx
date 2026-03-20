import React from 'react';

export default function StatCard({ icon, title, value, trend }) {
  const isPositive = trend.startsWith('+');
  const isCalendar = icon === 'calendar';

  const renderIcon = () => {
    switch(icon) {
      case 'phone': return '📞';
      case 'clock': return '🕒';
      case 'calendar': return '📅';
      default: return '📊';
    }
  };

  return (
    <div style={{
      background: isCalendar ? 'var(--success-bg)' : '#f3f4fa', 
      borderRadius: '8px',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      border: '1px solid var(--border-color)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1.5rem', filter: 'grayscale(0%)' }}>{renderIcon()}</span>
        <div style={{ 
          fontSize: '0.85rem', 
          fontWeight: '600', 
          color: isPositive ? 'var(--success-green)' : 'var(--donut-red)'
        }}>
          ↗ {trend}
        </div>
      </div>
      <div style={{ marginTop: '4px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-dark)' }}>{value}</div>
      </div>
    </div>
  );
}
