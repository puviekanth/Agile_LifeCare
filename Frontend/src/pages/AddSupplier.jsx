import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const AddSupplier = () => {
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API;
  const [formData, setFormData] = useState({
    supplierName: '',
    companyName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+(\.admin)?@lifecare\.com$|^[^\s@]+@(gmail\.com|outlook\.com|hotmail\.com|icloud\.com)$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.supplierName) newErrors.supplierName = 'Supplier Name is required';
    if (!formData.companyName) newErrors.companyName = 'Company Name is required';
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage('');
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${api}/addsuppliers`, formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      setServerMessage('Supplier added successfully!');
      setTimeout(() => navigate('/suppliers'), 1500);
    } catch (err) {
      setServerMessage(
        err.response?.data?.error || 'An error occurred while adding the supplier'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-lg rounded-2xl max-w-4xl w-full p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Add New Supplier</h2>
          <button
            onClick={() => navigate('/suppliers')}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        {serverMessage && (
          <p
            className={`text-center mb-4 text-sm ${
              serverMessage.includes('successfully')
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {serverMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Supplier Name and Company Name */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
              <input
                type="text"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleChange}
                placeholder="Enter Supplier Name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                disabled={isSubmitting}
              />
              {errors.supplierName && (
                <p className="text-red-500 text-sm mt-1">{errors.supplierName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter Company Name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                disabled={isSubmitting}
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
              )}
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit Phone Number"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/suppliers')}
              className="px-4 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-100 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              disabled={isSubmitting}
              
            >
              {isSubmitting ? 'Adding...' : 'Add Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;