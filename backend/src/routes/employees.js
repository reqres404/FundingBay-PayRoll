const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { isAdmin } = require('../middleware/auth');

const EMPLOYEES_FILE = path.join(__dirname, '../data/employees.json');

// Helper functions
const readEmployees = async () => {
  const data = await fs.readFile(EMPLOYEES_FILE, 'utf8');
  return JSON.parse(data);
};

const writeEmployees = async (employees) => {
  await fs.writeFile(EMPLOYEES_FILE, JSON.stringify(employees, null, 2));
};

const validateEmployee = (employee) => {
  const errors = [];
  
  if (!['Active', 'Terminated', 'OnBoarding'].includes(employee.status)) {
    errors.push('Status must be Active, Terminated, or OnBoarding');
  }
  
  if (!/^\d{10,12}$/.test(employee.bankAccount)) {
    errors.push('Bank account must be 10-12 digits');
  }
  
  return errors;
};

// List all employees
router.get('/', async (req, res) => {
  try {
    const employees = await readEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

// Add employee (admin only)
router.post('/', isAdmin, async (req, res) => {
  try {
    const employees = await readEmployees();
    const newEmployee = {
      id: Date.now().toString(),
      ...req.body,
      netPay: req.body.grossPay - (req.body.unpaidLeaveDays * 100)
    };

    const errors = validateEmployee(newEmployee);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    employees.push(newEmployee);
    await writeEmployees(employees);
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error adding employee' });
  }
});

// Edit employee (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const employees = await readEmployees();
    const index = employees.findIndex(e => e.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const updatedEmployee = {
      ...employees[index],
      ...req.body,
      id: req.params.id,
      netPay: req.body.grossPay - (req.body.unpaidLeaveDays * 100)
    };

    const errors = validateEmployee(updatedEmployee);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    employees[index] = updatedEmployee;
    await writeEmployees(employees);
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee' });
  }
});

// Delete employee (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const employees = await readEmployees();
    const filteredEmployees = employees.filter(e => e.id !== req.params.id);
    
    if (filteredEmployees.length === employees.length) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await writeEmployees(filteredEmployees);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee' });
  }
});

// Delete all invalid employees (admin only)
router.delete('/invalid/all', isAdmin, async (req, res) => {
  try {
    const employees = await readEmployees();
    const validEmployees = employees.filter(employee => {
      const errors = validateEmployee(employee);
      return errors.length === 0;
    });

    await writeEmployees(validEmployees);
    res.json({ 
      message: 'Invalid employees deleted successfully',
      deletedCount: employees.length - validEmployees.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting invalid employees' });
  }
});

// Approve payroll (admin only)
router.post('/approve', isAdmin, async (req, res) => {
  try {
    const employees = await readEmployees();
    const invalidEmployees = employees.filter(employee => {
      const errors = validateEmployee(employee);
      return errors.length > 0;
    });

    if (invalidEmployees.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot approve payroll with invalid employees',
        invalidCount: invalidEmployees.length
      });
    }

    res.json({ message: 'Payroll approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving payroll' });
  }
});

// Get payroll summary
router.get('/summary', async (req, res) => {
  try {
    const employees = await readEmployees();
    const totalEmployees = employees.length;
    const totalNetPay = employees.reduce((sum, emp) => sum + emp.netPay, 0);
    
    res.json({
      totalEmployees,
      totalNetPay
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting payroll summary' });
  }
});

module.exports = router; 