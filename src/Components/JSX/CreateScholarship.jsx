import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTimes } from 'react-icons/fa';
import '../CSS/CreateScholarship.css';
import StatusModal from './StatusModal';

const CreateScholarship = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    deadline: '',
    educationType: 'School',
    eligibility: {
      applicableBoards: [],
      class: '',
      minimumMarks: '',
      annualIncome: '',
      schoolType: 'Both',
      universityName: '',
      collegeName: '',
      studyYear: '',
      stream: '',
      educationLevel: 'UG',
      caste: []
    },
    extraRequirements: '',
    portalLink: ''
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    status: '',
    message: ''
  });
  const [newBoard, setNewBoard] = useState('');
  const [newCaste, setNewCaste] = useState('');
  const [newClass, setNewClass] = useState('');

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

  const handleAddClass = () => {
    if (newClass && !formData.eligibility.class.includes(newClass)) {
      setFormData(prev => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          class: newClass
        }
      }));
      setNewClass('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/scholarships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setModalState({
          isOpen: true,
          status: 'success',
          message: 'Scholarship created successfully!'
        });
        setTimeout(() => {
          navigate('/admin/manage-scholarships');
        }, 1500);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setModalState({
        isOpen: true,
        status: 'error',
        message: error.message || 'Error creating scholarship'
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
    <div className="create-scholarship">
      <h2>Create New Scholarship</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-groupss">
          <label htmlFor="name">Scholarship Name</label>
          <input
            className='form-input'
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-groupss">
          <label htmlFor="totalAmount">Total Amount (₹)</label>
          <input
            className='form-input'
            type="number"
            id="totalAmount"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-groupss">
          <label htmlFor="deadline">Application Deadline</label>
          <input
            className='form-input'
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-groupss">
          <label htmlFor="educationType">Education Type</label>
          <select
            className='form-input'
            id="educationType"
            name="educationType"
            value={formData.educationType}
            onChange={handleChange}
            required
          >
            <option value="School">School</option>
            <option value="College">College</option>
          </select>
        </div>

        {formData.educationType === 'School' ? (
          <>
            <div className="form-groupss">
              <label>Applicable Boards</label>
              <div className="tag-input-group">
                <input
                  type="text"
                  value={newBoard}
                  onChange={(e) => setNewBoard(e.target.value)}
                  placeholder="Enter board name"
                />
                <button type="button" className="add-button" onClick={handleAddBoard}>
                  <FaPlus className="icon" /> Add
                </button>
              </div>
              <div className="tag-container">
                {formData.eligibility.applicableBoards.map((board, index) => (
                  <span key={index} className="tag">
                    {board}
                    <button type="button" onClick={() => handleRemoveBoard(board)} className="remove-tag">
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-groupss">
              <label>Class</label>
              <div className="tag-input-group">
                <input
                  className='form-input'
                  type="text"
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  placeholder="Enter class"
                />
                <button type="button" className="add-button" onClick={handleAddClass}>
                  <FaPlus className="icon" /> Add
                </button>
              </div>
              {formData.eligibility.class && (
                <div className="tag-container">
                  <span className="tag">
                    {formData.eligibility.class}
                    <button type="button" onClick={() => setFormData(prev => ({
                      ...prev,
                      eligibility: { ...prev.eligibility, class: '' }
                    }))} className="remove-tag">
                      <FaTimes />
                    </button>
                  </span>
                </div>
              )}
            </div>

            <div className="form-groupss">
              <label htmlFor="schoolType">School Type</label>
              <select
                className='form-input'
                id="schoolType"
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
          </>
        ) : (
          <>
            <div className="form-groupss">
              <label htmlFor="universityName">University Name</label>
              <input
                className='form-input'
                type="text"
                id="universityName"
                name="eligibility.universityName"
                value={formData.eligibility.universityName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-groupss">
              <label htmlFor="collegeName">College Name</label>
              <input
                className='form-input'
                type="text"
                id="collegeName"
                name="eligibility.collegeName"
                value={formData.eligibility.collegeName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-groupss">
              <label htmlFor="studyYear">Study Year</label>
              <input
                className='form-input'
                type="number"
                id="studyYear"
                name="eligibility.studyYear"
                value={formData.eligibility.studyYear}
                onChange={handleChange}
                min="1"
                max="4"
                required
              />
            </div>

            <div className="form-groupss">
              <label htmlFor="stream">Stream</label>
              <input
                className='form-input'
                type="text"
                id="stream"
                name="eligibility.stream"
                value={formData.eligibility.stream}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-groupss">
              <label htmlFor="educationLevel">Education Level</label>
              <select
                className='form-input'
                id="educationLevel"
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
          <label htmlFor="minimumMarks">Minimum Marks Required (%)</label>
          <input
            className='form-input'
            type="number"
            id="minimumMarks"
            name="eligibility.minimumMarks"
            value={formData.eligibility.minimumMarks}
            onChange={handleChange}
            min="0"
            max="100"
            required
          />
        </div>

        <div className="form-groupss">
          <label htmlFor="annualIncome">Annual Income Limit (₹)</label>
          <input
            className='form-input'
            type="number"
            id="annualIncome"
            name="eligibility.annualIncome"
            value={formData.eligibility.annualIncome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-groupss">
          <label>Applicable Castes</label>
          <div className="tag-input-group">
            <select
              value={newCaste}
              onChange={(e) => setNewCaste(e.target.value)}
            >
              <option value="">Select caste</option>
              <option value="ST">ST</option>
              <option value="SC">SC</option>
              <option value="OBC">OBC</option>
              <option value="General">General</option>
            </select>
            <button type="button" className="add-button" onClick={handleAddCaste}>
              <FaPlus className="icon" /> Add
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

        <div className="form-groupss">
          <label htmlFor="extraRequirements">Extra Requirements</label>
          <textarea
            className='form-input'
            id="extraRequirements"
            name="extraRequirements"
            value={formData.extraRequirements}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <div className="form-groupss">
          <label htmlFor="portalLink">Portal Link</label>
          <input
            className='form-input'
            type="url"
            id="portalLink"
            name="portalLink"
            value={formData.portalLink}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">Create Scholarship</button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/admin/manage-scholarships')}
          >
            Cancel
          </button>
        </div>
      </form>

      <StatusModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        status={modalState.status}
        message={modalState.message}
      />
    </div>
  );
};

export default CreateScholarship; 