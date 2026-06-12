import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ArrowDownLeft, 
  ArrowUpRight, 
  UserCheck, 
  History, 
  LogOut,
  GraduationCap
} from 'lucide-react';

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();

  const handleLinkClick = () => {
    if (window.innerWidth <= 768 && toggleSidebar) {
      toggleSidebar();
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'ડેસ્કબોર્ડ', icon: LayoutDashboard, roles: ['ADMIN', 'TEACHER'] },
    { path: '/students', label: 'વિદ્યાર્થીઓ', icon: Users, roles: ['ADMIN', 'TEACHER'] },
    { path: '/aavak-register', label: 'આવક રજીસ્ટર', icon: ArrowDownLeft, roles: ['ADMIN'] },
    { path: '/javak-register', label: 'જાવક રજીસ્ટર', icon: ArrowUpRight, roles: ['ADMIN'] },
    { path: '/teachers', label: 'શિક્ષકો', icon: UserCheck, roles: ['ADMIN'] },
    { path: '/system-logs', label: 'સિસ્ટમ લોગ', icon: History, roles: ['ADMIN'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`} style={{ ...sidebarStyle, width: collapsed ? '80px' : '260px' }}>
      <div className="sidebar-logo" style={logoStyle}>
        <GraduationCap size={collapsed ? 28 : 36} color="#2b8cee" />
        {!collapsed && (
          <div style={logoTextStyle}>
            <span style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff' }}>આદિનાથનગર</span>
            <span style={{ fontSize: '0.75rem', color: '#2b8cee', marginTop: '-4px' }}>પ્રાથમિક શાળા</span>
          </div>
        )}
      </div>

      <nav className="sidebar-nav" style={navStyle}>
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleLinkClick}
            style={({ isActive }) => ({
              ...navItemStyle,
              backgroundColor: isActive ? 'rgba(43, 140, 238, 0.12)' : 'transparent',
              color: isActive ? '#2b8cee' : '#94a3b8',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderLeft: isActive ? '3px solid #2b8cee' : '3px solid transparent',
            })}
          >
            <item.icon size={20} />
            {!collapsed && <span style={{ marginLeft: '12px' }}>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer" style={footerStyle}>
        <button onClick={logout} style={{
          ...logoutButtonStyle,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <LogOut size={20} color="#f43f5e" />
          {!collapsed && <span style={{ marginLeft: '12px', color: '#f43f5e' }}>લોગઆઉટ</span>}
        </button>
      </div>
    </aside>
  );
};

// CSS-in-JS for Sidebar structure
const sidebarStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100vh',
  width: '260px',
  backgroundColor: 'var(--bg-secondary)',
  borderRight: '1px solid var(--border-color)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 100,
  transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
};

// Collapsed state handles dynamically in App.jsx via CSS class or inline style
// We support both mechanisms. Let's make sure the width matches the state.
const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '1.5rem 1.25rem',
  gap: '12px',
  borderBottom: '1px solid var(--border-color)',
  height: '70px',
  boxSizing: 'border-box',
};

const logoTextStyle = {
  display: 'flex',
  flexDirection: 'column',
  lineHeight: '1.2',
};

const navStyle = {
  flex: 1,
  padding: '1.5rem 0',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const navItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.85rem 1.5rem',
  fontSize: '0.95rem',
  fontWeight: '500',
  transition: 'all 0.15s ease',
  boxSizing: 'border-box',
};

const footerStyle = {
  padding: '1.5rem 0',
  borderTop: '1px solid var(--border-color)',
};

const logoutButtonStyle = {
  width: '100%',
  background: 'none',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  padding: '0.85rem 1.5rem',
  fontSize: '0.95rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
};

export default Sidebar;
