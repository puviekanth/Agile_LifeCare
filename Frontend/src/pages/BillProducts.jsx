import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function BillProduct() {
  const [searchTerm, setSearchTerm] = useState('');
  const [billItems, setBillItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingBill, setSavingBill] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [savedBill, setSavedBill] = useState(null);
  const api = import.meta.env.VITE_API;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${api}/getproductsbill`);
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(`Failed to load products: ${error.message}`);
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddToBill = () => {
    if (selectedProduct && quantity > 0) {
      const subtotal = selectedProduct.sellingprice * quantity;
      setBillItems((prevItems) => [...prevItems, { ...selectedProduct, quantity, subtotal }]);
      setIsModalOpen(false);
      setQuantity(1);
      setSelectedProduct(null);
      console.log('Added to bill:', { ...selectedProduct, quantity, subtotal });
    } else {
      console.log('Invalid addition: selectedProduct or quantity is invalid');
    }
  };

  const handleRemoveItem = (index) => {
    setBillItems(prevItems => prevItems.filter((_, i) => i !== index));
  };

  const handleSaveBill = async () => {
    if (billItems.length === 0) {
      setError('Cannot save empty bill');
      return;
    }

    setSavingBill(true);
    setError(null);
    setSuccessMessage('');
    try {
      const billData = {
        customerName: customerName || 'Walk-in Customer',
        customerPhone: customerPhone || '',
        items: billItems.map(item => ({
          productId: item._id,
          productName: item.productName,
          category: item.category,
          quantity: item.quantity,
          unitPrice: item.sellingprice,
          sellingPrice: item.sellingprice,
          subtotal: item.subtotal
        })),
        totalAmount: total,
        billDate: new Date().toISOString(),
        paymentMethod: paymentMethod || 'cash'
      };

      console.log('Sending bill data:', billData);

      const response = await fetch(`${api}/savebill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(billData)
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (!response.ok) {
        throw new Error(result.message || `Server error: ${response.status}`);
      }

      if (result.success) {
        setSuccessMessage(`Bill saved successfully! Bill ID: ${result.billId}`);
        setSavedBill({ ...billData, billId: result.billId });
        setIsPrintModalOpen(true);
        setBillItems([]);
        setCustomerName('');
        setCustomerPhone('');
        setPaymentMethod('');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        throw new Error(result.message || 'Failed to save bill');
      }
    } catch (error) {
      setError(`Failed to save bill: ${error.message}`);
      console.error('Save bill error:', error);
    } finally {
      setSavingBill(false);
    }
  };

  const handlePrintBill = () => {
    setIsPrintModalOpen(false);
    setTimeout(() => {
      window.print();
      navigate('/bill'); // Navigate back to BillProduct
    }, 500); // Small delay to ensure modal closes before printing
  };

  const handleClosePrintModal = () => {
    setIsPrintModalOpen(false);
    setSavedBill(null);
    navigate('/bill'); // Navigate back to BillProduct
  };

  const total = billItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Left: Product Search and List */}
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)]">
          <div className="sticky top-0 bg-white z-10 pb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Search Products</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md text-sm md:text-base text-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {loading && <p className="text-center text-gray-500">Loading products...</p>}
              {error && <p className="text-center text-red-500">{error}</p>}
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleAddClick(product)}
                >
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base">{product.productName}</h3>
                  <p className="text-xs md:text-sm text-gray-500">{product.category}</p>
                  <p className="text-base md:text-lg font-bold text-gray-800 mt-2">Rs. {product.sellingprice?.toFixed(2)}</p>
                  <button
                    className="mt-3 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 text-xs md:text-sm transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddClick(product);
                    }}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Bill Section */}
        <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Bill</h2>
          
          {/* Customer Details */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Customer Name (optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="p-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Phone Number (optional)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="p-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="p-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Payment Method</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="online">Online</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Bill Items */}
          <div className="border-b border-gray-200 pb-2 mb-4">
            <div className="grid grid-cols-5 font-semibold text-gray-600 text-xs md:text-sm">
              <span>Product</span>
              <span>Qty</span>
              <span>Price</span>
              <span>Subtotal</span>
              <span>Action</span>
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto mb-4">
            {billItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No items in bill</p>
            ) : (
              billItems.map((item, index) => (
                <div key={index} className="grid grid-cols-5 mb-2 text-gray-700 text-xs md:text-sm items-center">
                  <span className="truncate">{item.productName}</span>
                  <span>{item.quantity}</span>
                  <span>Rs. {item.sellingprice?.toFixed(2)}</span>
                  <span>Rs. {item.subtotal?.toFixed(2)}</span>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Total and Actions */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between font-bold text-base md:text-lg text-gray-800 mb-4">
              <span>Total</span>
              <span>Rs. {total.toFixed(2)}</span>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {successMessage}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSaveBill}
                disabled={billItems.length === 0 || savingBill}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {savingBill ? 'Saving...' : 'Save Bill'}
              </button>
              <button
                onClick={() => {
                  setBillItems([]);
                  setCustomerName('');
                  setCustomerPhone('');
                  setPaymentMethod('');
                  setError(null);
                  setSuccessMessage('');
                }}
                disabled={billItems.length === 0}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Quantity Input */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-sm">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
              Add {selectedProduct?.productName}
            </h3>
            <p className="text-gray-600 mb-2">Price: Rs. {selectedProduct?.sellingprice?.toFixed(2)}</p>
            <label className="block text-gray-700 text-sm md:text-base mb-2">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm md:text-base text-gray-700 focus:outline-none focus:border-blue-500 transition-colors mb-4"
            />
            <p className="text-gray-600 mb-4">
              Subtotal: Rs. {((selectedProduct?.sellingprice || 0) * quantity).toFixed(2)}
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm md:text-base transition-colors"
                onClick={() => {
                  setIsModalOpen(false);
                  setQuantity(1);
                  setSelectedProduct(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm md:text-base transition-colors"
                onClick={handleAddToBill}
              >
                Add to Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Confirmation Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-sm">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
              Print Bill
            </h3>
            <p className="text-gray-600 mb-4">Do you need to print the bill?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm md:text-base transition-colors"
                onClick={handleClosePrintModal}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm md:text-base transition-colors"
                onClick={handlePrintBill}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal for Printing */}
      {savedBill && (
        <div className="fixed inset-0 bg-white z-50 print:block hidden print:bg-white">
          <div className="max-w-3xl mx-auto p-6 font-sans text-sm print:p-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Pharmacy Receipt</h2>
              <p className="text-gray-600">Bill ID: {savedBill.billId}</p>
              <p className="text-gray-600">Date: {new Date(savedBill.billDate).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Details</h3>
              <p><strong>Name:</strong> {savedBill.customerName}</p>
              <p><strong>Phone:</strong> {savedBill.customerPhone || 'N/A'}</p>
              <p><strong>Payment Method:</strong> {savedBill.paymentMethod.charAt(0).toUpperCase() + savedBill.paymentMethod.slice(1)}</p>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Items</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-2">Product</th>
                    <th className="text-right py-2 px-2">Qty</th>
                    <th className="text-right py-2 px-2">Price</th>
                    <th className="text-right py-2 px-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {savedBill.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2 px-2">{item.productName}</td>
                      <td className="text-right py-2 px-2">{item.quantity}</td>
                      <td className="text-right py-2 px-2">Rs. {item.sellingPrice.toFixed(2)}</td>
                      <td className="text-right py-2 px-2">Rs. {item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end font-bold text-lg text-gray-800">
              <span>Total: Rs. {savedBill.totalAmount.toFixed(2)}</span>
            </div>
            <div className="text-center mt-6 text-gray-600 print:hidden">
              <button
                onClick={handleClosePrintModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
}

export default BillProduct;