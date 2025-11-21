# Daily Hustle Admin Dashboard

Admin webapp for managing the Daily Hustle platform.

## Features

- **Dashboard**: Overview of platform statistics and recent activity
- **Users Management**: View and manage all registered users
- **Tasks Management**: View and manage all tasks in the system
- **Task Approvals**: Approve or reject user-submitted tasks

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## API Integration

The frontend is configured to proxy API requests to `http://localhost:5000`. Make sure your backend server is running on port 5000.

### Expected API Endpoints

#### Authentication
- `POST /api/auth/login` - Admin login (email, password)

#### Dashboard
- `GET /api/dashboard/stats` - Get platform statistics
- `GET /api/dashboard/activity` - Get recent activity

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `GET /api/tasks/pending` - Get pending approval tasks
- `PUT /api/tasks/:id/approve` - Approve task
- `PUT /api/tasks/:id/reject` - Reject task (with reason in body)
- `DELETE /api/tasks/:id` - Delete task

## Project Structure

```
src/
├── components/
│   ├── Layout.jsx
│   └── Navbar.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Users.jsx
│   ├── Tasks.jsx
│   ├── TaskApproval.jsx
│   └── Login.jsx
├── context/
│   └── AuthContext.jsx
├── services/
│   └── api.js
├── App.jsx
└── main.jsx
```