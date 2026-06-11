import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, History, ShieldAlert } from 'lucide-react';

const SystemLogsPage = () => {
  const { user, isAdmin } = useAuth();
  
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('Today'); // Defaults to 'Today'

  useEffect(() => {
    if (isAdmin) {
      fetchLogs();
    }
  }, [isAdmin, selectedPeriod]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // Backend expects period: "Today", "This Week", "Month"
      const params = { period: selectedPeriod };
      if (searchTerm.trim() !== '') {
        params.search = searchTerm;
      }
      
      const data = await logAPI.getLogs(params);
      setLogs(data);
      setError('');
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('સિસ્ટમ લોગ લોડ કરવામાં અસમર્થ.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  if (!isAdmin) {
    return (
      <div className="glass-card animate-fade-in" style={{ textAlign: 'center', padding: '3rem', margin: '2rem auto', maxWidth: '500px' }}>
        <ShieldAlert size={48} color="#f43f5e" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f43f5e' }}>અપ્રવેશ્ય (Access Denied)</h2>
        <p style={{ color: '#94a3b8', marginTop: '10px' }}>આ પેજ માત્ર એડમિનિસ્ટ્રેટર માટે જ ઉપલબ્ધ છે.</p>
        <Link to="/dashboard" className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>ડેસ્કબોર્ડ પર જાઓ</Link>
      </div>
    );
  }

  const getBadgeStyle = (action) => {
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
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '0.8rem',
      fontWeight: '700',
      backgroundColor: bg,
      color: color,
    };
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={28} color="#2b8cee" /> સિસ્ટમ પ્રવૃત્તિ લોગ (Audit Logs)
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>વપરાશકર્તાઓ દ્વારા કરવામાં આવેલી તમામ ફેરફારોની વિગતવાર યાદી</p>
        </div>
      </div>

      {error && <div className="badge badge-danger" style={{ padding: '12px', borderRadius: '6px' }}>{error}</div>}

      {/* Filters Form */}
      <div className="glass-card">
        <form onSubmit={handleSearchSubmit} style={filtersFormStyle}>
          <div style={searchContainerStyle}>
            <Search size={18} style={searchIconStyle} />
            <input
              type="text"
              className="form-control"
              placeholder="વિગત અથવા નામથી શોધો (Enter દબાવો)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px', width: '100%' }}
            />
          </div>

          <div style={selectContainerStyle}>
            <Filter size={16} color="#94a3b8" />
            <select
              className="form-control"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="Today">આજે (Today)</option>
              <option value="This Week">આ અઠવાડિયે (This Week)</option>
              <option value="Month">આ મહિને (Month)</option>
            </select>
          </div>
        </form>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>લોડ થઈ રહ્યું છે...</div>
      ) : logs.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          કોઈ પ્રવૃત્તિ નોંધ મળી નથી.
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ક્રિયા</th>
                <th>લક્ષ્ય (Target)</th>
                <th>વિગત</th>
                <th>યુઝર (દ્વારા)</th>
                <th>તારીખ અને સમય</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span style={getBadgeStyle(log.actionType)}>
                      {log.actionType}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', color: '#f8fafc' }}>{log.title}</td>
                  <td style={{ color: '#e2e8f0', maxWidth: '350px', wordBreak: 'break-word' }}>{log.description}</td>
                  <td style={{ fontWeight: '500', color: '#2b8cee' }}>{log.user?.fullName || 'સિસ્ટમ'}</td>
                  <td style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                    {log.createdAt ? new Date(log.createdAt).toLocaleString('gu-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    }) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Styles
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const filtersFormStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1.5rem',
  flexWrap: 'wrap',
};

const searchContainerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  flex: '2 1 400px',
};

const searchIconStyle = {
  position: 'absolute',
  left: '12px',
  color: '#64748b',
};

const selectContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: '1 1 200px',
  width: '100%',
};

export default SystemLogsPage;
