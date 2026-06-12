import axios from 'axios';

// const API_BASE_URL = 'http://localhost:9995/api';
const API_BASE_URL = 'https://adinathnagar-primary-school-web-app.onrender.com/api';
// const getApiBaseUrl = () => {
//   if (typeof window !== 'undefined') {
//     const host = window.location.hostname;
//     // return `http://${host}:9995/api`;
//     return `https://adinathnagar-primary-school-web-app.onrender.com`;
//   }
//   // return 'http://localhost:9995/api';
//   return 'https://adinathnagar-primary-school-web-app.onrender.com';
// };

// const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('school_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry / unauthenticated requests
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('school_token');
      localStorage.removeItem('school_user');
      // Redirect to login if window is available
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/login', { username, password });
    return response.data; // Expected: { token: 'jwt...', user: { id, username, fullName, role, standard, isActive } }
  },
  getCurrentUser: async () => {
    // If there's a token, check/verify it or fetch profile. 
    // In our backend, /login is the main endpoint, and we can check token validity via stats or other secure endpoint.
    const token = localStorage.getItem('school_token');
    const userStr = localStorage.getItem('school_user');
    if (token && userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};

export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

export const studentAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/students', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },
  create: async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
  },
  update: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
  markJavak: async (id, javakData) => {
    // javakData expects: { leavingDate, destinationSchool, remarks }
    const response = await api.patch(`/students/${id}/javak`, javakData);
    return response.data;
  },
};

export const registerAPI = {
  getJavak: async (params = {}) => {
    const response = await api.get('/javak-register', { params });
    return response.data;
  },
  getAavak: async (params = {}) => {
    const response = await api.get('/aavak-register', { params });
    return response.data;
  },
};

export const teacherAPI = {
  getAll: async () => {
    const response = await api.get('/teachers');
    return response.data;
  },
  create: async (teacherData) => {
    const response = await api.post('/teachers', teacherData);
    return response.data;
  },
  update: async (id, teacherData) => {
    const response = await api.put(`/teachers/${id}`, teacherData);
    return response.data;
  },
};

export const logAPI = {
  getLogs: async (params = {}) => {
    // params can contain: search, period (e.g. today, week, month, all)
    const response = await api.get('/logs', { params });
    return response.data;
  },
};

export default api;
