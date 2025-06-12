import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Home.css';

// Cache object to store scholarships data
const scholarshipsCache = {
  data: null,
  timestamp: null,
  // Cache expires after 5 minutes
  maxAge: 5 * 60 * 1000
};

const Home = () => {
  const [scholarships, setScholarships] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  // const featuredScholarships = [
  //   {
  //     id: 1,
  //     title: 'Global Excellence Scholarship',
  //     provider: 'International Education Foundation',
  //     amount: '$10,000',
  //     deadline: '2024-06-30',
  //   },
  //   {
  //     id: 2,
  //     title: 'STEM Innovation Award',
  //     provider: 'Tech Education Initiative',
  //     amount: '$15,000',
  //     deadline: '2024-07-15',
  //   },
  //   {
  //     id: 3,
  //     title: 'Women in Leadership Grant',
  //     provider: 'Empowerment Foundation',
  //     amount: '$8,000',
  //     deadline: '2024-08-01',
  //   },
  // ];


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
      setIsLoading(false);
    } else {
      // Fetch new data if cache is empty or expired
      fetchFeaturedScholarships();
    }
  }, []);

  const fetchFeaturedScholarships = async () => {
    try {
      setIsLoading(true);
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
        const featuredScholarships = data.data.filter(scholarship => scholarship.isFeatured);
        // Update cache
        scholarshipsCache.data = featuredScholarships;
        scholarshipsCache.timestamp = Date.now();
        setScholarships(featuredScholarships);
        setRetryCount(0); // Reset retry count on success
      } else {
        throw new Error(data.message || 'Failed to load featured scholarships');
      }
    } catch (error) {
      console.error('Error fetching featured scholarships:', error);
      setError(error.message || 'Failed to load featured scholarships');
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (retryCount >= 3) {
      // Reset retry count when user clicks after 3 attempts
      setRetryCount(0);
      setError(null);
      // Clear cache on retry
      scholarshipsCache.data = null;
      scholarshipsCache.timestamp = null;
      fetchFeaturedScholarships();
      return;
    }
    // Clear cache on retry
    scholarshipsCache.data = null;
    scholarshipsCache.timestamp = null;
    fetchFeaturedScholarships();
  };

  const renderFeaturedScholarships = () => {
    if (isLoading) {
      return (
        <div className="loading-scholarships" role="status" aria-label="Loading scholarships">
          <div className="loading-spinner" aria-hidden="true"></div>
          <h3>Loading Featured Scholarships</h3>
          <p>Please wait while we fetch the latest opportunities...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="no-featured-scholarships error-state" role="alert">
          <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
          <h3>Unable to Load Featured Scholarships</h3>
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

    if (scholarships.length === 0) {
      return (
        <div className="no-featured-scholarships">
          <i className="fas fa-star" aria-hidden="true"></i>
          <h3>No Featured Scholarships Available</h3>
          <p>Check back soon for new featured opportunities or browse our complete scholarship list.</p>
          <Link to="/scholarships" className="browse-all-button">
            Browse All Scholarships
          </Link>
        </div>
      );
    }

    return scholarships.map((scholarship) => (
      <div 
        key={scholarship._id} 
        className="home-scholarship-card"
        role="article"
        aria-label={`Scholarship: ${scholarship.name}`}
      >
        <h3>{scholarship.name}</h3>
        <div className="scholarship-type">
          <span 
            className={`type-badge ${scholarship.educationType.toLowerCase()}`}
            aria-label={`Education type: ${scholarship.educationType}`}
          >
            {scholarship.educationType}
          </span>
        </div>
        {scholarship.educationType === 'School' ? (
          <p className="provider">
            <i className="fas fa-graduation-cap" aria-hidden="true"></i>
            Class: {scholarship.eligibility.class}
          </p>
        ) : (
          <p className="provider">
            <i className="fas fa-university" aria-hidden="true"></i>
            {scholarship.eligibility.stream} - Year {scholarship.eligibility.studyYear}
          </p>
        )}
        <div className="scholarship-details">
          <p>
            <i className="fas fa-rupee-sign" aria-hidden="true"></i>
            ₹{scholarship.totalAmount}
          </p>
          <p>
            <i className="fas fa-calendar" aria-hidden="true"></i>
            Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
          </p>
        </div>
        <Link 
          to={`/scholarship/${scholarship._id}`} 
          className="apply-buttons"
          aria-label={`Learn more about ${scholarship.name}`}
        >
          <i className="fas fa-arrow-right" aria-hidden="true"></i>
          Learn More
        </Link>
      </div>
    ));
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Find Your Path to Success</h1>
            <p className="hero-subtitle">
              Discover thousands of scholarships and funding opportunities to help you achieve your educational goals.
            </p>
            <Link to="/scholarships" className="cta-button">
              Browse Scholarships
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Scholarships Section */}
      <section 
        className="home-featured-scholarships"
        aria-labelledby="featured-scholarships-title"
      >
        <div className="container">
          <h2 id="featured-scholarships-title" className="section-title">Featured Scholarships</h2>
          <div className="home-scholarship-grid">
            {renderFeaturedScholarships()}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <h2 className="section-title">Why Choose ScholarPath?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-search" aria-hidden="true"></i>
              <h3>Easy Search</h3>
              <p>Find scholarships that match your profile and interests</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-bell" aria-hidden="true"></i>
              <h3>Stay Updated</h3>
              <p>Get notified about new opportunities and deadlines</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-globe" aria-hidden="true"></i>
              <h3>Global Reach</h3>
              <p>Access scholarships from around the world</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 