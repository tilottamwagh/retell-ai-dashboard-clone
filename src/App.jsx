import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import StatCard from './components/StatCard';
import BarChart from './components/BarChart';
import ActivityWidgets from './components/ActivityWidgets';
import Insights from './components/Insights';
import MainDashboard from './components/MainDashboard';
import LoginPage from './components/LoginPage';
import AgentPage from './components/AgentPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const getAnalytics = (id) => {
    switch(id) {
      case 'spa': return { calls: '487', duration: '4.5 min', relevance: '85%', peaks: ['10:00 AM', '2:00 PM', '4:00 PM'] };
      case 'auto': return { calls: '756', duration: '4.2 min', relevance: '82%', peaks: ['8:00 AM', '12:00 PM', '4:00 PM'] };
      case 'law': return { calls: '342', duration: '4.8 min', relevance: '88%', peaks: ['9:00 AM', '11:00 AM', '2:00 PM'] };
      case 'tata': return { calls: '924', duration: '5.8 min', relevance: '78%', peaks: ['11:00 AM', '3:00 PM', '6:00 PM'] };
      default: return { calls: '512', duration: '5.1 min', relevance: '83%', peaks: ['9:00 AM', '1:00 PM', '5:00 PM'] };
    }
  };

  const analyticsData = selectedAgent ? getAnalytics(selectedAgent.id) : null;

  return (
    <>
      {!selectedAgent ? (
         <MainDashboard onLogout={() => setIsAuthenticated(false)} onSelectAgent={(agent) => setSelectedAgent(agent)} />
      ) : (
         <AgentPage agent={selectedAgent} onBack={() => { setSelectedAgent(null); setShowAnalytics(false); }} onOpenAnalytics={() => setShowAnalytics(true)} />
      )}
      
      {showAnalytics && selectedAgent && (
        <div className="modal-backdrop">
          <div className="dashboard-modal" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <Header onClose={() => setShowAnalytics(false)} title={`${selectedAgent.title} Analytics`} />
            
            <div className="dashboard-content" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <StatCard icon="phone" title="Total Calls" value={analyticsData.calls} trend="+12%" />
                <StatCard icon="clock" title="Avg Call Duration" value={analyticsData.duration} trend="+5%" />
                <StatCard icon="calendar" title="Relevance" value={analyticsData.relevance} trend="+8%" />
              </div>

              <BarChart />
              <ActivityWidgets peaks={analyticsData.peaks} />
              <Insights />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
