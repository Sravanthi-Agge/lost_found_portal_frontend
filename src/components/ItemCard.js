import React from 'react';

const ItemCard = ({ item, onDelete, showActions = false }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-warning';
      case 'MATCHED': return 'bg-info';
      case 'RETURNED': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'LOST' ? '🔍' : '✅';
  };

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span className="badge bg-primary">
            {getTypeIcon(item.type)} {item.type}
          </span>
          <span className={`badge ${getStatusBadge(item.status)}`}>
            {item.status}
          </span>
        </div>
        
        <div className="card-body">
          <h5 className="card-title">{item.title}</h5>
          <p className="card-text">{item.description}</p>
          
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
        
        {showActions && (
          <div className="card-footer">
            <button 
              className="btn btn-sm btn-danger" 
              onClick={() => onDelete(item.id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
