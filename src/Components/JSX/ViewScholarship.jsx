import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaStar, FaLink } from 'react-icons/fa';
import StatusModal from './StatusModal';
import '../CSS/ViewScholarship.css';

const ViewScholarship = () => {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);
  const [modalState, setModalState] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    fetchScholarship();
  }, [id]);

  const fetchScholarship = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/scholarships/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setScholarship(data.data);
      } else {
        setModalState({
          show: true,
          message: 'Failed to fetch scholarship details',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching scholarship:', error);
      setModalState({
        show: true,
        message: 'Error fetching scholarship details',
        type: 'error'
      });
    }
  };

  const handleToggleFeatured = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/scholarships/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isFeatured: !scholarship.isFeatured })
      });
      const data = await response.json();
      
      if (data.success) {
        setModalState({
          show: true,
          message: `Scholarship ${!scholarship.isFeatured ? 'added to' : 'removed from'} featured list`,
          type: 'success'
        });
        fetchScholarship();
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

  if (!scholarship) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="view-scholarship">
      <div className="view-header">
        <Link to="/admin/manage-scholarships" className="back-buttonss">
          <FaArrowLeft /> Back to List
        </Link>
        <div className="header-actions">
          <Link to={`/admin/edit-scholarship/${id}`} className="edit-button">
            <FaEdit /> Edit Scholarship
          </Link>
          <button
            className={`feature-button ${scholarship.isFeatured ? 'featured' : ''}`}
            onClick={handleToggleFeatured}
          >
            <FaStar /> {scholarship.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
          </button>
        </div>
      </div>

      <div className="scholarship-details-cd">
        <div className="detail-section">
          <h2>{scholarship.name}</h2>
          <div className="detail-row">
            <span className="label">Amount:</span>
            <span className="value">₹{scholarship.totalAmount}</span>
          </div>
          <div className="detail-row">
            <span className="label">Deadline:</span>
            <span className="value">{new Date(scholarship.deadline).toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span className="label">Status:</span>
            <span className={`status ${scholarship.isFeatured ? 'featured' : ''}`}>
              {scholarship.isFeatured ? 'Featured' : 'Regular'}
            </span>
          </div>
          <div className="detail-row">
            <span className="label">Portal Link:</span>
            <a href={scholarship.portalLink} target="_blank" rel="noopener noreferrer" className="portal-link">
              <FaLink /> Visit Portal
            </a>
          </div>
        </div>

        <div className="detail-section">
          <h3>Eligibility Criteria</h3>
          <div className="eligibility-criteria">
            <div className="criteria-item">
              <span className="label">Education Type:</span>
              <span className="value">{scholarship.educationType}</span>
            </div>

            {scholarship.educationType === 'School' ? (
              <>
                <div className="criteria-item">
                  <span className="label">Class:</span>
                  <span className="value">{scholarship.eligibility.class}</span>
                </div>
                <div className="criteria-item">
                  <span className="label">School Type:</span>
                  <span className="value">{scholarship.eligibility.schoolType}</span>
                </div>
                <div className="criteria-item">
                  <span className="label">Applicable Boards:</span>
                  <div className="value-list">
                    {scholarship.eligibility.applicableBoards.map((board, index) => (
                      <span key={index} className="tag">{board}</span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="criteria-item">
                  <span className="label">University Name:</span>
                  <span className="value">{scholarship.eligibility.universityName}</span>
                </div>
                <div className="criteria-item">
                  <span className="label">College Name:</span>
                  <span className="value">{scholarship.eligibility.collegeName}</span>
                </div>
                <div className="criteria-item">
                  <span className="label">Study Year:</span>
                  <span className="value">{scholarship.eligibility.studyYear}</span>
                </div>
                <div className="criteria-item">
                  <span className="label">Stream:</span>
                  <span className="value">{scholarship.eligibility.stream}</span>
                </div>
                <div className="criteria-item">
                  <span className="label">Education Level:</span>
                  <span className="value">{scholarship.eligibility.educationLevel}</span>
                </div>
              </>
            )}

            <div className="criteria-item">
              <span className="label">Minimum Marks:</span>
              <span className="value">{scholarship.eligibility.minimumMarks}%</span>
            </div>
            <div className="criteria-item">
              <span className="label">Annual Income Limit:</span>
              <span className="value">₹{scholarship.eligibility.annualIncome}</span>
            </div>
            <div className="criteria-item">
              <span className="label">Caste Categories:</span>
              <div className="value-list">
                {scholarship.eligibility.caste.map((category, index) => (
                  <span key={index} className="tag">{category}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {scholarship.extraRequirements && (
          <div className="detail-section">
            <h3>Additional Requirements</h3>
            <p className="description">{scholarship.extraRequirements}</p>
          </div>
        )}
      </div>

      <StatusModal
        show={modalState.show}
        message={modalState.message}
        type={modalState.type}
        onClose={() => setModalState({ ...modalState, show: false })}
      />
    </div>
  );
};

export default ViewScholarship; 