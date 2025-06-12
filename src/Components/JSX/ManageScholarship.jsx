import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageScholarship = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    totalAmount: '',
    deadline: '',
    isFeatured: false,
    eligibility: {
      applicableBoards: [],
      class: '',
      minimumMarks: '',
      annualIncome: '',
      schoolType: '',
      caste: []
    },
    extraRequirements: '',
    portalLink: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/scholarships');
      setScholarships(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching scholarships');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('eligibility.')) {
      const eligibilityField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        eligibility: {
          ...prev.eligibility,
          [eligibilityField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        [field]: value.split(',').map(item => item.trim())
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/scholarships/${editingId}`, formData);
        toast.success('Scholarship updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/scholarships', formData);
        toast.success('Scholarship created successfully');
      }
      setEditingId(null);
      setFormData({
        name: '',
        totalAmount: '',
        deadline: '',
        isFeatured: false,
        eligibility: {
          applicableBoards: [],
          class: '',
          minimumMarks: '',
          annualIncome: '',
          schoolType: '',
          caste: []
        },
        extraRequirements: '',
        portalLink: ''
      });
      fetchScholarships();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving scholarship');
    }
  };

  const handleEdit = (scholarship) => {
    setEditingId(scholarship._id);
    setFormData({
      ...scholarship,
      deadline: new Date(scholarship.deadline).toISOString().split('T')[0]
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this scholarship?')) {
      try {
        await axios.delete(`http://localhost:5000/api/scholarships/${id}`);
        toast.success('Scholarship deleted successfully');
        fetchScholarships();
      } catch (error) {
        toast.error('Error deleting scholarship');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Scholarships</h1>
      
      {/* Scholarship Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Scholarship' : 'Add New Scholarship'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Amount</label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Portal Link</label>
              <input
                type="url"
                name="portalLink"
                value={formData.portalLink}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Applicable Boards (comma-separated)</label>
              <input
                type="text"
                value={formData.eligibility.applicableBoards.join(', ')}
                onChange={(e) => handleArrayInputChange('applicableBoards', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Class</label>
              <input
                type="text"
                name="eligibility.class"
                value={formData.eligibility.class}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Marks</label>
              <input
                type="number"
                name="eligibility.minimumMarks"
                value={formData.eligibility.minimumMarks}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Annual Income Limit</label>
              <input
                type="number"
                name="eligibility.annualIncome"
                value={formData.eligibility.annualIncome}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">School Type</label>
              <select
                name="eligibility.schoolType"
                value={formData.eligibility.schoolType}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select School Type</option>
                <option value="Private">Private</option>
                <option value="Government">Government</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Caste Categories (comma-separated)</label>
              <input
                type="text"
                value={formData.eligibility.caste.join(', ')}
                onChange={(e) => handleArrayInputChange('caste', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Extra Requirements</label>
              <textarea
                name="extraRequirements"
                value={formData.extraRequirements}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows="3"
              />
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Scholarship</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {editingId ? 'Update Scholarship' : 'Add Scholarship'}
            </button>
          </div>
        </form>
      </div>

      {/* Scholarships List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {scholarships.map((scholarship) => (
              <tr key={scholarship._id}>
                <td className="px-6 py-4 whitespace-nowrap">{scholarship.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{scholarship.totalAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(scholarship.deadline).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {scholarship.isFeatured ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(scholarship)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(scholarship._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageScholarship; 