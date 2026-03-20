export default function ActivityWidgets({ peaks }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      
      {/* Call Types Distribution */}
      <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '24px', background: '#f9fafa' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '32px' }}>Call Types Distribution</h3>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '32px' }}>
          
          <div style={{
            width: '180px', height: '180px',
            borderRadius: '50%',
            background: `conic-gradient(
              var(--donut-blue) 0% 45%,
              var(--donut-teal) 45% 70%,
              var(--donut-orange) 70% 82%,
              var(--donut-red) 82% 100%
            )`,
            position: 'relative',
            flexShrink: 0
          }}>
            <div style={{
              position: 'absolute', top: '25%', left: '25%', width: '50%', height: '50%',
              background: '#f9fafa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '600', fontSize: '1rem', color: 'var(--text-dark)'
            }}>
              Call Types
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--donut-blue)' }}></div> Appointment Scheduling: 45%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--donut-teal)' }}></div> General Inquiries: 25%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--donut-orange)' }}></div> Customer Complaints: 12%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--donut-red)' }}></div> Irrelevant: 18%
            </div>
          </div>
        </div>
      </div>

      {/* Peak Call Hours */}
      <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '24px', background: '#f3f4fa' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '24px' }}>Peak Call Hours</h3>
        <div style={{ display: 'flex', gap: '16px', height: '100%', alignItems: 'center' }}>
          {(peaks || ['10:00 AM', '2:00 PM', '4:00 PM']).map((time) => (
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
