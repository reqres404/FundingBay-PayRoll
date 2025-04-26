import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeForm from '../components/EmployeeForm';
import PayrollSummary from '../components/PayrollSummary';

function Dashboard({ user, onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [summary, setSummary] = useState({ totalEmployees: 0, totalNetPay: 0 });

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
      const response = await axios.get('/api/employees/summary', { withCredentials: true });
      setSummary(response.data);
    } catch (error) {
      toast.error('Failed to fetch summary');
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchSummary();
  }, []);

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Payroll Management</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
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

          <PayrollSummary summary={summary} />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <EmployeeTable
              employees={employees}
              onEdit={setEditingEmployee}
              onDelete={handleDeleteEmployee}
              isAdmin={user.role === 'admin'}
            />
          )}
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
        />
      )}
    </div>
  );
}

export default Dashboard; 