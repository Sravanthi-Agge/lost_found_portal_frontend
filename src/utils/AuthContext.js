import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Use same API base URL as api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('AuthContext: Token from localStorage:', token ? 'exists' : 'none');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const userData = localStorage.getItem('user');
      console.log('AuthContext: User data from localStorage:', userData);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('AuthContext: Parsed user:', parsedUser);
        setUser(parsedUser);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Attempting login with:', email);
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token, ...userData } = response.data;
      
      console.log('AuthContext: Login successful, storing token');
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('AuthContext: Registering user:', { name, email });
      const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
      const { token, ...userData } = response.data;
      
      console.log('AuthContext: Registration successful:', userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('AuthContext: Registration failed:', error);
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    console.log('AuthContext: Starting logout process');
    console.log('AuthContext: Current user:', user);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear axios headers completely
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear user state
    setUser(null);
    
    console.log('AuthContext: Logout completed');
    console.log('AuthContext: localStorage cleared:', {
      token: localStorage.getItem('token'),
      user: localStorage.getItem('user'),
      authHeader: axios.defaults.headers.common['Authorization']
    });
  };

  const isAdmin = () => {
    return user && user.role === 'ADMIN';
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
