import React , {useState,useEffect} from 'react';
import { TrendingUp, Package, ShoppingCart, FileText, DollarSign, Activity, Users, AlertTriangle } from 'lucide-react';
import Header from '../components/Header';
import SalesAnalytics from '../components/SaleAnalytics';
import FinancialAnalytics from '../components/FinancialAnalytics';
import OrderStats from '../components/OrdersStats';
import PrescriptionStats from '../components/PrescriptionAnalytics';
import ProductAnalytics from '../components/ProductStatsChart';

const Dashboard = () => {

  const [date,setDate] = useState('');
  const [month,setMonth] = useState('');
  const [year,setYear] = useState('');

   const getDate = () => {
    const today = new Date();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    setDate(today.getDate());
    setMonth(monthNames[today.getMonth()]); 
    setYear(today.getFullYear());
  };
  
   useEffect(() => {
    getDate();
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your business today.</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-blue-700 font-medium">
                    {month} {date}, {year}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6 space-y-6">
          {/* Top full-width sales card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow duration-300">
            <SalesAnalytics />
          </div>

          {/* Bottom grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left column - Products */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <ProductAnalytics />
            </div>

            {/* Middle column - Online Orders */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
              <OrderStats />
            </div>

            {/* Right column - Financial Summary and Prescription Stats */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 flex-1">
                <PrescriptionStats />
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300 flex-1">
                <FinancialAnalytics />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;