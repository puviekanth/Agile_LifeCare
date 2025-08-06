import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiEye, FiTrash2, FiPlus } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expiryFilter, setExpiryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const api = 'http://localhost:3000';
  const navigate = useNavigate();

  const filteredData = products.filter((item) => {
    const matchesSearch = 
      item.productName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      String(item.id)?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      item.companyName?.toLowerCase()?.includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;

    const matchesExpiry = expiryFilter
      ? (() => {
          const today = new Date();
          const expiry = new Date(item.expiryDate);
          const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
          if (expiryFilter === 'Expired') return diffDays < 0;
          if (expiryFilter === 'Expiring Soon') return diffDays >= 0 && diffDays <= 30;
          if (expiryFilter === 'Safe') return diffDays > 30;
          return true;
        })()
      : true;

    const matchesStock = stockFilter
      ? stockFilter === 'Low Stock' 
        ? item.quantity < 10 
        : item.quantity >= 10
      : true;

    return matchesSearch && matchesCategory && matchesExpiry && matchesStock;
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${api}/getproducts`);
        setProducts(response.data);
      } catch (error) {
        if (error.response) setError(`Server error: ${error.response.data.message || 'Unknown error'}`);
        else if (error.request) setError('Network error: Unable to reach the server.');
        else setError('An unexpected error occurred.');
        console.error('Axios error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/deleteproduct/${id}`);
      setProducts(products.filter((item) => item._id !== id));
      navigate('/inventory');
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product.');
    }
  };

  return (
    <>
      <Header />
      <div className="px-4 md:px-6 py-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-800 tracking-tight text-center md:text-left">
            Medicine Product Management
          </h1>
          <Link
            to="/addproduct"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 shadow-md transition duration-200 w-full md:w-auto"
          >
            <FiPlus className="text-lg" /> Add Product
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2 mb-4">
            <FiSearch className="text-blue-500" /> Search & Filter Products
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by medicine name, product ID, or supplier ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Filter by Category</option>
              <option value="OTC">OTC</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="A3">A3</option>
            </select>
            <select
              value={expiryFilter}
              onChange={(e) => setExpiryFilter(e.target.value)}
              className="border border-gray-300 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Filter by Expiry</option>
              <option value="Expired">Expired</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Safe">Safe</option>
            </select>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="border border-gray-300 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Filter by Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="In Stock">In Stock</option>
            </select>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            All Products <span className="text-sm text-gray-500">({filteredData.length})</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full table-auto text-sm text-gray-700">
              <thead className="bg-blue-100 text-blue-900 border-b">
                <tr className="text-left">
                  <th className="py-2 px-3">Image</th>
                  <th className="px-3">Medicine Name</th>
                  <th className="px-3">Price (Rs.)</th>
                  <th className="px-3">OTC Status</th>
                  <th className="px-3">Supplier Name</th>
                  <th className="px-3">Quantity</th>
                  <th className="px-3">Description</th>
                  <th className="px-3">Manufacture Date</th>
                  <th className="px-3">Expiration Warning</th>
                  <th className="px-3">Stock Status</th>
                  <th className="px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="12" className="text-center py-6">
                      Loading products...
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan="12" className="text-center py-6 text-red-500">
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && filteredData.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-blue-50 transition">
                    <td className="py-2 px-3">
                      {item.image ? (
                        <img src={`${api}/${item.image}`} alt={item.productName} className="w-10 h-10 rounded-md object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-md shadow-inner"></div>
                      )}
                    </td>
                    
                    <td className="px-3">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {item.productName}
                      </Link>
                    </td>
                    <td className="px-3 font-semibold text-green-600">Rs. {item.price.toFixed(2)}</td>
                    <td className="px-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.category === 'OTC' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="px-3">{item.companyName}</td>
                    <td className="px-3 font-semibold">{item.quantity}</td>
                    <td className="px-3 text-gray-600">{item.description}</td>
                    <td className="px-3">{item.manufactureDate?.slice(0, 10)}</td>
                    <td className="px-3">
                      {(() => {
                        const today = new Date();
                        const expiry = new Date(item.expiryDate);
                        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                        if (diffDays < 0) return <span className="text-red-600 font-bold">Expired</span>;
                        if (diffDays <= 10 && diffDays >= 0) return <span className="text-orange-500 font-semibold">Expires in {diffDays} days</span>;
                        if (diffDays <= 30) return <span className="text-yellow-600 font-semibold">Expiring soon</span>;
                        return <span className="text-green-600">Safe to use</span>;
                      })()}
                    </td>
                    <td className="px-3">
                      <span className={item.quantity < 10 ? 'text-red-600 font-bold' : 'text-green-600'}>
                        {item.quantity < 10 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-3">
                      <div className="flex gap-3">
                        <Link to={`/product/${item._id}`} className="text-blue-600 hover:text-blue-800" aria-label={`View ${item.productName}`}>
                          <FiEye />
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label={`Delete ${item.productName}`}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && !error && filteredData.length === 0 && (
                  <tr>
                    <td colSpan="12" className="text-center py-6 text-gray-400 italic">
                      No products match your search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;