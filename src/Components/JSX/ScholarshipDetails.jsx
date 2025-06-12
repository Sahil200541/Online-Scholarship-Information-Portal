import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../CSS/ScholarshipDetails.css';
import StatusModal from './StatusModal';

// Cache object to store scholarship details
const scholarshipDetailsCache = {
  data: null,
  timestamp: null,
  // Cache expires after 5 minutes
  maxAge: 5 * 60 * 1000
};

const ScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalState, setModalState] = useState({
    show: false,
    message: '',
    type: 'info'
  });

  useEffect(() => {
    // Clear cache when id changes
    scholarshipDetailsCache.data = null;
    scholarshipDetailsCache.timestamp = null;
    
    // Fetch new data
    fetchScholarshipDetails();
    checkLoginStatus();
  }, [id]);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/check-auth', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
      
      const data = await response.json();
      setIsLoggedIn(data.isAuthenticated);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
    }
  };

  const fetchScholarshipDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Minimum loading time of 1 second for better UX
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1000));
      
      const fetchPromise = fetch(`http://localhost:5000/api/scholarships/${id}`, {
        credentials: 'include'
      });

      const [response] = await Promise.all([fetchPromise, minLoadingTime]);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Update cache
        scholarshipDetailsCache.data = data.data;
        scholarshipDetailsCache.timestamp = Date.now();
        setScholarship(data.data);
      } else {
        throw new Error(data.message || 'Failed to load scholarship details');
      }
    } catch (error) {
      console.error('Error fetching scholarship details:', error);
      setError(error.message || 'Failed to load scholarship details');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    // Clear cache on retry
    scholarshipDetailsCache.data = null;
    scholarshipDetailsCache.timestamp = null;
    fetchScholarshipDetails();
  };

  const handleApplyClick = async (e) => {
    e.preventDefault();
    await checkLoginStatus();
    
    if (!isLoggedIn) {
      setModalState({
        show: true,
        message: 'Please login to apply for this scholarship',
        type: 'info'
      });
      return;
    }
    window.open(scholarship.portalLink, '_blank');
  };

  if (loading) {
    return (
      <div className="scholarship-details-loading">
        <div className="loading-spinner" aria-hidden="true"></div>
        <h3>Loading Scholarship Details</h3>
        <p>Please wait while we fetch the scholarship information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scholarship-details-error">
        <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
        <h3>Unable to Load Scholarship Details</h3>
        <p>{error}</p>
        <button 
          onClick={handleRetry} 
          className="retry-button"
          aria-label="Retry loading scholarship details"
        >
          <i className="fas fa-sync-alt" aria-hidden="true"></i>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="scholarship-details-page">
      <div className="scholarship-details-container">
        <Link to="/scholarships" className="scholarship-details-back-link">
          <i className="fas fa-arrow-left"></i> Back to Scholarships
        </Link>

        <div className="scholarship-details-header">
          <h1>{scholarship.name}</h1>
          <div className="scholarship-type">
            <span className={`type-badge ${scholarship.educationType.toLowerCase()}`}>
              {scholarship.educationType}
            </span>
          </div>
        </div>

        <div className="scholarship-details-overview">
          <div className="scholarship-details-overview-card">
            <i className="fas fa-rupee-sign"></i>
            <h3>Amount</h3>
            <p>₹{scholarship.totalAmount}</p>
          </div>
          <div className="scholarship-details-overview-card">
            <i className="fas fa-calendar"></i>
            <h3>Deadline</h3>
            <p>{new Date(scholarship.deadline).toLocaleDateString()}</p>
          </div>
          
          {scholarship.educationType === 'School' ? (
            <div className="scholarship-details-overview-card">
              <i className="fas fa-graduation-cap"></i>
              <h3>Class</h3>
              <p>{scholarship.eligibility.class}</p>
            </div>
          ) : (
            <div className="scholarship-details-overview-card">
              <i className="fas fa-university"></i>
              <h3>Education Level</h3>
              <p>{scholarship.eligibility.educationLevel}</p>
            </div>
          )}
        </div>

        <div className="scholarship-details-content">
          <section className="scholarship-details-section">
            <h2><i className="fas fa-info-circle"></i>Eligibility Criteria</h2>
            <div className="scholarship-details-eligibility">
              {scholarship.educationType === 'School' ? (
                <>
                  <div className="eligibility-item">
                    <i className="fas fa-school"></i>
                    <div className="eligibility-content">
                      <h4>School Type</h4>
                      <p>{scholarship.eligibility.schoolType}</p>
                    </div>
                  </div>
                  <div className="eligibility-item">
                    <i className="fas fa-chalkboard"></i>
                    <div className="eligibility-content">
                      <h4>Applicable Boards</h4>
                      <div className="tag-list">
                        {scholarship.eligibility.applicableBoards.map((board, index) => (
                          <span key={index} className="tag">{board}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="eligibility-item">
                    <i className="fas fa-university"></i>
                    <div className="eligibility-content">
                      <h4>University</h4>
                      <p>{scholarship.eligibility.universityName}</p>
                    </div>
                  </div>
                  <div className="eligibility-item">
                    <i className="fas fa-building"></i>
                    <div className="eligibility-content">
                      <h4>College</h4>
                      <p>{scholarship.eligibility.collegeName}</p>
                    </div>
                  </div>
                  <div className="eligibility-item">
                    <i className="fas fa-book"></i>
                    <div className="eligibility-content">
                      <h4>Stream</h4>
                      <p>{scholarship.eligibility.stream}</p>
                    </div>
                  </div>
                  <div className="eligibility-item">
                    <i className="fas fa-calendar-alt"></i>
                    <div className="eligibility-content">
                      <h4>Study Year</h4>
                      <p>Year {scholarship.eligibility.studyYear}</p>
                    </div>
                  </div>
                </>
              )}

              <div className="eligibility-item">
                <i className="fas fa-percentage"></i>
                <div className="eligibility-content">
                  <h4>Minimum Marks Required</h4>
                  <p>{scholarship.eligibility.minimumMarks}%</p>
                </div>
              </div>

              <div className="eligibility-item">
                <i className="fas fa-money-bill-wave"></i>
                <div className="eligibility-content">
                  <h4>Annual Income Limit</h4>
                  <p>₹{scholarship.eligibility.annualIncome}</p>
                </div>
              </div>

              <div className="eligibility-item">
                <i className="fas fa-users"></i>
                <div className="eligibility-content">
                  <h4>Applicable Categories</h4>
                  <div className="tag-list">
                    {scholarship.eligibility.caste.map((category, index) => (
                      <span key={index} className="tag">{category}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {scholarship.extraRequirements && (
            <section className="scholarship-details-section">
              <h2><i className="fas fa-file-alt"></i>Additional Requirements</h2>
              <div className="scholarship-details-description">
                <p>{scholarship.extraRequirements}</p>
              </div>
            </section>
          )}
        </div>

        <div className="scholarship-details-cta">
          <button 
            onClick={handleApplyClick}
            className="scholarship-details-apply-button"
          >
            Apply Now
          </button>
          <p className="scholarship-details-deadline">
            <i className="fas fa-clock"></i>
            Application deadline: {new Date(scholarship.deadline).toLocaleDateString()}
          </p>
        </div>

        <StatusModal
          show={modalState.show}
          message={modalState.message}
          type={modalState.type}
          onClose={() => setModalState({ ...modalState, show: false })}
        >
          <div className="contact-modal-buttons">
            <button 
              className="contact-modal-login-btn"
              onClick={() => {
                setModalState({ ...modalState, show: false });
                navigate('/auth/login');
              }}
            >
              Login
            </button>
            <button 
              className="contact-modal-close-btn"
              onClick={() => setModalState({ ...modalState, show: false })}
            >
              Close
            </button>
          </div>
        </StatusModal>
      </div>
    </div>
  );
};

export default ScholarshipDetails;