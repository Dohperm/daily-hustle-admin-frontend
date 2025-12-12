import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Spinner from "../components/Spinner";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaskDetail();
  }, [id]);

  const fetchTaskDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/tasks/${id}/admins`);
      setTask(response.data.data);
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner size="lg" fullScreen />;
  if (!task) return <div>Task not found</div>;

  return (
    <div className="fade-in">
      <button onClick={() => navigate(-1)} className="btn btn-outline mb-4">
        <i className="fas fa-arrow-left"></i> Back
      </button>

      <div className="task-detail-container">
        {/* Main Task Content */}
        <div className="task-detail-main">
          <div className="card">
            <h1 className="card-title" style={{ fontSize: '1.5rem' }}>{task.title}</h1>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span className={`badge ${task.status ? 'badge-success' : 'badge-danger'}`}>
                {task.status ? 'Active' : 'Inactive'}
              </span>
              <span className="badge badge-primary">{task.category}</span>
              <span className="badge badge-primary">{task.sub_category}</span>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div className="stat-card">
                <div className="stat-label">Reward per Worker</div>
                <div className="stat-value" style={{ fontSize: '1.5rem' }}>₦{task.reward?.amount_per_worker?.toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Slots</div>
                <div className="stat-value" style={{ fontSize: '1.5rem' }}>{task.slots?.max}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Submissions</div>
                <div className="stat-value" style={{ fontSize: '1.5rem' }}>{task.total_submissions || 0}</div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600' }}>Description</h3>
              <div dangerouslySetInnerHTML={{ __html: task.description }} style={{ lineHeight: '1.6' }} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600' }}>Instructions</h3>
              <div dangerouslySetInnerHTML={{ __html: task.instructions }} style={{ lineHeight: '1.6' }} />
            </div>

            {task.task_site && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600' }}>Task Site</h3>
                <a href={task.task_site} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--dh-primary)', wordBreak: 'break-all' }}>
                  {task.task_site}
                </a>
              </div>
            )}

            {task.attachment && task.attachment.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600' }}>Attachments</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {task.attachment.map((url, index) => (
                    <img key={index} src={url} alt={`Attachment ${index + 1}`} style={{ maxWidth: '100%', width: '200px', borderRadius: '8px' }} />
                  ))}
                </div>
              </div>
            )}

            {task.review_type === 'Closed' && task.closed_review_options && (
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '600' }}>Review Options ({task.closed_review_options.length})</h3>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                  {task.closed_review_options.slice(0, 3).map((option, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>{option}</li>
                  ))}
                  {task.closed_review_options.length > 3 && (
                    <li style={{ color: 'var(--dh-muted)' }}>...and {task.closed_review_options.length - 3} more options</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Advertiser Card */}
        <div className="task-detail-sidebar">
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Employer Info</h3>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ 
                width: '70px', 
                height: '70px', 
                borderRadius: '50%', 
                background: 'var(--dh-primary)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.5rem',
                fontWeight: '600',
                margin: '0 auto 0.75rem'
              }}>
                {task.advertiser?.first_name?.[0]}{task.advertiser?.last_name?.[0]}
              </div>
              <h4 style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>
                {task.advertiser?.first_name} {task.advertiser?.last_name}
              </h4>
              <p style={{ color: 'var(--dh-muted)', fontSize: '0.85rem', marginBottom: 0, wordBreak: 'break-word' }}>{task.advertiser?.email}</p>
            </div>
            <div style={{ borderTop: '1px solid var(--dh-border)', paddingTop: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--dh-muted)', marginBottom: '0.25rem' }}>Total Budget</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>₦{task.reward?.amount?.toLocaleString()}</div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--dh-muted)', marginBottom: '0.25rem' }}>Amount Spent</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>₦{task.reward?.spent?.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--dh-muted)', marginBottom: '0.25rem' }}>Approval Mode</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{task.approval?.mode} ({task.approval?.num_days} days)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
