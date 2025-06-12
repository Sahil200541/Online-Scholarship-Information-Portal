import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusModal from './StatusModal';
import '../CSS/Auth.css';

const UserRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNo: '',
    gender: '',
    educationDetails: {
      type: '',
      // School details
      schoolName: '',
      schoolType: '',
      boardName: '',
      class: '',
      previousClassMarks: '',
      // College details
      collegeName: '',
      universityName: '',
      collegeType: '',
      educationLevel: '',
      yearOfStudy: '',
      currentSemester: '',
      previousYearMarks: ''
    },
    isTicket: false,
    ticketDetails: {
      name: null,
      email: null,
      subject: null,
      message: null,
      ticketStatus: 'not send'
    }
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
    
    // Handle nested educationDetails fields
    if (name.startsWith('educationDetails.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        educationDetails: {
          ...prev.educationDetails,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setModalState({
        isOpen: true,
        status: 'error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setModalState({
        isOpen: true,
        status: 'error',
        message: 'Passwords do not match'
      });
      return;
    }

    // Validate schoolType if education type is School
    if (formData.educationDetails.type === 'School' && !formData.educationDetails.schoolType) {
      setModalState({
        isOpen: true,
        status: 'error',
        message: 'Please select a school type'
      });
      return;
    }

    setModalState({
      isOpen: true,
      status: 'loading',
      message: 'Creating your account...'
    });

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData;
      
      // Ensure schoolType is not sent if education type is not School
      if (registrationData.educationDetails.type !== 'School') {
        delete registrationData.educationDetails.schoolType;
      }
      
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setModalState({
        isOpen: true,
        status: 'success',
        message: 'Account created successfully! Redirecting...'
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/auth/login');
      }, 1500);
    } catch (error) {
      setModalState({
        isOpen: true,
        status: 'error',
        message: error.message || 'An error occurred during registration'
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
          <p>Join ScholarPath Today</p>
          <p>Create your account to access scholarships and manage your applications</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name <span className="required"></span></label>
              <div className="input-group">
                <i className="fas fa-user input-icon"></i>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address <span className="required"></span></label>
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
              <label htmlFor="phoneNo">Phone Number</label>
              <div className="input-group">
                <i className="fas fa-phone input-icon"></i>
                <input
                  type="tel"
                  id="phoneNo"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <div className="input-group">
                <i className="fas fa-venus-mars input-icon"></i>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className='selects'
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="educationType">Education Type</label>
              <div className="input-group">
                <i className="fas fa-graduation-cap input-icon"></i>
                <select
                  id="educationType"
                  name="educationDetails.type"
                  value={formData.educationDetails.type}
                  onChange={handleChange}
                  className='selects'
                >
                  <option value="">Select education type</option>
                  <option value="School">School</option>
                  <option value="College">College</option>
                </select>
              </div>
            </div>

            {formData.educationDetails.type === 'School' && (
              <>
                <div className="form-group">
                  <label htmlFor="schoolName">School Name</label>
                  <div className="input-group">
                    <i className="fas fa-school input-icon"></i>
                    <input
                      type="text"
                      id="schoolName"
                      name="educationDetails.schoolName"
                      value={formData.educationDetails.schoolName}
                      onChange={handleChange}
                      placeholder="Enter your school name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="schoolType">School Type <span className="required"></span></label>
                  <div className="input-group">
                    <i className="fas fa-building input-icon"></i>
                    <select
                      id="schoolType"
                      name="educationDetails.schoolType"
                      value={formData.educationDetails.schoolType}
                      onChange={handleChange}
                      className='selects'
                      required
                    >
                      <option value="">Select school type</option>
                      <option value="Private">Private</option>
                      <option value="Government">Government</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="boardName">Board Name</label>
                  <div className="input-group">
                    <i className="fas fa-university input-icon"></i>
                    <input
                      type="text"
                      id="boardName"
                      name="educationDetails.boardName"
                      value={formData.educationDetails.boardName}
                      onChange={handleChange}
                      placeholder="Enter your board name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="class">Class</label>
                  <div className="input-group">
                    <i className="fas fa-graduation-cap input-icon"></i>
                    <input
                      type="text"
                      id="class"
                      name="educationDetails.class"
                      value={formData.educationDetails.class}
                      onChange={handleChange}
                      placeholder="Enter your class"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="previousClassMarks">Previous Class Marks</label>
                  <div className="input-group">
                    <i className="fas fa-percent input-icon"></i>
                    <input
                      type="number"
                      id="previousClassMarks"
                      name="educationDetails.previousClassMarks"
                      value={formData.educationDetails.previousClassMarks}
                      onChange={handleChange}
                      placeholder="Enter your previous class marks"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </>
            )}

            {formData.educationDetails.type === 'College' && (
              <>
                <div className="form-group">
                  <label htmlFor="collegeName">College Name</label>
                  <div className="input-group">
                    <i className="fas fa-university input-icon"></i>
                    <input
                      type="text"
                      id="collegeName"
                      name="educationDetails.collegeName"
                      value={formData.educationDetails.collegeName}
                      onChange={handleChange}
                      placeholder="Enter your college name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="universityName">University Name</label>
                  <div className="input-group">
                    <i className="fas fa-university input-icon"></i>
                    <input
                      type="text"
                      id="universityName"
                      name="educationDetails.universityName"
                      value={formData.educationDetails.universityName}
                      onChange={handleChange}
                      placeholder="Enter your university name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="collegeType">College Type</label>
                  <div className="input-group">
                    <i className="fas fa-building input-icon"></i>
                    <select
                      id="collegeType"
                      name="educationDetails.collegeType"
                      value={formData.educationDetails.collegeType}
                      onChange={handleChange}
                      className='selects'
                    >
                      <option value="">Select college type</option>
                      <option value="Private">Private</option>
                      <option value="Government">Government</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="educationLevel">Education Level</label>
                  <div className="input-group">
                    <i className="fas fa-graduation-cap input-icon"></i>
                    <select
                      id="educationLevel"
                      name="educationDetails.educationLevel"
                      value={formData.educationDetails.educationLevel}
                      onChange={handleChange}
                      className='selects'
                    >
                      <option value="">Select education level</option>
                      <option value="UG">UG</option>
                      <option value="PG">PG</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="yearOfStudy">Year of Study</label>
                  <div className="input-group">
                    <i className="fas fa-calendar input-icon"></i>
                    <input
                      type="number"
                      id="yearOfStudy"
                      name="educationDetails.yearOfStudy"
                      value={formData.educationDetails.yearOfStudy}
                      onChange={handleChange}
                      min="1"
                      placeholder="Enter your year of study"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="currentSemester">Current Semester</label>
                  <div className="input-group">
                    <i className="fas fa-calendar-alt input-icon"></i>
                    <input
                      type="number"
                      id="currentSemester"
                      name="educationDetails.currentSemester"
                      value={formData.educationDetails.currentSemester}
                      onChange={handleChange}
                      min="1"
                      placeholder="Enter your current semester"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="previousYearMarks">Previous Year Marks (%)</label>
                  <div className="input-group">
                    <i className="fas fa-percentage input-icon"></i>
                    <input
                      type="number"
                      id="previousYearMarks"
                      name="educationDetails.previousYearMarks"
                      value={formData.educationDetails.previousYearMarks}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      placeholder="Enter your previous year marks"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="password">Password <span className="required"></span></label>
              <div className="input-group">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a password"
                />
                <i 
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                  onClick={togglePasswordVisibility}
                ></i>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password <span className="required"></span></label>
              <div className="input-group">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                />
                <i 
                  className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                  onClick={toggleConfirmPasswordVisibility}
                ></i>
              </div>
            </div>

            <div className="form-note">
              <p>Fields marked with <span className="required"></span> are required</p>
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={modalState.isOpen && modalState.status === 'loading'}
            >
              Create Account
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/auth/login">Sign In</Link>
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

export default UserRegister; 