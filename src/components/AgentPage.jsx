import React, { useState, useEffect, useRef } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';

const retellWebClient = new RetellWebClient();

export default function AgentPage({ agent, onBack, onOpenAnalytics }) {
  const [callStatus, setCallStatus] = useState('idle'); // 'idle', 'connecting', 'active'
  const [transcripts, setTranscripts] = useState([]);
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    const handleCallStarted = () => setCallStatus('active');
    const handleCallEnded = () => {
      setCallStatus('idle');
      setTranscripts([]);
    };
    const handleUpdate = (update) => {
      console.log('Transcript update received:', update);
      if (Array.isArray(update)) {
         setTranscripts([...update]);
      } else if (update && Array.isArray(update.transcript)) {
         setTranscripts([...update.transcript]);
      } else if (update && update.content) {
         setTranscripts(prev => [...prev, update]);
      }
    };
    const handleError = (error) => {
      console.error('Retell SDK Error:', error);
      setCallStatus('idle');
    };

    retellWebClient.on('call_started', handleCallStarted);
    retellWebClient.on('call_ended', handleCallEnded);
    retellWebClient.on('update', handleUpdate);
    retellWebClient.on('error', handleError);

    return () => {
      retellWebClient.off('call_started', handleCallStarted);
      retellWebClient.off('call_ended', handleCallEnded);
      retellWebClient.off('update', handleUpdate);
      retellWebClient.off('error', handleError);
    };
  }, []);

  const handleStartCall = async () => {
    try {
      setCallStatus('connecting');
      
      const payload = {
        // We use the exact agent ID provided by the user payload
        agent_id: "agent_7a9caf347c54066728de33800b"
      };
      
      const response = await fetch('https://api.retellai.com/v2/create-web-call', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer key_55749b4969d295ff4c31bebd9e43',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      if (!data.access_token) {
         throw new Error("No access token received: " + JSON.stringify(data));
      }

      await retellWebClient.startCall({
        accessToken: data.access_token
      });
      
    } catch (err) {
      console.error('Failed to start call', err);
      setCallStatus('idle');
      alert("Failed to connect to agent: " + err.message);
    }
  };

  const handleEndCall = () => {
    retellWebClient.stopCall();
    setCallStatus('idle');
    setTranscripts([]);
  };

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
       <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '48px' }}>
          <button onClick={onBack} style={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Back to Demo</button>
       </div>

       {callStatus === 'idle' ? (
         <div style={{ textAlign: 'center', marginTop: '15vh' }}>
            <div style={{ fontSize: '6rem', marginBottom: '24px' }}>{agent.icon}</div>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '16px' }}>{agent.title}</h1>
            <p style={{ color: '#9CA3AF', marginBottom: '48px', fontSize: '1.2rem' }}>Voice Receptionist System</p>

            <button className="start-call-btn" onClick={handleStartCall} style={{
               background: 'linear-gradient(to right, #9333ea, #2563eb)',
               color: '#fff', border: 'none', borderRadius: '8px', padding: '16px 48px',
               fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '16px'
            }}>📞 Start Call</button>
            <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Click to begin your conversation</p>
         </div>
       ) : (
         <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '70vh' }}>
            <div style={{ 
               flex: 1, 
               backgroundColor: '#f3f4f6', 
               borderRadius: '16px', 
               padding: '24px', 
               overflowY: 'auto',
               display: 'flex',
               flexDirection: 'column',
               gap: '16px'
            }}>
               {transcripts.map((msg, index) => {
                  const isAgent = msg.role === 'agent';
                  return (
                     <div key={index} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isAgent ? 'flex-start' : 'flex-end',
                        maxWidth: '100%'
                     }}>
                        <div style={{
                           backgroundColor: isAgent ? '#e5e7eb' : '#9333ea',
                           color: isAgent ? '#111827' : '#ffffff',
                           borderRadius: '12px',
                           padding: '12px 16px',
                           maxWidth: '80%'
                        }}>
                           {isAgent && <strong style={{ display: 'block', marginBottom: '4px' }}>{agent.title.split(' ')[0]}:</strong>}
                           <span style={{ lineHeight: '1.5' }}>{msg.content}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '4px' }}>
                           {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                     </div>
                  );
               })}
               {callStatus === 'connecting' && (
                  <div style={{ color: '#6B7280', textAlign: 'center', margin: '20px 0', fontStyle: 'italic' }}>
                     Connecting to {agent.title}... (Allow microphone access)
                  </div>
               )}
               <div ref={transcriptEndRef} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
               <button onClick={handleEndCall} style={{
                  backgroundColor: '#d1d5db',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '12px 32px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
               }}>
                  <span style={{ color: '#ef4444' }}>📞</span> End Call
               </button>
            </div>
         </div>
       )}

       {callStatus === 'idle' && (
         <button onClick={onOpenAnalytics} style={{
             position: 'fixed', bottom: '32px', left: '32px',
             background: 'linear-gradient(to right, #9333ea, #2563eb)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold'
         }}>
             📊 Analytics
         </button>
       )}
    </div>
  );
}
