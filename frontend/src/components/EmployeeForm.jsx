import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

function EmployeeForm({ employee, onSubmit, onClose, isDarkMode }) {
  const [formData, setFormData] = useState({
    name: '',
    status: 'Active',
    bankAccount: '',
    grossPay: '',
    unpaidLeaveDays: '0'
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        status: employee.status,
        bankAccount: employee.bankAccount,
        grossPay: employee.grossPay,
        unpaidLeaveDays: employee.unpaidLeaveDays
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Log the raw form data
    console.log('Raw form data:', formData);
    
    // Format the data
    const data = {
      name: formData.name.trim(),
      status: formData.status,
      bankAccount: formData.bankAccount.toString(),
      grossPay: Number(formData.grossPay),
      unpaidLeaveDays: Number(formData.unpaidLeaveDays)
    };

    console.log('Formatted data:', data);

    // Enhanced validation
    const validationErrors = [];

    if (!data.name || data.name.trim().length === 0) {
      validationErrors.push('Name is required');
    }

    if (!/^\d{10,12}$/.test(data.bankAccount)) {
      validationErrors.push('Bank account must be 10-12 digits');
    }

    if (!['Active', 'Terminated', 'OnBoarding'].includes(data.status)) {
      validationErrors.push('Status must be Active, Terminated, or OnBoarding');
    }

    if (isNaN(data.grossPay) || data.grossPay <= 0) {
      validationErrors.push('Gross pay must be a positive number');
    }

    if (isNaN(data.unpaidLeaveDays) || data.unpaidLeaveDays < 0) {
      validationErrors.push('Unpaid leave days must be a non-negative number');
    }

    // If there are validation errors, show them and return
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    // Log before submission
    console.log('Submitting data:', data);
    
    if (employee) {
      onSubmit(employee.id, data);
    } else {
      onSubmit(data);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg p-8 max-w-md w-full`}>
        <h2 className="text-2xl font-bold mb-6">
          {employee ? 'Edit Employee' : 'Add Employee'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                ${isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                ${isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            >
              <option value="Active">Active</option>
              <option value="Terminated">Terminated</option>
              <option value="OnBoarding">OnBoarding</option>
            </select>
          </div>

          <div>
            <label htmlFor="bankAccount" className="block text-sm font-medium">
              Bank Account
            </label>
            <input
              type="text"
              id="bankAccount"
              name="bankAccount"
              required
              pattern="\d{10,12}"
              value={formData.bankAccount}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                ${isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            />
          </div>

          <div>
            <label htmlFor="grossPay" className="block text-sm font-medium">
              Gross Pay
            </label>
            <input
              type="number"
              id="grossPay"
              name="grossPay"
              required
              min="0"
              value={formData.grossPay}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                ${isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            />
          </div>

          <div>
            <label htmlFor="unpaidLeaveDays" className="block text-sm font-medium">
              Unpaid Leave Days
            </label>
            <input
              type="number"
              id="unpaidLeaveDays"
              name="unpaidLeaveDays"
              required
              min="0"
              value={formData.unpaidLeaveDays}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                ${isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md text-sm font-medium
                ${isDarkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              {employee ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm; 