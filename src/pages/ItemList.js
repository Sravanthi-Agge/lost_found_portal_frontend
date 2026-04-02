import React, { useState, useEffect } from 'react';
import ItemCard from '../components/ItemCard';
import { itemAPI } from '../services/api';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: 'ALL',
    status: 'ALL',
    category: 'ALL'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    console.log('ItemList: Fetching items...');
    setLoading(true);
    try {
      const response = await itemAPI.getAll();
      console.log('ItemList: API Response:', response.data);
      setItems(response.data);
    } catch (error) {
      console.error('ItemList: Error fetching items:', error);
      alert('Failed to fetch items. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemAPI.delete(itemId);
        setItems(items.filter(item => item.id !== itemId));
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleUpdateStatus = async (itemId, newStatus) => {
    try {
      console.log(`=== Status Update Request ===`);
      console.log(`Item ID: ${itemId}`);
      console.log(`New Status: ${newStatus}`);
      
      const response = await itemAPI.updateStatus(itemId, newStatus);
      console.log('API Response:', response);
      console.log('Response Data:', response.data);
      
      // Update the item in the list
      const updatedItems = items.map(item => 
        item.id === itemId ? response.data : item
      );
      setItems(updatedItems);
      
      console.log(`✅ Item ${itemId} successfully updated to ${newStatus}`);
      
      // Show success message
      const item = items.find(i => i.id === itemId);
      const oldStatus = item ? item.status : 'UNKNOWN';
      alert(`Item ${itemId} status updated from ${oldStatus} to ${newStatus}`);
      
    } catch (error) {
      console.error('❌ Status Update Failed');
      console.error('Full error:', error);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      // Show detailed error message
      let errorMessage = 'Failed to update item status';
      if (error.response?.status === 404) {
        errorMessage = '❌ Item not found (404) - Backend may not be running';
      } else if (error.response?.status === 400) {
        errorMessage = '❌ Bad request (400) - Invalid status value';
      } else if (error.code === 'ECONNREFUSED') {
        errorMessage = '❌ Connection refused - Backend not running on port 8080';
      }
      
      alert(errorMessage);
    }
  };

  const handleMatchItem = async (itemId) => {
    try {
      const response = await itemAPI.matchItem(itemId);
      setItems(items.map(item => 
        item.id === itemId ? response.data : item
      ));
    } catch (error) {
      console.error('Error matching item:', error);
    }
  };

  const categories = [...new Set(items.map(item => item.category))];
  
  // Calculate status counts
  const statusCounts = items.reduce((counts, item) => {
    counts[item.status] = (counts[item.status] || 0) + 1;
    return counts;
  }, {});

  const filteredItems = items.filter(item => {
    const matchesType = filter.type === 'ALL' || item.type === filter.type;
    const matchesStatus = filter.status === 'ALL' || item.status === filter.status;
    const matchesCategory = filter.category === 'ALL' || item.category === filter.category;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesStatus && matchesCategory && matchesSearch;
  });

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
          <h2>All Items</h2>
          <p className="text-muted">Browse all lost and found items</p>
          
          {/* Refresh Button */}
          <button 
            className="btn btn-outline-primary btn-sm mb-3"
            onClick={fetchItems}
            disabled={loading}
          >
            {loading ? '🔄 Refreshing...' : '🔄 Refresh Items'}
          </button>
          
          {/* Status Summary */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="d-flex gap-3 flex-wrap">
                <span className="badge bg-warning fs-6">
                  🟡 Pending: {statusCounts.PENDING || 0}
                </span>
                <span className="badge bg-info fs-6">
                  🔵 Matched: {statusCounts.MATCHED || 0}
                </span>
                <span className="badge bg-success fs-6">
                  🟢 Returned: {statusCounts.RETURNED || 0}
                </span>
                <span className="badge bg-secondary fs-6">
                  📦 Total: {items.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-2 mb-3">
          <select
            className="form-select"
            value={filter.type}
            onChange={(e) => setFilter({...filter, type: e.target.value})}
          >
            <option value="ALL">All Types</option>
            <option value="LOST">🔍 Lost</option>
            <option value="FOUND">✅ Found</option>
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <select
            className="form-select"
            value={filter.status}
            onChange={(e) => setFilter({...filter, status: e.target.value})}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">🟡 Pending</option>
            <option value="MATCHED">🔵 Matched</option>
            <option value="RETURNED">🟢 Returned</option>
          </select>
        </div>
        <div className="col-md-3 mb-3">
          <select
            className="form-select"
            value={filter.category}
            onChange={(e) => setFilter({...filter, category: e.target.value})}
          >
            <option value="ALL">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        {filteredItems.length === 0 ? (
          <div className="col-12 text-center">
            <p className="text-muted">No items found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="col-12 mb-3">
              <p className="text-muted">Found {filteredItems.length} items</p>
            </div>
            {filteredItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                showActions={true}
                onUpdateStatus={handleUpdateStatus}
                onMatch={handleMatchItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ItemList;
