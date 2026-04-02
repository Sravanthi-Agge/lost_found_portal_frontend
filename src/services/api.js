import axios from 'axios';

// Use environment variable for API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add timeout to prevent hanging
  withCredentials: false, // Important for CORS
});

// Add request interceptor to always include current token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request with token:', config.method?.toUpperCase(), config.url);
    } else {
      console.log('API Request without token:', config.method?.toUpperCase(), config.url);
      // Remove any existing Authorization header if no token
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Handle network errors specifically
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend connection refused - check if backend is running on port 8080');
    } else if (error.code === 'ERR_NETWORK_CHANGED') {
      console.error('Network changed - check connection');
    } else if (error.code === 'ERR_INTERNET_DISCONNECTED') {
      console.error('Internet disconnected - check connection');
    }
    
    // Don't show alerts for every error, just log them
    if (error.response?.status === 401) {
      console.log('Unauthorized - token may be expired');
      // Auto-logout on 401
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => {
    console.log('Login API call:', credentials);
    return api.post('/auth/login', credentials);
  },
  register: (userData) => {
    console.log('Register API call:', userData);
    return api.post('/auth/register', userData);
  }
};

export const itemAPI = {
  getAll: () => api.get('/items/all'),
  getById: (id) => api.get(`/items/${id}`),
  add: (itemData) => api.post('/items/add', itemData),
  delete: (id) => api.delete(`/items/${id}`),
  getMyItems: () => api.get('/items/all'), // Temporarily use all items
  updateStatus: (id, status) => api.put(`/items/${id}/status?status=${status}`),
  matchItem: (id) => api.post(`/items/${id}/match`),
  
  // Test method without authentication
  testAdd: (itemData) => {
    const testApi = axios.create({
      baseURL: 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return testApi.post('/items/add', itemData);
  }
};

export const adminAPI = {
  getAllItems: () => api.get('/admin/items'),
  approveItem: (id) => api.put(`/admin/approve/${id}`),
  deleteItem: (id) => api.delete(`/admin/delete/${id}`),
  updateStatus: (id, status) => api.put(`/admin/status/${id}?status=${status}`),
};

export default api;
