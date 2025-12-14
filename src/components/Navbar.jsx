import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import LogoutModal from "./LogoutModal";

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark');
    }
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