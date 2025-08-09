import { useParams, useNavigate } from 'react-router-dom';
import { FiX, FiShoppingCart, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import axios from 'axios';
import EHeader from '../components/EHeader';
import Footer from '../components/Footer';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);
  const api = import.meta.env.VITE_API;

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`${api}/getproduct?id=${id}`)
        .then((res) => {
          if (res.data.error) {
            setError(res.data.error);
            console.log(res.data.error);
          } else {
            setProduct(res.data);
            setFormData(res.data);
            setError('');
            console.log('Fetched Successfully');
          }
        })
        .catch((err) => {
          setError('Failed to fetch product details');
          console.error('Error fetching product:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError('No product ID provided');
      console.error('No ID has been defined');
      setLoading(false);
    }
  }, [id]);

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const totalValue = product.sellingprice && product.quantity
    ? (product.sellingprice * product.quantity).toFixed(2)
    : '0.00';

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(product.quantity, Number(e.target.value)));
    setQuantity(value);
  };

  const handleQuantityButton = (action) => {
    if (action === 'increment' && quantity < product.quantity) {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (product.quantity <= 0) {
      showNotification("Product is out of stock", 'error');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('Please login to add items to cart', 'error');
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    setError('');

    try {
      const response = await axios.post(`${api}/addtocart`, {
        productId: product._id,
        ProductName: product.productName,
        ProductPrice: product.sellingprice,
        ProductQuantity: quantity,
        Subtotal: product.sellingprice * quantity,
        Image: product.image,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Added to cart successfully', response.data);
      
      // Update product quantity in local state
      setProduct(prevProduct => ({
        ...prevProduct,
        quantity: prevProduct.quantity - quantity
      }));

      // Show success animation
      setCartSuccess(true);
      showNotification(`${quantity} item(s) added to cart successfully!`, 'success');
      
      // Reset quantity to 1
      setQuantity(1);
      
      // Reset success animation after 2 seconds
      setTimeout(() => setCartSuccess(false), 2000);

    } catch (error) {
      console.log('Error adding to cart', error.response?.data?.error || error.message);
      
      if (error.response?.status === 401) {
        showNotification('Session expired. Please login again.', 'error');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response?.status === 400) {
        showNotification(error.response.data.error || 'Invalid request', 'error');
      } else {
        showNotification('Failed to add item to cart. Please try again.', 'error');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const getImageUrl = () => {
    if (product.image) {
      const formattedPath = product.image.replace(/\\/g, '/');
      return `http://localhost:3000/${formattedPath}`;
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <>
        <EHeader />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error && !product.productName) {
    return (
      <>
        <EHeader />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4">
          <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-6 text-center">
            <FiAlertCircle className="mx-auto text-red-500 text-4xl mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Back to Products
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <EHeader />
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        } animate-slide-in-right`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <FiCheck /> : <FiAlertCircle />}
            {notification.message}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-8">
        <div className="bg-white shadow-xl rounded-2xl max-w-4xl w-full p-6 relative">
          <button
            onClick={() => navigate('/products')}
            className="absolute top-4 right-4 text-xl text-gray-500 hover:text-black transition-colors"
          >
            <FiX />
          </button>
          
          <h2 className="text-2xl font-bold mb-6 text-blue-800">Product Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div>
              {getImageUrl() ? (
                <img
                  src={getImageUrl()}
                  alt={product.productName || 'Product Image'}
                  className="w-full h-auto max-h-64 object-contain rounded-md shadow-md"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/192x128?text=No+Image'; }}
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 border border-dashed">
                  No Image Available
                </div>
              )}
              
              <div className="mt-4">
                <h1 className="text-2xl font-bold text-gray-800">{product.productName}</h1>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Price: </span>
                  <span className="text-2xl font-bold text-green-600">
                    Rs. {parseFloat(product?.sellingprice || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Description</h3>
                <p className="text-gray-800 mt-1">{product.description || 'No description available'}</p>
              </div>

              {/* Stock Status */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Availability</h3>
                {product.quantity > 0 ? (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-medium">In Stock </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              {product.quantity > 0 && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityButton('decrement')}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      max={product.quantity}
                      className="w-16 text-center p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleQuantityButton('increment')}
                      disabled={quantity >= product.quantity}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Subtotal */}
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="text-lg font-bold text-blue-600">
                        Rs. {(product.sellingprice * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="border-t pt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantity === 0 || addingToCart}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    product.quantity === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : cartSuccess
                      ? 'bg-green-600 text-white'
                      : addingToCart
                      ? 'bg-blue-400 text-white cursor-wait'
                      : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Adding to Cart...
                    </>
                  ) : cartSuccess ? (
                    <>
                      <FiCheck className="text-lg" />
                      Added to Cart!
                    </>
                  ) : product.quantity === 0 ? (
                    'Out of Stock'
                  ) : (
                    <>
                      <FiShoppingCart className="text-lg" />
                      Add to Cart
                    </>
                  )}
                </button>
                
                {product.quantity > 0 && (
                  <button
                    onClick={() => navigate('/cart')}
                    className="w-full mt-3 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    View Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ProductDetails;