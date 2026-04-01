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

    try {
      const response = await itemAPI.add(formData);
      console.log('Item added successfully:', response.data);
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
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add item. Please try again.';
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
