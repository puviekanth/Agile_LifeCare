import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState("");
  const [modalCartItems, setModalCartItems] = useState(null);
  const api = 'http://localhost:3000';
  const navigate = useNavigate();

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login.');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${api}/api/getcompletedorders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setOrders(response.data.orders || []);
        console.log('Orders fetched successfully:', response.data.orders?.length || 0, 'orders');
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      if (error.response) {
        if (error.response.status === 401) {
          setError('Session expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else if (error.response.status === 403) {
          setError('Access denied. You do not have permission to view orders.');
        } else if (error.response.status === 404) {
          setError('No orders found.');
        } else {
          setError(error.response.data?.message || 'Failed to fetch orders. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  // Refresh orders
  const refreshOrders = async () => {
    await fetchOrders();
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please login.');
        navigate('/login');
        return;
      }

      const response = await axios.put(
        `${api}/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        console.log('Order status updated successfully');
      } else {
        setError(response.data.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error.message);
      setError(error.response?.data?.message || 'Failed to update order status. Please try again.');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = !searchTerm || (
      order.email?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      order.cartItems?.some(item =>
        item.ProductName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Subtotal?.toString().includes(searchTerm.toLowerCase())
      ) ||
      (order.deliveryDetails && (
        order.deliveryDetails.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        order.deliveryDetails.address?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        order.deliveryDetails.city?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        order.deliveryDetails.postalCode?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        order.deliveryDetails.phone?.toLowerCase()?.includes(searchTerm.toLowerCase())
      )) ||
      (order.orderToken && order.orderToken.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesDelivery = !deliveryFilter || order.deliveryMethod === deliveryFilter;
    return matchesSearch && matchesStatus && matchesDelivery;
  });

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-screen-xl mx-auto px-6 py-10">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error && orders.length === 0) {
    return (
      <>
        <Header />
        <div className="max-w-screen-xl mx-auto px-6 py-10">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Orders</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refreshOrders}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* Header with refresh button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-800 tracking-tight">
            All Orders ({orders.length})
          </h2>
          <button
            onClick={refreshOrders}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            Refresh
          </button>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex space-x-3 bg-gray-100 p-2 rounded-xl shadow-md">
            <button
              onClick={() => navigate('/orders')}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 bg-transparent text-gray-700 hover:bg-gray-200"
            >
              All Orders
            </button>
            <button
              onClick={() => navigate('/pending-orders')}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 bg-transparent text-gray-700 hover:bg-gray-200"
            >
              Pending Orders
            </button>
            <button
              onClick={() => navigate('/processing-orders')}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 bg-transparent text-gray-700 hover:bg-gray-200"
            >
              Processing Orders
            </button>
            <button
              onClick={() => navigate('/comp-orders')}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 bg-blue-600 text-white shadow-md"
            >
              Completed Orders
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Search & Filter Orders</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by email, product name, delivery details, or token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            >
              <option value="">All Delivery Methods</option>
              <option value="home">Home Delivery</option>
              <option value="instore">In-Store Pickup</option>
            </select>
          </div>
          
          {/* Filter results info */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
          <table className="min-w-full table-auto bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-sm uppercase tracking-wider">
                <th className="py-4 px-6 text-left">Order ID</th>
                <th className="py-4 px-6 text-left">Email</th>
                <th className="py-4 px-6 text-left">Items</th>
                <th className="py-4 px-6 text-left">Total</th>
                <th className="py-4 px-6 text-left">Delivery</th>
                <th className="py-4 px-6 text-left">Contact Info</th>
                <th className="py-4 px-6 text-left">Date</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 text-sm transition-all duration-200">
                  <td className="py-4 px-6 border-b font-mono text-xs">
                    {order._id?.substring(order._id.length - 8) || 'N/A'}
                  </td>
                  <td className="py-4 px-6 border-b">{order.email || 'N/A'}</td>
                  <td className="py-4 px-6 border-b">
                    <button
                      onClick={() => setModalCartItems(order.cartItems)}
                      className="text-blue-600 hover:underline"
                    >
                      View Items ({order.cartItems?.length || 0})
                    </button>
                  </td>
                  <td className="py-4 px-6 border-b font-semibold">
                    Rs. {order.Total?.toFixed(2) || '0.00'}
                  </td>
                  <td className="py-4 px-6 border-b">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${order.deliveryMethod === 'home' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                      {order.deliveryMethod === 'home' ? 'Home' : 'In-Store'}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b">
                    {order.deliveryMethod === 'home' ? (
                      <div className="text-xs">
                        <div><strong>Name:</strong> {order.deliveryDetails?.name || 'N/A'}</div>
                        <div><strong>Phone:</strong> {order.deliveryDetails?.phone || 'N/A'}</div>
                        <div><strong>Address:</strong> {order.deliveryDetails?.address || 'N/A'}</div>
                        <div><strong>City:</strong> {order.deliveryDetails?.city || 'N/A'} - {order.deliveryDetails?.postalCode || 'N/A'}</div>
                      </div>
                    ) : (
                      <div className="text-xs">
                        <div><strong>Token:</strong> {order.orderToken || 'N/A'}</div>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 border-b">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-4 px-6 border-b">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusStyles(order.status)}`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b">
                    <select
                      value={order.status || ''}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500 text-base">
                    {orders.length === 0
                      ? 'No orders found. Orders will appear here once customers place them.'
                      : 'No orders match your search or filter criteria.'
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal for Cart Items */}
        {modalCartItems && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setModalCartItems(null)}
                className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-700 transition duration-200"
                aria-label="Close modal"
              >
                ×
              </button>
              <h3 className="text-xl font-semibold text-blue-700 mb-4">Order Items</h3>
              <div className="space-y-4">
                {modalCartItems.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-gray-50 border-gray-200">
                    <h5 className="font-semibold text-gray-800">{item.ProductName}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mt-2">
                      <div><strong>Price:</strong> Rs. {item.ProductPrice?.toFixed(2)}</div>
                      <div><strong>Quantity:</strong> {item.ProductQuantity}</div>
                      <div><strong>Subtotal:</strong> Rs. {item.Subtotal?.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Order Total:</span>
                  <span className="text-blue-600">Rs. {modalCartItems.reduce((total, item) => total + (item.Subtotal || 0), 0).toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalCartItems(null)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;