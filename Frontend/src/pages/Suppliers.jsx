import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiSearch, FiEye, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import axios from 'axios';
import EditSupplierModal from '../components/EditSupplierModal';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'

const Suppliers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const api = import.meta.env.VITE_API;
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [id, setId] = useState('');
  const navigate = useNavigate();

  const filteredData = suppliers.filter((supplier) =>
    (supplier.supplierName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
     supplier.companyName?.toLowerCase()?.includes(searchTerm.toLowerCase())) &&
    (filter ? supplier.status === filter : true)
  );

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${api}/getsuppliers`);
        setSuppliers(response.data);
      } catch (error) {
        if (error.response) {
          setError(`Server error: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          setError('Network error: Unable to reach the server. Please check your connection.');
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
        console.error('Axios error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = {
        supplierName: formData.supplierName || '',
        companyName: formData.companyName || '',
        email: formData.email || '',
        phone: formData.phone || '',
      };

      const response = await axios.put(`${api}/updatesupplier/${id}`, data, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.error) {
        console.error(response.data.error);
      } else {
        // Update the suppliers list with the updated supplier
        setSuppliers((prev) =>
          prev.map((sup) => (sup._id === id ? response.data : sup))
        );
        setShowEditModal(false);
        console.log('Updated Successfully', response.data);
        navigate('/suppliers');
      }
    } catch (err) {
      console.error('Error updating supplier:', err);
    }
  };

  
  const handleEditClick = (supplier) => {
    setId(supplier._id);
    setFormData({
      supplierName: supplier.supplierName || '',
      companyName: supplier.companyName || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
    });
    setShowEditModal(true);
  };

const handleDelete = async (supplier) => {
  try {
    const response = await axios.delete(`${api}/deletesupplier/${supplier._id}`);
    console.log('Supplier deleted successfully', response.data);
    // Update the suppliers state to remove the deleted supplier
    setSuppliers((prev) => prev.filter((sup) => sup._id !== supplier._id));
  } catch (error) {
    console.error('Error deleting supplier:', error);
    setError('Failed to delete supplier. Please try again.');
  }
};

  return (
    <>
    <Header />
    <div className="px-4 md:px-6 py-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-800 tracking-tight text-center md:text-left">
          Supplier Management
        </h1>
        <Link
          to="/addSuppliers"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 shadow-md transition duration-200 w-full md:w-auto"
        >
          <FiPlus className="text-lg" /> Add Suppliers
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-blue-100">
        <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2 mb-4">
          <FiSearch className="text-blue-500" /> Search & Filter Suppliers
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by Supplier name or Company Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 p-3 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          All Suppliers <span className="text-sm text-gray-500">({filteredData.length})</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full table-auto text-sm text-gray-700">
            <thead className="bg-blue-100 text-blue-900 border-b">
              <tr className="text-left">
                <th className="px-3 py-2">Supplier Name</th>
                <th className="px-3 py-2">Company Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((supplier) => (
                <tr key={supplier._id} className="border-b hover:bg-blue-50 transition">
                  <td className="px-3 py-4">{supplier.supplierName}</td>
                  <td className="px-3 py-4">{supplier.companyName}</td>
                  <td className="px-3 font-semibold py-4">{supplier.email}</td>
                  <td className="px-3 py-4">{supplier.phone}</td>
                  <td className="px-3 py-4">
                    <div className="flex gap-4">
                      <button
                        className="text-yellow-500 hover:text-yellow-600"
                        onClick={() => handleEditClick(supplier)}
                      >
                        <FiEdit2 />
                      </button>
                      <button className="text-red-500 hover:text-red-700" onClick={()=>handleDelete(supplier)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-400 italic">
                    No suppliers match your search or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <EditSupplierModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        formData={formData}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
      />
    </div>
    </>
  );
};

export default Suppliers;