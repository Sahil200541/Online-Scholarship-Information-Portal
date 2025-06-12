import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { FaUser, FaHome, FaPlus, FaStar, FaComments, FaSignOutAlt, FaList } from 'react-icons/fa';
import '../CSS/AdminDashboard.css';
import StatusModal from './StatusModal';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    status: '',
    message: ''
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Check admin session
    const checkAdminSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/check-session', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (!data.success) {
          navigate('/admin/login');
          return;
        }
        
        setAdmin(data.data.admin);
      } catch (error) {
        console.error('Session check error:', error);
        navigate('/admin/login');
      }
    };

    checkAdminSession();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setModalState({
          isOpen: true,
          status: 'success',
          message: 'Logout successful! Redirecting...'
        });
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      setModalState({
        isOpen: true,
        status: 'error',
        message: 'Logout failed. Please try again.'
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

  const getInitials = (name = '') => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || '';
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path === '/admin/manage-scholarships') return 'Manage Scholarships';
    if (path === '/admin/create-scholarship') return 'Create Scholarship';
    if (path === '/admin/featured-scholarships') return 'Featured Scholarships';
    if (path === '/admin/user-queries') return 'User Queries';
    return 'Admin Dashboard';
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>ScholarPath</h2>
          <p>Admin Portal</p>
          <div className="admin-welcome">
            <h3>Welcome, {admin?.username || 'Admin'}</h3>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/admin" 
            className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            <FaHome className="nav-icon" />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/admin/manage-scholarships" 
            className={`nav-item ${location.pathname === '/admin/manage-scholarships' ? 'active' : ''}`}
          >
            <FaList className="nav-icon" />
            <span>Manage Scholarships</span>
          </Link>
          <Link 
            to="/admin/create-scholarship" 
            className={`nav-item ${location.pathname === '/admin/create-scholarship' ? 'active' : ''}`}
          >
            <FaPlus className="nav-icon" />
            <span>Create Scholarships</span>
          </Link>
          <Link 
            to="/admin/featured-scholarships" 
            className={`nav-item ${location.pathname === '/admin/featured-scholarships' ? 'active' : ''}`}
          >
            <FaStar className="nav-icon" />
            <span>Featured Scholarships</span>
          </Link>
          <Link 
            to="/admin/user-queries" 
            className={`nav-item ${location.pathname === '/admin/user-queries' ? 'active' : ''}`}
          >
            <FaComments className="nav-icon" />
            <span>User Queries</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <div className="admin-topbar">
          <div className="topbar-content">
            <h1>{getPageTitle()}</h1>
            <div className="profile-dropdown">
              <button className="profile-button" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                {admin ? (
                  <div className="profile-initials">
                    {getInitials(admin.username)}
                  </div>
                ) : (
                  <FaUser />
                )}
              </button>
              {isProfileOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-user-info">
                    <div className="profile-initials-lg">{getInitials(admin?.username)}</div>
                    <div>
                      <div className="user-fullname">{admin?.username}</div>
                      <div className="user-email">{admin?.email}</div>
                    </div>
                  </div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-icon" />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="dashboard-content">
          <Outlet />
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

export default AdminLayout; 