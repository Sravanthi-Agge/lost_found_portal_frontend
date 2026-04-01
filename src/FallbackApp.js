import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FallbackApp = () => {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('App loaded successfully');
    }, 2000);

    // Check for React
    if (typeof React !== 'undefined') {
      console.log('✅ React is available');
    } else {
      setError('React is not loaded');
    }

    // Check for DOM
    if (document.getElementById('root')) {
      console.log('✅ Root element found');
    } else {
      setError('Root element not found');
    }
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className={error ? 'alert alert-danger' : 'alert alert-success'}>
            <h3>🧪 Lost and Found Portal Status</h3>
            <p><strong>Status:</strong> {status}</p>
            {error && <p><strong>Error:</strong> {error}</p>}
          </div>
          
          <div className="mt-4">
            <h5>🔍 Debugging Information:</h5>
            <ul>
              <li>React Version: {React.version}</li>
              <li>Browser: {navigator.userAgent}</li>
              <li>Current URL: {window.location.href}</li>
              <li>Timestamp: {new Date().toISOString()}</li>
            </ul>
          </div>

          <div className="mt-4">
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/'}
            >
              Try Loading Main App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackApp;
