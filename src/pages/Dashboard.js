import React, { useState, useEffect } from 'react';
import ItemForm from '../components/ItemForm';
import ItemCard from '../components/ItemCard';
import { itemAPI } from '../services/api';

const Dashboard = () => {
  const [myItems, setMyItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const response = await itemAPI.getMyItems();
      setMyItems(response.data);
    } catch (error) {
      console.error('Error fetching my items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemAdded = (newItem) => {
    setMyItems([newItem, ...myItems]);
    setShowForm(false);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemAPI.delete(itemId);
        setMyItems(myItems.filter(item => item.id !== itemId));
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  };

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
          <h2>My Dashboard</h2>
          <p className="text-muted">Manage your lost and found items</p>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Hide Form' : '➕ Add New Item'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="row mb-4">
          <div className="col-12">
            <ItemForm 
              onItemAdded={handleItemAdded} 
              onCancel={() => setShowForm(false)} 
            />
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <h3>My Items ({myItems.length})</h3>
          {myItems.length === 0 ? (
            <p className="text-muted">You haven't posted any items yet.</p>
          ) : (
            <div className="row">
              {myItems.map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onDelete={handleDeleteItem}
                  showActions={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
