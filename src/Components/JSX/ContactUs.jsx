import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaClock, FaTicketAlt, FaTimes } from 'react-icons/fa';
import '../CSS/ContactUs.css';
import StatusModal from './StatusModal';

const ContactUs = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ email: '', name: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [modalState, setModalState] = useState({
    show: false,
    message: '',
    type: 'info'
  });
  const [isTicket, setIsTicket] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchTicketDetails();
    }
  }, [isLoggedIn]);

  const fetchTicketDetails = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tickets', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setIsTicket(data.data.isTicket);
        setTicketDetails(data.data.ticketDetails);
      }
    } catch (error) {
      console.error('Error fetching ticket details:', error);
    }
  };

  const checkLoginStatus = async () => {
    try {
      setIsLoading(true);
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
      if (data.isAuthenticated && data.user) {
        setUserData({
          email: data.user.email,
          name: data.user.name
        });
        if (showForm) {
          setFormData(prev => ({
            ...prev,
            email: data.user.email,
            name: data.user.name
          }));
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsLoggedIn(false);
      setUserData({ email: '', name: '' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRaiseTicket = async () => {
    setIsLoading(true);
    try {
      await checkLoginStatus();

      if (!isLoggedIn) {
        setModalState({
          show: true,
          message: 'Please login to raise a ticket',
          type: 'info'
        });
        return;
      }
      setShowForm(true);
      if (userData.email && userData.name) {
        setFormData(prev => ({
          ...prev,
          email: userData.email,
          name: userData.name
        }));
      }
    } catch (error) {
      console.error('Error raising ticket:', error);
      setModalState({
        show: true,
        message: 'An error occurred. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: 'success',
          message: 'Ticket submitted successfully! We will get back to you soon.'
        });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          priority: 'medium'
        });
        setIsTicket(true);
        setTicketDetails(data.data.ticketDetails);
        setTimeout(() => {
          setShowForm(false);
        }, 2000);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to submit ticket. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTicket = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/tickets', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setIsTicket(false);
        setTicketDetails(null);
        setModalState({
          show: true,
          message: 'Ticket deleted successfully',
          type: 'success'
        });
      } else {
        throw new Error(data.message || 'Failed to delete ticket');
      }
    } catch (error) {
      console.error('Delete ticket error:', error);
      setModalState({
        show: true,
        message: error.message || 'Error deleting ticket',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-us-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Have questions? We're here to help. Reach out to our support team.</p>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-info-card">
            <h2>Get in Touch</h2>
            <div className="contact-info-item">
              <FaEnvelope className="contact-info-icon" />
              <div>
                <h3>Email</h3>
                <p>support@scholarpath.com</p>
              </div>
            </div>
            <div className="contact-info-item">
              <FaClock className="contact-info-icon" />
              <div>
                <h3>Response Time</h3>
                <p>We typically respond within 24-48 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Show ticket details if isTicket is true */}
        {isLoggedIn && isTicket && ticketDetails && (
          <div className="tickets-history">
            <h3>Your Ticket</h3>
            <div className="ticket-item">

              <div className="ticket-detail-row"><b>Name:</b> {ticketDetails.name}</div>
              <div className="ticket-detail-row"><b>Email:</b> {ticketDetails.email}</div>
              <div className="ticket-detail-row"><b>Subject:</b> {ticketDetails.subject}</div>
              <div className="ticket-detail-row"><b>Message:</b> {ticketDetails.message}</div>
            </div>

            <div className="ticket-action-row">
              <span
                className={
                  "ticket-status " +
                  (ticketDetails.ticketStatus === "Open"
                    ? "open"
                    : ticketDetails.ticketStatus === "Closed"
                    ? "closed"
                    : "other")
                }
              >
                {ticketDetails.ticketStatus}
              </span>
              <button
                className="delete-ticket-btn"
                onClick={handleDeleteTicket}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete Ticket"}
              </button>
            </div>
          </div>
        )}

        {/* Show form if not ticket */}
        {!isTicket && (!showForm ? (
          <div className="contact-ticket-section">
            <div className="contact-ticket-content">
              <h2>Need Help?</h2>
              <p>Our support team is ready to assist you with any questions or concerns you may have.</p>
              <button
                className="contact-raise-ticket-btn"
                onClick={handleRaiseTicket}
                disabled={isLoading}
              >
                {isLoading ? (
                  'Loading...'
                ) : (
                  <>
                    <FaTicketAlt className="contact-ticket-icon" />
                    Raise a Ticket
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="contact-form-container">
            <div className="contact-form-header">
              <h2>Submit Your Ticket</h2>
              <button
                className="contact-form-close-btn"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                    priority: 'medium'
                  });
                  setStatus({ type: '', message: '' });
                }}
                disabled={isLoading}
              >
                <FaTimes />
              </button>
            </div>

            <form className="contact-ticket-form" onSubmit={handleSubmit}>
              {status.message && (
                <div className={`contact-status-message ${status.type}`}>
                  {status.message}
                </div>
              )}

              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    readOnly={isLoggedIn}
                    disabled={isLoading}
                  />
                </div>
                <div className="contact-form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    readOnly={isLoggedIn}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="contact-form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Enter ticket subject"
                  disabled={isLoading}
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Describe your issue or question"
                  disabled={isLoading}
                ></textarea>
              </div>

              <div className="contact-form-buttons">
                <button
                  type="submit"
                  className="contact-form-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Ticket'}
                </button>
                <button
                  type="button"
                  className="contact-form-cancel-btn"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      name: '',
                      email: '',
                      subject: '',
                      message: '',
                      priority: 'medium'
                    });
                    setStatus({ type: '', message: '' });
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>

      <StatusModal
        show={modalState.show}
        message={modalState.message}
        type={modalState.type}
        onClose={() => setModalState({ ...modalState, show: false })}
      >
        {!isLoggedIn && modalState.type === 'info' && (
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
        )}
      </StatusModal>
    </div>
  );
};

export default ContactUs; 