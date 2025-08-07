import { useParams, useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import axios from 'axios';
import EditProductModal from '../components/EditModal'; // Import the new modal component

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const api = 'http://localhost:3000';

  useEffect(() => {
    if (id) {
      axios
        .get(`${api}/getproduct?id=${id}`)
        .then((res) => {
          if (res.data.error) {
            console.log(res.data.error);
          } else {
            setProduct(res.data);
            setFormData(res.data); // Initialize formData with product data, including image path
            console.log('Fetched Successfully');
          }
        })
        .catch((err) => {
          console.error('Error fetching product:', err);
        });
    } else {
      console.error('No ID has been defined');
    }
  }, [id]);

  const totalValue = product.sellingprice && product.quantity
    ? (product.sellingprice * product.quantity).toFixed(2)
    : '0.00';

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] || prev.image }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('productName', formData.productName || '');
    data.append('price', formData.sellingprice || '');
    data.append('quantity', formData.quantity || '');
    data.append('companyName', formData.companyName || '');
    data.append('category', formData.category || '');
    data.append('description', formData.description || '');
     data.append('manufactureDate', formData.manufactureDate || '');
      data.append('expiryDate', formData.expiryDate || '');
    if (formData.image) {
      data.append('image', formData.image); // Send file or original path
    }

    try {
      const response = await axios.put(`${api}/updateproduct/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.error) {
        console.error(response.data.error);
      } else {
        setProduct(response.data);
        setFormData(response.data);
        setShowEditModal(false);
        console.log('Updated Successfully', response.data);
      }
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl max-w-4xl w-full p-6 relative">
        <button
          onClick={() => navigate('/inventory')}
          className="absolute top-4 right-4 text-xl text-gray-500 hover:text-black"
        >
          <FiX />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Product Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {product.image ? (
              <img
                src={`http://localhost:3000/${product.image.replace(/\\/g, '/')}`}
                alt={product.productName || 'Product Image'}
                className="w-full h-auto max-h-64 object-contain rounded-md"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 border border-dashed">
                No Image Available
              </div>
            )}
            <p className="text-xl font-bold text-gray-800 mt-4">{product.productName}</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-lg font-semibold text-green-600">
                Rs. {parseFloat(product?.sellingprice || 0).toFixed(2)}
              </p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="text-lg font-bold text-gray-800">{product.quantity}</p>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <p className="text-sm text-gray-500">Product Category</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  product.category === 'OTC'
                    ? 'bg-black text-white'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {product.category}
              </span>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-sm text-gray-800">{product.description}</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-500">Supplier Company Name</p>
              <p className="text-sm text-gray-800">{product.companyName}</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-500">Manufacture Date</p>
              <p className="text-sm text-gray-800">{product.manufactureDate?.slice(0, 10)}</p>
            </div>
             <div className="mb-3">
              <p className="text-sm text-gray-500">Expiry Date</p>
              <p className="text-sm text-gray-800">{product.expiryDate?.slice(0, 10)}</p>
            </div>
            <div className="mb-3">
              <p className="text-sm text-gray-500">Expiry Date</p>
              <p className="text-sm">{(() => {
                        const today = new Date();
                        const expiry = new Date(product.expiryDate);
                        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                        if (diffDays < 0) return <span className="text-red-600 font-bold">Expired</span>;
                        if (diffDays <= 10 && diffDays >= 0) return <span className="text-orange-500 font-semibold">Expires in {diffDays} days</span>;
                        if (diffDays <= 30) return <span className="text-yellow-600 font-semibold">Expiring soon</span>;
                        return <span className="text-green-600">Safe to use</span>;
                      })()}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mt-4">
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <p>Stock Status</p>
                <p>Total Value</p>
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-green-600">In Stock ({product.quantity || 0} units)</p>
                <p className="text-blue-700">Rs. {totalValue}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={() => navigate('/inventory')}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
          >
            Edit Product
          </button>
        </div>
      </div>

      <EditProductModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        formData={formData}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
      />
    </div>
  );
};

export default ProductDetails;