import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Sales = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Chart data state
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Sales Amount',
        data: [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
        fill: true
      }
    ]
  });

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  // Process data for chart
  const processChartData = (data) => {
    // Group sales by date and calculate total amount for each date
    const salesByDate = data.reduce((acc, sale) => {
      const date = formatDate(sale.date);
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += sale.amount;
      return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(salesByDate).sort();

    // Prepare chart data
    setChartData({
      labels: sortedDates,
      datasets: [
        {
          ...chartData.datasets[0],
          data: sortedDates.map(date => salesByDate[date])
        }
      ]
    });
  };

  // Filter data based on date range
  const filterDataByDateRange = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setFilteredData(salesData);
      processChartData(salesData);
      return;
    }

    const filtered = salesData.filter(sale => {
      const saleDate = new Date(sale.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);

      // Set time to start/end of day for accurate comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      return saleDate >= startDate && saleDate <= endDate;
    });

    setFilteredData(filtered);
    processChartData(filtered);
  };

  // Handle date range change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply date filter
  const applyDateFilter = (e) => {
    e.preventDefault();
    filterDataByDateRange();
  };

  // Reset date filter
  const resetDateFilter = () => {
    setDateRange({ startDate: '', endDate: '' });
    setFilteredData(salesData);
    processChartData(salesData);
  };

  // Fetch sales data
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await axios.get('http://localhost:3000/api/sales');
        // Mock data for demonstration
        const mockData = [
          { _id: '1', orderId: 'ORD-001', date: '2025-07-01', customerName: 'John Doe', amount: 120.50, status: 'completed' },
          { _id: '2', orderId: 'ORD-002', date: '2025-07-15', customerName: 'Jane Smith', amount: 89.99, status: 'completed' },
          { _id: '3', orderId: 'ORD-003', date: '2025-07-20', customerName: 'Bob Johnson', amount: 150.75, status: 'pending' },
          { _id: '4', orderId: 'ORD-004', date: '2025-07-25', customerName: 'Alice Brown', amount: 65.25, status: 'completed' },
          { _id: '5', orderId: 'ORD-005', date: '2025-08-01', customerName: 'Charlie Wilson', amount: 210.00, status: 'completed' },
          { _id: '6', orderId: 'ORD-006', date: '2025-08-02', customerName: 'Diana Lee', amount: 45.90, status: 'completed' },
          { _id: '7', orderId: 'ORD-007', date: '2025-08-03', customerName: 'Evan Davis', amount: 175.30, status: 'completed' },
        ];

        setSalesData(mockData);
        setFilteredData(mockData);
        processChartData(mockData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sales data:', err);
        setError('Failed to load sales data');
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>{error}</p>
        </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Sales Overview</h1>

          {/* Date Range Filter */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter by Date Range</h2>
            <form onSubmit={applyDateFilter} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateChange}
                    min={dateRange.startDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Apply Filter
                </button>
                <button
                    type="button"
                    onClick={resetDateFilter}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Sales Chart */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <div className="flex justify-between items-center mb-4 p-4">
              <h2 className="text-xl font-semibold text-gray-800">Sales Records</h2>
              <div className="text-sm text-gray-500">
                Showing {filteredData.length} of {salesData.length} records
                {dateRange.startDate && dateRange.endDate && (
                    <span className="ml-2 text-blue-600">
                  (Filtered: {new Date(dateRange.startDate).toLocaleDateString()} to {new Date(dateRange.endDate).toLocaleDateString()})
                </span>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No sales data found for the selected date range.
                      </td>
                    </tr>
                ) : (
                    filteredData.map((sale) => (
                        <motion.tr
                            key={sale._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                            className="cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sale.orderId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(sale.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sale.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${sale.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                            sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}`}>
                          {sale.status}
                        </span>
                          </td>
                        </motion.tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Sales;