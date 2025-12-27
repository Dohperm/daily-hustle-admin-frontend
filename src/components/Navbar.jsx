import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import LogoutModal from "./LogoutModal";
import { api } from "../services/api";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [kycPendingCount, setKycPendingCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark');
    }
    fetchKycPendingCount();
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const fetchKycPendingCount = async () => {
    try {
      const response = await api.get('/users/kyc/pending-count/admins');
      setKycPendingCount(response.data.data.count || 0);
    } catch (error) {
      console.error('Error fetching KYC pending count:', error);
    }
  };

  return (
    <nav className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
      <div className="logo">
        Daily Hustle Admin
      </div>
      
      <div className="nav-menu">
        <NavLink to="/" className="nav-link">
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/users" className="nav-link">
          <i className="fas fa-users"></i>
          <span>Workers Management</span>
        </NavLink>
        
        <NavLink to="/advertisers" className="nav-link">
          <i className="fas fa-building"></i>
          <span>Employers Management</span>
        </NavLink>
        
        <NavLink to="/tasks" className="nav-link">
          <i className="fas fa-tasks"></i>
          <span>Tasks Management</span>
        </NavLink>
        
        <NavLink to="/transactions" className="nav-link">
          <i className="fas fa-exchange-alt"></i>
          <span>Transactions</span>
        </NavLink>
        
        <NavLink to="/withdrawals" className="nav-link">
          <i className="fas fa-money-bill-wave"></i>
          <span>Withdrawals</span>
        </NavLink>
        
        <NavLink to="/kyc" className="nav-link">
          <i className="fas fa-id-card"></i>
          <span>KYC</span>
          {kycPendingCount > 0 && (
            <span className="badge badge-danger" style={{ marginLeft: 'auto', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
              {kycPendingCount}
            </span>
          )}
        </NavLink>
        
        <NavLink to="/support" className="nav-link">
          <i className="fas fa-headset"></i>
          <span>Support</span>
        </NavLink>
        
        <NavLink to="/third-party-support" className="nav-link">
          <i className="fas fa-plug"></i>
          <span>Third-Party Support</span>
        </NavLink>
      </div>
      
      <div className="theme-toggle-container">
        <div className="theme-toggle">
          <span>Theme</span>
          <div className={`theme-switch ${isDark ? 'active' : ''}`} onClick={toggleTheme}></div>
        </div>
        <div className="nav-link" onClick={() => setShowLogoutModal(true)} style={{ cursor: 'pointer' }}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Log Out</span>
        </div>
      </div>
      
      <LogoutModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          logout();
          setShowLogoutModal(false);
        }}
      />
    </nav>
  );
}