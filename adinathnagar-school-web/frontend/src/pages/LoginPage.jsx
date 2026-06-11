import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, GraduationCap } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('કૃપા કરીને યુઝરનેમ અને પાસવર્ડ દાખલ કરો.');
      return;
    }

    setLoading(true);
    setError('');
    
    const result = await login(username, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'યુઝરનેમ અથવા પાસવર્ડ ખોટો છે.');
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div className="glass-card animate-fade-in" style={cardStyle}>
        <div style={headerStyle}>
          <div style={logoWrapperStyle}>
            <GraduationCap size={44} color="#2b8cee" />
          </div>
          <h1 style={titleStyle}>આદિનાથનગર પ્રાથમિક શાળા</h1>
          <p style={subtitleStyle}>શાળા વ્યવસ્થાપન સિસ્ટમ</p>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">યુઝરનેમ</label>
            <div style={inputContainerStyle}>
              <User size={18} style={iconStyle} />
              <input
                id="username"
                type="text"
                className="form-control"
                placeholder="યુઝરનેમ લખો"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="password">પાસવર્ડ</label>
            <div style={inputContainerStyle}>
              <Lock size={18} style={iconStyle} />
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="પાસવર્ડ લખો"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', height: '48px' }}
            disabled={loading}
          >
            {loading ? 'પ્રવેશ પ્રક્રિયા ચાલુ છે...' : 'લોગીન કરો'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Styling
const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  width: '100vw',
  backgroundColor: '#0b0d10',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 1000,
};

const cardStyle = {
  width: '100%',
  maxWidth: '420px',
  padding: '2.5rem 2rem',
  boxSizing: 'border-box',
  textAlign: 'center',
};

const headerStyle = {
  marginBottom: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const logoWrapperStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '20px',
  backgroundColor: 'rgba(43, 140, 238, 0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1rem',
  border: '1px solid rgba(43, 140, 238, 0.15)',
};

const titleStyle = {
  fontSize: '1.6rem',
  fontWeight: '700',
  color: '#ffffff',
  marginBottom: '0.25rem',
};

const subtitleStyle = {
  fontSize: '0.95rem',
  color: '#94a3b8',
};

const formStyle = {
  textAlign: 'left',
};

const inputContainerStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const iconStyle = {
  position: 'absolute',
  left: '12px',
  color: '#64748b',
};

const inputStyle = {
  paddingLeft: '40px',
  width: '100%',
};

const errorStyle = {
  backgroundColor: 'rgba(244, 63, 94, 0.1)',
  color: '#f43f5e',
  border: '1px solid rgba(244, 63, 94, 0.2)',
  padding: '10px 14px',
  borderRadius: '6px',
  marginBottom: '1.5rem',
  fontSize: '0.9rem',
  fontWeight: '500',
  textAlign: 'left',
};

export default LoginPage;
