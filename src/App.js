import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ApiTest from './components/ApiTest';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ItemList from './pages/ItemList';
import AdminPanel from './pages/AdminPanel';
import { useAuth } from './utils/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/admin" element={user && user.role === 'ADMIN' ? <AdminPanel /> : <Navigate to="/" />} />
          <Route path="/test" element={<ApiTest />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
