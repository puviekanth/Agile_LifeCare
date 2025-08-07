import React, { useState } from "react";
import Header from '../components/Header'; // Assuming Header component exists

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      _id: "1",
      email: "john@example.com",
      cartItems: [
        { ProductName: "Laptop", ProductPrice: 999, ProductQuantity: 1, Subtotal: 999, Image: "" },
        { ProductName: "Mouse", ProductPrice: 25, ProductQuantity: 2, Subtotal: 50, Image: "" },
      ],
      deliveryMethod: "home",
      deliveryDetails: {
        name: "John Doe",
        address: "123 Main St",
        city: "New York",
        postalCode: "10001",
        phone: "555-1234",
      },
      orderToken: null,
      createdAt: new Date(),
      status: "pending",
    },
    {
      _id: "2",
      email: "jane@example.com",
      cartItems: [
        { ProductName: "Phone", ProductPrice: 699, ProductQuantity: 1, Subtotal: 699, Image: "" },
      ],
      deliveryMethod: "instore",
      deliveryDetails: null,
      orderToken: "ABC123",
      createdAt: new Date(),
      status: "processing",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deliveryFilter, setDeliveryFilter] = useState("");
  const [modalCartItems, setModalCartItems] = useState(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = !searchTerm || (
      order.email?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      order.cartItems.some(item => 
        item.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Subtotal.toString().includes(searchTerm.toLowerCase())
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

  return (
    <>
      <Header />
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-800 tracking-tight">
          All Orders
        </h2>

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
              <option value="home">Home</option>
              <option value="instore">Instore</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
          <table className="min-w-full table-auto bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-sm uppercase tracking-wider">
                <th className="py-4 px-6 text-left">Email</th>
                <th className="py-4 px-6 text-left">Items</th>
                <th className="py-4 px-6 text-left">Delivery Option</th>
                <th className="py-4 px-6 text-left">Address</th>
                <th className="py-4 px-6 text-left">City</th>
                <th className="py-4 px-6 text-left">Postal Code</th>
                <th className="py-4 px-6 text-left">Phone</th>
                <th className="py-4 px-6 text-left">Token</th>
                <th className="py-4 px-6 text-left">Date</th>
                <th className="py-4 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 text-sm transition-all duration-200">
                  <td className="py-4 px-6 border-b">{order.email}</td>
                  <td className="py-4 px-6 border-b">
                    <button
                      onClick={() => setModalCartItems(order.cartItems)}
                      className="text-blue-600 hover:underline"
                    >
                      View Items ({order.cartItems.length})
                    </button>
                  </td>
                  <td className="py-4 px-6 border-b">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${order.deliveryMethod === 'home' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                      {order.deliveryMethod}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b">{order.deliveryMethod === 'home' ? (order.deliveryDetails?.name || '-') : '-'}</td>
                  <td className="py-4 px-6 border-b">{order.deliveryMethod === 'home' ? (order.deliveryDetails?.city || '-') : '-'}</td>
                  <td className="py-4 px-6 border-b">{order.deliveryMethod === 'home' ? (order.deliveryDetails?.postalCode || '-') : '-'}</td>
                  <td className="py-4 px-6 border-b">{order.deliveryMethod === 'home' ? (order.deliveryDetails?.phone || '-') : '-'}</td>
                  <td className="py-4 px-6 border-b">{order.deliveryMethod === 'instore' ? (order.orderToken || '-') : '-'}</td>
                  <td className="py-4 px-6 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-6 border-b">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusStyles(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-gray-500 text-base">
                    {orders.length === 0
                      ? 'No orders found.'
                      : 'No orders match your search or filter criteria.'
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div><strong>Price:</strong> ${item.ProductPrice}</div>
                      <div><strong>Quantity:</strong> {item.ProductQuantity}</div>
                      <div><strong>Subtotal:</strong> ${item.Subtotal}</div>
                    </div>
                  </div>
                ))}
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