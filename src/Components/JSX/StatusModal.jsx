import React from 'react';
import '../CSS/StatusModal.css';
import { FaStar } from 'react-icons/fa';

const StatusModal = ({ isOpen, onClose, status, message, show, type, children }) => {
  // Support both 'status' and 'type' props for compatibility
  const modalType = type || status;
  if (!(isOpen ?? show)) return null;

  const getStatusIcon = () => {
    switch (modalType) {
      case 'featured-success':
        return <FaStar className="star-icon" />;
      case 'success':
        return <i className="fas fa-check-circle"></i>;
      case 'error':
        return <i className="fas fa-times-circle"></i>;
      case 'loading':
        return <i className="fas fa-spinner fa-spin"></i>;
      default:
        return <i className="fas fa-info-circle"></i>;
    }
  };

  const getStatusClass = () => {
    switch (modalType) {
      case 'featured-success':
        return 'status-featured';
      case 'success':
        return 'status-success';
      case 'error':
        return 'status-error';
      case 'loading':
        return 'status-loading';
      default:
        return 'status-info';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className={`status-icon ${getStatusClass()}`}>
          {getStatusIcon()}
        </div>
        <div className="status-message">{message}</div>
        {/* Render children (e.g., Confirm/Cancel buttons) if provided */}
        {children}
        {/* If no children, show default close button */}
        {modalType !== 'loading' && !children && (
          <button className="modal-close-btn" onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default StatusModal; 