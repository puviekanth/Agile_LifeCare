import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PrescriptionAnalytics = () => {

  const api = import.meta.env.VITE_API;
  const [summary, setSummary] = useState({
    prescriptions: {
      uploaded: 0,
      verified: 0,
      completed: 0,
      processing: 0,
      declined: 0,
    },
    financials: {
      totalSales: 0,
      totalExpenses: 0,
      totalProfit: 0,
    },
  });
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('2025-08-01');
  const [endDate, setEndDate] = useState('2025-08-31');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in as an admin');
          navigate('/login');
          return;
        }

        const response = await axios.get(`${api}/api/summary`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate, endDate },
        });
        
        setSummary(response.data);
      } catch (err) {
        console.error('Error fetching summary:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Admin access required. Please log in as an admin.');
          navigate('/login');
        } else {
          setError('Failed to load summary. Please try again.');
        }
      }
    };

    fetchSummary();
  }, [navigate, startDate, endDate]);

  return (
    <div className="p-6 bg-gray-200 rounded-xl shadow-lg max-w-md">
      
      {error && <p className="text-red-600 mb-4 text-left font-medium">{error}</p>}
      <div className="summary-section">
        <h3 className="text-2xl font-bold text-teal-800 mb-4 text-left">Prescription Status</h3>
        <ul className="space-y-3">
          <li className="text-left text-lg text-purple-700 font-semibold">
            Uploaded: <span className="text-purple-900">{summary.prescriptions.uploaded}</span>
          </li>
          <li className="text-left text-lg text-blue-700 font-semibold">
            Verified: <span className="text-blue-900">{summary.prescriptions.verified}</span>
          </li>
          <li className="text-left text-lg text-green-700 font-semibold">
            Completed: <span className="text-green-900">{summary.prescriptions.completed}</span>
          </li>
          <li className="text-left text-lg text-yellow-700 font-semibold">
            Processing: <span className="text-yellow-900">{summary.prescriptions.processing}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PrescriptionAnalytics;