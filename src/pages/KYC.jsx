import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { usePaginatedData } from "../hooks/usePaginatedData";
import Spinner from "../components/Spinner";
import { toast } from "../components/Toast";

export default function KYC() {
  const navigate = useNavigate();
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showImageModal, setShowImageModal] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const {
    data: submissions,
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
    refetch
  } = usePaginatedData(() => api.get('/users/kyc/submissions/admins'));

  const handleApprove = async (id) => {
    try {
      setProcessing(true);
      await api.patch(`/users/${id}/kyc/status/admins`, { is_approved: true });
      toast.success('KYC approved successfully');
      refetch();
    } catch (error) {
      console.error('Error approving KYC:', error);
      toast.error('Failed to approve KYC');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setProcessing(true);
      await api.patch(`/users/${showRejectModal}/kyc/status/admins`, { 
        is_approved: false,
        rejection_reason: rejectionReason 
      });
      toast.success('KYC rejected');
      setShowRejectModal(null);
      setRejectionReason("");
      refetch();
    } catch (error) {
      console.error('Error rejecting KYC:', error);
      toast.error('Failed to reject KYC');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="card-title">KYC Submissions</h1>
        <span className="badge badge-primary">{submissions.length}</span>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
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
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>DOB</th>
                <th>ID Number</th>
                <th>Address</th>
                <th>Status</th>
                <th>Submitted</th>
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
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">No KYC submissions found</td>
                </tr>
              ) : submissions.map((submission) => (
                <tr key={submission._id}>
                  <td>{submission.kyc?.full_name || `${submission.first_name} ${submission.last_name}`}</td>
                  <td>{submission.email}</td>
                  <td>{submission.phone}</td>
                  <td>{submission.kyc?.DOB ? new Date(submission.kyc.DOB).toLocaleDateString() : 'N/A'}</td>
                  <td>{submission.kyc?.identification_number || 'N/A'}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {submission.kyc?.residential_address || 'N/A'}
                  </td>
                  <td>
                    <span className={`badge ${
                      submission.kyc?.status === 'approved' ? 'badge-success' :
                      submission.kyc?.status === 'rejected' ? 'badge-danger' :
                      'badge-warning'
                    }`}>
                      {submission.kyc?.status === 'approved' ? 'Approved' : 
                       submission.kyc?.status === 'rejected' ? 'Rejected' : 
                       'Submitted'}
                    </span>
                  </td>
                  <td>{new Date(submission.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      {submission.kyc?.id_src && (
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => {
                            setShowImageModal(submission.kyc.id_src);
                            setImageZoom(1);
                          }}
                          title="View ID"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                      )}
                      {submission.kyc?.status === 'submitted' && (
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleApprove(submission._id)}
                            disabled={processing}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => setShowRejectModal(submission._id)}
                            disabled={processing}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

      {showImageModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          flexDirection: 'column'
        }}>
          <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', gap: '10px', zIndex: 10000 }}>
            <button
              className="btn btn-outline"
              onClick={() => setImageZoom(Math.max(0.5, imageZoom - 0.25))}
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              <i className="fas fa-search-minus"></i>
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setImageZoom(Math.min(3, imageZoom + 0.25))}
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              <i className="fas fa-search-plus"></i>
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setShowImageModal(null)}
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div style={{ overflow: 'auto', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={showImageModal}
              alt="ID Document"
              style={{
                transform: `scale(${imageZoom})`,
                transition: 'transform 0.2s',
                maxWidth: '100%',
                display: 'block',
                pointerEvents: 'none'
              }}
            />
          </div>
        </div>
      )}

      {showRejectModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
            <h3 className="card-title">Reject KYC Submission</h3>
            <div className="form-group">
              <label className="form-label">Rejection Reason</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <button
                className="btn btn-outline"
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectionReason("");
                }}
                disabled={processing}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
              >
                {processing ? <Spinner size="sm" /> : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
