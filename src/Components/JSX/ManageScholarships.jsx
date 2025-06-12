import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaEye, FaStar, FaSearch, FaFilter } from 'react-icons/fa';
import '../CSS/ManageScholarships.css';
import StatusModal from './StatusModal';

const ManageScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [modalState, setModalState] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    scholarshipId: null,
  });

  useEffect(() => {
    fetchScholarships();
  }, []);

  useEffect(() => {
    let result = scholarships;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(scholarship =>
        scholarship.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy !== 'none') {
      result.sort((a, b) => {
        switch (sortBy) {
          case 'amountAsc':
            return a.totalAmount - b.totalAmount;
          case 'amountDesc':
            return b.totalAmount - a.totalAmount;
          case 'deadlineAsc':
            return new Date(a.deadline) - new Date(b.deadline);
          case 'deadlineDesc':
            return new Date(b.deadline) - new Date(a.deadline);
          default:
            return 0;
        }
      });
    }

    setFilteredScholarships(result);
  }, [scholarships, searchTerm, sortBy]);

  const fetchScholarships = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/scholarships', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setScholarships(data.data);
        setFilteredScholarships(data.data);
      } else {
        setModalState({
          show: true,
          message: 'Failed to fetch scholarships',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      setModalState({
        show: true,
        message: 'Error fetching scholarships',
        type: 'error'
      });
    }
  };

  const handleDelete = async (scholarshipId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/scholarships/${scholarshipId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setModalState({
          show: true,
          message: 'Scholarship deleted successfully',
          type: 'success'
        });
        fetchScholarships();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setModalState({
        show: true,
        message: error.message || 'Error deleting scholarship',
        type: 'error'
      });
    }
  };

  const handleToggleFeatured = async (scholarshipId, isCurrentlyFeatured) => {
    try {
      const response = await fetch(`http://localhost:5000/api/scholarships/${scholarshipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isFeatured: !isCurrentlyFeatured })
      });
      const data = await response.json();
      
      if (data.success) {
        setModalState({
          show: true,
          message: `Scholarship ${!isCurrentlyFeatured ? 'added to' : 'removed from'} featured list`,
          type: !isCurrentlyFeatured ? 'featured-success' : 'success'
        });
        fetchScholarships();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setModalState({
        show: true,
        message: error.message || 'Error updating scholarship',
        type: 'error'
      });
    }
  };

  return (
    <div className="scholarship-list">
      <div className="scholarship-list-header">
        <h2>Manage Scholarships</h2>
        <Link to="/admin/create-scholarship" className="create-button">
          <FaPlus /> Create Scholarship
        </Link>
      </div>

      <div className="filters-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search scholarships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-button ${sortBy === 'amountAsc' ? 'active' : ''}`}
            onClick={() => setSortBy(sortBy === 'amountAsc' ? 'amountDesc' : 'amountAsc')}
          >
            <FaFilter /> Amount {sortBy === 'amountAsc' ? '↑' : sortBy === 'amountDesc' ? '↓' : ''}
          </button>
          <button
            className={`filter-button ${sortBy === 'deadlineAsc' ? 'active' : ''}`}
            onClick={() => setSortBy(sortBy === 'deadlineAsc' ? 'deadlineDesc' : 'deadlineAsc')}
          >
            <FaFilter /> Deadline {sortBy === 'deadlineAsc' ? '↑' : sortBy === 'deadlineDesc' ? '↓' : ''}
          </button>
        </div>
      </div>

      <div className="scholarship-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredScholarships.map((scholarship) => (
              <tr key={scholarship._id}>
                <td>{scholarship.name}</td>
                <td>₹{scholarship.totalAmount}</td>
                <td>{new Date(scholarship.deadline).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <a href={`/admin/scholarships/${scholarship._id}`} className="view-button">
                      <FaEye />
                    </a>
                    <a href={`/admin/edit-scholarship/${scholarship._id}`} className="edit-button">
                      <FaEdit />
                    </a>
                    <button
                      className="delete-button"
                      onClick={() => setDeleteModal({ show: true, scholarshipId: scholarship._id })}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <StatusModal
        show={modalState.show}
        message={modalState.message}
        type={modalState.type}
        onClose={() => setModalState({ ...modalState, show: false })}
      />

      {deleteModal.show && (
        <StatusModal
          show={deleteModal.show}
          message="Are you sure you want to delete this scholarship?"
          type="error"
          onClose={() => setDeleteModal({ show: false, scholarshipId: null })}
        >
          <button
            className="modal-close-btn"
            onClick={() => {
              handleDelete(deleteModal.scholarshipId);
              setDeleteModal({ show: false, scholarshipId: null });
            }}
          >
            Confirm
          </button>
          <button
            className="modal-close-btn"
            onClick={() => setDeleteModal({ show: false, scholarshipId: null })}
          >
            Cancel
          </button>
        </StatusModal>
      )}
    </div>
  );
};

export default ManageScholarships; 