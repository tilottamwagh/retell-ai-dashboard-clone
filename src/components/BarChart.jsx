import React, { useState, useRef } from 'react';

export default function BarChart({ dailyVolume }) {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, content: '' });
  const chartRef = useRef(null);
  const data = dailyVolume && dailyVolume.length > 0 ? dailyVolume : [];
  const maxCount = data.length > 0 ? Math.max(...data.map(d => d.count)) : 1;

  const labelCount = 6;
  const labelIndices = data.length > labelCount
    ? Array.from({ length: labelCount }, (_, i) => Math.round(i * (data.length - 1) / (labelCount - 1)))
    : data.map((_, i) => i);

  if (data.length === 0) {
    return (
      <div style={{
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '24px',
        background: 'white'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '24px' }}>Daily Call Volume (Last 30 Days)</h3>
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No call data available for the last 30 days.
        </div>
      </div>
    );
  }

  const handleBarHover = (e, item) => {
    if (!chartRef.current) return;
    const chartRect = chartRef.current.getBoundingClientRect();
    const barRect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: barRect.left - chartRect.left + barRect.width / 2,
      y: barRect.top - chartRect.top - 8,
      content: `${item.count} calls\n${item.avgDuration} min avg`
    });
  };

  return (
    <div ref={chartRef} style={{
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '24px',
      background: 'white',
      position: 'relative',
      overflow: 'visible'
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
        {data.map((item, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${(item.count / maxCount) * 100}%`,
              minHeight: item.count > 0 ? '4px' : '0',
              background: 'var(--bar-grad)',
              borderRadius: '2px 2px 0 0',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => handleBarHover(e, item)}
            onMouseMove={(e) => handleBarHover(e, item)}
            onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
          ></div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '32px' }}>
        {labelIndices.map(idx => (
          <span key={idx}>{data[idx]?.date}</span>
        ))}
      </div>
      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>Date</div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div style={{
          position: 'absolute',
          left: tooltip.x,
          top: tooltip.y,
          transform: 'translate(-50%, -100%)',
          background: '#1a1a2e',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: '600',
          whiteSpace: 'pre-line',
          lineHeight: '1.4',
          pointerEvents: 'none',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          {tooltip.content}
          <div style={{
            position: 'absolute',
            bottom: '-5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #1a1a2e',
          }}></div>
        </div>
      )}
    </div>
  );
}
