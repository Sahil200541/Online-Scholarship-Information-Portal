import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusModal from './StatusModal';
import '../CSS/Auth.css';

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    status: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalState({
      isOpen: true,
      status: 'loading',
      message: 'Signing in...'
    });

    try {
      console.log('Attempting to login with:', formData);
      
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Fetch the user's name from the session
      let userName = '';
      try {
        const sessionRes = await fetch('http://localhost:5000/api/check-session', {
          method: 'GET',
          credentials: 'include',
        });
        const sessionData = await sessionRes.json();
        if (sessionData.loggedIn && sessionData.user && sessionData.user.name) {
          userName = sessionData.user.name;
        }
      } catch (e) {
        // Ignore error, fallback to generic message
      }
      setModalState({
        isOpen: true,
        status: 'success',
        message: userName
          ? `Welcome, ${userName}! Login successful. Redirecting...`
          : 'Login successful! Redirecting...'
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/'; // Force full reload to update Navbar session state
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      setModalState({
        isOpen: true,
        status: 'error',
        message: error.message || 'An error occurred during login'
      });
    }
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="auth-container">
      <button 
        className="back-button" 
        onClick={() => navigate('/')}
      >
        <i className="fas fa-arrow-left"></i>
        Back to Home
      </button>
      <div className="auth-left">
        <h1>ScholarPath</h1>
        <p>Student Portal</p>
        <div className="auth-description">
          <p>Welcome to ScholarPath</p>
          <p>Sign in to access your scholarships and manage your applications</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Student Login</h1>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-group">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
                <i 
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                  onClick={togglePasswordVisibility}
                ></i>
              </div>
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={modalState.isOpen && modalState.status === 'loading'}
            >
              Sign In
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/auth/register">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>

      <StatusModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        status={modalState.status}
        message={modalState.message}
      />
    </div>
  );
};

export default UserLogin; 