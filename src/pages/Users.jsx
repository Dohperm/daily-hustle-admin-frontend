import { usePaginatedData } from "../hooks/usePaginatedData";
import { usersAPI } from "../services/api";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { exportToCSV } from "../utils/exportUtils";
import { toast } from "../components/Toast";

export default function Users() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(null);
  const [stats, setStats] = useState({ active_users: 0, suspended_users: 0 });
  const {
    data: users,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    loading,
  } = usePaginatedData(usersAPI.getAdmins);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await usersAPI.getUserStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleUserAction = async (userId, action) => {
    if (action === 'view') {
      navigate(`/users/${userId}`);
    } else {
      console.log(`${action} user ${userId}`);
    }
    setShowDropdown(null);
  };

  const handleExport = async () => {
    const columns = ['first_name', 'last_name', 'username', 'email', 'status', 'approved_tasks_count', 'total_earnings', 'date'];
    const result = await exportToCSV('/users/admins', columns, 'workers.csv', { search: searchTerm });
    if (result.success) {
      toast.success('Workers exported successfully');
    } else {
      toast.error('Failed to export workers');
    }
  };







  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="card-title">Workers Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-2 text-muted">Active Workers</h6>
                  <h3 className="card-title mb-0">{stats.active_users}</h3>
                </div>
                <div className="text-success">
                  <i className="fas fa-user-check fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-2 text-muted">Suspended Workers</h6>
                  <h3 className="card-title mb-0">{stats.suspended_users}</h3>
                </div>
                <div className="text-warning">
                  <i className="fas fa-user-slash fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search workers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '300px' }}
          />
          <select
            className="form-control"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ maxWidth: '150px' }}
          >
            <option value="all">All Filters</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <button className="btn btn-outline" onClick={handleExport}>
          <i className="fas fa-download"></i> Export
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Tasks Completed</th>
                <th>Earnings</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    <Spinner />
                  </td>
                </tr>
              ) : users.map((user) => (
                <tr key={user._id} onClick={() => navigate(`/users/${user._id}`)} style={{ cursor: 'pointer' }}>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.status ? 'badge-success' : 'badge-warning'}`}>
                      {user.status ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td>{user.approved_tasks_count}</td>
                  <td>₦{user.total_earnings.toLocaleString()}</td>
                  <td>{new Date(user.date).toLocaleDateString()}</td>
                  <td style={{ position: 'relative' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDropdown(showDropdown === user._id ? null : user._id);
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                    >
                      <i className="fas fa-ellipsis-v" style={{ color: 'var(--dh-text)' }}></i>
                    </button>
                    {showDropdown === user._id && (
                      <div style={{
                        position: 'absolute',
                        bottom: '100%',
                        right: '10px',
                        background: 'var(--dh-card-bg)',
                        border: '1px solid var(--dh-border)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        minWidth: '150px',
                        marginBottom: '4px',
                        overflow: 'hidden'
                      }}>
                        <div
                          onClick={() => handleUserAction(user._id, 'view')}
                          style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--dh-border)' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dh-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <i className="fas fa-eye" style={{ width: '16px' }}></i>
                          <span>View</span>
                        </div>
                        <div
                          onClick={() => handleUserAction(user._id, user.status ? 'suspend' : 'activate')}
                          style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dh-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <i className={`fas ${user.status ? 'fa-ban' : 'fa-check'}`} style={{ width: '16px' }}></i>
                          <span>{user.status ? 'Suspend' : 'Activate'}</span>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center p-3">
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{ background: 'none', border: 'none', color: 'var(--dh-text)' }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  className={`btn btn-sm ${currentPage === page ? 'btn-primary' : ''}`}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: currentPage === page ? 'var(--dh-primary)' : 'transparent',
                    color: currentPage === page ? '#fff' : 'var(--dh-text)',
                    border: 'none'
                  }}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              className="btn btn-sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{ background: 'none', border: 'none', color: 'var(--dh-text)' }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
}