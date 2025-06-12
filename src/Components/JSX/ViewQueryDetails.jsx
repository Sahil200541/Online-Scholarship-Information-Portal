import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaUser, FaEnvelope, FaComment, FaCheck, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import '../CSS/ViewQueryDetails.css';

const ViewQueryDetails = () => {
  const { queryId } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    error: null,
    success: false
  });
  const [deleteStatus, setDeleteStatus] = useState({
    loading: false,
    error: null,
    success: false
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchQueryDetails();
  }, [queryId]);

  const fetchQueryDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:5000/api/admin/query/${queryId}`, {
        withCredentials: true
      });
      setQuery(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch query details');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (newStatus) => {
    try {
      setUpdateStatus({ loading: true, error: null, success: false });
      await axios.put(`http://localhost:5000/api/admin/update-ticket-status/${queryId}`, {
        ticketStatus: newStatus
      }, {
        withCredentials: true
      });
      setUpdateStatus({ loading: false, error: null, success: true });
      fetchQueryDetails(); // Refresh the details after update
    } catch (err) {
      setUpdateStatus({
        loading: false,
        error: err.response?.data?.message || 'Failed to update ticket status',
        success: false
      });
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteStatus({ loading: true, error: null, success: false });
      await axios.delete(`http://localhost:5000/api/admin/query/${queryId}`, {
        withCredentials: true
      });
      setDeleteStatus({ loading: false, error: null, success: true });
      setShowDeleteModal(false);
      // Navigate back to queries list after successful deletion
      navigate('/admin/user-queries');
    } catch (err) {
      setDeleteStatus({
        loading: false,
        error: err.response?.data?.message || 'Failed to delete query',
        success: false
      });
    }
  };

  const DeleteConfirmationModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="vqd-modal-overlay">
        <div className="vqd-modal-content">
          <div className="vqd-modal-header">
            <h3 className="vqd-modal-title">Delete Query</h3>
          </div>
          <div className="vqd-modal-body">
            <p className="vqd-modal-text">Are you sure you want to delete this query? This action cannot be undone.</p>
          </div>
          <div className="vqd-modal-actions">
            <button 
              className="vqd-modal-button vqd-modal-button-cancel"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleteStatus.loading}
            >
              Cancel
            </button>
            <button 
              className="vqd-modal-button vqd-modal-button-delete"
              onClick={handleDelete}
              disabled={deleteStatus.loading}
            >
              {deleteStatus.loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="vqd-page">
        <div className="vqd-loading-container">
          <div className="vqd-loading-spinner"></div>
          <p>Loading query details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vqd-page">
        <div className="vqd-error-container">
          <h3 className="vqd-error-title">Error</h3>
          <p className="vqd-error-text">{error}</p>
          <button className="vqd-back-button" onClick={() => navigate('/admin/user-queries')}>
            <FaArrowLeft /> Back to Queries
          </button>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="vqd-page">
        <div className="vqd-error-container">
          <h3 className="vqd-error-title">Not Found</h3>
          <p className="vqd-error-text">No query found with the provided ID.</p>
          <button className="vqd-back-button" onClick={() => navigate('/admin/user-queries')}>
            <FaArrowLeft /> Back to Queries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vqd-page">
      <DeleteConfirmationModal />
      <div className="vqd-header">
        <button className="vqd-back-button" onClick={() => navigate('/admin/user-queries')}>
          <FaArrowLeft /> Back to Queries
        </button>
        <h2 className="vqd-header-title">Query Details</h2>
      </div>

      <div className="vqd-content">
        <div className="vqd-info-header">
          <h3 className="vqd-info-title">User Information</h3>
          <div className="vqd-header-actions">
            <span className={`vqd-status vqd-status-${query.ticketDetails.ticketStatus.replace(/\s+/g, '-')}`}>
              {query.ticketDetails.ticketStatus}
            </span>
            <button 
              className="vqd-delete-button"
              onClick={() => setShowDeleteModal(true)}
              disabled={deleteStatus.loading}
            >
              <FaTrash className="vqd-delete-button-icon" /> Delete Query
            </button>
          </div>
        </div>

        <div className="vqd-info-body">
          <div className="vqd-info-group">
            <label className="vqd-info-label">
              <FaUser className="vqd-info-label-icon" /> Name
            </label>
            <p className="vqd-info-text">{query.ticketDetails.name}</p>
          </div>
          <div className="vqd-info-group">
            <label className="vqd-info-label">
              <FaEnvelope className="vqd-info-label-icon" /> Email
            </label>
            <p className="vqd-info-text">{query.ticketDetails.email}</p>
          </div>
          <div className="vqd-info-group">
            <label className="vqd-info-label">
              <FaComment className="vqd-info-label-icon" /> Subject
            </label>
            <p className="vqd-info-text">{query.ticketDetails.subject}</p>
          </div>
          <div className="vqd-info-group">
            <label className="vqd-info-label">
              <FaComment className="vqd-info-label-icon" /> Message
            </label>
            <p className="vqd-message-content">{query.ticketDetails.message}</p>
          </div>
        </div>

        <div className="vqd-actions">
          {updateStatus.success && (
            <div className="vqd-success-message">
              <FaCheck /> Status updated successfully
            </div>
          )}
          {updateStatus.error && (
            <div className="vqd-error-message">
              {updateStatus.error}
            </div>
          )}
          {deleteStatus.error && (
            <div className="vqd-error-message">
              {deleteStatus.error}
            </div>
          )}
          <select
            value={query.ticketDetails.ticketStatus}
            onChange={(e) => updateTicketStatus(e.target.value)}
            className="vqd-status-select"
            disabled={updateStatus.loading || deleteStatus.loading}
          >
            <option value="not send">Not Send</option>
            <option value="check by admin">Check by Admin</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ViewQueryDetails; 