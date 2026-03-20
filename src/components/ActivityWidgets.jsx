import { useState, useRef } from 'react';

export default function ActivityWidgets({ peaks, callTypes }) {
  const [donutTooltip, setDonutTooltip] = useState({ visible: false, x: 0, y: 0, label: '', percent: 0 });
  const donutContainerRef = useRef(null);

  const colors = ['var(--donut-blue)', 'var(--donut-teal)', 'var(--donut-orange)', 'var(--donut-red)', '#9b59b6', '#f39c12'];
  const friendlyNames = {
    web_call: 'Web Call',
    phone_call: 'Phone Call',
    unknown: 'Unknown',
  };

  const totalTypeCalls = callTypes ? Object.values(callTypes).reduce((a, b) => a + b, 0) : 0;
  const typeEntries = callTypes && totalTypeCalls > 0
    ? Object.entries(callTypes).map(([type, count], i) => ({
        label: friendlyNames[type] || type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        percent: Math.round((count / totalTypeCalls) * 100),
        color: colors[i % colors.length],
      }))
    : [{ label: 'No Data', percent: 100, color: '#ccc' }];

  // Build segment angles for hit detection
  let segments = [];
  let cumulative = 0;
  typeEntries.forEach(entry => {
    const startAngle = cumulative * 3.6;
    cumulative += entry.percent;
    const endAngle = cumulative * 3.6;
    segments.push({ ...entry, startAngle, endAngle });
  });

  // Build conic-gradient
  let gradientParts = [];
  let cumulativeGrad = 0;
  typeEntries.forEach(entry => {
    const start = cumulativeGrad;
    cumulativeGrad += entry.percent;
    gradientParts.push(`${entry.color} ${start}% ${cumulativeGrad}%`);
  });
  const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;

  const handleDonutMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    const radius = rect.width / 2;
    const innerRadius = radius * 0.25;
    const dist = Math.sqrt(x * x + y * y);

    if (dist < innerRadius * 2 || dist > radius) {
      setDonutTooltip(prev => ({ ...prev, visible: false }));
      return;
    }

    let angle = Math.atan2(x, -y) * (180 / Math.PI);
    if (angle < 0) angle += 360;

    const segment = segments.find(s => angle >= s.startAngle && angle < s.endAngle);
    if (segment && donutContainerRef.current) {
      const containerRect = donutContainerRef.current.getBoundingClientRect();
      // Position tooltip relative to the container, clamped to stay inside
      let tooltipX = e.clientX - containerRect.left;
      let tooltipY = e.clientY - containerRect.top - 45;

      // Clamp X so tooltip doesn't overflow left/right
      const tooltipWidth = 180; // approximate
      tooltipX = Math.max(tooltipWidth / 2 + 8, Math.min(tooltipX, containerRect.width - tooltipWidth / 2 - 8));
      // Clamp Y so tooltip doesn't overflow top
      tooltipY = Math.max(8, tooltipY);

      setDonutTooltip({
        visible: true,
        x: tooltipX,
        y: tooltipY,
        label: segment.label,
        percent: segment.percent,
      });
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

      {/* Call Types Distribution */}
      <div ref={donutContainerRef} style={{
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '24px',
        background: '#f9fafa',
        position: 'relative',
        overflow: 'visible',
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '32px' }}>Call Types Distribution</h3>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '32px' }}>

          <div
            style={{
              width: '180px', height: '180px',
              borderRadius: '50%',
              background: conicGradient,
              position: 'relative',
              flexShrink: 0,
              cursor: 'pointer',
            }}
            onMouseMove={handleDonutMouseMove}
            onMouseLeave={() => setDonutTooltip(prev => ({ ...prev, visible: false }))}
          >
            <div style={{
              position: 'absolute', top: '25%', left: '25%', width: '50%', height: '50%',
              background: '#f9fafa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '600', fontSize: '1rem', color: 'var(--text-dark)', pointerEvents: 'none'
            }}>
              Call Types
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem' }}>
            {typeEntries.map((entry, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: entry.color }}></div>
                {entry.label}: {entry.percent}%
              </div>
            ))}
          </div>
        </div>

        {/* Donut Tooltip */}
        {donutTooltip.visible && (
          <div style={{
            position: 'absolute',
            left: donutTooltip.x,
            top: donutTooltip.y,
            transform: 'translateX(-50%)',
            background: '#1a1a2e',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            {donutTooltip.label}: {donutTooltip.percent}%
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

      {/* Peak Call Hours */}
      <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '24px', background: '#f3f4fa' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '24px' }}>Peak Call Hours</h3>
        <div style={{ display: 'flex', gap: '16px', height: '100%', alignItems: 'center' }}>
          {(peaks && peaks.length > 0 ? peaks : ['N/A']).map((time) => (
            <div key={time} style={{
              background: 'white',
              border: '1px solid rgba(108, 92, 231, 0.3)',
              borderRadius: '8px',
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1
            }}>
              <div style={{ color: '#4B0082', fontWeight: '700', fontSize: '1.4rem', marginBottom: '8px' }}>{time}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>High Volume</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
