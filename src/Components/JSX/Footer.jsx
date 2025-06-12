import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Footer.css';

const Footer = () => {
  const [scholarshipCount, setScholarshipCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch scholarship count
        const scholarshipResponse = await fetch('http://localhost:5000/api/scholarships', {
          credentials: 'include'
        });
        const scholarshipData = await scholarshipResponse.json();
        
        if (scholarshipData.success) {
          const actualScholarshipCount = scholarshipData.data.length;
          animateCounter(actualScholarshipCount, setScholarshipCount);
        }

        // Fetch user count
        const userResponse = await fetch('http://localhost:5000/api/users/count', {
          credentials: 'include'
        });
        const userData = await userResponse.json();
        
        if (userData.success) {
          const actualUserCount = userData.data;
          animateCounter(actualUserCount, setStudentCount);
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  const animateCounter = (target, setter) => {
    const duration = 2000; // 2 seconds
    const interval = 20; // Update every 20ms
    const steps = duration / interval;
    const increment = target / steps;
    let current = 0;

    const counter = setInterval(() => {
      current += increment;

      if (current >= target) {
        current = target;
        clearInterval(counter);
      }

      setter(Math.floor(current));
    }, interval);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ScholarPath</h3>
            <p className="mission-statement">
              Empowering students to achieve their academic dreams through accessible scholarship opportunities. 
              We believe in making quality education attainable for everyone.
            </p>
            <div className="footer-stats">
              <div className="stat-item">
                <span className="stat-numbers">{scholarshipCount.toLocaleString()}+</span>
                <span className="stat-label">Scholarships</span>
              </div>
              <div className="stat-item">
                <span className="stat-numbers">{studentCount.toLocaleString()}+</span>
                <span className="stat-label">Students</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/scholarships">Scholarships</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Resources</h3>
            <ul>
              <li><Link to="/scholarships">Find Scholarships</Link></li>
              <li><Link to="/about">About ScholarPath</Link></li>
              <li><Link to="/contact">Get Help</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ScholarPath. All rights reserved.</p>
          <p className="footer-tagline">Your Journey to Educational Success Starts Here</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 