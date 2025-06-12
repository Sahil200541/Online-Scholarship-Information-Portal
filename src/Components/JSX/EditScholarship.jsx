import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaPlus, FaTimes } from 'react-icons/fa';
import StatusModal from './StatusModal';
import '../CSS/EditScholarship.css';

const EditScholarship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    deadline: '',
    portalLink: '',
    educationType: 'School',
    eligibility: {
      class: '',
      schoolType: 'Both',
      minimumMarks: '',
      annualIncome: '',
      applicableBoards: [],
      universityName: '',
      collegeName: '',
      studyYear: '',
      stream: '',
      educationLevel: 'UG',
      caste: []
    },
    extraRequirements: '',
    isFeatured: false
  });
  const [modalState, setModalState] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  const [newBoard, setNewBoard] = useState('');
  const [newCaste, setNewCaste] = useState('');

  useEffect(() => {
    fetchScholarship();
  }, [id]);

  const fetchScholarship = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/scholarships/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setFormData(data.data);
      } else {
        setModalState({
          show: true,
          message: 'Failed to fetch scholarship details',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching scholarship:', error);
      setModalState({
        show: true,
        message: 'Error fetching scholarship details',
        type: 'error'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddBoard = () => {
    if (newBoard && !formData.eligibility.applicableBoards.includes(newBoard)) {
      setFormData(prev => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          applicableBoards: [...prev.eligibility.applicableBoards, newBoard]
        }
      }));
      setNewBoard('');
    }
  };

  const handleRemoveBoard = (board) => {
    setFormData(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        applicableBoards: prev.eligibility.applicableBoards.filter(b => b !== board)
      }
    }));
  };

  const handleAddCaste = () => {
    if (newCaste && !formData.eligibility.caste.includes(newCaste)) {
      setFormData(prev => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          caste: [...prev.eligibility.caste, newCaste]
        }
      }));
      setNewCaste('');
    }
  };

  const handleRemoveCaste = (caste) => {
    setFormData(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        caste: prev.eligibility.caste.filter(c => c !== caste)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/scholarships/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        setModalState({
          show: true,
          message: 'Scholarship updated successfully',
          type: 'success'
        });
        setTimeout(() => {
          navigate('/admin/manage-scholarships');
        }, 1500);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setModalState({
        show: true,
        message: error.message || 'Error updating scholarship',
        type: 'error'
      });
    }
  };

  return (
    <div className="edit-scholarship">
      <div className="edit-header">
        <button onClick={() => navigate('/admin/manage-scholarships')} className="back-buttonsss">
          <FaArrowLeft /> Back to List
        </button>
        <h2>Edit Scholarship</h2>
      </div>

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-groupss">
            <label>Scholarship Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groupss">
            <label>Total Amount (₹)</label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groupss">
            <label>Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : ''}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groupss">
            <label>Portal Link</label>
            <input
              type="url"
              name="portalLink"
              value={formData.portalLink}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groupss">
            <label>Education Type</label>
            <select
              name="educationType"
              value={formData.educationType}
              onChange={handleChange}
              required
            >
              <option value="School">School</option>
              <option value="College">College</option>
            </select>
          </div>
          
        </div>

        <div className="form-section">
          <h3>Eligibility Criteria</h3>
          {formData.educationType === 'School' ? (
            <>
              <div className="form-groupss">
                <label>Class</label>
                <input
                  type="text"
                  name="eligibility.class"
                  value={formData.eligibility.class}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-groupss">
                <label>School Type</label>
                <select
                  name="eligibility.schoolType"
                  value={formData.eligibility.schoolType}
                  onChange={handleChange}
                  required
                >
                  <option value="Private">Private</option>
                  <option value="Government">Government</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div className="form-groupss">
                <label>Applicable Boards</label>
                <div className="tag-input-group">
                  <input
                    type="text"
                    value={newBoard}
                    onChange={(e) => setNewBoard(e.target.value)}
                    placeholder="Enter board name"
                  />
                  <button type="button" onClick={handleAddBoard}>
                    <FaPlus /> Add
                  </button>
                </div>
                <div className="tag-list">
                  {formData.eligibility.applicableBoards.map((board, index) => (
                    <span key={index} className="tag">
                      {board}
                      <button type="button" onClick={() => handleRemoveBoard(board)}>
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-groupss">
                <label>University Name</label>
                <input
                  type="text"
                  name="eligibility.universityName"
                  value={formData.eligibility.universityName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-groupss">
                <label>College Name</label>
                <input
                  type="text"
                  name="eligibility.collegeName"
                  value={formData.eligibility.collegeName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-groupss">
                <label>Study Year</label>
                <input
                  type="number"
                  name="eligibility.studyYear"
                  value={formData.eligibility.studyYear}
                  onChange={handleChange}
                  min="1"
                  max="4"
                  required
                />
              </div>
              <div className="form-groupss">
                <label>Stream</label>
                <input
                  type="text"
                  name="eligibility.stream"
                  value={formData.eligibility.stream}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-groupss">
                <label>Education Level</label>
                <select
                  name="eligibility.educationLevel"
                  value={formData.eligibility.educationLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="UG">Undergraduate (UG)</option>
                  <option value="PG">Postgraduate (PG)</option>
                </select>
              </div>
            </>
          )}

          <div className="form-groupss">
            <label>Minimum Marks (%)</label>
            <input
              type="number"
              name="eligibility.minimumMarks"
              value={formData.eligibility.minimumMarks}
              onChange={handleChange}
              min="0"
              max="100"
              required
            />
          </div>
          <div className="form-groupss">
            <label>Annual Income Limit (₹)</label>
            <input
              type="number"
              name="eligibility.annualIncome"
              value={formData.eligibility.annualIncome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-groupss">
            <label>Caste Categories</label>
            <div className="tag-input-group">
              <input
                type="text"
                value={newCaste}
                onChange={(e) => setNewCaste(e.target.value)}
                placeholder="Enter caste category"
              />
              <button type="button" className="caste-add-button" onClick={handleAddCaste}>
                <FaPlus /> Add Caste
              </button>
            </div>
            <div className="tag-container">
              {formData.eligibility.caste.map((caste, index) => (
                <span key={index} className="tag">
                  {caste}
                  <button type="button" onClick={() => handleRemoveCaste(caste)} className="remove-tag">
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Requirements</h3>
          <div className="form-groupss">
            <label>Extra Requirements</label>
            <textarea
              name="extraRequirements"
              value={formData.extraRequirements}
              onChange={handleChange}
              rows="4"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button">
            <FaSave /> Save Changes
          </button>
        </div>
      </form>

      <StatusModal
        show={modalState.show}
        message={modalState.message}
        type={modalState.type}
        onClose={() => setModalState(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default EditScholarship; 