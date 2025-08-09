import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const AddMedicine = () => {
  const api = import.meta.env.VITE_API;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    medicineName: '',
    unitprice: '',
    sellingprice:'',
    category: '',
    companyName: '',
    quantity: '',
    description: '',
    manufactureDate:'',
    expiryDate:'',
    image: null,
  });
  const [error, setError] = useState(null); // Add state for error handling

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    const newFormData = new FormData();
    newFormData.append('medicineName', formData.medicineName);
    newFormData.append('unitprice', formData.unitprice);
    newFormData.append('sellingprice', formData.sellingprice);
    newFormData.append('otcStatus', formData.otcStatus);
    newFormData.append('companyName', formData.companyName);
    newFormData.append('quantity', formData.quantity);
    newFormData.append('description', formData.description);
    newFormData.append('manufactureDate',formData.manufactureDate);
    newFormData.append('expiryDate',formData.expiryDate);
    if (formData.image) {
      newFormData.append('image', formData.image);
    }
    

    try {
      const response = await axios.post(`${api}/addproduct`, newFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }, 
      });
      console.log('Successfully Added', response.data);
      navigate('/inventory'); 
    } catch (error) {
      console.error('Error Adding the product:', error);
      setError(error.response?.data?.message || 'Failed to add product. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/inventory'); // Navigate back to home or reset form
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-lg rounded-2xl max-w-4xl w-full p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Add New Medicine Product</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
              <input
                type="text"
                name="medicineName"
                value={formData.medicineName}
                onChange={handleChange}
                placeholder="Enter Medicine Name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (Rs.)</label>
              <input
                type="number"
                name="unitprice"
                value={formData.unitprice}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                placeholder="Price"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (Rs.)</label>
              <input
                type="number"
                name="sellingprice"
                value={formData.sellingprice}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                placeholder="Price"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="otcStatus"
                value={formData.otcStatus}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Category</option>
                <option value="OTC">OTC</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="A3">A3</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter Company Name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacture Date</label>
              <input
                type="date"
                name="manufactureDate"
                value={formData.manufactureDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter Description"
              className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Product Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400"
              accept="image/*"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-400 rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              onClick={handleSubmit}
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;