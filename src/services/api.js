import axios from 'axios';

// Use environment variable for API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Request with token:', config.method?.toUpperCase(), config.url);
    } else {
      console.log('API Request without token:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        data: error.config?.data
      }
    });
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const itemAPI = {
  getAll: () => api.get('/items/all'),
  getById: (id) => api.get(`/items/${id}`),
  add: (itemData) => api.post('/items/add', itemData),
  delete: (id) => api.delete(`/items/${id}`),
  getMyItems: () => api.get('/items/all'), // Temporarily use all items
  
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
