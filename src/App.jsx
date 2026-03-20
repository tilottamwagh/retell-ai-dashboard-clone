import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import StatCard from './components/StatCard';
import BarChart from './components/BarChart';
import ActivityWidgets from './components/ActivityWidgets';
import Insights from './components/Insights';
import MainDashboard from './components/MainDashboard';
import LoginPage from './components/LoginPage';
import AgentPage from './components/AgentPage';
import { fetchAnalyticsForAgent } from './services/retellApi';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    if (showAnalytics && selectedAgent) {
      setLoadingAnalytics(true);
      fetchAnalyticsForAgent(selectedAgent.id)
        .then(data => setAnalyticsData(data))
        .catch(err => console.error(err))
        .finally(() => setLoadingAnalytics(false));
    }
  }, [showAnalytics, selectedAgent]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

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
              {loadingAnalytics || !analyticsData ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Loading real-time analytics from Retell AI...
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    <StatCard icon="phone" title="Total Calls" value={analyticsData.calls} trend="+12%" />
                    <StatCard icon="clock" title="Avg Call Duration" value={analyticsData.duration} trend="+5%" />
                    <StatCard icon="calendar" title="Relevance" value={analyticsData.relevance} trend="+8%" />
                  </div>

                  <BarChart dailyVolume={analyticsData.dailyVolume} />
                  <ActivityWidgets peaks={analyticsData.peaks} callTypes={analyticsData.callTypes} />
                  <Insights />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
