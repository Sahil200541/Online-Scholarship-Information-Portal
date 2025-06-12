import React, { useState, useEffect } from 'react';
import '../CSS/About.css';

const About = () => {
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
    const duration = 2000;
    const interval = 20;
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
    <div className="about-page">
      <div className="about-hero">
        <h1 className="about-title">About ScholarPath</h1>
        <p className="about-subtitle">Empowering Students Through Accessible Education</p>
      </div>

      <div className="about-sections">
        <section className="about-mission">
          <h2 className="section-title">Our Mission</h2>
          <p className="section-text">
            At ScholarPath, we believe that every student deserves access to quality education, 
            regardless of their financial background. Our mission is to bridge the gap between 
            deserving students and educational opportunities by providing a comprehensive platform 
            for scholarship discovery and application.
          </p>
        </section>

        <section className="about-impact">
          <h2 className="section-title">Our Impact</h2>
          <div className="impact-cards">
            <div className="impact-card">
              <h3 className="impact-number">{scholarshipCount.toLocaleString()}+</h3>
              <p className="impact-label">Scholarships Listed</p>
            </div>
            <div className="impact-card">
              <h3 className="impact-number">{studentCount.toLocaleString()}+</h3>
              <p className="impact-label">Students Helped</p>
            </div>
          </div>
        </section>

        <section className="about-values">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-item">
              <h3 className="value-title">Accessibility</h3>
              <p className="value-description">
                Making education accessible to all students, regardless of their financial background.
              </p>
            </div>
            <div className="value-item">
              <h3 className="value-title">Transparency</h3>
              <p className="value-description">
                Providing clear and accurate information about scholarship opportunities.
              </p>
            </div>
            <div className="value-item">
              <h3 className="value-title">Support</h3>
              <p className="value-description">
                Offering guidance and support throughout the scholarship application process.
              </p>
            </div>
            <div className="value-item">
              <h3 className="value-title">Innovation</h3>
              <p className="value-description">
                Continuously improving our platform to better serve students' needs.
              </p>
            </div>
          </div>
        </section>

        <section className="about-team">
          <h2 className="section-title">Our Team</h2>
          <p className="section-text">
            Our dedicated team of education enthusiasts and technology experts work tirelessly 
            to ensure that every student can find and apply for the scholarships they deserve. 
            We combine our passion for education with technical expertise to create a seamless 
            experience for our users.
          </p>
        </section>

        <section className="about-contact">
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-text">
            Have questions or suggestions? We'd love to hear from you. Reach out to us through 
            our contact page or email us directly.
          </p>
          <a href="/contact" className="contact-link">Contact Us</a>
        </section>
      </div>
    </div>
  );
};

export default About; 