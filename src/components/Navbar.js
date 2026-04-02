import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  console.log('Navbar: Current user state:', user);

  const handleLogout = () => {
    console.log('Navbar: Logging out user:', user);
    console.log('Navbar: Clearing localStorage and axios headers');
    logout();
    navigate('/');
    console.log('Navbar: Logout completed, navigating to home');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          📍 Lost & Found Portal
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/items">All Items</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
            )}
            {user && user.role === 'ADMIN' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin Panel</Link>
              </li>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    👤 {user.name}
                  </a>
                  <ul className="dropdown-menu">
                    <li><span className="dropdown-item-text">Role: {user.role || 'USER'}</span></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={handleLogout}
                        style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', padding: '8px 16px' }}
                      >
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                </li>
                
                {/* Direct Logout Button */}
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-light btn-sm ms-2" 
                    onClick={handleLogout}
                    title="Logout"
                  >
                    🚪 Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
