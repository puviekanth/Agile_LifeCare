import { FiX } from 'react-icons/fi';

const EditProductModal = ({ showEditModal, setShowEditModal, formData, handleChange, handleUpdate }) => {
  if (!showEditModal) return null;

  // Function to format date to YYYY-MM-DD for input type="date"
  const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.warn(`Invalid date received: ${date}`);
      return '';
    }
    return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 py-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl transition-colors"
          onClick={() => setShowEditModal(false)}
        >
          <FiX />
        </button>
        <h3 className="text-2xl font-semibold mb-6 text-blue-900">Edit Product</h3>
        <form onSubmit={(e) => {
          console.log('Submitting form with formData:', formData);
          handleUpdate(e);
        }} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {formData.image && (
                <p className="text-sm text-gray-500 mt-1">
                  Current file:{' '}
                  <span className="font-medium">
                    {typeof formData.image === 'string'
                      ? formData.image.split('\\').pop().split('/').pop()
                      : formData.image.name}
                  </span>
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="productName"
                value={formData.productName || ''}
                onChange={handleChange}
                placeholder="Medicine Name"
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Product Price</label>
              <input
                type="number"
                name="sellingprice"
                value={formData.sellingprice || ''}
                onChange={handleChange}
                placeholder="Price"
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Product Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity || ''}
                onChange={handleChange}
                placeholder="Quantity"
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Supplier Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName || ''}
                onChange={handleChange}
                placeholder="Supplier Company Name"
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Product Category</label>
              <select
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select Category</option>
                <option value="OTC">OTC</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="A3">A3</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Manufacture Date</label>
              <input
                type="date"
                name="manufactureDate"
                value={formatDateForInput(formData.manufactureDate)}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={formatDateForInput(formData.expiryDate)}
                onChange={handleChange}
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Product Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Description"
              className="border border-gray-300 p-2.5 rounded-lg w-full resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;