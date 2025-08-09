import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OrderStats = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const startDate = new Date('2025-08-01');
        const endDate = new Date('2025-08-31T23:59:59.999Z');

        const BASE_URL = import.meta.env.VITE_API;
        const response = await fetch(`${BASE_URL}/api/orderstats?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
        if (!response.ok) throw new Error(`Orders fetch failed: ${response.statusText}`);
        const orders = await response.json();

        console.log('Orders:', orders);

        // Count orders by status
        const statusCounts = {
          pending: 0,
          processing: 0,
          completed: 0
        };

        orders.forEach(order => {
          const status = order.status?.toLowerCase();
          console.log('Status : ',status);
          if (status in statusCounts) {
            statusCounts[status]++;
          } else {
            console.warn(`Unknown status for order:`, order);
          }
        });

        const labels = ['Pending', 'Processing', 'Completed'];
        const data = [statusCounts.pending, statusCounts.processing, statusCounts.completed];

        const newChartData = {
          labels,
          datasets: [{
            label: 'Order Count',
            data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',  // Pending
              'rgba(54, 162, 235, 0.2)', // Processing
              'rgba(75, 192, 192, 0.2)'  // Completed
            ],
            borderColor: [
              'rgb(255, 99, 132)',  // Pending
              'rgb(54, 162, 235)',  // Processing
              'rgb(75, 192, 192)'   // Completed
            ],
            borderWidth: 1
          }]
        };

        console.log('Chart Data:', newChartData);
        setChartData(newChartData);
      } catch (error) {
        console.error('Error fetching order stats:', error);
      }
    };

    fetchOrderStats();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Order Status Distribution (August 2025)' }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number of Orders' },
        ticks: { stepSize: 1 } // Ensure integer steps for count
      },
      x: {
        title: { display: true, text: 'Status' }
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Status Analytics</h2>
      <div className="w-full h-96">
        {chartData.labels.length > 0 ? (
          <Bar options={options} data={chartData} />
        ) : (
          <p className="text-gray-500">No order data available for the selected period.</p>
        )}
      </div>
    </div>
  );
};

export default OrderStats;