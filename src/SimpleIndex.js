import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';

const SimpleApp = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="alert alert-info">
            <h2>🧪 Lost and Found Portal</h2>
            <p>✅ React is working!</p>
            <p>✅ Components are loading!</p>
            <hr />
            <div className="mt-3">
              <h5>🔧 Debugging Info:</h5>
              <ul>
                <li>React Version: {React.version}</li>
                <li>Environment: {process.env.NODE_ENV || 'development'}</li>
                <li>API URL: {process.env.REACT_APP_API_URL || 'Not set'}</li>
                <li>Current Time: {new Date().toLocaleString()}</li>
              </ul>
            </div>
            
            <div className="mt-4">
              <button 
                className="btn btn-primary me-2"
                onClick={() => {
                  console.log('Attempting to load main app...');
                  // Try to dynamically import the main App
                  import('./App').then(module => {
                    const App = module.default;
                    const root = ReactDOM.createRoot(document.getElementById('root'));
                    root.render(<App />);
                  }).catch(err => {
                    console.error('Failed to load App:', err);
                  });
                }}
              >
                🚀 Load Main Application
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render the simple app first
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SimpleApp />);
