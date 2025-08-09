import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors,setErrors] = useState('');
  const api = import.meta.env.VITE_API;
  const [success,setSuccess] = useState('');

  const navigate = useNavigate();



const validateform = () =>{
    const newErrors = {};
    if(newPassword!==confirmPassword){
       newErrors.confirm = 'Password Mismatch';
    }
    if(currentPassword===newPassword)
    {
        newErrors.new = 'Same as Current Password';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
}


  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateform()) {
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    navigate('/login');
    return;
  }

  try {
    const response = await axios.put(
      `${api}/updatepassword`,
      { currentPassword, newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('Password Changed successfully', response);
    setSuccess('Password Chanhged successfully');
    onClose();
  } catch (error) {
    console.error('Error changing the password', error);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errors.new && <p className="text-red-500 text-sm mt-1">{errors.new}</p>}
          </div>
          <div>
            <label className="block font-semibold mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errors.confirm && <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>}
          </div>
          <button
            type="submit"
            className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 w-full"
          >
            Save Password
          </button>
          {
            success && (
                <span className='text-green-500 text-sm mt-1'>{success}</span>
            )
          }
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;