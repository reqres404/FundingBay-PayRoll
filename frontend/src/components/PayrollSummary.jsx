function PayrollSummary({ summary }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Payroll Summary</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-blue-500 truncate">Total Employees</dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-900">{summary.totalEmployees}</dd>
          </div>
        </div>
        <div className="bg-green-50 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-green-500 truncate">Total Net Pay</dt>
            <dd className="mt-1 text-3xl font-semibold text-green-900">
              ${summary.totalNetPay.toLocaleString()}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayrollSummary; 