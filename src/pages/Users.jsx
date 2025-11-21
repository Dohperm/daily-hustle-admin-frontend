import { useState, useEffect } from "react";

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, username: 'john_doe', email: 'john@example.com', status: 'active', createdAt: '2024-01-15', tasksCompleted: 45, earnings: 12500 },
    { id: 2, username: 'jane_smith', email: 'jane@example.com', status: 'active', createdAt: '2024-01-20', tasksCompleted: 32, earnings: 8900 },
    { id: 3, username: 'mike_johnson', email: 'mike@example.com', status: 'suspended', createdAt: '2024-02-01', tasksCompleted: 12, earnings: 3200 },
    { id: 4, username: 'sarah_wilson', email: 'sarah@example.com', status: 'active', createdAt: '2024-02-10', tasksCompleted: 67, earnings: 18700 },
    { id: 5, username: 'david_brown', email: 'david@example.com', status: 'active', createdAt: '2024-02-15', tasksCompleted: 23, earnings: 6800 },
    { id: 6, username: 'lisa_davis', email: 'lisa@example.com', status: 'active', createdAt: '2024-02-20', tasksCompleted: 41, earnings: 11200 },
    { id: 7, username: 'tom_wilson', email: 'tom@example.com', status: 'suspended', createdAt: '2024-02-25', tasksCompleted: 8, earnings: 2100 },
    { id: 8, username: 'anna_taylor', email: 'anna@example.com', status: 'active', createdAt: '2024-03-01', tasksCompleted: 55, earnings: 15400 }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    // Demo data - no API call needed
  };

  const handleUserAction = async (userId, action) => {
    console.log(`${action} user ${userId}`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const activeWorkers = users.filter(u => u.status === 'active').length;
  const suspendedWorkers = users.filter(u => u.status === 'suspended').length;

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
                  <h3 className="card-title mb-0">{activeWorkers}</h3>
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
                  <h3 className="card-title mb-0">{suspendedWorkers}</h3>
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
        <button className="btn btn-outline" onClick={() => console.log('Export workers')}>
          <i className="fas fa-download"></i> Export
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
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
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${
                      user.status === 'active' ? 'badge-success' : 
                      user.status === 'suspended' ? 'badge-warning' : 
                      'badge-danger'
                    }`}>
                      <i className={`fas ${
                        user.status === 'active' ? 'fa-check' : 
                        user.status === 'suspended' ? 'fa-pause' : 
                        'fa-times'
                      }`}></i> {user.status}
                    </span>
                  </td>
                  <td>{user.tasksCompleted}</td>
                  <td>₦{user.earnings.toLocaleString()}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleUserAction(user.id, 'view')}
                      >
                        View
                      </button>
                      <button
                        className={`btn btn-sm ${user.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                      >
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
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
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                  onClick={() => handlePageChange(page)}
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
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{ background: 'none', border: 'none', color: 'var(--dh-text)' }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <select
            className="form-control"
            style={{ width: 'auto' }}
            defaultValue="10"
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