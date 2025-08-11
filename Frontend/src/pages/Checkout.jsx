import React, { useState, useEffect } from 'react';
import { FiX, FiShoppingCart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EHeader from '../components/EHeader';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [orderToken, setOrderToken] = useState(null);
  const navigate = useNavigate();
  const api = import.meta.env.VITE_API;

 
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your cart.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${api}/getcartitems`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching cart:', err.message);
        setError('Failed to load cart. Please try again.');
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  
  const handleDeliveryMethod = async (method) => {
  setDeliveryMethod(method);
  if (method === 'instore') {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderToken(token);

    const authToken = localStorage.getItem('token');
    if (!authToken) {
      setError('Please log in to proceed.');
      navigate('/login');
      return;
    }

    try {
      // Fetch user email from backend
      const userResponse = await axios.get(`${api}/getuser`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const userEmail = userResponse.data.email;

      // Save order details
      await axios.post(
        `${api}/saveorder`,
        {
          cartItems,
          email: userEmail,
          deliveryMethod: 'instore',
          orderToken: token,
          Total:total,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setShowModal(false);
    } catch (err) {
      console.error('Error saving in-store order:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to process in-store pickup. Please try again.');
    }
  }
};

  
  

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({ ...prev, [name]: value }));
  };

  
  const total = cartItems.reduce((sum, item) => sum + item.Subtotal, 0);

  const handleDeliveryFormSubmit = async (e) => {
    e.preventDefault();
    
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      setError('Please log in to proceed.');
      navigate('/login');
      return;
    }
    

    try {
        const userResponse = await axios.get(`${api}/getuser`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const userEmail = userResponse.data.email;
      console.log(total);
      await axios.post(
        `${api}/saveorder`,
        {
          cartItems,
          email: userEmail,
          deliveryMethod: 'home',
          deliveryDetails,
          Total:total,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error('Error saving delivery order:', err.message);
      setError('Failed to process delivery order. Please try again.');
    }
  };

  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  };

  return (
    <>
      <EHeader />
      <div className="container mx-auto px-4 py-12 bg-gray-50">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-gray-800 mb-10"
        >
          Checkout
        </motion.h1>

        

        {/* Loading State */}
        {isLoading ? (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-center py-16"
          >
            <div className="inline-block h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading cart...</p>
          </motion.div>
        ) : (
          <>
            {/* Cart Summary */}
            {cartItems.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Cart</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 border-b pb-4"
                    >
                      <img
                        src={`${api}/${item.Image}`}
                        alt={item.ProductName}
                        className="h-16 w-16 object-contain rounded"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {item.ProductName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.ProductQuantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          LKR {item.Subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-right">
                  <p className="text-xl font-semibold text-gray-800">
                    Total: LKR {total.toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-white rounded-2xl shadow-sm"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  Your cart is empty
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/products')}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Shop Now
                </motion.button>
              </motion.div>
            )}

            {/* Order Confirmation for In-Store Pickup */}
            {deliveryMethod === 'instore' && orderToken && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm p-6 text-center"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  In-Store Pickup Confirmed
                </h2>
                <p className="text-lg text-gray-600">
                  Your order token is{' '}
                  <span className="font-bold text-blue-600">{orderToken}</span>
                </p>
                <p className="text-gray-500 mt-2">
                  Please present this token at the store to collect your order.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/products')}
                  className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300"
                >
                  Continue Shopping
                </motion.button>
              </motion.div>
            )}
          </>
        )}

        {/* Delivery Method Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl p-8 max-w-md w-full relative"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <FiX size={24} />
                </motion.button>

                {deliveryMethod !== 'home' ? (
                  <>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                      Choose Delivery Method
                    </h2>
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeliveryMethod('home')}
                        className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300"
                      >
                        Home Delivery
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeliveryMethod('instore')}
                        className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300"
                      >
                        In-Store Pickup
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                      Enter Delivery Details
                    </h2>
                    <form onSubmit={handleDeliveryFormSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={deliveryDetails.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={deliveryDetails.address}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={deliveryDetails.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={deliveryDetails.postalCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={deliveryDetails.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => setDeliveryMethod(null)}
                          className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-xl hover:bg-gray-300 transition-colors duration-300"
                        >
                          Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300"
                        >
                          Confirm Delivery
                        </motion.button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Checkout;