import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

const UploadList = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [details, setDetails] = useState(null);
  const api = 'http://localhost:3000';

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];

    if (uploadedFile && (uploadedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || uploadedFile.type === 'application/vnd.ms-excel' || uploadedFile.type.includes('excel'))) {
      setFile(uploadedFile);
      setError('');
      setSuccess('');
      setDetails(null);
    } else {
      setFile(null);
      setError('Please upload a valid Excel (.xlsx or .xls) file.');
      setSuccess('');
      setDetails(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('No file selected.');
      setSuccess('');
      setDetails(null);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${api}/api/upload-nmra`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Updated to match backend response format
      setSuccess(
        `${response.data.message} (Total: ${response.data.totalRecords}, Inserted: ${response.data.inserted}, Failed: ${response.data.failedRecords}, Invalid: ${response.data.invalidRecords}, Duplicates: ${response.data.duplicateRecords})`
      );
      setError('');
      setDetails({
        invalidRecords: response.data.details.invalidRecords,
        failedRecords: response.data.details.failedRecords,
        duplicateRecords: response.data.details.duplicateRecords
      });
      setFile(null);
      document.getElementById('fileInput').value = '';
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to upload file. Please try again.';
      const details = error.response?.data?.details;
      let detailedError = errorMessage;
      if (details?.mimetype) {
        detailedError += ` (MIME: ${details.mimetype}, Extension: ${details.extension})`;
      }
      setError(detailedError);
      setSuccess('');
      setDetails(error.response?.data?.details || null);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Upload Medicine Excel List</h2>
          
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center bg-gray-50 hover:bg-gray-100 transition">
            <input 
              type="file" 
              accept=".xlsx,.xls" 
              onChange={handleFileChange} 
              className="hidden" 
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer text-blue-600 hover:underline">
              {file ? file.name : 'Click here or drag a file to upload'}
            </label>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
          

          <button
            onClick={handleUpload}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition"
          >
            Upload File
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UploadList;