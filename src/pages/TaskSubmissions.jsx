import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InputModal from "../components/InputModal";

export default function TaskSubmissions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([
    { id: 1, user: 'john_doe', submittedAt: '2024-02-15T10:30:00Z', status: 'pending', proofText: 'Posted on Instagram with 2.5k views and 150 likes', proofImage: 'https://via.placeholder.com/300x200' },
    { id: 2, user: 'jane_smith', submittedAt: '2024-02-14T15:45:00Z', status: 'approved', proofText: 'Created engaging post with product placement, got great engagement', proofImage: 'https://via.placeholder.com/300x200' },
    { id: 3, user: 'mike_johnson', submittedAt: '2024-02-13T09:20:00Z', status: 'rejected', proofText: 'Posted as requested but image quality was low', proofImage: 'https://via.placeholder.com/300x200' },
    { id: 4, user: 'sarah_wilson', submittedAt: '2024-02-12T14:10:00Z', status: 'pending', proofText: 'High-quality post with all requirements met', proofImage: 'https://via.placeholder.com/300x200' }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [showRejectModal, setShowRejectModal] = useState(null);
  const itemsPerPage = 10;

  const handleSubmissionAction = (submissionId, action) => {
    if (action === 'view') {
      navigate(`/submissions/${submissionId}`);
    } else if (action === 'approve') {
      setSubmissions(prev => prev.map(s => 
        s.id === submissionId ? { ...s, status: 'approved' } : s
      ));
    } else if (action === 'reject') {
      setShowRejectModal(submissionId);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (filter === "all") return true;
    return submission.status === filter;
  });

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSubmissions = filteredSubmissions.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleReject = (reason) => {
    setSubmissions(prev => prev.map(s => 
      s.id === showRejectModal ? { ...s, status: 'rejected' } : s
    ));
    setShowRejectModal(null);
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button className="btn btn-outline mb-2" onClick={() => navigate('/tasks')}>
            <i className="fas fa-arrow-left"></i> Back to Tasks
          </button>
          <h1 className="card-title">Task Submissions</h1>
        </div>
        <div className="d-flex gap-3 align-items-center">
          <button className="btn btn-outline" onClick={() => console.log('Export submissions')}>
            <i className="fas fa-download"></i> Export
          </button>
          <span className="badge badge-primary">{filteredSubmissions.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="d-flex gap-3 mb-4">
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

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Proof Text</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSubmissions.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.user}</td>
                  <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${
                      submission.status === 'approved' ? 'badge-success' : 
                      submission.status === 'rejected' ? 'badge-danger' : 
                      'badge-warning'
                    }`}>
                      <i className={`fas ${
                        submission.status === 'approved' ? 'fa-check' : 
                        submission.status === 'rejected' ? 'fa-times' : 
                        'fa-clock'
                      }`}></i> {submission.status}
                    </span>
                  </td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {submission.proofText}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleSubmissionAction(submission.id, 'view')}
                      >
                        View
                      </button>
                      {submission.status === 'pending' && (
                        <>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleSubmissionAction(submission.id, 'approve')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleSubmissionAction(submission.id, 'reject')}
                          >
                            Reject
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
        title="Reject Submission"
        message="Please provide a reason for rejecting this submission:"
        placeholder="Enter rejection reason..."
      />
    </div>
  );
}