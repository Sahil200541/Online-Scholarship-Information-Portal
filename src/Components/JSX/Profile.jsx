import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/Profile.css';
import StatusModal from './StatusModal';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    status: '',
    message: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setForm(data.user);
        } else {
          navigate('/user/login');
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate('/user/login');
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    
    // If the type is being changed, clear all education details
    if (name === 'type') {
      setForm(prev => ({
        ...prev,
        educationDetails: {
          type: value,
          // Initialize empty fields based on the new type
          ...(value === 'School' ? {
            schoolName: '',
            schoolType: '',
            boardName: '',
            class: '',
            previousClassMarks: ''
          } : {
            collegeName: '',
            universityName: '',
            collegeType: '',
            educationLevel: '',
            yearOfStudy: '',
            currentSemester: '',
            previousYearMarks: ''
          })
        }
      }));
    } else {
      // For other education fields, update normally
      setForm(prev => ({
        ...prev,
        educationDetails: {
          ...prev.educationDetails,
          [name]: value
        }
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validate education details based on type
    if (form.educationDetails?.type) {
      if (form.educationDetails.type === 'School') {
        if (!form.educationDetails.schoolName || 
            !form.educationDetails.schoolType || 
            !form.educationDetails.boardName || 
            !form.educationDetails.class || 
            !form.educationDetails.previousClassMarks) {
          setModalState({
            isOpen: true,
            status: 'error',
            message: 'Please fill in all school details'
          });
          return;
        }
      } else if (form.educationDetails.type === 'College') {
        if (!form.educationDetails.collegeName || 
            !form.educationDetails.universityName || 
            !form.educationDetails.collegeType || 
            !form.educationDetails.educationLevel || 
            !form.educationDetails.yearOfStudy || 
            !form.educationDetails.currentSemester || 
            !form.educationDetails.previousYearMarks) {
          setModalState({
            isOpen: true,
            status: 'error',
            message: 'Please fill in all college details'
          });
          return;
        }
      }
    }

    setModalState({
      isOpen: true,
      status: 'loading',
      message: 'Updating profile...'
    });

    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (res.ok) {
        // Update local state
        setUser(data.user);
        setForm(data.user);
        setEditMode(false);
        
        // Update session data
        try {
          const sessionRes = await fetch('http://localhost:5000/api/check-session', {
            method: 'GET',
            credentials: 'include',
          });
          const sessionData = await sessionRes.json();
          
          if (sessionData.loggedIn && sessionData.user) {
            // Update localStorage with new user data
            localStorage.setItem('user', JSON.stringify(sessionData.user));
            
            setModalState({
              isOpen: true,
              status: 'success',
              message: 'Profile updated successfully! Redirecting...'
            });
            
            // Navigate after a short delay
            setTimeout(() => {
              navigate('/');
            }, 2000);
          } else {
            throw new Error('Session update failed');
          }
        } catch (sessionError) {
          console.error('Session update error:', sessionError);
          setModalState({
            isOpen: true,
            status: 'error',
            message: 'Profile updated but session update failed. Please log in again.'
          });
        }
      } else {
        setModalState({
          isOpen: true,
          status: 'error',
          message: data.message || 'Update failed'
        });
      }
    } catch (err) {
      setModalState({
        isOpen: true,
        status: 'error',
        message: 'Update failed'
      });
    }
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  if (loading) return <div className="profile-container">Loading...</div>;
  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header-row">
          <span className="profile-initials-lg">
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </span>
          <div className="profile-header-info">
            <h2>{user.name}</h2>
            <div className="profile-header-email">{user.email}</div>
          </div>
        </div>
        {editMode ? (
          <form className="profile-form" onSubmit={handleSave}>
            <label>Name
              <input 
                name="name" 
                value={form.name || ''} 
                onChange={handleChange} 
                required 
                placeholder="Enter your full name"
              />
            </label>
            <label>Email
              <input 
                name="email" 
                type="email" 
                value={form.email || ''} 
                onChange={handleChange} 
                required 
                placeholder="Enter your email"
              />
            </label>
            <label>Phone Number
              <input name="phoneNo" value={form.phoneNo || ''} onChange={handleChange} required />
            </label>
            <label>Gender
              <select name="gender" value={form.gender || ''} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
            <fieldset className="profile-edu-fieldset">
              <legend>Education Details</legend>
              <label>Type
                <select name="type" value={form.educationDetails?.type || ''} onChange={handleEducationChange} required>
                  <option value="">Select</option>
                  <option value="School">School</option>
                  <option value="College">College</option>
                </select>
              </label>
              {form.educationDetails?.type === 'School' && (
                <>
                  <label>School Name
                    <input name="schoolName" value={form.educationDetails.schoolName || ''} onChange={handleEducationChange} />
                  </label>
                  <label>School Type
                    <select name="schoolType" value={form.educationDetails.schoolType || ''} onChange={handleEducationChange}>
                      <option value="">Select</option>
                      <option value="Private">Private</option>
                      <option value="Government">Government</option>
                    </select>
                  </label>
                  <label>Board Name
                    <input name="boardName" value={form.educationDetails.boardName || ''} onChange={handleEducationChange} />
                  </label>
                  <label>Class
                    <input name="class" value={form.educationDetails.class || ''} onChange={handleEducationChange} />
                  </label>
                  <label>Previous Class Marks
                    <input name="previousClassMarks" value={form.educationDetails.previousClassMarks || ''} onChange={handleEducationChange} type="number" />
                  </label>
                </>
              )}
              {form.educationDetails?.type === 'College' && (
                <>
                  <label>College Name
                    <input name="collegeName" value={form.educationDetails.collegeName || ''} onChange={handleEducationChange} />
                  </label>
                  <label>University Name
                    <input name="universityName" value={form.educationDetails.universityName || ''} onChange={handleEducationChange} />
                  </label>
                  <label>College Type
                    <select name="collegeType" value={form.educationDetails.collegeType || ''} onChange={handleEducationChange}>
                      <option value="">Select</option>
                      <option value="Private">Private</option>
                      <option value="Government">Government</option>
                    </select>
                  </label>
                  <label>Education Level
                    <select name="educationLevel" value={form.educationDetails.educationLevel || ''} onChange={handleEducationChange}>
                      <option value="">Select</option>
                      <option value="UG">UG</option>
                      <option value="PG">PG</option>
                    </select>
                  </label>
                  <label>Year of Study
                    <input name="yearOfStudy" value={form.educationDetails.yearOfStudy || ''} onChange={handleEducationChange} type="number" />
                  </label>
                  <label>Current Semester
                    <input name="currentSemester" value={form.educationDetails.currentSemester || ''} onChange={handleEducationChange} type="number" />
                  </label>
                  <label>Previous Year Marks
                    <input name="previousYearMarks" value={form.educationDetails.previousYearMarks || ''} onChange={handleEducationChange} type="number" />
                  </label>
                </>
              )}
            </fieldset>
            <label>Queries
              <input name="queries" value={form.queries || ''} onChange={handleChange} />
            </label>
            <button className="edit-profile-btn" type="submit">Save</button>
            <button className="edit-profile-btn cancel" type="button" onClick={() => { setEditMode(false); setForm(user); }}>Cancel</button>
          </form>
        ) : (
          <div className="profile-info">
            <h2>{user.name}</h2>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Phone:</b> {user.phoneNo}</p>
            <p><b>Gender:</b> {user.gender}</p>
            <div className="profile-edu-block">
              <b>Education Details:</b>
              <ul>
                {user.educationDetails?.type && <li>Type: {user.educationDetails.type}</li>}
                {user.educationDetails?.schoolName && <li>School Name: {user.educationDetails.schoolName}</li>}
                {user.educationDetails?.schoolType && <li>School Type: {user.educationDetails.schoolType}</li>}
                {user.educationDetails?.boardName && <li>Board Name: {user.educationDetails.boardName}</li>}
                {user.educationDetails?.class && <li>Class: {user.educationDetails.class}</li>}
                {user.educationDetails?.previousClassMarks && <li>Previous Class Marks: {user.educationDetails.previousClassMarks}</li>}
                {user.educationDetails?.collegeName && <li>College Name: {user.educationDetails.collegeName}</li>}
                {user.educationDetails?.universityName && <li>University Name: {user.educationDetails.universityName}</li>}
                {user.educationDetails?.collegeType && <li>College Type: {user.educationDetails.collegeType}</li>}
                {user.educationDetails?.educationLevel && <li>Education Level: {user.educationDetails.educationLevel}</li>}
                {user.educationDetails?.yearOfStudy && <li>Year of Study: {user.educationDetails.yearOfStudy}</li>}
                {user.educationDetails?.currentSemester && <li>Current Semester: {user.educationDetails.currentSemester}</li>}
                {user.educationDetails?.previousYearMarks && <li>Previous Year Marks: {user.educationDetails.previousYearMarks}</li>}
              </ul>
            </div>
            <p><b>Queries:</b> {user.queries}</p>
            <button className="edit-profile-btn" onClick={() => setEditMode(true)}>Edit</button>
          </div>
        )}
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

export default Profile; 