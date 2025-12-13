import { useState, useEffect } from "react";
import { api, usersAPI, advertisersAPI } from "../services/api";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Spinner from "../components/Spinner";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [advertiserStats, setAdvertiserStats] = useState(null);
  const [topUsers, setTopUsers] = useState([]);
  const [topAdvertisers, setTopAdvertisers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [userStatsRes, advertiserStatsRes, usersRes, advertisersRes, tasksRes, submissionsRes] = await Promise.all([
        usersAPI.getUserStats(),
        advertisersAPI.getStats(),
        usersAPI.getAdmins({ limit: 10, sort: '-total_earnings' }),
        advertisersAPI.getAll({ limit: 10, sort: '-total_spent' }),
        api.get('/tasks/admins'),
        api.get('/tasks/submissions/admins')
      ]);

      setUserStats(userStatsRes.data.data);
      setAdvertiserStats(advertiserStatsRes.data.data);
      setTopUsers(usersRes.data.data?.data || []);
      setTopAdvertisers(advertisersRes.data.data?.data || []);
      setTasks(tasksRes.data.data?.data || []);
      setSubmissions(submissionsRes.data.data?.data || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" fullScreen />;
  }

  const userStatusData = userStats ? [
    { name: 'Active', value: userStats.active_users || 0, color: '#10b981' },
    { name: 'Suspended', value: userStats.suspended_users || 0, color: '#ef4444' }
  ] : [];

  const advertiserStatusData = advertiserStats ? [
    { name: 'Active', value: advertiserStats.active_advertisers || 0, color: '#10b981' },
    { name: 'Suspended', value: advertiserStats.suspended_advertisers || 0, color: '#ef4444' }
  ] : [];

  const taskStatusData = tasks.reduce((acc, task) => {
    const status = task.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const taskStatusChartData = Object.entries(taskStatusData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: name === 'active' ? '#10b981' : name === 'completed' ? '#3b82f6' : '#f59e0b'
  }));

  const submissionStatusData = submissions.reduce((acc, sub) => {
    const status = sub.admin_approval_status || 'pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const submissionStatusChartData = Object.entries(submissionStatusData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: name === 'approved' ? '#10b981' : name === 'rejected' ? '#ef4444' : name === 'resubmit' ? '#f59e0b' : '#6b7280'
  }));

  const categoryData = tasks.reduce((acc, task) => {
    const category = task.category || 'Others';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryData).map(([name, value], index) => ({
    name,
    value,
    color: ['#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#84cc16', '#f59e0b'][index % 6]
  }));

  const topUsersData = topUsers.slice(0, 5).map(user => ({
    name: `${user.first_name} ${user.last_name}`,
    earnings: user.total_earnings || 0,
    tasks: user.approved_tasks_count || 0
  }));

  const topAdvertisersData = topAdvertisers.slice(0, 5).map(adv => ({
    name: `${adv.first_name} ${adv.last_name}`,
    spent: adv.total_spent || 0,
    tasks: adv.total_tasks || 0
  }));

  const stats = {
    totalUsers: userStats?.total_users || 0,
    totalTasks: tasks.length,
    pendingApprovals: submissions.filter(s => s.admin_approval_status === 'pending').length,
    totalEarnings: topUsers.reduce((sum, u) => sum + (u.total_earnings || 0), 0)
  };

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="card">
          <h3 className="card-title">User Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={userStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} dataKey="value">
                {userStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--dh-card-bg)', border: '1px solid var(--dh-border)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Advertiser Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={advertiserStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} dataKey="value">
                {advertiserStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--dh-card-bg)', border: '1px solid var(--dh-border)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={taskStatusChartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} dataKey="value">
                {taskStatusChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--dh-card-bg)', border: '1px solid var(--dh-border)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Submission Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={submissionStatusChartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} dataKey="value">
                {submissionStatusChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--dh-card-bg)', border: '1px solid var(--dh-border)' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Tasks by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--dh-border)" />
              <XAxis type="number" stroke="var(--dh-text)" />
              <YAxis type="category" dataKey="name" stroke="var(--dh-text)" width={120} />
              <Tooltip contentStyle={{ background: 'var(--dh-card-bg)', border: '1px solid var(--dh-border)' }} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {categoryChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Top Earners</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topUsersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--dh-border)" />
              <XAxis dataKey="name" stroke="var(--dh-text)" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="var(--dh-text)" />
              <Tooltip contentStyle={{ background: 'var(--dh-card-bg)', border: '1px solid var(--dh-border)' }} formatter={(value) => `₦${value.toLocaleString()}`} />
              <Bar dataKey="earnings" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">Top Spending Advertisers</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topAdvertisersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--dh-border)" />
              <XAxis dataKey="name" stroke="var(--dh-text)" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="var(--dh-text)" />
              <Tooltip contentStyle={{ background: 'var(--dh-card-bg)', border: '1px solid var(--dh-border)' }} formatter={(value) => `₦${value.toLocaleString()}`} />
              <Bar dataKey="spent" fill="#ff6b35" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="card-title">User Task Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topUsersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--dh-border)" />
              <XAxis dataKey="name" stroke="var(--dh-text)" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="var(--dh-text)" />
              <Tooltip contentStyle={{ background: 'var(--dh-card-bg)', border: '1px solid var(--dh-border)' }} />
              <Bar dataKey="tasks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}