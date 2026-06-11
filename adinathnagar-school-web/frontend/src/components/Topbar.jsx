import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, ChevronLeft, ChevronRight, User } from 'lucide-react';

const Topbar = ({ collapsed, toggleSidebar }) => {
  const { user } = useAuth();

  const getTodayString = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('gu-IN', options); // Display date in Gujarati!
  };

  return (
    <header className="topbar" style={topbarStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={toggleSidebar} style={toggleButtonStyle}>
          {collapsed ? <ChevronRight size={20} /> : <Menu size={20} />}
        </button>
        <span style={dateStyle}>{getTodayString()}</span>
      </div>

      {user && (
        <div style={userProfileStyle}>
          <div style={userAvatarStyle}>
            <User size={18} color="#2b8cee" />
          </div>
          <div style={userInfoStyle}>
            <span style={userNameStyle}>{user.fullName}</span>
            <span style={userRoleBadgeStyle(user.role)}>
              {user.role === 'ADMIN' ? 'એડમિન' : `શિક્ષક (ધોરણ: ${user.standard || '-'})`}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

const topbarStyle = {
  height: '70px',
  backgroundColor: '#12161b',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2rem',
  position: 'sticky',
  top: 0,
  zIndex: 99,
};

const toggleButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  padding: '6px',
  borderRadius: '4px',
  transition: 'background-color 0.15s ease',
  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  }
};

const dateStyle = {
  color: '#94a3b8',
  fontSize: '0.9rem',
  fontWeight: '500',
};

const userProfileStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const userAvatarStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: 'rgba(43, 140, 238, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid rgba(43, 140, 238, 0.2)',
};

const userInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  lineHeight: '1.2',
};

const userNameStyle = {
  fontSize: '0.95rem',
  fontWeight: '600',
  color: '#f8fafc',
};

const userRoleBadgeStyle = (role) => ({
  fontSize: '0.75rem',
  fontWeight: '600',
  color: role === 'ADMIN' ? '#10b981' : '#f59e0b',
  marginTop: '2px',
});

export default Topbar;
