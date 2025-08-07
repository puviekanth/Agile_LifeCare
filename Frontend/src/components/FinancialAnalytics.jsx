import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FinancialSummary = () => {
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

        const response = await axios.get('http://localhost:3000/api/summary', {
          headers: { Authorization: `Bearer ${token}` },
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
  }, [navigate]);

  return (
    <div className="p-4 bg-gray-200 rounded-lg shadow-md w-58 h-64">
      <h3 className="text-xl font-semibold text-indigo-800 mb-3 text-left">Financial Summary</h3>
      {error && <p className="text-red-600 mb-3 text-left text-sm font-medium">{error}</p>}
      <ul className="space-y-2">
        <li className="text-left text-sm text-green-700 font-medium">
          Total Sales: <span className="text-green-900">${summary.financials.totalSales.toFixed(2)}</span>
        </li>
        <li className="text-left text-sm text-red-700 font-medium">
          Total Expenses: <span className="text-red-900">${summary.financials.totalExpenses.toFixed(2)}</span>
        </li>
        <li className="text-left text-sm text-blue-700 font-medium">
          Total Profit: <span className="text-blue-900">${summary.financials.totalProfit.toFixed(2)}</span>
        </li>
      </ul>
    </div>
  );
};

export default FinancialSummary;
