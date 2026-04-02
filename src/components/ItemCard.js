import React, { useState } from 'react';

const ItemCard = ({ item, onDelete, showActions = false, onUpdateStatus, onMatch }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-warning';
      case 'MATCHED': return 'bg-info';
      case 'RETURNED': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'LOST': return '🔍';
      case 'FOUND': return '✅';
      default: return '📦';
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (onUpdateStatus) {
      setIsUpdating(true);
      try {
        console.log(`Updating item ${item.id} from ${item.status} to ${newStatus}`);
        await onUpdateStatus(item.id, newStatus);
        console.log(`✅ Item ${item.id} successfully updated to ${newStatus}`);
      } catch (error) {
        console.error('❌ Failed to update status:', error);
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
        
        // Show user-friendly error message
        let errorMessage = 'Failed to update status';
        if (error.response?.status === 404) {
          errorMessage = 'Item not found or server error';
        } else if (error.response?.status === 400) {
          errorMessage = 'Invalid status value';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
        
        alert(errorMessage);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleMatch = () => {
    if (onMatch) {
      onMatch(item.id);
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row">
          <div className="col-md-8">
            <h5 className="card-title">
              {getTypeIcon(item.type)} {item.title}
            </h5>
            <p className="card-text text-muted mb-2">
              <strong>ID:</strong> #{item.id} | 
              <strong>Status:</strong> 
              <span className={`badge ${getStatusBadge(item.status)} ms-2`}>
                {item.status}
              </span>
            </p>
            <p className="card-text">{item.description}</p>
            <div className="d-flex gap-2 mb-2">
              <span className="badge bg-primary">{item.category}</span>
              <span className="badge bg-secondary">📍 {item.location}</span>
              <span className="badge bg-info">{item.type}</span>
            </div>
            <small className="text-muted">
              Posted by {item.user?.name || 'Unknown'} on {new Date(item.createdAt).toLocaleDateString()}
            </small>
          </div>
          <div className="col-md-4 text-end">
            <div className="btn-group-vertical">
              {item.status === 'PENDING' && (
                <button 
                  className="btn btn-success btn-sm mb-2"
                  onClick={() => handleStatusUpdate('MATCHED')}
                  disabled={isUpdating}
                >
                  {isUpdating ? '⏳ Updating...' : '🔗 Mark as Matched'}
                </button>
              )}
              {item.status === 'MATCHED' && (
                <button 
                  className="btn btn-primary btn-sm mb-2"
                  onClick={() => handleStatusUpdate('RETURNED')}
                  disabled={isUpdating}
                >
                  {isUpdating ? '⏳ Updating...' : '✅ Mark as Returned'}
                </button>
              )}
              {showActions && (
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
