import { useState, useEffect } from "react";
import InputModal from "../components/InputModal";
import Spinner from "../components/Spinner";

export default function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showRejectModal, setShowRejectModal] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    // Demo data - no API call needed
  };

  const handleWithdrawalAction = async (withdrawalId, action) => {
    if (action === 'reject') {
      setShowRejectModal(withdrawalId);
      return;
    }
    
    console.log(`${action} withdrawal ${withdrawalId}`);
    // Update local state for demo
    setWithdrawals(prev => prev.map(w => 
      w.id === withdrawalId 
        ? { ...w, status: 'approved', processedDate: new Date().toISOString().split('T')[0] }
        : w
    ));
  };

  const handleReject = (reason) => {
    console.log(`reject withdrawal ${showRejectModal}`, reason);
    setWithdrawals(prev => prev.map(w => 
      w.id === showRejectModal 
        ? { ...w, status: 'rejected', processedDate: new Date().toISOString().split('T')[0] }
        : w
    ));
    setShowRejectModal(null);
  };

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesSearch = withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         withdrawal.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || withdrawal.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentWithdrawals = filteredWithdrawals.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalApproved = withdrawals.filter(w => w.status === 'approved').reduce((sum, w) => sum + w.amount, 0);
  const totalPending = withdrawals.filter(w => w.status === 'pending').reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="card-title">Withdrawal Requests</h1>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle mb-2 text-muted">Total Approved Payments</h6>
                  <h3 className="card-title mb-0">₦{totalApproved.toLocaleString()}</h3>
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
                  <h6 className="card-subtitle mb-2 text-muted">Total Pending Payments</h6>
                  <h3 className="card-title mb-0">₦{totalPending.toLocaleString()}</h3>
                </div>
                <div className="text-warning">
                  <i className="fas fa-clock fa-2x"></i>
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
            placeholder="Search withdrawals..."
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button className="btn btn-outline" onClick={() => console.log('Export withdrawals')}>
          <i className="fas fa-download"></i> Export
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Bank Details</th>
                <th>Status</th>
                <th>Request Date</th>
                <th>Processed Date</th>
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
              ) : currentWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id}>
                  <td>{withdrawal.user}</td>
                  <td>₦{withdrawal.amount.toLocaleString()}</td>
                  <td>
                    <div>
                      <div><strong>{withdrawal.bankName}</strong></div>
                      <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                        {withdrawal.accountNumber}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      withdrawal.status === 'approved' ? 'badge-success' : 
                      withdrawal.status === 'rejected' ? 'badge-danger' : 
                      'badge-warning'
                    }`}>
                      <i className={`fas ${
                        withdrawal.status === 'approved' ? 'fa-check' : 
                        withdrawal.status === 'rejected' ? 'fa-times' : 
                        'fa-clock'
                      }`}></i> {withdrawal.status}
                    </span>
                  </td>
                  <td>{new Date(withdrawal.requestDate).toLocaleDateString()}</td>
                  <td>{withdrawal.processedDate ? new Date(withdrawal.processedDate).toLocaleDateString() : '-'}</td>
                  <td>
                    {withdrawal.status === 'pending' && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleWithdrawalAction(withdrawal.id, 'approve')}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleWithdrawalAction(withdrawal.id, 'reject')}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {withdrawal.status !== 'pending' && (
                      <span className="text-muted">Processed</span>
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
      
      <InputModal 
        isOpen={showRejectModal !== null}
        onClose={() => setShowRejectModal(null)}
        onConfirm={handleReject}
        title="Reject Withdrawal"
        message="Please provide a reason for rejecting this withdrawal request:"
        placeholder="Enter rejection reason..."
      />
    </div>
  );
}