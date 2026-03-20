import React, { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'Samarth' && password === 'Samarth@202288') {
      onLogin();
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        background: '#1c1c1e',
        border: '1px solid #2c2c2e',
        borderRadius: '12px',
        padding: '32px',
        width: '400px',
        color: '#fff'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '600', margin: 0, marginBottom: '8px' }}>Login</h2>
        <p style={{ color: '#888', fontSize: '0.9rem', margin: 0, marginBottom: '32px' }}>Enter your credentials to access the demo</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="demo"
              style={{
                background: '#111',
                border: '1px solid #333',
                color: '#fff',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '1rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              style={{
                background: '#111',
                border: '1px solid #333',
                color: '#fff',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '1rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {error && <div style={{ color: '#ff4d4d', fontSize: '0.85rem' }}>{error}</div>}

          <button type="submit" style={{
            background: '#c58d34',
            color: '#000',
            border: 'none',
            borderRadius: '6px',
            padding: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '8px'
          }}>Login</button>
        </form>
      </div>
    </div>
  );
}
