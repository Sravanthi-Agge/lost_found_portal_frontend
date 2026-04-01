import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AdminPanel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await adminAPI.getAllItems();
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId) => {
    try {
      await adminAPI.approveItem(itemId);
      setItems(items.map(item => 
        item.id === itemId ? {...item, status: 'PENDING'} : item
      ));
      alert('Item approved successfully');
    } catch (error) {
      console.error('Error approving item:', error);
      alert('Failed to approve item');
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await adminAPI.deleteItem(itemId);
        setItems(items.filter(item => item.id !== itemId));
        alert('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await adminAPI.updateStatus(itemId, newStatus);
      setItems(items.map(item => 
        item.id === itemId ? {...item, status: newStatus} : item
      ));
      alert(`Item status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update item status');
    }
  };

  const filteredItems = items.filter(item => 
    filter === 'ALL' || item.type === filter
  );

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="row mb-4">
        <div className="col-12">
          <h2>🛡️ Admin Panel</h2>
          <p className="text-muted">Manage all lost and found items</p>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Items</option>
            <option value="LOST">🔍 Lost Items</option>
            <option value="FOUND">✅ Found Items</option>
          </select>
        </div>
        <div className="col-md-8">
          <div className="d-flex gap-2">
            <span className="badge bg-warning">PENDING: {items.filter(i => i.status === 'PENDING').length}</span>
            <span className="badge bg-info">MATCHED: {items.filter(i => i.status === 'MATCHED').length}</span>
            <span className="badge bg-success">RETURNED: {items.filter(i => i.status === 'RETURNED').length}</span>
          </div>
        </div>
      </div>

      <div className="row">
        {filteredItems.length === 0 ? (
          <div className="col-12 text-center">
            <p className="text-muted">No items found.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span className="badge bg-primary">
                    {item.type === 'LOST' ? '🔍 LOST' : '✅ FOUND'}
                  </span>
                  <span className={`badge bg-${
                    item.status === 'PENDING' ? 'warning' : 
                    item.status === 'MATCHED' ? 'info' : 'success'
                  }`}>
                    {item.status}
                  </span>
                </div>
                
                <div className="card-body">
                  <h6 className="card-title">{item.title}</h6>
                  <p className="card-text small">{item.description}</p>
                  
                  <div className="mb-2">
                    <small className="text-muted">
                      <strong>Category:</strong> {item.category}
                    </small>
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-muted">
                      <strong>📍 Location:</strong> {item.location}
                    </small>
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-muted">
                      <strong>👤 Posted by:</strong> {item.user?.name}
                    </small>
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-muted">
                      <strong>📅 Date:</strong> {new Date(item.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                
                <div className="card-footer">
                  <div className="d-flex flex-column gap-2">
                    <div className="btn-group" role="group">
                      <button 
                        className="btn btn-sm btn-success" 
                        onClick={() => handleApprove(item.id)}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                    
                    <div className="btn-group btn-group-sm" role="group">
                      <button 
                        className="btn btn-outline-warning" 
                        onClick={() => handleStatusChange(item.id, 'PENDING')}
                      >
                        Pending
                      </button>
                      <button 
                        className="btn btn-outline-info" 
                        onClick={() => handleStatusChange(item.id, 'MATCHED')}
                      >
                        Matched
                      </button>
                      <button 
                        className="btn btn-outline-success" 
                        onClick={() => handleStatusChange(item.id, 'RETURNED')}
                      >
                        Returned
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
