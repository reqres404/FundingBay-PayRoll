import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeForm from '../components/EmployeeForm';
import PayrollSummary from '../components/PayrollSummary';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaFilter } from 'react-icons/fa';

function Dashboard({ user, onLogout }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [summary, setSummary] = useState({ totalEmployees: 0, totalNetPay: 0 });
  const [filters, setFilters] = useState({
    status: 'all',
    searchTerm: '',
    payRange: 'all'
  });

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees', { withCredentials: true });
      setEmployees(response.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/employees/summary', { 
        withCredentials: true 
      });
      
      // Calculate additional metrics
      const activeEmployees = employees.filter(e => e.status === 'Active').length;
      const totalDeductions = employees.reduce((sum, emp) => 
        sum + (emp.unpaidLeaveDays * 100), 0);

      setSummary({
        ...response.data,
        activeEmployees,
        totalDeductions,
        lastPayrollDate: response.data.lastPayrollDate
      });
    } catch (error) {
      toast.error('Failed to fetch summary');
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchSummary();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(employee => {
      const matchesStatus = filters.status === 'all' || employee.status === filters.status;
      const matchesSearch = employee.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          employee.bankAccount.includes(filters.searchTerm);
      const matchesPayRange = filters.payRange === 'all' ||
        (filters.payRange === 'high' && employee.grossPay >= 50000) ||
        (filters.payRange === 'medium' && employee.grossPay >= 30000 && employee.grossPay < 50000) ||
        (filters.payRange === 'low' && employee.grossPay < 30000);

      return matchesStatus && matchesSearch && matchesPayRange;
    });

    setFilteredEmployees(filtered);
  }, [employees, filters]);

  const handleAddEmployee = async (employeeData) => {
    try {
      // Ensure we have the data
      if (!employeeData) {
        toast.error('No employee data provided');
        return;
      }

      // Format the data before sending
      const data = {
        name: employeeData.name,
        status: employeeData.status,
        bankAccount: employeeData.bankAccount.toString(),
        grossPay: Number(employeeData.grossPay),
        unpaidLeaveDays: Number(employeeData.unpaidLeaveDays)
      };

      console.log('Sending employee data:', data);

      const response = await axios.post('http://localhost:3000/api/employees', data, { 
        withCredentials: true
      });
      
      toast.success('Employee added successfully');
      setShowForm(false);
      fetchEmployees();
      fetchSummary();
    } catch (error) {
      // Improved error logging
      console.error('Error adding employee:', {
        message: error.message,
        response: error.response,
        data: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid employee data');
      } else if (error.response?.status === 401) {
        toast.error('Please log in again');
        onLogout();
      } else {
        toast.error('Failed to add employee. Please try again.');
      }
    }
  };

  const handleEditEmployee = async (id, employeeData) => {
    try {
      if (!id || !employeeData) {
        toast.error('Invalid employee data for editing');
        return;
      }

      const response = await axios.put(`http://localhost:3000/api/employees/${id}`, employeeData, { 
        withCredentials: true 
      });
      
      toast.success('Employee updated successfully');
      setEditingEmployee(null);
      fetchEmployees();
      fetchSummary();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update employee');
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`/api/employees/${id}`, { withCredentials: true });
      toast.success('Employee deleted successfully');
      fetchEmployees();
      fetchSummary();
    } catch (error) {
      toast.error('Failed to delete employee');
    }
  };

  const handleDeleteInvalid = async () => {
    try {
      const response = await axios.delete('/api/employees/invalid/all', { withCredentials: true });
      toast.success(`Deleted ${response.data.deletedCount} invalid employees`);
      fetchEmployees();
      fetchSummary();
    } catch (error) {
      toast.error('Failed to delete invalid employees');
    }
  };

  const handleApprovePayroll = async () => {
    try {
      await axios.post('/api/employees/approve', {}, { withCredentials: true });
      toast.success('Payroll approved successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve payroll');
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Payroll Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
              >
                {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
              </button>
              <span>
                Welcome, {user.username} ({user.role})
              </span>
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Employees</h2>
              {user.role === 'admin' && (
                <div className="space-x-4">
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Add Employee
                  </button>
                  <button
                    onClick={handleDeleteInvalid}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700"
                  >
                    Delete Invalid
                  </button>
                  <button
                    onClick={handleApprovePayroll}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Approve Payroll
                  </button>
                </div>
              )}
            </div>

            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search by name or bank account..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-md ${
                      isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    }`}
                  />
                </div>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className={`px-3 py-2 rounded-md ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <select
                  value={filters.payRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, payRange: e.target.value }))}
                  className={`px-3 py-2 rounded-md ${
                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <option value="all">All Pay Ranges</option>
                  <option value="high">High Pay (&ge;50k)</option>
                  <option value="medium">Medium Pay (30k-50k)</option>
                  <option value="low">Low Pay (&lt;30k)</option>
                </select>
              </div>
            </div>

            <PayrollSummary summary={summary} isDarkMode={isDarkMode} />

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <EmployeeTable
                employees={filteredEmployees}
                onEdit={setEditingEmployee}
                onDelete={handleDeleteEmployee}
                isAdmin={user.role === 'admin'}
                isDarkMode={isDarkMode}
              />
            )}
          </div>
        </div>
      </main>

      {(showForm || editingEmployee) && (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={editingEmployee ? handleEditEmployee : handleAddEmployee}
          onClose={() => {
            setShowForm(false);
            setEditingEmployee(null);
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default Dashboard; 