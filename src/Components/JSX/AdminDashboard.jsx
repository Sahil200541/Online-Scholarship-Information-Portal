import React, { useState, useEffect } from 'react';
import '../CSS/AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalQueries: 0,
    totalScholarships: 0,
    featuredScholarships: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/stats', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="loading">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <h2>Welcome to your Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Queries</h3>
          <p className="stat-number">{stats.totalQueries}</p>
          <p className="stat-description">User queries received</p>
        </div>
        <div className="stat-card">
          <h3>Total Scholarships</h3>
          <p className="stat-number">{stats.totalScholarships}</p>
          <p className="stat-description">Available scholarships</p>
        </div>
        <div className="stat-card">
          <h3>Featured Scholarships</h3>
          <p className="stat-number">{stats.featuredScholarships}</p>
          <p className="stat-description">Highlighted opportunities</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 