import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../CSS/ScholarshipList.css';
import StatusModal from './StatusModal';

// Cache object to store scholarships data
const scholarshipsCache = {
  data: null,
  timestamp: null,
  // Cache expires after 5 minutes
  maxAge: 5 * 60 * 1000
};

const ScholarshipList = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    educationType: '',
    deadline: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalState, setModalState] = useState({
    show: false,
    message: '',
    type: 'info'
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have valid cached data
    const now = Date.now();
    if (
      scholarshipsCache.data &&
      scholarshipsCache.timestamp &&
      now - scholarshipsCache.timestamp < scholarshipsCache.maxAge
    ) {
      // Use cached data
      setScholarships(scholarshipsCache.data);
      setLoading(false);
    } else {
      // Fetch new data if cache is empty or expired
      fetchScholarships();
    }
    checkLoginStatus();
  }, []);

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

  const handleApplyClick = async (e, scholarship) => {
    e.preventDefault();
    await checkLoginStatus();
    
    if (!isLoggedIn) {
      setModalState({
        show: true,
        message: 'Please login to apply for scholarships',
        type: 'info'
      });
      return;
    }
    window.open(scholarship.portalLink, '_blank');
  };

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Minimum loading time of 1 second for better UX
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1000));
      
      const fetchPromise = fetch('http://localhost:5000/api/scholarships', {
        credentials: 'include'
      });

      const [response] = await Promise.all([fetchPromise, minLoadingTime]);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Update cache
        scholarshipsCache.data = data.data;
        scholarshipsCache.timestamp = Date.now();
        setScholarships(data.data);
      } else {
        throw new Error(data.message || 'Failed to load scholarships');
      }
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      setError(error.message || 'Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    // Clear cache on retry
    scholarshipsCache.data = null;
    scholarshipsCache.timestamp = null;
    fetchScholarships();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch = searchTerm === '' || 
      scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.eligibility.stream?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.eligibility.educationLevel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.eligibility.class?.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesSearch &&
      (!filters.educationType || scholarship.educationType === filters.educationType) &&
      (!filters.deadline || new Date(scholarship.deadline) >= new Date(filters.deadline))
    );
  });

  const DetailItem = ({ icon, label, value }) => (
    <div className="scholarship-list-detail-item">
      <i className={`fas fa-${icon}`}></i>
      <span>{value}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="scholarship-list-loading">
        <div className="loading-spinner" aria-hidden="true"></div>
        <h3>Loading Scholarships</h3>
        <p>Please wait while we fetch the latest opportunities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scholarship-list-error">
        <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
        <h3>Unable to Load Scholarships</h3>
        <p>{error}</p>
        <button 
          onClick={handleRetry} 
          className="retry-button"
          aria-label="Retry loading scholarships"
        >
          <i className="fas fa-sync-alt" aria-hidden="true"></i>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="scholarship-list">
      <div className="scholarship-list-containers">
        <div className="scholarship-list-header">
          <h1>Discover Your Perfect Scholarship</h1>
          <p>Browse through our extensive collection of scholarships and find the perfect opportunity for you.</p>
        </div>

        {/* Search Bar */}
        <div className="scholarship-search-wrapper">
          <div className="scholarship-search-container">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search scholarships by name, stream, education level, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="scholarship-search-input"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="educationType">
              <i className="fas fa-graduation-cap"></i>
              Education Type
            </label>
            <select
              id="educationType"
              name="educationType"
              value={filters.educationType}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="School">School</option>
              <option value="College">College</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="deadline">
              <i className="fas fa-calendar-alt"></i>
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={filters.deadline}
              onChange={handleFilterChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Scholarship Grid */}
        <div className="scholarship-list-grid">
          {filteredScholarships.map((scholarship) => (
            <div key={scholarship._id} className="scholarship-list-card">
              <div className="scholarship-list-card-header">
                <h3 className="scholarship-list-card-title">{scholarship.name}</h3>
                <div className="scholarship-type">
                  <span className={`type-badge ${scholarship.educationType.toLowerCase()}`}>
                    {scholarship.educationType}
                  </span>
                </div>
              </div>
              
              <div className="scholarship-list-card-body">
                <div className="scholarship-list-card-details">
                  <DetailItem
                    icon="rupee-sign"
                    label="Amount"
                    value={`₹${scholarship.totalAmount}`}
                  />
                  <DetailItem
                    icon="calendar-alt"
                    label="Deadline"
                    value={new Date(scholarship.deadline).toLocaleDateString()}
                  />
                  {scholarship.educationType === 'School' ? (
                    <>
                      <DetailItem
                        icon="graduation-cap"
                        label="Class"
                        value={scholarship.eligibility.class}
                      />
                      <DetailItem
                        icon="school"
                        label="School Type"
                        value={scholarship.eligibility.schoolType}
                      />
                      <div className="scholarship-list-detail-item">
                        <i className="fas fa-chalkboard"></i>
                        <div className="tag-list">
                          {scholarship.eligibility.applicableBoards.map((board, index) => (
                            <span key={index} className="tag-board">{board}</span>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <DetailItem
                        icon="university"
                        label="Education Level"
                        value={scholarship.eligibility.educationLevel}
                      />
                      <DetailItem
                        icon="book"
                        label="Stream"
                        value={scholarship.eligibility.stream}
                      />
                      <DetailItem
                        icon="calendar-alt"
                        label="Study Year"
                        value={`Year ${scholarship.eligibility.studyYear}`}
                      />
                    </>
                  )}
                  <DetailItem
                    icon="percentage"
                    label="Minimum Marks"
                    value={`${scholarship.eligibility.minimumMarks}%`}
                  />
                </div>
              </div>

              <div className="scholarship-list-card-footer">
                <div className="scholarship-list-card-amount">₹{scholarship.totalAmount}</div>
                <div className="scholarship-list-card-actions">
                  <Link 
                    to={`/scholarship/${scholarship._id}`} 
                    className="scholarship-list-card-button secondary"
                  >
                    Learn More
                  </Link>
                  <button 
                    onClick={(e) => handleApplyClick(e, scholarship)}
                    className="scholarship-list-card-button primary"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="no-results">
            <i className="fas fa-search"></i>
            <p>No scholarships found matching your criteria.</p>
          </div>
        )}
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
  );
};

export default ScholarshipList; 