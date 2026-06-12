import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, logAPI } from '../api/api';
import { 
  Users, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Layers, 
  Plus, 
  ClipboardList, 
  UserPlus, 
  FileText,
  Activity,
  UserCheck,
  History
} from 'lucide-react';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    aavakCount: 0,
    javakCount: 0,
    standardCount: '1-8'
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const statsData = await dashboardAPI.getStats();
        setStats(statsData);

        // Fetch logs for today or week to populate recent activity
        const logsData = await logAPI.getLogs({ period: 'This Week' });
        setRecentLogs(logsData.slice(0, 5)); // Keep top 5
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('માહિતી લોડ કરવામાં ભૂલ આવી છે.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'સુપ્રભાત';
    if (hrs < 17) return 'શુભ બપોર';
    return 'શુભ સાંજ';
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>લોડ થઈ રહ્યું છે...</div>;
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Header */}
      <div style={welcomeHeaderStyle}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>
            {getGreeting()}, {user?.fullName}!
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>
            આદિનાથનગર પ્રાથમિક શાળા સંચાલન પ્રણાલીમાં આપનું સ્વાગત છે.
          </p>
        </div>
        <div style={roleBadgeStyle(user?.role)}>
          {user?.role === 'ADMIN' ? 'એડમિનિસ્ટ્રેટર પેનલ' : 'શિક્ષક પેનલ'}
        </div>
      </div>

      {error && <div className="badge badge-danger" style={{ padding: '10px 16px', borderRadius: '6px' }}>{error}</div>}

      {/* Stats Cards */}
      <div style={statsGridStyle}>
        <div className="glass-card interactive" style={statCardStyle}>
          <div style={statHeaderStyle}>
            <span style={{ color: '#94a3b8', fontWeight: '500' }}>હાજર વિદ્યાર્થીઓ (Active)</span>
            <div style={{ ...iconWrapperStyle, backgroundColor: 'rgba(43, 140, 238, 0.1)', border: '1px solid rgba(43, 140, 238, 0.2)' }}>
              <Users size={22} color="#2b8cee" />
            </div>
          </div>
          <span style={statValueStyle}>{stats.totalStudents}</span>
          <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '500', marginTop: '6px' }}>શાળામાં હાલ અભ્યાસ કરતા</span>
        </div>

        <div className="glass-card interactive" style={statCardStyle}>
          <div style={statHeaderStyle}>
            <span style={{ color: '#94a3b8', fontWeight: '500' }}>કુલ પ્રવેશ (Aavak Register)</span>
            <div style={{ ...iconWrapperStyle, backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <ArrowDownLeft size={22} color="#10b981" />
            </div>
          </div>
          <span style={statValueStyle}>{stats.aavakCount}</span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>શાળા રજીસ્ટરમાં નોંધાયેલ કુલ</span>
        </div>

        <div className="glass-card interactive" style={statCardStyle}>
          <div style={statHeaderStyle}>
            <span style={{ color: '#94a3b8', fontWeight: '500' }}>કુલ કમી થયેલ (Javak Register)</span>
            <div style={{ ...iconWrapperStyle, backgroundColor: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
              <ArrowUpRight size={22} color="#f43f5e" />
            </div>
          </div>
          <span style={statValueStyle}>{stats.javakCount}</span>
          <span style={{ fontSize: '0.85rem', color: '#f43f5e', fontWeight: '500', marginTop: '6px' }}>અન્ય શાળામાં બદલી થયેલ</span>
        </div>

        <div className="glass-card interactive" style={statCardStyle}>
          <div style={statHeaderStyle}>
            <span style={{ color: '#94a3b8', fontWeight: '500' }}>શૈક્ષણિક ધોરણો</span>
            <div style={{ ...iconWrapperStyle, backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <Layers size={22} color="#f59e0b" />
            </div>
          </div>
          <span style={statValueStyle}>{stats.standardCount}</span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>ધોરણ ૧ થી ૮ અને બાલવાટિકા</span>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="dashboard-main-grid">
        {/* Quick Actions */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#2b8cee" /> ત્વરિત કાર્યો
          </h2>
          <div style={actionsGridStyle}>
            <button onClick={() => navigate('/students/add')} style={actionButtonStyle}>
              <Plus size={24} color="#2b8cee" />
              <span>વિદ્યાર્થી ઉમેરો</span>
            </button>
            <button onClick={() => navigate('/students')} style={actionButtonStyle}>
              <ClipboardList size={24} color="#10b981" />
              <span>વિદ્યાર્થી યાદી</span>
            </button>
            {isAdmin && (
              <>
                <button onClick={() => navigate('/aavak-register')} style={actionButtonStyle}>
                  <ArrowDownLeft size={24} color="#f59e0b" />
                  <span>આવક રજીસ્ટર</span>
                </button>
                <button onClick={() => navigate('/javak-register')} style={actionButtonStyle}>
                  <ArrowUpRight size={24} color="#f43f5e" />
                  <span>જાવક રજીસ્ટર</span>
                </button>
                <button onClick={() => navigate('/teachers')} style={actionButtonStyle}>
                  <UserCheck size={24} color="#c084fc" />
                  <span>શિક્ષક સંચાલન</span>
                </button>
                <button onClick={() => navigate('/system-logs')} style={actionButtonStyle}>
                  <History size={24} color="#818cf8" />
                  <span>સિસ્ટમ લોગ</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={20} color="#10b981" /> તાજેતરની પ્રવૃત્તિઓ
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentLogs.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>કોઈ તાજેતરની પ્રવૃત્તિઓ નથી.</p>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} style={activityItemStyle}>
                  <div style={activityBadgeStyle(log.actionType)}>
                    {log.actionType?.substring(0, 3).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{log.title}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{log.description}</div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {log.user?.fullName || 'સિસ્ટમ'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                      {new Date(log.createdAt).toLocaleTimeString('gu-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const welcomeHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
};

const roleBadgeStyle = (role) => ({
  padding: '6px 16px',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontWeight: '600',
  backgroundColor: role === 'ADMIN' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(43, 140, 238, 0.15)',
  color: role === 'ADMIN' ? '#10b981' : '#2b8cee',
  border: role === 'ADMIN' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(43, 140, 238, 0.3)',
});

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '1.5rem',
};

const statCardStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const statHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.5rem',
};

const iconWrapperStyle = {
  width: '42px',
  height: '42px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const statValueStyle = {
  fontSize: '2.25rem',
  fontWeight: '700',
  color: 'var(--text-primary)',
  lineHeight: '1.2',
};

const mainGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.5rem',
  alignItems: 'start',
  '@media (max-width: 900px)': {
    gridTemplateColumns: '1fr',
  },
};

const actionsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
  gap: '1rem',
};

const actionButtonStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  padding: '1.25rem 1rem',
  backgroundColor: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '12px',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontSize: '0.9rem',
  fontWeight: '600',
  outline: 'none',
  ':hover': {
    transform: 'translateY(-2px)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
  }
};

const activityItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px',
  borderRadius: '8px',
  backgroundColor: 'rgba(255, 255, 255, 0.01)',
  border: '1px solid rgba(255, 255, 255, 0.03)',
};

const activityBadgeStyle = (action) => {
  let bg = 'rgba(43, 140, 238, 0.15)';
  let color = '#2b8cee';
  if (action === 'CREATE' || action?.includes('ADD')) {
    bg = 'rgba(16, 185, 129, 0.15)';
    color = '#10b981';
  } else if (action === 'DELETE') {
    bg = 'rgba(244, 63, 94, 0.15)';
    color = '#f43f5e';
  } else if (action === 'UPDATE' || action === 'EDIT') {
    bg = 'rgba(245, 158, 11, 0.15)';
    color = '#f59e0b';
  }
  return {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: bg,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: '700',
  };
};

export default DashboardPage;
