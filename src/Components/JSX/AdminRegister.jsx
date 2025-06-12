import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import StatusModal from './StatusModal';
import '../CSS/Auth.css';
import axios from 'axios';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      setModalState({
        isOpen: true,
        status: 'error',
        message: 'Password must be at least 6 characters long'
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setModalState({
        isOpen: true,
        status: 'error',
        message: 'Passwords do not match'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Show loading state
    setModalState({
      isOpen: true,
      status: 'loading',
      message: 'Creating your account...'
    });

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData;

      const response = await axios.post('http://localhost:5000/api/admin/register', registrationData, {
        withCredentials: true
      });

      if (response.data.success) {
        setModalState({
          isOpen: true,
          status: 'success',
          message: 'Registration successful! Redirecting to login...'
        });

        // Redirect to login page after 1.5 seconds
        setTimeout(() => {
          navigate('/admin/login');
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred during registration';
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
          <p>Create your admin account to manage scholarships</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create Admin Account</h1>
            <p>Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter your username"
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                />
                {showPassword ? (
                  <FaEyeSlash className="password-toggle" onClick={togglePasswordVisibility} />
                ) : (
                  <FaEye className="password-toggle" onClick={togglePasswordVisibility} />
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                />
                {showConfirmPassword ? (
                  <FaEyeSlash className="password-toggle" onClick={toggleConfirmPasswordVisibility} />
                ) : (
                  <FaEye className="password-toggle" onClick={toggleConfirmPasswordVisibility} />
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={modalState.isOpen && modalState.status === 'loading'}
            >
              Sign Up
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/admin/login">Sign In</Link>
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

export default AdminRegister; 