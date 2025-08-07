import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX, FiStar, FiShoppingCart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import EHeader from '../components/EHeader';
import { Link, useNavigate } from 'react-router-dom';

const categories = ['All', 'Vitamins', 'Foods', 'Sanitary', 'Cosmetics', 'Supplements', 'OTC'];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(1000);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const api = 'http://localhost:3000';

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(`${api}/getproductsOTC`);
        let result = Array.isArray(response.data) ? response.data : [];
        console.log('Fetched products:', result);

        // Apply filters
        let filtered = result;
        if (searchTerm) {
          filtered = filtered.filter(product =>
            (product.productName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (product.category?.toLowerCase() || '').includes(searchTerm.toLowerCase())
          );
        }

        if (selectedCategory !== 'All') {
          filtered = filtered.filter(product => product.category === selectedCategory);
        }

        filtered = filtered.filter(product => product.sellingprice <= priceRange);

        console.log('Filtered products:', filtered);
        setFilteredProducts(filtered);
        setError(null);
      } catch (err) {
        console.error('API Error:', err.message, err.response?.status, err.response?.data);
        setError('Failed to fetch products. Please try again later.');
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, priceRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange(1000);
    setSelectedCategory('All');
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    hover: { y: -5, scale: 1.02, transition: { duration: 0.2 } }
  };

  const handleAddToCart = (product) => {
    if (product.quantity <= 0) {
      console.log("Out of Stock");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please login');
      navigate('/login');
      return;
    }

    axios.post(`${api}/addtocart`, {
      productId: product._id,
      ProductName: product.productName,
      ProductPrice: product.sellingprice,
      ProductQuantity: 1,
      Subtotal: product.sellingprice * 1,
      Image: product.image,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      console.log('Added to cart successfully', response.data);
      setFilteredProducts(prevProducts =>
        prevProducts.map(p => p._id === product._id ? { ...p, quantity: p.quantity - 1 } : p)
      );
    })
    .catch(error => {
      console.log('Error adding to cart', error.response?.data?.error || error.message);
      if (error.response?.status !== 400) {
        setFilteredProducts([]);
        setError('Failed to add item. Please try again.');
      }
    });
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
          Our Products
        </motion.h1>
        
        <div className="mb-10 bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-4 top-3.5 text-gray-400" size={20} />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300"
            >
              <FiFilter />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </motion.button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gray-100 p-6 rounded-xl overflow-hidden"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-lg text-gray-800">Refine Your Search</h3>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear All Filters
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Price Range: LKR {priceRange}</label>
                    <input
                      type="range"
                      min="1"
                      max="1000"
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full h-2 bg-blue-200 rounded-lg cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>LKR 1</span>
                      <span>LKR 1000</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Categories</label>
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map(category => (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`text-sm px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                            selectedCategory === category
                              ? 'bg-blue-600 text-white border border-blue-600'
                              : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {category}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {(searchTerm || selectedCategory !== 'All' || priceRange < 1000) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            {searchTerm && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full"
              >
                Search: {searchTerm}
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <FiX size={16} />
                </motion.button>
              </motion.span>
            )}
            
            {selectedCategory !== 'All' && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full"
              >
                Category: {selectedCategory}
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSelectedCategory('All')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <FiX size={16} />
                </motion.button>
              </motion.span>
            )}
            
            {priceRange < 1000 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full"
              >
                Max Price: LKR {priceRange}
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setPriceRange(1000)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <FiX size={16} />
                </motion.button>
              </motion.span>
            )}
          </motion.div>
        )}

        {isLoading ? (
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-center py-16"
          >
            <div className="inline-block h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm"
          >
            <h3 className="text-xl font-semibold text-red-600">{error}</h3>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={() => window.location.reload()}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : filteredProducts.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {filteredProducts.map((product) => (
              <div key={product._id} className={`relative ${product.quantity <= 0 ? 'pointer-events-none opacity-50' : ''}`}>
                <Link to={`/view/${product._id}`} className={product.quantity <= 0 ? 'pointer-events-none' : ''}>
                  <motion.div 
                    variants={cardVariants}
                    whileHover={product.quantity > 0 ? "hover" : ""}
                    className="bg-white shadow-lg border border-gray-400 overflow-hidden p-2"
                  >
                    <div className="h-56 bg-white flex items-center justify-center overflow-hidden">
                      <motion.img 
                        src={`${api}/${product.image}`} 
                        alt={product.productName} 
                        className="h-full w-full object-contain"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                        whileHover={product.quantity > 0 ? { scale: 1.05 } : {}}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                        {product.category}
                      </span>
                      <h3 className="font-semibold text-lg mt-3 text-gray-800 line-clamp-2">{product.productName}</h3>
                      {product.rating && (
                        <div className="flex items-center mt-2">
                          {[...Array(5)].map((_, i) => (
                            <FiStar 
                              key={i} 
                              fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} 
                              className="w-5 h-5 text-yellow-400"
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-2 font-medium">
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-xl text-gray-800">LKR {product.sellingprice.toFixed(2)}</span>
                          <div className="mt-2">
                            <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                              product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                        <motion.button 
                          whileHover={product.quantity > 0 ? { scale: 1.1 } : {}}
                          whileTap={product.quantity > 0 ? { scale: 0.9 } : {}}
                          className={`p-3 rounded-full transition-colors duration-300 ${
                            product.quantity > 0 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          }`}
                          onClick={(e) => { 
                            e.preventDefault(); 
                            if (product.quantity > 0) handleAddToCart(product); 
                          }}
                          disabled={product.quantity <= 0}
                        >
                          <FiShoppingCart size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
                {product.quantity <= 0 && (
                  <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm"
          >
            <h3 className="text-xl font-semibold text-gray-800">No products found</h3>
            <p className="text-gray-500 mt-3">Try adjusting your search or filter criteria</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={clearFilters}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Products;