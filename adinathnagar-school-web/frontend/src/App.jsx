import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentListPage from './pages/StudentListPage';
import StudentDetailPage from './pages/StudentDetailPage';
import AddStudentPage from './pages/AddStudentPage';
import AavakRegisterPage from './pages/AavakRegisterPage';
import JavakRegisterPage from './pages/JavakRegisterPage';
import TeacherListPage from './pages/TeacherListPage';
import AddTeacherPage from './pages/AddTeacherPage';
import SystemLogsPage from './pages/SystemLogsPage';
import CertificatePage from './pages/CertificatePage';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0b0d10' }}>સિસ્ટમ ચાલુ થઈ રહી છે...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Only Route Guard
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0b0d10' }}>સિસ્ટમ ચાલુ થઈ રહી છે...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Main App Router Setup
const AppContent = () => {
  const { user, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0b0d10', color: 'white' }}>લોડ થઈ રહ્યું છે...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

      {/* Special Print Certificates (Renders outside the main layout shell) */}
      <Route 
        path="/certificates/:type/:id" 
        element={
          <AdminRoute>
            <CertificatePage />
          </AdminRoute>
        } 
      />

      {/* Protected Dashboard Layout Shell */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="app-container">
              <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
              <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <Topbar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
                <main className="content-body">
                  <Routes>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/students" element={<StudentListPage />} />
                    <Route path="/students/add" element={<AddStudentPage />} />
                    <Route path="/students/edit/:id" element={<AddStudentPage />} />
                    <Route path="/students/:id" element={<StudentDetailPage />} />
                    <Route path="/aavak-register" element={<AdminRoute><AavakRegisterPage /></AdminRoute>} />
                    <Route path="/javak-register" element={<AdminRoute><JavakRegisterPage /></AdminRoute>} />
                    <Route path="/teachers" element={<AdminRoute><TeacherListPage /></AdminRoute>} />
                    <Route path="/teachers/add" element={<AdminRoute><AddTeacherPage /></AdminRoute>} />
                    <Route path="/system-logs" element={<AdminRoute><SystemLogsPage /></AdminRoute>} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
