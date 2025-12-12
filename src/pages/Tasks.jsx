import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import Spinner from "../components/Spinner";
import { api } from "../services/api";

export default function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showDropdown, setShowDropdown] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTasks();
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDropdown && !e.target.closest('td')) {
        setShowDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await api.get('/tasks/admins', { params });
      
      // Handle nested data structure
      let tasksArray = [];
      if (response.data.data && Array.isArray(response.data.data.data)) {
        tasksArray = response.data.data.data;
      } else if (Array.isArray(response.data.data)) {
        tasksArray = response.data.data;
      } else if (Array.isArray(response.data)) {
        tasksArray = response.data;
      }
      
      setTasks(tasksArray);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.message || 'Failed to fetch tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = {
        download: true,
        columns: ['title', 'advertiser', 'description', 'status', 'reward', 'submissions', 'createdAt']
      };
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await api.get('/tasks/admins', { params, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tasks.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting tasks:', error);
    }
  };

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

  const filteredTasks = (tasks || []).filter(task => {
    const matchesSearch = !searchTerm || 
                         task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.advertiser?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.advertiser?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.advertiser?.email?.toLowerCase().includes(searchTerm.toLowerCase());
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
    <>
      {loading && <Spinner size="lg" fullScreen />}
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
        <button className="btn btn-outline" onClick={handleExport}>
          <i className="fas fa-download"></i> Export
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive" style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Advertiser</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Status</th>
                <th>Reward</th>
                <th>Submissions</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.length === 0 && !loading ? (
                <tr>
                  <td colSpan="9" className="text-center">No tasks found</td>
                </tr>
              ) : currentTasks.map((task) => (
                <tr key={task._id} style={{ fontSize: '0.8rem' }}>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</td>
                  <td style={{ minWidth: '120px' }}>{task.advertiser?.first_name} {task.advertiser?.last_name}</td>
                  <td style={{ minWidth: '100px' }}>{task.category || 'N/A'}</td>
                  <td style={{ minWidth: '120px' }}>{task.sub_category || 'N/A'}</td>
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
                  <td>₦{task.reward?.amount_per_worker?.toLocaleString() || 0}</td>
                  <td>{task.submissions}</td>
                  <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td style={{ position: 'relative' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDropdown(showDropdown === task._id ? null : task._id);
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                    >
                      <i className="fas fa-ellipsis-v" style={{ color: 'var(--dh-text)' }}></i>
                    </button>
                    {showDropdown === task._id ? (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: '10px',
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        minWidth: '180px',
                        marginTop: '4px',
                        overflow: 'hidden'
                      }}>
                        <div
                          onClick={() => handleTaskAction(task._id, 'view')}
                          style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f3f4f6' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          <i className="fas fa-eye" style={{ width: '16px' }}></i>
                          <span>View Task</span>
                        </div>
                        <div
                          onClick={() => handleTaskAction(task._id, 'submissions')}
                          style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f3f4f6' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          <i className="fas fa-list" style={{ width: '16px' }}></i>
                          <span>View Submissions</span>
                        </div>
                        <div
                          onClick={() => handleTaskAction(task._id, 'delete')}
                          style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                          <i className="fas fa-trash" style={{ width: '16px' }}></i>
                          <span>Delete</span>
                        </div>
                      </div>
                    ) : null}
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
        onConfirm={async () => {
          try {
            await api.delete(`/tasks/${showDeleteModal}/admins`);
            setTasks(prev => prev.filter(t => t._id !== showDeleteModal));
            setShowDeleteModal(null);
          } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task');
          }
        }}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
    </>
  );
}