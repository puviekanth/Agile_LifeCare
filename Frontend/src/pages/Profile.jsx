import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PencilIcon, CheckIcon, XMarkIcon, KeyIcon } from '@heroicons/react/24/outline';
import ChangePasswordModal from '../components/ChangePasswordModal';
import EHeader from '../components/EHeader';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DHeader from '../components/DHeader';
import Header from '../components/Header';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false); // Track API request state
  const [error, setError] = useState(''); // Track errors for user feedback
  const api = import.meta.env.VITE_API;
  

  const [user, setUser] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: 'https://via.placeholder.com/150',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get(`${api}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser({
          username: response.data.name || '',
          email: response.data.email || '',
          phone : response.data.phone || '',
          address : response.data.address || '',
          profilePicture: response.data.profilePicture || 'https://via.placeholder.com/150',
        });
      })
      .catch((error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 500)) {
          navigate('/login');
        } else {
          console.error('Failed to fetch user details:', error);
        }
      });
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const renderHeader = () =>{
    if(user.email.endsWith('.doc@gmail.com')){
      return <DHeader />
    }else if(user.email.endsWith('.admin@lifecare.com')){
      return <Header />
    }else{
      return <EHeader />
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault(); // Prevent default button behavior if needed
    setLoading(true); // Show loading state
    setError(''); // Clear previous errors
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
        `${api}/updateProfile`,
        {
          name: user.username,
          email: user.email,
          phone : user.phone,
          address : user.address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('User Updated Successfully', response.data);
      setEditing(false); // Disable editing mode after successful update
    } catch (err) {
      console.error('Something went wrong', err);
      setError('Failed to update profile. Please try again.'); // Show error to user
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <>
      { renderHeader()}
      <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen py-16 px-4">
        {/* Buttons below header, top-right */}
        <div className="absolute top-0 right-4 mt-16 flex gap-3">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-200"
            >
              <PencilIcon className="w-5 h-5" />
              Edit Profile
            </button>
          )}

          {editing && (
            <>
              <button
                onClick={handleProfileUpdate}
                disabled={loading} // Disable button during API request
                className={`flex items-center gap-2 px-5 py-2 rounded-lg shadow-md transition-all duration-200 ${
                  loading
                    ? 'bg-green-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none'
                }`}
              >
                <CheckIcon className="w-5 h-5" />
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setError(''); // Clear error when canceling
                }}
                disabled={loading} // Disable cancel during API request
                className="flex items-center gap-2 bg-gray-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-600 focus:ring-2 focus:ring-gray-400 focus:outline-none transition-all duration-200"
              >
                <XMarkIcon className="w-5 h-5" />
                Cancel
              </button>
            </>
          )}

          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-700 focus:ring-2 focus:ring-red-400 focus:outline-none transition-all duration-200"
          >
            <KeyIcon className="w-5 h-5" />
            Change Password
          </button>
        </div>

        <main className="max-w-5xl mx-auto">
          {/* Your Profile Title - Top Left */}
          <h1 className="text-4xl font-extrabold text-gray-800 mb-12 tracking-tight">
            Your Profile
          </h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 max-w-5xl mx-auto">
              {error}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-row items-start gap-8 transform hover:scale-[1.01] transition-transform duration-300">
            {/* Profile Image and Username - Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center space-y-4 w-1/3"
            >
              <div className="relative group">
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full border-2 border-gray-200 shadow-md group-hover:ring-4 group-hover:ring-indigo-300 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                  <PencilIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{user.username}</h2>
            </motion.div>

            {/* Details - Right, Centered Vertically */}
            <div className="w-2/3 flex flex-col items-center justify-center space-y-6">
              <AnimatePresence>
                <motion.div
                  key="username"
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="w-full max-w-md"
                >
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    disabled={!editing || loading} // Disable during API request
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-200 disabled:bg-gray-100"
                  />
                </motion.div>

                <motion.div
                  key="email"
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="w-full max-w-md"
                >
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    disabled={true} // Disable during API request
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-200 disabled:bg-gray-100"
                  />
                </motion.div>
                <motion.div
                  key="phone"
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="w-full max-w-md"
                >
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Contact</label>
                  <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    disabled={!editing || loading} // Disable during API request
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-200 disabled:bg-gray-100"
                  />
                  <motion.div
                  key="address"
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="w-full max-w-md"
                >
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={user.address}
                    onChange={handleChange}
                    disabled={!editing || loading} // Disable during API request
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-200 disabled:bg-gray-100"
                  />
                </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>

        <ChangePasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      </div>
    </>
  );
};

export default Profile;