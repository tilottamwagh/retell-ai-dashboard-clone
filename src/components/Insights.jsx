import React from 'react';

export default function Insights() {
  const Check = () => <span style={{ color: 'var(--success-green)', marginRight: '8px', fontWeight: 'bold' }}>✓</span>;
  const Info = () => <span style={{ color: 'var(--donut-blue)', marginRight: '8px', fontWeight: 'bold' }}>ℹ</span>;

  return (
    <div style={{
      background: 'var(--insights-bg)',
      border: '1px solid #fbe69e',
      borderRadius: '8px',
      padding: '24px'
    }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px' }}>Key Insights</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem', color: 'var(--text-dark)' }}>
        <li style={{ display: 'flex', alignItems: 'center' }}><Check /> Call volume increased by 12% compared to last month</li>
        <li style={{ display: 'flex', alignItems: 'center' }}><Check /> Average call duration is 4.5 minutes, showing good engagement</li>
        <li style={{ display: 'flex', alignItems: 'center' }}><Check /> Call relevance rate at 85%, indicating high-quality interactions</li>
        <li style={{ display: 'flex', alignItems: 'center' }}><Info /> Consider adding staff during peak hours: 10:00 AM, 2:00 PM, 4:00 PM</li>
      </ul>
    </div>
  );
}
