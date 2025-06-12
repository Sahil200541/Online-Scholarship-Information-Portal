import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import StatusModal from './StatusModal';
import '../CSS/Auth.css';
import axios from 'axios';

const AdminLogin = () => {
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
    
    // Show loading state
    setModalState({
      isOpen: true,
      status: 'loading',
      message: 'Logging in...'
    });

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', formData, {
        withCredentials: true // Important for cookies
      });

      if (response.data.success) {
        setModalState({
          isOpen: true,
          status: 'success',
          message: 'Login successful! Redirecting...'
        });

        // Store admin data in localStorage
        localStorage.setItem('admin', JSON.stringify(response.data.data.admin));

        // Redirect to admin dashboard after 1.5 seconds
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred during login';
      setModalState({
        isOpen: true,
        status: 'error',
        message: errorMessage
      });
    }
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      status: '',
      message: ''
    });
  };

  return (
    <div className="auth-container">
      <button 
        className="back-button" 
        onClick={() => navigate('/')}
      >
        <FaArrowLeft />
        Back to Home
      </button>
      <div className="auth-left">
        <h1>ScholarPath</h1>
        <p>Admin Portal</p>
        <div className="auth-description">
          <p>Welcome to ScholarPath</p>
          <p>Sign in to manage scholarships and applications</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Admin Login</h1>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-group">
                <FaEnvelope className="input-icon" />
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
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
                {showPassword ? (
                  <FaEyeSlash className="password-toggle" onClick={togglePasswordVisibility} />
                ) : (
                  <FaEye className="password-toggle" onClick={togglePasswordVisibility} />
                )}
              </div>
            </div>

            <div className="forgot-password">
              <Link to="/admin/forgot-password">Forgot Password?</Link>
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
              <Link to="/admin/register">Sign Up</Link>
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

export default AdminLogin; 