import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalTasks: 856,
    pendingApprovals: 23,
    totalEarnings: 45600
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Demo data - no API call needed
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="fade-in">
      <h1 className="card-title mb-4">Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <i className="fas fa-users"></i>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        
        <div className="stat-card">
          <i className="fas fa-tasks"></i>
          <div className="stat-value">{stats.totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        
        <div className="stat-card">
          <i className="fas fa-clock"></i>
          <div className="stat-value">{stats.pendingApprovals}</div>
          <div className="stat-label">Pending Approvals</div>
        </div>
        
        <div className="stat-card">
          <i className="fas fa-naira-sign"></i>
          <div className="stat-value">₦{stats.totalEarnings}</div>
          <div className="stat-label">Total Earnings</div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">User Signup Trend</h3>
        <div style={{ height: '300px', display: 'flex', alignItems: 'end', justifyContent: 'space-between', padding: '20px' }}>
          {[12, 19, 15, 27, 32, 25, 38, 42, 35, 28, 45, 52].map((value, index) => (
            <div key={index} style={{
              height: `${(value / 52) * 80}%`,
              width: '40px',
              background: 'var(--dh-primary)',
              borderRadius: '4px 4px 0 0',
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '11px',
              paddingBottom: '5px',
              fontWeight: '500'
            }}>
              {value}
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.8rem', marginTop: '10px', paddingLeft: '20px', paddingRight: '20px' }}>
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </div>
    </div>
  );
}