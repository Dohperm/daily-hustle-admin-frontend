import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Toast from "./components/Toast";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetail";
import Tasks from "./pages/Tasks";
import Transactions from "./pages/Transactions";
import Advertisers from "./pages/Advertisers";
import AdvertiserDetail from "./pages/AdvertiserDetail";
import Withdrawals from "./pages/Withdrawals";
import TaskDetail from "./pages/TaskDetail";
import TaskSubmissions from "./pages/TaskSubmissions";
import SubmissionDetail from "./pages/SubmissionDetail";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

export default function App() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toast />
      <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="advertisers" element={<Advertisers />} />
        <Route path="advertisers/:id" element={<AdvertiserDetail />} />
        <Route path="withdrawals" element={<Withdrawals />} />
        <Route path="tasks/:id" element={<TaskDetail />} />
        <Route path="tasks/:id/submissions" element={<TaskSubmissions />} />
        <Route path="submissions/:id" element={<SubmissionDetail />} />
      </Route>
      </Routes>
    </>
  );
}