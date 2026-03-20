import React from 'react';

const cardsData = [
  { id: 'spa', icon: '🌸', title: 'Spa Receptionist', subtitle: 'Talk to Sarah at Serenity Springs Spa', bg: '#2D1B2D' },
  { id: 'auto', icon: '🚗', title: 'Automobile Service', subtitle: 'Talk to Mike at Premier Auto Service Center', bg: '#1A1F2D' },
  { id: 'law', icon: '⚖️', title: 'Law Firm Receptionist', subtitle: 'Talk to Jennifer at Mitchell & Associates Law Firm', bg: '#2D251B' },
  { id: 'tata', icon: '🚙', title: 'Tata Motors (Hindi)', subtitle: 'Talk to Priya at Tata Motors Showroom Delhi', bg: '#1B2D1F' },
  { id: 'hospital', icon: '🏥', title: 'Hospital Appointments', subtitle: 'Talk to Maria at City General Hospital', bg: '#2B1A2B' },
  { id: 'kia', icon: '🚘', title: 'Kia Motors (Hindi)', subtitle: 'Talk to Priya at Kia Motors Showroom Mumbai', bg: '#1A1C2B' },
  { id: 'sharvik', icon: '🏠', title: 'Sharvik Properties', subtitle: 'Talk to Agent at Sharvik Properties', bg: '#172727' },
  { id: 'mortgage', icon: '🏦', title: 'Done Mortgage', subtitle: 'Talk to Agent at Done Mortgage', bg: '#3B1A2B' },
  { id: 'facile', icon: '📈', title: 'Facile Fintax Inc.', subtitle: 'Talk to Agent at Facile Fintax', bg: '#252525' },
  { id: 'dental', icon: '🦷', title: 'Bright Smile Dental Clinic', subtitle: 'Talk to Agent at Bright Smile', bg: '#1E2C22' },
  { id: 'ca', icon: '💼', title: 'CA Office Demo(Hindi)', subtitle: 'Talk to Agent at CA Office', bg: '#332924' },
  { id: 'deepa', icon: '👩‍⚕️', title: "Dr. Deepa Sangole's Women's Health Clinic", subtitle: 'Talk to Receptionist', bg: '#401C2B' },
  { id: 'guardian', icon: '🛡️', title: 'Guardian Shield Insurance Services', subtitle: 'Talk to Agent at Guardian Shield', bg: '#1A1A3A' },
  { id: 'century', icon: '🏘️', title: 'Century 21 - Inbound call handling', subtitle: 'Talk to Agent at Century 21', bg: '#29331A' },
  { id: 'osmos', icon: '🍔', title: 'Osmos Fast Food- Order taking', subtitle: 'Talk to Agent at Osmos', bg: '#3B1A12' },
  { id: 'bombay', icon: '🍽️', title: 'Bombay bar and Grill', subtitle: 'Talk to Agent at Bombay bar', bg: '#42111A' },
  { id: 'grover', icon: '📊', title: 'Grover CPA', subtitle: 'Talk to Agent at Grover CPA', bg: '#1A252B' },
  { id: 'pxc', icon: '🌏', title: 'PXC Pacific Global', subtitle: 'Talk to Agent at PXC Pacific Global', bg: '#113022' },
  { id: 'atlantic', icon: '🛂', title: 'Atlantic Immigration Demo', subtitle: 'Talk to Agent at Atlantic Immigration', bg: '#112244' },
  { id: 'dosa', icon: '🫓', title: 'Dosa Boyz', subtitle: 'Talk to Agent at Dosa Boyz', bg: '#4A2A0E' },
];

const Card = ({ id, icon, title, subtitle, bg, onSelectCard }) => (
  <div className="agent-card" style={{
    backgroundColor: bg,
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.05)'
  }} onClick={() => onSelectCard(id)}>
    <div style={{ fontSize: '2rem', marginBottom: '12px', lineHeight: 1 }}>{icon}</div>
    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: '0 0 8px 0', fontFamily: 'Inter, sans-serif' }}>{title}</h3>
    <p style={{ color: '#9CA3AF', margin: '0 0 24px 0', fontSize: '0.875rem', lineHeight: '1.4' }}>{subtitle}</p>
    
    <div style={{ marginTop: 'auto' }}>
      <button className="start-btn" style={{
        backgroundColor: '#C58D34',
        color: '#000000',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 24px',
        fontWeight: '600',
        fontSize: '0.9rem',
        cursor: 'pointer',
        width: '100%'
      }}>Start Conversation</button>
    </div>
  </div>
);

export default function MainDashboard({ onLogout, onSelectAgent }) {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0E0E10',
      color: '#ffffff',
      fontFamily: 'Inter, -apple-system, sans-serif',
      padding: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px', paddingRight: '24px' }}>
        <button onClick={onLogout} style={{ 
          backgroundColor: '#0E0E10', 
          border: '1px solid #333333', 
          color: '#ffffff', 
          padding: '8px 16px', 
          borderRadius: '4px', 
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '0.875rem'
        }}>Logout</button>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', margin: '0 0 8px 0' }}>AI Voice Receptionist Demo</h1>
        <p style={{ fontSize: '1.1rem', color: '#9CA3AF', margin: 0, fontWeight: '400' }}>Choose a receptionist to start your conversation</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        maxWidth: '1000px',
        margin: '0 auto',
        paddingBottom: '64px'
      }}>
        {cardsData.map((c) => (
          <Card key={c.id} {...c} onSelectCard={() => onSelectAgent(c)} />
        ))}
      </div>
    </div>
  );
}
