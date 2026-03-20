import React from 'react';

export default function BarChart() {
  // Generate mock data mimicking the random peaks and valleys of a call volume graph
  const data = [
    30, 18, 25, 38, 30, 20, 12, 28, 36, 18, 33, 20, 19, 35, 28, 14, 20, 16, 32, 28, 38, 28, 25, 18, 30, 21, 28, 25
  ];
  
  return (
    <div style={{
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '24px',
      background: 'white'
    }}>
      <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '24px' }}>Daily Call Volume (Last 30 Days)</h3>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        height: '240px',
        gap: '4px',
        paddingLeft: '32px',
        position: 'relative',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ 
          position: 'absolute', left: 0, bottom: '50%', transform: 'rotate(-90deg)', 
          fontSize: '0.75rem', color: 'var(--text-muted)', transformOrigin: 'left bottom', marginLeft: '-15px' 
        }}>
          Number of Calls
        </div>
        {data.map((height, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${(height / 40) * 100}%`,
            background: 'var(--bar-grad)',
            borderRadius: '2px 2px 0 0'
          }}></div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '32px' }}>
        <span>Feb 19</span>
        <span>Feb 24</span>
        <span>Mar 1</span>
        <span>Mar 6</span>
        <span>Mar 11</span>
        <span>Mar 16</span>
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Date</div>
    </div>
  );
}
