import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { authAPI } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token and user exist in local storage on initialization
    const initializeAuth = async () => {
      // Trigger a background wake-up request to Render to resolve cold starts
      api.get('/health').catch(() => {});

      const savedUser = await authAPI.getCurrentUser();
      if (savedUser) {
        setUser(savedUser);
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login(username, password);
      // Data expected structure: { token, user } or similar depending on controller
      // Let's verify what AuthController returns in the Java code:
      // It returns: ResponseEntity.ok(Map.of("token", token, "user", user))
      if (data && data.token && data.user) {
        localStorage.setItem('school_token', data.token);
        localStorage.setItem('school_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid server response structure' };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Login failed';
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('school_token');
    localStorage.removeItem('school_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
