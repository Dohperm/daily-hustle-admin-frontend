import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { usePaginatedData } from "../hooks/usePaginatedData";
import { advertisersAPI } from "../services/api";
import { exportToCSV } from "../utils/exportUtils";
import { toast } from "../components/Toast";

export default function Advertisers() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(null);
  const [stats, setStats] = useState({ active_advertisers: 0, suspended_advertisers: 0 });
  const {
    data: advertisers,
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
  } = usePaginatedData(advertisersAPI.getAll);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await advertisersAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching advertiser stats:', error);
    }
  };

  const handleAdvertiserAction = async (advertiserId, action) => {
    if (action === 'view') {
      navigate(`/advertisers/${advertiserId}`);
    } else {
      console.log(`${action} advertiser ${advertiserId}`);
    }
    setShowDropdown(null);
  };

  const handleExport = async () => {
    const columns = ['first_name', 'last_name', 'email', 'status', 'total_tasks', 'total_spent', 'date'];
    const result = await exportToCSV('/advertisers/admins', columns, 'advertisers.csv', { search: searchTerm });
    if (result.success) {
      toast.success('Employers exported successfully');
    } else {
      toast.error('Failed to export employers');
    }
  };



  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="card-title">Employers Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-2 text-muted">Active Employers</h6>
                  <h3 className="card-title mb-0">{stats.active_advertisers}</h3>
                </div>
                <div className="text-success">
                  <i className="fas fa-check-circle fa-2x"></i>
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
                  <h6 className="card-subtitle mb-2 text-muted">Suspended Employers</h6>
                  <h3 className="card-title mb-0">{stats.suspended_advertisers}</h3>
                </div>
                <div className="text-warning">
                  <i className="fas fa-pause-circle fa-2x"></i>
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
            placeholder="Search employers..."
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
                <th>Email</th>
                <th>Status</th>
                <th>Total Tasks</th>
                <th>Total Spent</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <Spinner />
                  </td>
                </tr>
              ) : advertisers.map((advertiser) => (
                <tr key={advertiser._id} onClick={() => navigate(`/advertisers/${advertiser._id}`)} style={{ cursor: 'pointer' }}>
                  <td>{advertiser.first_name || 'N/A'}</td>
                  <td>{advertiser.last_name || 'N/A'}</td>
                  <td>{advertiser.email}</td>
                  <td>
                    <span className={`badge ${advertiser.status ? 'badge-success' : 'badge-warning'}`}>
                      {advertiser.status ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td>{advertiser.total_tasks}</td>
                  <td>₦{advertiser.total_spent?.toLocaleString() || 0}</td>
                  <td>{new Date(advertiser.date).toLocaleDateString()}</td>
                  <td style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDropdown(showDropdown === advertiser._id ? null : advertiser._id);
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                    >
                      <i className="fas fa-ellipsis-v" style={{ color: 'var(--dh-text)' }}></i>
                    </button>
                    {showDropdown === advertiser._id && (
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdvertiserAction(advertiser._id, 'view');
                          }}
                          style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--dh-border)' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dh-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <i className="fas fa-eye" style={{ width: '16px' }}></i>
                          <span>View</span>
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdvertiserAction(advertiser._id, advertiser.status ? 'suspend' : 'activate');
                          }}
                          style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dh-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <i className={`fas ${advertiser.status ? 'fa-ban' : 'fa-check'}`} style={{ width: '16px' }}></i>
                          <span>{advertiser.status ? 'Suspend' : 'Activate'}</span>
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