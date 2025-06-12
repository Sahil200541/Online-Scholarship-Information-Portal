import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../CSS/ViewUserQuery.css';

const ViewUserQuery = () => {
  const navigate = useNavigate();
  const [userQueries, setUserQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserQueries();
  }, []);

  const fetchUserQueries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/user-queries', {
        withCredentials: true
      });
      setUserQueries(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user queries');
      setLoading(false);
    }
  };

  const handleViewQuery = (queryId) => {
    navigate(`/admin/user-queries/${queryId}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="view-user-query">
      <h2>User Queries</h2>
      <div className="queries-container">
        {userQueries.length === 0 ? (
          <p>No user queries found</p>
        ) : (
          userQueries.map((user) => (
            user.isTicket && user.ticketDetails && (
              <div key={user._id} className="query-card">
                <div className="query-header">
                  <h3>{user.ticketDetails.name}</h3>
                  <span className={`status ${user.ticketDetails.ticketStatus}`}>
                    {user.ticketDetails.ticketStatus}
                  </span>
                </div>
                <div className="query-details">
                  <p><strong>Email:</strong> {user.ticketDetails.email}</p>
                  <p><strong>Subject:</strong> {user.ticketDetails.subject}</p>
                  <p><strong>Message:</strong> {user.ticketDetails.message}</p>
                </div>
                <button 
                  className="view-button"
                  onClick={() => handleViewQuery(user._id)}
                >
                  View Details
                </button>
              </div>
            )
          ))
        )}
      </div>
    </div>
  );
};

export default ViewUserQuery; 