function EmployeeTable({ employees, onEdit, onDelete, isAdmin, isDarkMode }) {
  const validateEmployee = (employee) => {
    const errors = [];
    
    if (employee.status !== 'Active') {
      errors.push('Employee must be active');
    }
    
    if (!/^\d{10,12}$/.test(employee.bankAccount)) {
      errors.push('Bank account must be 10-12 digits');
    }
    
    const netPay = employee.grossPay - (employee.unpaidLeaveDays * 100);
    if (netPay !== employee.netPay) {
      errors.push('Net pay calculation is incorrect');
    }
    
    return errors;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Terminated':
        return 'bg-red-100 text-red-800';
      case 'OnBoarding':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`overflow-x-auto rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Bank Account
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Gross Pay
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Unpaid Leave Days
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Net Pay
            </th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
              Validation
            </th>
            {isAdmin && (
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {employees.map((employee) => {
            const errors = validateEmployee(employee);
            const isValid = errors.length === 0;

            return (
              <tr key={employee.id} className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{employee.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {employee.bankAccount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  ${employee.grossPay.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {employee.unpaidLeaveDays}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  ${employee.netPay.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      isValid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                    title={isValid ? 'Valid' : errors.join(', ')}
                  >
                    {isValid ? 'Valid' : 'Invalid'}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(employee)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(employee.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable; 