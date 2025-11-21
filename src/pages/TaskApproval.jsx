import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function TaskApproval() {
  const [submissions, setSubmissions] = useState([
    { id: 1, taskTitle: 'Instagram Story Post', username: 'john_doe', submittedAt: '2024-02-15T10:30:00Z', category: 'Social Media', proofText: 'Posted story about new product launch with 2.5k views', proofImage: 'https://via.placeholder.com/300x200' },
    { id: 2, taskTitle: 'TikTok Video Upload', username: 'jane_smith', submittedAt: '2024-02-14T15:45:00Z', category: 'Video Content', proofText: 'Created dance video with product placement, got 15k views', proofImage: 'https://via.placeholder.com/300x200' },
    { id: 3, taskTitle: 'Product Review Blog', username: 'mike_johnson', submittedAt: '2024-02-13T09:20:00Z', category: 'Content Writing', proofText: 'Wrote detailed 1000-word review on personal blog', proofImage: 'https://via.placeholder.com/300x200' }
  ]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const fetchPendingSubmissions = async () => {
    // Demo data - no API call needed
    setLoading(false);
  };

  const handleApproval = async (submissionId, action, reason = "") => {
    try {
      await api.put(`/api/tasks/${submissionId}/${action}`, { reason });
      fetchPendingSubmissions(); // Refresh list
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Failed to process approval:', error);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading submissions...</div>;
  }

  return (
    <div>
      <h1 className="h2 mb-4">Task Approval</h1>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Pending Submissions ({submissions.length})</h5>
            </div>
            <div className="list-group list-group-flush">
              {submissions.map(submission => (
                <div key={submission.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="mb-1">{submission.taskTitle}</h6>
                      <p className="mb-1 text-muted small">
                        User: {submission.username} • Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                      <small className="text-muted">Category: {submission.category}</small>
                    </div>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          {selectedSubmission ? (
            <div className="card">
              <div className="card-header">
                <h5>Review Submission</h5>
              </div>
              <div className="card-body">
                <h6>{selectedSubmission.taskTitle}</h6>
                <p className="small text-muted">User: {selectedSubmission.username}</p>
                
                <div className="mb-3">
                  <label className="form-label">Proof Text:</label>
                  <p className="border p-2 rounded bg-light small">
                    {selectedSubmission.proofText || "No text provided"}
                  </p>
                </div>

                {selectedSubmission.proofImage && (
                  <div className="mb-3">
                    <label className="form-label">Proof Image:</label>
                    <img 
                      src={selectedSubmission.proofImage} 
                      alt="Proof" 
                      className="img-fluid rounded border"
                    />
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-success"
                    onClick={() => handleApproval(selectedSubmission.id, 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      const reason = prompt("Rejection reason:");
                      if (reason) handleApproval(selectedSubmission.id, 'reject', reason);
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center text-muted">
                Select a submission to review
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}