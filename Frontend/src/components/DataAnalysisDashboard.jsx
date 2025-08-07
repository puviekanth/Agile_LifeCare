import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const COLORS = ['#3366CC', '#66B2FF', '#CCCCCC'];

export default function DataAnalysisDashboard() {
  const [orderStats, setOrderStats] = useState([]);
  const [visitStats, setVisitStats] = useState([]);

  useEffect(() => {
    axios.get('/api/dashboard/online-orders')
      .then(res => setOrderStats(res.data))
      .catch(err => console.error('Order Stats Error:', err));

    axios.get('/api/dashboard/visit-reports')
      .then(res => setVisitStats(res.data))
      .catch(err => console.error('Visit Stats Error:', err));
  }, []);

  const totalOrders = orderStats.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="rounded-xl border bg-white shadow p-6 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Online Orders</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={orderStats}
              dataKey="value"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              label
            >
              {orderStats.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <p className="mt-4 text-lg font-semibold">Total: {totalOrders}</p>
        <div className="mt-2 text-sm">
          {orderStats.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
              <span>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow p-6 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Visits Report</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={visitStats} layout="vertical">
            <XAxis type="number" allowDecimals={false} label={{ value: 'Number of reports', position: 'bottom' }} />
            <YAxis dataKey="status" type="category" />
            <Tooltip />
            <Bar dataKey="count" fill="#3366CC" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}