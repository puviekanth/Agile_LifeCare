import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ProductStatsChart = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = import.meta.env.VITE_API;
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${api}/api/product-stats`);
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching product stats:', err);
        setError('Failed to load product statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">⚠️</div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const chartData = {
    labels: [
      'Expired Products',
      'Low Stock Products',
      'Safe & In Stock'
    ],
    datasets: [
      {
        data: [
          stats.expiredProducts,
          stats.lowStockProducts,
          stats.safeAndInStock
        ],
        backgroundColor: [
          '#ef4444', // Red for expired
          '#f59e0b', // Amber for low stock
          '#10b981'  // Green for safe
        ],
        borderColor: [
          '#dc2626',
          '#d97706',
          '#059669'
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          '#dc2626',
          '#d97706',
          '#059669'
        ]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: 'Product Inventory Status',
        font: {
          size: 18,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Statistics</h2>
        <p className="text-gray-600">Total Products: <span className="font-semibold text-blue-600">{stats.totalProducts}</span></p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.expiredProducts}</div>
          <div className="text-sm text-red-700">Expired Products</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{stats.lowStockProducts}</div>
          <div className="text-sm text-amber-700">Low Stock Products</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.safeAndInStock}</div>
          <div className="text-sm text-green-700">Safe & In Stock</div>
        </div>
      </div>

      <div className="h-80">
        <Pie data={chartData} options={options} />
      </div>

      <div className="mt-6 text-sm text-gray-500 text-center">
        <p>Low stock threshold: ≤ 10 units | Data updates in real-time</p>
      </div>
    </div>
  );
};

export default ProductStatsChart; 