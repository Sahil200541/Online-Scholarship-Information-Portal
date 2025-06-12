import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import '../CSS/Navbar.css';
import StatusModal from './StatusModal';

const getInitials = (name = '') => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    status: '',
    message: ''
  });
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setActiveSubmenu(null);
  };

  const toggleSubmenu = (type) => {
    setActiveSubmenu(activeSubmenu === type ? null : type);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Check login state on mount (call backend to check session)
  useEffect(() => {
    fetch('http://localhost:5000/api/check-session', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setIsLoggedIn(data.loggedIn);
        setUser(data.user || null);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
      });
  }, [navigate]);

  // Example: handle logout
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setModalState({
        isOpen: true,
        status: 'success',
        message: 'Logout successful! Redirecting...'
      });
      setTimeout(() => {
        window.location.href = '/'; // Force full reload to update Navbar session state
      }, 1500);
    } catch (error) {
      setModalState({
        isOpen: true,
        status: 'error',
        message: 'Logout failed. Please try again.'
      });
    }
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            <span className="logo-text">ScholarPath</span>
          </Link>

          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/scholarships" onClick={() => setIsMenuOpen(false)}>Scholarships</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
          </div>

          <div className="profile-dropdown">
            <button className="profile-button" onClick={toggleProfile}>
              {isLoggedIn && user ? (
                <div className="profile-initials">
                  {getInitials(user.name)}
                </div>
              ) : (
                <FaUser />
              )}
            </button>
            {isProfileOpen && (
              <div className="dropdown-menu">
                {!isLoggedIn && (
                  <>
                    <div className="dropdown-item" onClick={() => toggleSubmenu('admin')}>
                      <i><FaUser /></i>
                      <span>Log in as Admin</span>
                      <i className="arrow"><FaChevronRight /></i>
                    </div>
                    {activeSubmenu === 'admin' && (
                      <div className="submenu">
                        <Link to="/admin/login" className="submenu-item">
                          <i><FaUser /></i>
                          <span>Admin Login</span>
                        </Link>
                        <Link to="/admin/register" className="submenu-item">
                          <i><FaUser /></i>
                          <span>Admin Sign Up</span>
                        </Link>
                      </div>
                    )}
                    <div className="dropdown-item" onClick={() => toggleSubmenu('user')}>
                      <i><FaUser /></i>
                      <span>Log in as User</span>
                      <i className="arrow"><FaChevronRight /></i>
                    </div>
                    {activeSubmenu === 'user' && (
                      <div className="submenu">
                        <Link to="/auth/login" className="submenu-item">
                          <i><FaUser /></i>
                          <span>Login</span>
                        </Link>
                        <Link to="/auth/register" className="submenu-item">
                          <i><FaUser /></i>
                          <span>Sign Up</span>
                        </Link>
                      </div>
                    )}
                  </>
                )}
                {isLoggedIn && user && (
                  <>
                    <div className="dropdown-user-info">
                      <div className="profile-initials-lg">{getInitials(user.name)}</div>
                      <div>
                        <div className="user-fullname">{user.name}</div>
                        <div className="user-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="dropdown-item" onClick={() => { setIsProfileOpen(false); navigate('/profile'); }}>
                      <i><FaUser /></i>
                      <span>Profile</span>
                    </div>
                    <div className="dropdown-item" onClick={handleLogout}>
                      <i><FaUser /></i>
                      <span>Logout</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <button className="menu-toggle" onClick={toggleMenu}>
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>
      <StatusModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        status={modalState.status}
        message={modalState.message}
      />
    </nav>
  );
};

export default Navbar; 