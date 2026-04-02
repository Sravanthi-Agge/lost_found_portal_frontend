import React, { useState } from 'react';
import { itemAPI } from '../services/api';

const ItemForm = ({ onItemAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    type: 'LOST'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Electronics', 'Jewelry', 'Documents', 'Clothing', 
    'Accessories', 'Books', 'Keys', 'Wallet', 'Phone', 
    'Bag', 'Watch', 'Glasses', 'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Submitting item:', formData);
    console.log('API Base URL:', process.env.REACT_APP_API_URL || 'http://localhost:8080/api');

    try {
      const response = await itemAPI.add(formData);
      console.log('Item added successfully:', response.data);
      console.log('Response status:', response.status);
      
      onItemAdded(response.data);
      setFormData({
        title: '',
        description: '',
        category: '',
        location: '',
        type: 'LOST'
      });
    } catch (error) {
      console.error('Error adding item:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Failed to add item. Please try again.';
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = 'Cannot connect to backend. Please check if backend is running on port 8080.';
      } else if (error.response?.status === 0) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid item data. Please check all fields.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="mb-0">Add New Item</h4>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Location *</label>
            <input
              type="text"
              className="form-control"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Library, Campus Building A"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Type *</label>
            <select
              className="form-select"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="LOST">🔍 Lost Item</option>
              <option value="FOUND">✅ Found Item</option>
            </select>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Item'}
            </button>
            {onCancel && (
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
