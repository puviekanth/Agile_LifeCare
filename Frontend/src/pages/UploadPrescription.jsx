import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EHeader from '../components/EHeader';
import Footer from '../components/Footer'

const UploadPrescription = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState(null);
  const [tokenNumber, setTokenNumber] = useState(null);
  const [addressDetails, setAddressDetails] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const fileInputRef = useRef(null);
  const api = import.meta.env.VITE_API;

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token is ', token);
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (file && allowedTypes.includes(file.type)) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(file.type.startsWith('image/') ? reader.result : null);
      };
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      }
    } else {
      alert('Please upload a valid file (JPEG, JPG, PNG, or PDF).');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFile) {
      setIsDeliveryModalOpen(true);
    } else {
      alert('Please select a prescription file to upload.');
    }
  };

  const generateTokenNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddressDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryOption = (option) => {
    setDeliveryOption(option);
    setIsDeliveryModalOpen(false);
    if (option === 'home') {
      setIsAddressModalOpen(true);
    } else if (option === 'instore') {
      const generatedToken = generateTokenNumber();
      setTokenNumber(generatedToken);
      setIsTokenModalOpen(true);
    }
  };

  const handleAddressSubmit = (event) => {
    event.preventDefault();
    const { address, city, state, zip } = addressDetails;
    if (address && city && state && zip) {
      submitFormData('home', null, addressDetails);
      setIsAddressModalOpen(false);
    } else {
      alert('Please fill in all address fields.');
    }
  };

  const handleTokenModalClose = () => {
    submitFormData('instore', tokenNumber);
    setIsTokenModalOpen(false);
  };

  const submitFormData = async (option, token = null, address = null) => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      alert('Please log in to continue.');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('prescription', selectedFile);
    formData.append('deliveryOption', option);
    if (token) formData.append('tokenNumber', token);
    if (address) {
      formData.append('address', address.address);
      formData.append('city', address.city);
      formData.append('state', address.state);
      formData.append('zip', address.zip);
    }

    try {
      const response = await fetch(`${api}/prescriptionUpload`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      console.log('Response:', response);
      if (response.ok) {
        alert('Prescription uploaded successfully!');
        setSelectedFile(null);
        setPreview(null);
        setDeliveryOption(null);
        setTokenNumber(null);
        setAddressDetails({ address: '', city: '', state: '', zip: '' });
        fileInputRef.current.value = '';
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`Failed to upload prescription: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error uploading prescription:', error);
      alert('An error occurred while uploading.');
    }
  };

  return (
    <>
    <EHeader />
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload Prescription</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prescription" className="block text-sm font-medium text-gray-700">
            Select Prescription File
          </label>
          <input
            type="file"
            id="prescription"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        {preview && (
          <div className="mt-4">
            <img src={preview} alt="Prescription Preview" className="max-w-full h-auto rounded-md" />
          </div>
        )}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Upload Prescription
        </button>
      </form>

      {/* Delivery Option Modal */}
      {isDeliveryModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Choose Delivery Option</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Please select how you would like to receive your prescription.
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                onClick={() => handleDeliveryOption('home')}
              >
                Home Delivery
              </button>
              <button
                type="button"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                onClick={() => handleDeliveryOption('instore')}
              >
                In-Store Pickup
              </button>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="w-full py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400"
                onClick={() => setIsDeliveryModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Address Input Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Enter Delivery Details</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">Please provide your delivery address.</p>
            </div>
            <form onSubmit={handleAddressSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={addressDetails.address}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={addressDetails.city}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={addressDetails.state}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={addressDetails.zip}
                  onChange={handleAddressChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mt-4 space-y-2">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit Address
                </button>
                <button
                  type="button"
                  className="w-full py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-md hover:bg-gray-400"
                  onClick={() => setIsAddressModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Token Number Modal */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Your Token Number</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Please present this token number at the store to collect your medicines:
              </p>
              <p className="text-xl font-bold text-blue-600 mt-2">{tokenNumber}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                onClick={handleTokenModalClose}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
        
      )}
    </div>
  </>
  );
};

export default UploadPrescription;