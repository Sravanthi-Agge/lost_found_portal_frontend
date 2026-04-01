import React, { useState } from 'react';
import { itemAPI } from '../services/api';

const ApiTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      console.log('Testing API call...');
      console.log('API Base URL:', process.env.REACT_APP_API_URL || 'http://localhost:8080/api');
      
      const testData = {
        title: 'Test Item from Component',
        description: 'Testing from React component',
        category: 'Electronics',
        location: 'Test Location',
        type: 'LOST'
      };
      
      console.log('Sending data:', testData);
      
      // Test both methods
      try {
        console.log('Testing with regular API...');
        const response1 = await itemAPI.add(testData);
        console.log('Regular API Response:', response1);
        setResult(`Success with regular API! Item added with ID: ${response1.data.id}`);
      } catch (regularError) {
        console.log('Regular API failed, trying test API...');
        try {
          const response2 = await itemAPI.testAdd(testData);
          console.log('Test API Response:', response2);
          setResult(`Success with test API! Item added with ID: ${response2.data.id}`);
        } catch (testError) {
          throw new Error(`Both APIs failed. Regular: ${regularError.message}, Test: ${testError.message}`);
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>API Test Component</h3>
      <button 
        onClick={testApi} 
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? 'Testing...' : 'Test Add Item API'}
      </button>
      <div className="mt-3">
        <strong>Result:</strong>
        <pre className="alert alert-info">{result}</pre>
      </div>
    </div>
  );
};

export default ApiTest;
