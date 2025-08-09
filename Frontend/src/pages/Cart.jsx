import React, { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import EHeader from '../components/EHeader';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const api = import.meta.env.VITE_API;
  const navigate = useNavigate();
  const [totalCost , setTotalCost] = useState('');

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Unauthorized Access!');
          navigate('/login');
          return;
        }
        const res = await axios.get(`${api}/getcartitems`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data || res.data.length === 0) {
          setError('Cart is empty');
          setCartItems([]);
        } else {
          setCartItems(res.data);
          console.log('Cart items fetched successfully');
          setError('');
        }
      } catch (error) {
        console.error('Error fetching the cart items', error);
        setError('Failed to load cart items. Please try again later.');
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, [navigate]);

  const handleQuantityChange = async (id, newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity) || 1); // Ensure quantity is at least 1
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Unauthorized access');
        navigate('/login');
        return;
      }

      // Find the item to get ProductPrice for Subtotal calculation
      const item = cartItems.find(item => item._id === id);
      if (!item) {
        setError('Cart item not found');
        return;
      }

      // Update backend
      await axios.put(`${api}/updatecart/${id}`, {
        ProductQuantity: quantity,
        Subtotal: item.ProductPrice * quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setCartItems(cartItems.map(item =>
        item._id === id ? { ...item, ProductQuantity: quantity, Subtotal: item.ProductPrice * quantity } : item
      ));
      setError('');
    } catch (error) {
      console.error('Error updating cart item:', error.response?.data?.error || error.message);
      setError('Failed to update quantity. Please try again.');
    }
  };

  const calculateSubtotal = (ProductPrice, ProductQuantity) => ProductPrice * ProductQuantity;

  const handleRemoveItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Unauthorized access');
        navigate('/login');
        return;
      }
      await axios.delete(`${api}/deletecartproduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res = await axios.get(`${api}/getcartitems`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data && res.data.length >= 0) {
        setCartItems(res.data);
        console.log('Product deleted from cart successfully');
        setError('');
      } else {
        setError('Cart is empty after deletion');
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error deleting the product from the cart', error);
      setError('Failed to remove item. Please try again.');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + calculateSubtotal(item.ProductPrice, item.ProductQuantity), 0).toFixed(2);
  };

  const calculateTotalCartCost = () => {
    const deliveryFee = 600;
     return (parseFloat(calculateTotal()) + deliveryFee).toFixed(2);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="flex flex-col min-h-screen" role="main" aria-label="Shopping Cart">
      <EHeader />
      <div className="flex-1 py-8 px-4 mt-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6" id="cart-heading">Shopping Cart</h1>
          {error && (
            <p className="text-red-600 text-center mb-4" role="alert">{error}</p>
          )}
          {cartItems.length === 0 ? (
            <p className="text-gray-600 text-center py-10" role="alert">No items in the cart.</p>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full" role="table" aria-describedby="cart-heading">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700" scope="col"></th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700" scope="col">Image</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700" scope="col">Product</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700" scope="col">Price (Rs.)</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700" scope="col">Quantity</th>
                      <th className="p-4 text-left text-sm font-semibold text-gray-700" scope="col">Subtotal (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody className="cart-products">
                    {cartItems.map((item) => (
                      <tr key={item._id} className="border-t">
                        <td className="p-4">
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label={`Remove ${item.ProductName} from cart`}
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                        <td className="p-4">
                          <img
                            src={`${api}/${item.Image}`}
                            alt={`${item.ProductName} image`}
                            className="w-20 h-20 object-cover rounded"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                          />
                        </td>
                        <td className="p-4 max-w-xs">
                          <Link to={`/product/${item._id}`} className="text-gray-800 font-medium hover:underline">
                            {item.ProductName}
                          </Link>
                        </td>
                        <td className="p-4 text-gray-800">{item.ProductPrice.toFixed(2)}</td>
                        <td className="p-4">
                          <input
                            type="number"
                            className="w-20 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                            value={item.ProductQuantity}
                            onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                            aria-label={`Quantity for ${item.ProductName}`}
                          />
                        </td>
                        <td className="p-4 text-gray-800">{calculateSubtotal(item.ProductPrice, item.ProductQuantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="lg:w-1/3 bg-white p-6 shadow-md rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Cart Totals</h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-t">
                      <td className="p-2"><b>Subtotal</b></td>
                      <td className="p-2 text-right">{calculateTotal()}</td>
                    </tr>
                    <tr>
                      <td className="p-2"><b>Delivery Fee</b></td>
                      <td className="p-2 text-right">600.00</td>
                    </tr>
                    <tr className="border-t">
                      <td className="p-2"><b>Total</b></td>
                      <td className="p-2 text-right">{calculateTotalCartCost()}</td>
                    </tr>
                  </tbody>
                </table>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 rounded-md mt-6 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Proceed to Checkout"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;