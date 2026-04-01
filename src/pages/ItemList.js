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
    try {
      const response = await itemAPI.getAll();
      console.log('ItemList: API Response:', response.data);
      setItems(response.data);
    } catch (error) {
      console.error('ItemList: Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(items.map(item => item.category))];

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
              <ItemCard key={item.id} item={item} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ItemList;
