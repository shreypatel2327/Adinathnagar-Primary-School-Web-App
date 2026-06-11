import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, ChevronRight, User, Sun, Moon } from 'lucide-react';

const Topbar = ({ collapsed, toggleSidebar }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('school_theme') || 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('school_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

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

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Theme Toggler Button */}
        <button onClick={toggleTheme} style={themeButtonStyle} title={theme === 'dark' ? 'લાઇટ થીમ' : 'ડાર્ક થીમ'}>
          {theme === 'dark' ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="#475569" />}
        </button>

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
      </div>
    </header>
  );
};

const topbarStyle = {
  height: '70px',
  backgroundColor: 'var(--bg-secondary)',
  borderBottom: '1px solid var(--border-color)',
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
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  padding: '6px',
  borderRadius: '4px',
  transition: 'background-color 0.15s ease',
};

const themeButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  padding: '6px',
  borderRadius: '4px',
  transition: 'all 0.15s ease',
};

const dateStyle = {
  color: 'var(--text-secondary)',
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
  backgroundColor: 'var(--primary-glow)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid var(--border-focus)',
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
  color: 'var(--text-primary)',
};

const userRoleBadgeStyle = (role) => ({
  fontSize: '0.75rem',
  fontWeight: '600',
  color: role === 'ADMIN' ? 'var(--success)' : 'var(--warning)',
  marginTop: '2px',
});

export default Topbar;
