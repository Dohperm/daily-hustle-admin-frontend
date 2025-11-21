import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

export default function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Social Media Post', advertiser: 'John Marketing Co.', description: 'Create Instagram post about product', status: 'active', reward: 500, submissions: 12, createdAt: '2024-01-15' },
    { id: 2, title: 'Survey Completion', advertiser: 'Sarah Digital Agency', description: 'Complete customer satisfaction survey', status: 'active', reward: 200, submissions: 8, createdAt: '2024-01-20' },
    { id: 3, title: 'Product Review', advertiser: 'Mike Brand Solutions', description: 'Write detailed product review', status: 'paused', reward: 300, submissions: 5, createdAt: '2024-02-01' },
    { id: 4, title: 'Video Upload', advertiser: 'Lisa Creative Studio', description: 'Upload unboxing video to TikTok', status: 'active', reward: 800, submissions: 15, createdAt: '2024-02-10' },
    { id: 5, title: 'App Review', advertiser: 'Tech Innovations Ltd', description: 'Review mobile app on Play Store', status: 'completed', reward: 150, submissions: 25, createdAt: '2024-02-15' },
    { id: 6, title: 'Website Testing', advertiser: 'Global Brands Inc', description: 'Test website functionality', status: 'active', reward: 400, submissions: 7, createdAt: '2024-02-20' }
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showDropdown, setShowDropdown] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const itemsPerPage = 10;

  const handleTaskAction = (taskId, action) => {
    if (action === 'view') {
      navigate(`/tasks/${taskId}`);
    } else if (action === 'submissions') {
      navigate(`/tasks/${taskId}/submissions`);
    } else if (action === 'delete') {
      setShowDeleteModal(taskId);
    }
    setShowDropdown(null);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.advertiser?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || task.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="card-title">Tasks Management</h1>
        <span className="badge badge-primary">{filteredTasks.length}</span>
      </div>

      {/* Filters */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search tasks..."
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
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button className="btn btn-outline" onClick={() => console.log('Export tasks')}>
          <i className="fas fa-download"></i> Export
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Advertiser</th>
                <th>Description</th>
                <th>Status</th>
                <th>Reward</th>
                <th>Submissions</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.advertiser}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {task.description}
                  </td>
                  <td>
                    <span className={`badge ${
                      task.status === 'active' ? 'badge-success' : 
                      task.status === 'paused' ? 'badge-warning' : 
                      'badge-primary'
                    }`}>
                      <i className={`fas ${
                        task.status === 'active' ? 'fa-play' : 
                        task.status === 'paused' ? 'fa-pause' : 
                        'fa-check'
                      }`}></i> {task.status}
                    </span>
                  </td>
                  <td>₦{task.reward.toLocaleString()}</td>
                  <td>{task.submissions}</td>
                  <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td style={{ position: 'relative' }}>
                    <button
                      className="btn btn-sm"
                      onClick={() => setShowDropdown(showDropdown === task.id ? null : task.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--dh-text)' }}
                    >
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    {showDropdown === task.id && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        background: 'var(--dh-card-bg)',
                        border: '1px solid var(--dh-border)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        minWidth: '150px'
                      }}>
                        <button
                          className="btn btn-sm"
                          onClick={() => handleTaskAction(task.id, 'view')}
                          style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', padding: '8px 12px' }}
                        >
                          <i className="fas fa-eye"></i> View Task
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => handleTaskAction(task.id, 'submissions')}
                          style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', padding: '8px 12px' }}
                        >
                          <i className="fas fa-list"></i> Submissions
                        </button>
                        <button
                          className="btn btn-sm text-danger"
                          onClick={() => handleTaskAction(task.id, 'delete')}
                          style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', padding: '8px 12px' }}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
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
      
      <ConfirmModal 
        isOpen={showDeleteModal !== null}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={() => {
          setTasks(prev => prev.filter(t => t.id !== showDeleteModal));
          setShowDeleteModal(null);
        }}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
}