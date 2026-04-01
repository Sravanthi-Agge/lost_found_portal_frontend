import React, { useState, useEffect } from 'react';
import ItemCard from '../components/ItemCard';
import { itemAPI } from '../services/api';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    console.log('Fetching items...');
    try {
      const response = await itemAPI.getAll();
      console.log('API Response:', response.data);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add refresh function
  const refreshItems = () => {
    setLoading(true);
    fetchItems();
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'ALL' || item.type === filter;
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    console.log('Home page is loading...');
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
          <h1 className="text-center mb-4">🔍 Lost & Found Portal</h1>
          <p className="text-center text-muted">
            Find your lost items or report found items to help others
          </p>
          <div className="text-center">
            <button className="btn btn-outline-primary me-2" onClick={refreshItems}>
              🔄 Refresh Items
            </button>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
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
      </div>

      <div className="row">
        {filteredItems.length === 0 ? (
          <div className="col-12 text-center">
            <p className="text-muted">No items found matching your criteria.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
