import { FaUsers, FaMoneyBillWave, FaUserClock, FaChartLine } from 'react-icons/fa';

function PayrollSummary({ summary, isDarkMode }) {
  // Calculate additional metrics
  const averageNetPay = summary.totalEmployees > 0 
    ? summary.totalNetPay / summary.totalEmployees 
    : 0;

  const activeEmployees = summary.activeEmployees || 0;
  const inactiveEmployees = summary.totalEmployees - activeEmployees;
  const activePercentage = summary.totalEmployees > 0 
    ? (activeEmployees / summary.totalEmployees) * 100 
    : 0;

  const StatCard = ({ icon: Icon, title, value, subtext, color }) => (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} mr-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          {subtext && (
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Payroll Summary</h3>
        <div className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FaUsers}
          title="Total Employees"
          value={summary.totalEmployees}
          subtext={`${activeEmployees} Active · ${inactiveEmployees} Inactive`}
          color="bg-blue-500"
        />

        <StatCard
          icon={FaMoneyBillWave}
          title="Total Net Pay"
          value={`$${summary.totalNetPay.toLocaleString()}`}
          subtext={`Avg: $${averageNetPay.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          color="bg-green-500"
        />

        <StatCard
          icon={FaUserClock}
          title="Active Rate"
          value={`${activePercentage.toFixed(1)}%`}
          subtext={`${activeEmployees} out of ${summary.totalEmployees} employees`}
          color="bg-purple-500"
        />

        <StatCard
          icon={FaChartLine}
          title="Total Deductions"
          value={`$${(summary.totalDeductions || 0).toLocaleString()}`}
          subtext="Based on unpaid leave days"
          color="bg-orange-500"
        />
      </div>

      {/* Progress bar for active vs inactive */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Employee Status Distribution</span>
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            {activePercentage.toFixed(1)}% Active
          </span>
        </div>
        <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className="h-2 rounded-full bg-green-500 transition-all duration-300"
            style={{ width: `${activePercentage}%` }}
          />
        </div>
      </div>

      {/* Last payroll info if available */}
      {summary.lastPayrollDate && (
        <div className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Last Payroll Processed: {new Date(summary.lastPayrollDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

export default PayrollSummary; 