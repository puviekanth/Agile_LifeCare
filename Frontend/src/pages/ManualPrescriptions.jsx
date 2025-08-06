import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const DeliveryDetails = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [verificationModal, setVerificationModal] = useState(null);
  const [isLoadingVerification, setIsLoadingVerification] = useState({});
  const [isLoadingComplete, setIsLoadingComplete] = useState({});
  const [costModal, setCostModal] = useState(null);
  const [totalCost, setTotalCost] = useState('');
  const [costError, setCostError] = useState('');
  const api = 'http://localhost:3000';
  const navigate = useNavigate();

  const fetchDeliveries = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${api}/api/manualprescriptions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Fetched manual prescriptions:', data);
      setDeliveries(data);
    } catch (error) {
      console.error("Failed to fetch prescriptions:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this delivery?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${api}/api/prescriptions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      setDeliveries(deliveries.filter(item => item._id !== id));
    } catch (error) {
      console.error("Failed to delete delivery:", error);
      alert("Failed to delete prescription. Please try again.");
    }
  };

  const handleVerify = async (id) => {
    setIsLoadingVerification(prev => ({ ...prev, [id]: true }));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${api}/verify/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`Verification response for ID ${id}:`, {
          verificationStatus: data.prescription.verificationStatus,
          verificationNotes: data.prescription.verificationNotes,
          verificationResults: data.verificationResults
        });

        setDeliveries(prev => prev.map(delivery => 
          delivery._id === id 
            ? { 
                ...delivery, 
                verificationStatus: data.prescription.verificationStatus,
                verificationNotes: data.prescription.verificationNotes,
                extractedData: data.extractedData,
                verificationResults: data.verificationResults
              }
            : delivery
        ));

        const { verificationResults } = data;
        const approvedMedicines = verificationResults.filter(med => med.isApproved);
        const rejectedMedicines = verificationResults.filter(med => !med.isApproved);
        const isManual = data.prescription.verificationStatus === 'manual' || 
                         (data.prescription.verificationStatus === 'failed' && 
                          /manual inspection required/i.test(data.prescription.verificationNotes));
        
        setVerificationModal({
          status: isManual ? 'manual' : data.prescription.verificationStatus,
          message: isManual 
            ? `Verification requires manual inspection: ${approvedMedicines.length} of ${verificationResults.length} medicines verified.`
            : data.prescription.verificationStatus === 'verified'
              ? `Verification completed! All ${approvedMedicines.length} medicine(s) approved.`
              : `Verification failed: ${rejectedMedicines.length} of ${verificationResults.length} medicines not found in NMRA database.`,
          medicines: verificationResults.map(med => ({
            name: med.extractedName,
            dosage: med.dosage,
            isApproved: med.isApproved,
            matchType: med.nmraMatch?.matchType,
            brandName: med.nmraMatch?.brandName,
            genericName: med.nmraMatch?.genericName,
            matchConfidence: med.matchConfidence,
            frequency: med.frequency,
            duration: med.duration
          })),
          fullResults: verificationResults
        });
        
      } else {
        console.log(`Verification failed for ID ${id}:`, data.error || 'No error message provided');
        setDeliveries(prev => prev.map(delivery => 
          delivery._id === id 
            ? { ...delivery, verificationStatus: 'failed', verificationNotes: data.error || 'Verification failed' }
            : delivery
        ));

        setVerificationModal({
          status: 'failed',
          message: data.error || 'Verification failed. Please try again.',
          medicines: []
        });
      }
      
    } catch (error) {
      console.error('Error getting verification results:', error);
      setDeliveries(prev => prev.map(delivery => 
        delivery._id === id 
          ? { ...delivery, verificationStatus: 'failed', verificationNotes: 'Network error occurred' }
          : delivery
      ));

      setVerificationModal({
        status: 'failed',
        message: 'Network error occurred. Please check your connection and try again.',
        medicines: []
      });
      
    } finally {
      setIsLoadingVerification(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleComplete = async (id) => {
    console.log('handleComplete called with ID:', id);
    console.log('totalCost:', totalCost);
    
    // Validate input
    if (!totalCost || isNaN(parseFloat(totalCost)) || parseFloat(totalCost) <= 0) {
      setCostError('Please enter a valid total cost greater than 0.');
      return;
    }

    setIsLoadingComplete(prev => ({ ...prev, [id]: true }));
    setCostError(''); // Clear any previous errors
    
    try {
      const token = localStorage.getItem('token');
      const requestBody = { 
        verificationStatus: 'completed', 
        totalCost: parseFloat(totalCost) 
      };
      
      console.log('Making request to:', `${api}/api/completeprescriptions/${id}`);
      console.log('Request body:', requestBody);
      console.log('Token exists:', !!token);
      
      const response = await fetch(`${api}/api/completeprescriptions/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Success - close modal and refresh data
        setCostModal(null);
        setTotalCost('');
        setCostError('');
        await fetchDeliveries(); // Refresh the list to reflect backend changes
        alert('Prescription completed successfully!');
      } else {
        const errorMessage = data.error || data.message || `Server error: ${response.status}`;
        console.error('Server error:', errorMessage);
        setCostError(errorMessage);
      }
    } catch (error) {
      console.error('Network error completing prescription:', error);
      setCostError(`Network error: ${error.message}. Please check your connection and try again.`);
    } finally {
      setIsLoadingComplete(prev => ({ ...prev, [id]: false }));
    }
  };

  const openCostModal = (id) => {
    console.log('Opening cost modal for ID:', id);
    setCostModal(id);
    setTotalCost('');
    setCostError('');
  };

  const closeCostModal = () => {
    setCostModal(null);
    setTotalCost('');
    setCostError('');
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // Fixed filtering logic
  const filteredDeliveries = deliveries.filter((d) => {
    // Search filter
    const matchesSearch = !searchTerm || (
      d.email?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      d.deliveryMethod?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      d.deliveryDetails?.address?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      d.deliveryDetails?.city?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      d.deliveryDetails?.state?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      d.deliveryDetails?.zip?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      d.orderToken?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );

    // Delivery method filter
    const matchesDelivery = !deliveryFilter || d.deliveryMethod === deliveryFilter;

    // Verification status filter
    const matchesVerification = !verificationFilter || (() => {
      if (verificationFilter === 'processing') {
        return isLoadingVerification[d._id] || isLoadingComplete[d._id];
      }
      if (verificationFilter === 'manual') {
        return d.verificationStatus === 'manual' || 
               (d.verificationStatus === 'failed' && /manual inspection required/i.test(d.verificationNotes));
      }
      if (verificationFilter === 'pending') {
        return !d.verificationStatus || d.verificationStatus === 'pending';
      }
      return d.verificationStatus === verificationFilter;
    })();

    return matchesSearch && matchesDelivery && matchesVerification;
  });

  const getDisplayStatus = (delivery) => {
    if (isLoadingVerification[delivery._id] || isLoadingComplete[delivery._id]) {
      return 'Processing...';
    }
    if (delivery.verificationStatus === 'manual' || 
        (delivery.verificationStatus === 'failed' && /manual inspection required/i.test(delivery.verificationNotes))) {
      return 'Manual';
    }
    return delivery.verificationStatus 
      ? delivery.verificationStatus.charAt(0).toUpperCase() + delivery.verificationStatus.slice(1)
      : 'Pending';
  };

  const getStatusStyles = (delivery) => {
    if (isLoadingVerification[delivery._id] || isLoadingComplete[delivery._id]) {
      return 'bg-yellow-500';
    }
    if (delivery.verificationStatus === 'manual' || 
        (delivery.verificationStatus === 'failed' && /manual inspection required/i.test(delivery.verificationNotes))) {
      return 'bg-orange-500';
    }
    return delivery.verificationStatus === 'completed' ? 'bg-blue-500' :
           delivery.verificationStatus === 'verified' ? 'bg-green-500' :
           delivery.verificationStatus === 'failed' ? 'bg-red-500' :
           'bg-gray-500';
  };

  return (
    <>
      <Header />
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-800 tracking-tight">Manual Prescriptions</h2>
        <div className="flex justify-center mb-8">
          <div className="flex space-x-3 bg-gray-100 p-2 rounded-xl shadow-md">
            <button
              onClick={() => navigate('/prescriptions')}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 bg-transparent text-gray-700 hover:bg-gray-200"
            >
              All Prescriptions
            </button>
            <button
              onClick={() => navigate('/manual-presc')}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 bg-blue-600 text-white shadow-md"
            >
              Manual
            </button>
            <button
              onClick={() => navigate('/veri-presc')}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 bg-transparent text-gray-700 hover:bg-gray-200"
            >
              Verified
            </button>
            <button
              onClick={() => navigate('/comp-presc')}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 bg-transparent text-gray-700 hover:bg-gray-200"
            >
              Completed
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Search & Filter Manual Prescriptions</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by email, delivery option, address, city, state, ZIP, or token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            />
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            >
              <option value="">All Delivery Methods</option>
              <option value="home">Home</option>
              <option value="instore">Instore</option>
            </select>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            >
              <option value="">All Verification Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="failed">Failed</option>
              <option value="manual">Manual</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
          <table className="min-w-full table-auto bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-sm uppercase tracking-wider">
                <th className="py-4 px-6 text-left">Email</th>
                <th className="py-4 px-6 text-left">Delivery Option</th>
                <th className="py-4 px-6 text-left">Address</th>
                <th className="py-4 px-6 text-left">City</th>
                <th className="py-4 px-6 text-left">State</th>
                <th className="py-4 px-6 text-left">ZIP</th>
                <th className="py-4 px-6 text-left">Token</th>
                <th className="py-4 px-6 text-left">Prescription</th>
                <th className="py-4 px-6 text-left">Verification Status</th>
                <th className="py-4 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50 text-sm transition-all duration-200">
                  <td className="py-4 px-6 border-b">{d.email}</td>
                  <td className="py-4 px-6 border-b">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${d.deliveryMethod === 'home' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                      {d.deliveryMethod}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b">{d.deliveryMethod === 'home' ? (d.deliveryDetails?.address || '-') : '-'}</td>
                  <td className="py-4 px-6 border-b">{d.deliveryMethod === 'home' ? (d.deliveryDetails?.city || '-') : '-'}</td>
                  <td className="py-4 px-6 border-b">{d.deliveryMethod === 'home' ? (d.deliveryDetails?.state || '-') : '-'}</td>
                  <td className="py-4 px-6 border-b">{d.deliveryMethod === 'home' ? (d.deliveryDetails?.zip || '-') : '-'}</td>
                  <td className="py-4 px-6 border-b">{d.deliveryMethod === 'instore' ? (d.orderToken || '-') : '-'}</td>
                  <td className="py-4 px-6 border-b">
                    {d.prescriptionFilePath ? (
                      <img
                        src={`${api}/${d.prescriptionFilePath}`}
                        alt="Prescription"
                        onClick={() => setModalImage(d.prescriptionFilePath)}
                        className="w-16 h-16 object-cover border rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-4 px-6 border-b">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusStyles(d)}`}>
                      {getDisplayStatus(d)}
                    </span>
                  </td>
                  <td className="py-4 px-6 border-b">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        onClick={() => handleVerify(d._id)}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition duration-200"
                        disabled={d.verificationStatus === 'verified' || isLoadingVerification[d._id]}
                      >
                        {isLoadingVerification[d._id] ? 'Verifying...' : 'Verify'}
                      </button>
                      <button
                        onClick={() => openCostModal(d._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition duration-200"
                        disabled={d.verificationStatus === 'completed' || isLoadingComplete[d._id]}
                      >
                        {isLoadingComplete[d._id] ? 'Processing...' : 'Complete'}
                      </button>
                      <button
                        onClick={() => handleDelete(d._id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDeliveries.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center py-8 text-gray-500 text-base">
                    {deliveries.length === 0 
                      ? 'No manual prescriptions found.' 
                      : 'No prescriptions match your search or filter criteria.'
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {modalImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto mx-4">
              <button
                onClick={() => setModalImage(null)}
                className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-700 transition duration-200"
                aria-label="Close modal"
              >
                ×
              </button>
              <img
                src={`${api}/${modalImage}`}
                alt="Prescription"
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        {verificationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setVerificationModal(null)}
                className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-700 transition duration-200"
                aria-label="Close modal"
              >
                ×
              </button>
              
              <div className="mb-4">
                <h3 className={`text-xl font-semibold mb-2 ${
                  verificationModal.status === 'verified' ? 'text-green-600' : 
                  verificationModal.status === 'manual' ? 'text-orange-600' : 
                  'text-red-600'
                }`}>
                  Prescription Verification {verificationModal.status.charAt(0).toUpperCase() + verificationModal.status.slice(1)}
                </h3>
                <p className="text-gray-700 mb-4">{verificationModal.message}</p>
              </div>

              {verificationModal.medicines && verificationModal.medicines.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-800 border-b pb-2">Medicine Analysis:</h4>
                  
                  {verificationModal.medicines.map((med, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      med.isApproved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-800">{med.name}</h5>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          med.isApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {med.isApproved ? '✓ NMRA Approved' : '✗ Not Found'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div><strong>Dosage:</strong> {med.dosage || 'Not specified'}</div>
                        <div><strong>Frequency:</strong> {med.frequency || 'Not specified'}</div>
                        <div><strong>Duration:</strong> {med.duration || 'Not specified'}</div>
                        
                        {med.isApproved && (
                          <>
                            <div><strong>Match Confidence:</strong> {med.matchConfidence}%</div>
                            {med.brandName && <div><strong>Brand Name:</strong> {med.brandName}</div>}
                            {med.genericName && <div><strong>Generic Name:</strong> {med.genericName}</div>}
                            {med.matchType && (
                              <div><strong>Match Type:</strong> 
                                <span className="ml-1 capitalize">
                                  {med.matchType.replace('_', ' ')}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setVerificationModal(null)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {costModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
              <button
                onClick={closeCostModal}
                className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-700 transition duration-200"
                aria-label="Close modal"
              >
                ×
              </button>
              <h3 className="text-xl font-semibold text-blue-700 mb-4">Complete Prescription</h3>
              <p className="text-gray-600 mb-4">Enter the total cost for the prescription.</p>
              <div className="mb-4">
                <label htmlFor="totalCost" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Cost ($)
                </label>
                <input
                  type="number"
                  id="totalCost"
                  value={totalCost}
                  onChange={(e) => {
                    setTotalCost(e.target.value);
                    setCostError(''); // Clear error when user types
                  }}
                  placeholder="Enter total cost"
                  className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                  min="0"
                  step="0.01"
                />
                {costError && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                    {costError}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeCostModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition duration-200"
                  disabled={isLoadingComplete[costModal]}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleComplete(costModal)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition duration-200"
                  disabled={isLoadingComplete[costModal] || !totalCost}
                >
                  {isLoadingComplete[costModal] ? 'Processing...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DeliveryDetails;