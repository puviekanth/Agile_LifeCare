import React, { useEffect, useState } from 'react';
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
  Filler, // Import the Filler plugin
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Register the Filler plugin
);

const SalesAnalytics = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const startDate = new Date('2025-08-01');
        const endDate = new Date('2025-08-31T23:59:59.999Z');

        // Use full backend URL
        const BASE_URL = import.meta.env.VITE_API; // Adjust if backend is on a different host/port
        const orderResponse = await fetch(`${BASE_URL}/api/anaorders?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
        if (!orderResponse.ok) throw new Error(`Orders fetch failed: ${orderResponse.statusText}`);
        const orders = await orderResponse.json();

        const billResponse = await fetch(`${BASE_URL}/api/anabills?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
        if (!billResponse.ok) throw new Error(`Bills fetch failed: ${billResponse.statusText}`);
        const bills = await billResponse.json();
        
        // Process sales data by date
        const dailySales = {};
        const dateOptions = { day: '2-digit', month: '2-digit' };

        orders.forEach(order => {
          const date = new Date(order.createdAt).toLocaleDateString('en-US', dateOptions);
          dailySales[date] = (dailySales[date] || 0) + order.Total;
        });

        bills.forEach(bill => {
          const date = new Date(bill.createdAt).toLocaleDateString('en-US', dateOptions);
          dailySales[date] = (dailySales[date] || 0) + bill.totalAmount;
        });

        const labels = Object.keys(dailySales).sort();
        const salesData = labels.map(date => dailySales[date]);
        

        setChartData({
          labels,
          datasets: [{
            label: 'Daily Sales ($)',
            data: salesData,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.1,
            fill: true
          }]
        });
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchSalesData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Daily Sales Analytics (August 2025)' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Sales Amount ($)' } },
      x: { title: { display: true, text: 'Date (MM/DD)' } }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Sales Analytics</h2>
      <div className="h-96 w-208">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
};

export default SalesAnalytics;