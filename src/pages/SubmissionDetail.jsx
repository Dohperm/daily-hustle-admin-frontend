import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InputModal from "../components/InputModal";

export default function SubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState({
    id: 1,
    user: 'john_doe',
    taskTitle: 'Social Media Post',
    submittedAt: '2024-02-15T10:30:00Z',
    status: 'pending',
    proofText: 'Posted on Instagram with 2.5k views and 150 likes. Used all required hashtags and tagged the official account. The post received great engagement with positive comments from followers.',
    proofImage: 'https://via.placeholder.com/600x400',
    userEmail: 'john@example.com',
    userPhone: '+234 801 234 5678'
  });
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleAction = (action) => {
    if (action === 'approve') {
      setSubmission(prev => ({ ...prev, status: 'approved' }));
    } else if (action === 'reject') {
      setShowRejectModal(true);
    }
  };

  const handleReject = (reason) => {
    setSubmission(prev => ({ ...prev, status: 'rejected' }));
    setShowRejectModal(false);
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button className="btn btn-outline mb-2" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
          <h1 className="card-title">Submission Details</h1>
        </div>
        {submission.status === 'pending' && (
          <div className="d-flex gap-3">
            <button className="btn btn-success" onClick={() => handleAction('approve')}>
              <i className="fas fa-check"></i> Approve
            </button>
            <button className="btn btn-danger" onClick={() => handleAction('reject')}>
              <i className="fas fa-times"></i> Reject
            </button>
          </div>
        )}
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <h3 className="card-title">Submission Content</h3>
            <div className="mb-3">
              <strong>Task:</strong> {submission.taskTitle}
            </div>
            <div className="mb-3">
              <strong>Proof Text:</strong>
              <p className="mt-2">{submission.proofText}</p>
            </div>
            {submission.proofImage && (
              <div className="mb-3">
                <strong>Proof Image:</strong>
                <div className="mt-2">
                  <img 
                    src={submission.proofImage} 
                    alt="Submission proof" 
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <h3 className="card-title">Submission Info</h3>
            <div className="mb-3">
              <strong>User:</strong> {submission.user}
            </div>
            <div className="mb-3">
              <strong>Email:</strong> {submission.userEmail}
            </div>
            <div className="mb-3">
              <strong>Phone:</strong> {submission.userPhone}
            </div>
            <div className="mb-3">
              <strong>Status:</strong>
              <span className={`badge ${
                submission.status === 'approved' ? 'badge-success' : 
                submission.status === 'rejected' ? 'badge-danger' : 
                'badge-warning'
              } ms-2`}>
                {submission.status}
              </span>
            </div>
            <div className="mb-3">
              <strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      <InputModal 
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        title="Reject Submission"
        message="Please provide a reason for rejecting this submission:"
        placeholder="Enter rejection reason..."
      />
    </div>
  );
}