import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaStar } from 'react-icons/fa';
import StatusModal from './StatusModal';
import '../CSS/FeaturedScholarships.css';

const FeaturedScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [modalState, setModalState] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    fetchFeaturedScholarships();
  }, []);

  const fetchFeaturedScholarships = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/scholarships', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        // Filter featured scholarships
        const featuredScholarships = data.data.filter(scholarship => scholarship.isFeatured);
        setScholarships(featuredScholarships);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching featured scholarships:', error);
      setModalState({
        show: true,
        message: 'Error fetching featured scholarships',
        type: 'error'
      });
    }
  };

  const handleRemoveFeatured = async (scholarshipId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/scholarships/${scholarshipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ isFeatured: false })
      });
      const data = await response.json();
      
      if (data.success) {
        setModalState({
          show: true,
          message: 'Scholarship removed from featured list',
          type: 'success'
        });
        // Refresh the list
        fetchFeaturedScholarships();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setModalState({
        show: true,
        message: error.message || 'Error removing scholarship from featured list',
        type: 'error'
      });
    }
  };

  return (
    <div className="featured-scholarships">
      <div className="featured-header">
        <h2>Featured Scholarships</h2>
        <p>Manage and view all featured scholarships</p>
      </div>

      <div className="scholarships-grid">
        {scholarships.map(scholarship => (
          <div key={scholarship._id} className="scholarship-card">
            <div className="card-header">
              <h3>{scholarship.name}</h3>
              <div className="card-actions">
                <Link to={`/admin/scholarships/${scholarship._id}`} className="view-button">
                  <FaEye /> View
                </Link>
                <button 
                  onClick={() => handleRemoveFeatured(scholarship._id)}
                  className="remove-featured-button"
                >
                  <FaStar /> Remove Featured
                </button>
              </div>
            </div>
            
            <div className="card-details">
              <div className="detail-item">
                <span className="label">Amount:</span>
                <span className="value">₹{scholarship.totalAmount}</span>
              </div>
              <div className="detail-item">
                <span className="label">Deadline:</span>
                <span className="value">
                  {new Date(scholarship.deadline).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Education Type:</span>
                <span className="value">{scholarship.educationType}</span>
              </div>
              {scholarship.educationType === 'School' ? (
                <>
                  <div className="detail-item">
                    <span className="label">Class:</span>
                    <span className="value">{scholarship.eligibility.class}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">School Type:</span>
                    <span className="value">{scholarship.eligibility.schoolType}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="detail-item">
                    <span className="label">Education Level:</span>
                    <span className="value">{scholarship.eligibility.educationLevel}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Stream:</span>
                    <span className="value">{scholarship.eligibility.stream}</span>
                  </div>
                </>
              )}
              <div className="detail-item">
                <span className="label">Minimum Marks:</span>
                <span className="value">{scholarship.eligibility.minimumMarks}%</span>
              </div>
            </div>

            <div className="card-footer">
              {scholarship.educationType === 'School' ? (
                <div className="applicable-boards">
                  {scholarship.eligibility.applicableBoards.map((board, index) => (
                    <span key={index} className="board-tag">{board}</span>
                  ))}
                </div>
              ) : (
                <div className="college-details">
                  <span className="college-tag">{scholarship.eligibility.universityName}</span>
                  <span className="college-tag">{scholarship.eligibility.collegeName}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {scholarships.length === 0 && (
        <div className="no-scholarships">
          <p>No featured scholarships found</p>
        </div>
      )}

      <StatusModal
        show={modalState.show}
        message={modalState.message}
        type={modalState.type}
        onClose={() => setModalState(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default FeaturedScholarships; 