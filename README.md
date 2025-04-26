# Payroll Management System

A full-stack payroll management system with authentication, employee management, and payroll processing features.

## Features

- User authentication (admin and viewer roles)
- Employee management (CRUD operations)
- Employee validation
- Payroll processing
- Modern UI with Tailwind CSS
- Toast notifications
- Session management

## Tech Stack

### Backend
- Node.js
- Express.js
- JWT for authentication
- JSON file storage

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd payroll
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Start the backend server:
```bash
cd ../backend
npm run dev
```

5. Start the frontend development server:
```bash
cd ../frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Default Users

1. Admin User:
   - Username: admin
   - Password: admin123

2. Viewer User:
   - Username: viewer
   - Password: viewer123

## API Endpoints

### Authentication
- POST /api/auth/login - Login
- POST /api/auth/logout - Logout
- GET /api/auth/me - Get current user

### Employees
- GET /api/employees - List all employees
- POST /api/employees - Add employee (admin only)
- PUT /api/employees/:id - Edit employee (admin only)
- DELETE /api/employees/:id - Delete employee (admin only)
- DELETE /api/employees/invalid/all - Delete all invalid employees (admin only)
- POST /api/employees/approve - Approve payroll (admin only)
- GET /api/employees/summary - Get payroll summary

## License

MIT 