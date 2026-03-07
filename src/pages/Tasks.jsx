import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import Spinner from "../components/Spinner";
import { api } from "../services/api";
import { exportToCSV } from "../utils/exportUtils";
import { toast } from "../components/Toast";

const CATEGORY_OPTIONS = [
  "Bank App Download (Special)",
];

const SUB_CATEGORY_OPTIONS = [
  "Mobile App Download",
  "Mobile App Download & Signup",
  "Mobile App Download & Signup + Deposit",
  "Signup & Review",
  "Mobile App Download, Signup & Review",
  "Mobile App Download, KYC Signup & Additional Task",
];

const MIN_DURATION_OPTIONS = [
  "Less than 1 minute",
  "1-5 minutes",
  "5-10 minutes",
  "10-30 minutes",
  "30-60 minutes",
  "More than 1 hour",
];

const APPROVAL_MODE_OPTIONS = [
  { label: "Self Approval", value: "Self" },
  { label: "Platform Approval", value: "Platform" },
];

const INITIAL_FORM = {
  advertiser_id: "",
  category: "",
  sub_category: "",
  title: "",
  description: "",
  instructions: "",
  amount_per_worker: "",
  workers_needed: "",
  min_duration: "",
  approval_days: "",
  approval_mode: "",
  screenshot_src: "",
  job_link: "",
  reward_currency: "NGN",
};

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

  // Create drawer state
  const [showDrawer, setShowDrawer] = useState(false);
  const [employers, setEmployers] = useState([]);
  const [employersLoading, setEmployersLoading] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const descEditorId = 'tinymce-description';
  const instrEditorId = 'tinymce-instructions';

  // Edit drawer state
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editMinValues, setEditMinValues] = useState({ amount_per_worker: 0, workers_needed: 0 });
  const [editScreenshotPreview, setEditScreenshotPreview] = useState(null);
  const [editUploadingFile, setEditUploadingFile] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const editFileInputRef = useRef(null);
  const editDescEditorId = 'tinymce-edit-description';
  const editInstrEditorId = 'tinymce-edit-instructions';

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

  // Lock body scroll when drawer is open + init TinyMCE
  useEffect(() => {
    if (showDrawer) {
      document.body.style.overflow = 'hidden';
      fetchEmployers();

      // Init TinyMCE after the DOM elements are rendered
      const timer = setTimeout(() => {
        const tinyMCEConfig = {
          menubar: false,
          plugins: 'lists link',
          toolbar: 'bold italic underline | bullist numlist | link',
          skin: document.body.classList.contains('dark') ? 'oxide-dark' : 'oxide',
          content_css: document.body.classList.contains('dark') ? 'dark' : 'default',
          min_height: 180,
          branding: false,
          resize: true,
        };
        if (window.tinymce) {
          window.tinymce.init({
            ...tinyMCEConfig,
            selector: `#${descEditorId}`,
            setup: (editor) => {
              editor.on('change keyup', () => {
                const content = editor.getContent();
                setForm(prev => ({ ...prev, description: content }));
              });
            },
          });
          window.tinymce.init({
            ...tinyMCEConfig,
            selector: `#${instrEditorId}`,
            setup: (editor) => {
              editor.on('change keyup', () => {
                const content = editor.getContent();
                setForm(prev => ({ ...prev, instructions: content }));
              });
            },
          });
        }
      }, 300);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        if (window.tinymce) {
          window.tinymce.remove(`#${descEditorId}`);
          window.tinymce.remove(`#${instrEditorId}`);
        }
      };
    } else {
      document.body.style.overflow = '';
      if (window.tinymce) {
        window.tinymce.remove(`#${descEditorId}`);
        window.tinymce.remove(`#${instrEditorId}`);
      }
    }
    return () => { document.body.style.overflow = ''; };
  }, [showDrawer]);

  // Edit drawer body scroll + TinyMCE
  useEffect(() => {
    if (showEditDrawer && editTask) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        const tinyMCEConfig = {
          menubar: false,
          plugins: 'lists link',
          toolbar: 'bold italic underline | bullist numlist | link',
          skin: document.body.classList.contains('dark') ? 'oxide-dark' : 'oxide',
          content_css: document.body.classList.contains('dark') ? 'dark' : 'default',
          min_height: 180,
          branding: false,
          resize: true,
        };
        if (window.tinymce) {
          window.tinymce.init({
            ...tinyMCEConfig,
            selector: `#${editDescEditorId}`,
            setup: (editor) => {
              editor.on('init', () => editor.setContent(editForm.description || ''));
              editor.on('change keyup', () => {
                const content = editor.getContent();
                setEditForm(prev => ({ ...prev, description: content }));
              });
            },
          });
          window.tinymce.init({
            ...tinyMCEConfig,
            selector: `#${editInstrEditorId}`,
            setup: (editor) => {
              editor.on('init', () => editor.setContent(editForm.instructions || ''));
              editor.on('change keyup', () => {
                const content = editor.getContent();
                setEditForm(prev => ({ ...prev, instructions: content }));
              });
            },
          });
        }
      }, 300);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        if (window.tinymce) {
          window.tinymce.remove(`#${editDescEditorId}`);
          window.tinymce.remove(`#${editInstrEditorId}`);
        }
      };
    } else {
      document.body.style.overflow = showDrawer ? 'hidden' : '';
      if (window.tinymce) {
        window.tinymce.remove(`#${editDescEditorId}`);
        window.tinymce.remove(`#${editInstrEditorId}`);
      }
    }
  }, [showEditDrawer, editTask]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await api.get('/tasks/admins', { params });

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

  const fetchEmployers = async () => {
    try {
      setEmployersLoading(true);
      const response = await api.get('/advertisers/admins', {
        params: { limitNo: 1000, status: true },
      });
      let list = [];
      if (response.data.data && Array.isArray(response.data.data.data)) {
        list = response.data.data.data;
      } else if (Array.isArray(response.data.data)) {
        list = response.data.data;
      }
      setEmployers(list);
    } catch (err) {
      console.error('Error fetching employers:', err);
      toast.error('Failed to load employers');
    } finally {
      setEmployersLoading(false);
    }
  };

  const handleExport = async () => {
    const columns = ['title', 'advertiser', 'category', 'sub_category', 'status', 'reward', 'submissions', 'createdAt'];
    const result = await exportToCSV('/tasks/admins', columns, 'tasks.csv', { search: searchTerm });
    if (result.success) {
      toast.success('Tasks exported successfully');
    } else {
      toast.error('Failed to export tasks');
    }
  };

  const handleTaskAction = (taskId, action, taskObj) => {
    if (action === 'view') {
      navigate(`/tasks/${taskId}`);
    } else if (action === 'submissions') {
      navigate(`/tasks/${taskId}/submissions`);
    } else if (action === 'delete') {
      setShowDeleteModal(taskId);
    } else if (action === 'edit') {
      handleOpenEdit(taskObj);
    }
    setShowDropdown(null);
  };

  const handleOpenEdit = (task) => {
    const apw = task.reward?.amount_per_worker || 0;
    const max = task.slots?.max || 0;
    const existingScreenshot = Array.isArray(task.attachment) ? task.attachment[0] : '';
    setEditTask(task);
    setEditMinValues({ amount_per_worker: apw, workers_needed: max });
    setEditForm({
      title: task.title || '',
      description: task.description || '',
      instructions: task.instructions || '',
      amount_per_worker: apw,
      workers_needed: max,
      min_duration: task.min_duration || '',
      approval_days: task.approval?.num_days || '',
      approval_mode: task.approval?.mode || '',
      screenshot_src: existingScreenshot || '',
      job_link: task.task_site || '',
    });
    setEditScreenshotPreview(existingScreenshot || null);
    setShowEditDrawer(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditDrawerClose = () => {
    setShowEditDrawer(false);
    setEditTask(null);
    setEditForm({});
    setEditScreenshotPreview(null);
  };

  const handleEditFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditScreenshotPreview(URL.createObjectURL(file));
    try {
      setEditUploadingFile(true);
      const formData = new FormData();
      formData.append('files', file);
      const response = await api.post('/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const src = response.data.data?.[0]?.src || '';
      setEditForm(prev => ({ ...prev, screenshot_src: src }));
      toast.success('Screenshot uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload screenshot');
      setEditScreenshotPreview(editForm.screenshot_src || null);
    } finally {
      setEditUploadingFile(false);
    }
  };

  const handleEditRemoveScreenshot = () => {
    setEditScreenshotPreview(null);
    setEditForm(prev => ({ ...prev, screenshot_src: '' }));
    if (editFileInputRef.current) editFileInputRef.current.value = '';
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.title) { toast.error('Please enter a title'); return; }
    if (!editForm.description) { toast.error('Please enter a description'); return; }
    if (!editForm.instructions) { toast.error('Please enter instructions'); return; }
    if (!editForm.amount_per_worker) { toast.error('Please enter amount per worker'); return; }
    if (!editForm.workers_needed) { toast.error('Please enter workers needed'); return; }
    if (!editForm.min_duration) { toast.error('Please select a minimum duration'); return; }
    if (!editForm.approval_days) { toast.error('Please enter approval days'); return; }
    if (!editForm.approval_mode) { toast.error('Please select an approval mode'); return; }

    const apw = parseFloat(editForm.amount_per_worker);
    const wn = parseInt(editForm.workers_needed, 10);
    const subtotal = apw * wn;
    const platformFee = subtotal * 0.15;
    const totalAmount = subtotal + platformFee;

    const payload = {
      title: editForm.title,
      description: editForm.description,
      instructions: editForm.instructions,
      reward: {
        currency: 'NGN',
        amount: subtotal,
        amount_per_worker: apw,
      },
      slots: { max: wn },
      min_duration: editForm.min_duration,
      approval: {
        num_days: parseInt(editForm.approval_days, 10),
        mode: editForm.approval_mode,
      },
      is_screenshot_required: !!editForm.screenshot_src,
      attachment: editForm.screenshot_src ? [editForm.screenshot_src] : [],
      task_site: editForm.job_link || undefined,
      total_amount: totalAmount,
    };

    try {
      setEditSubmitting(true);
      await api.patch(`/tasks/${editTask._id}/admins`, payload);
      toast.success('Task updated successfully!');
      handleEditDrawerClose();
      fetchTasks();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task';
      toast.error(msg);
    } finally {
      setEditSubmitting(false);
    }
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));

    // Upload immediately
    try {
      setUploadingFile(true);
      const formData = new FormData();
      formData.append('files', file);
      const response = await api.post('/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const src = response.data.data?.[0]?.src || '';
      setForm(prev => ({ ...prev, screenshot_src: src }));
      toast.success('Screenshot uploaded successfully');
    } catch (err) {
      console.error('Error uploading file:', err);
      toast.error('Failed to upload screenshot');
      setScreenshotFile(null);
      setScreenshotPreview(null);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setForm(prev => ({ ...prev, screenshot_src: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrawerClose = () => {
    setShowDrawer(false);
    setForm(INITIAL_FORM);
    setScreenshotFile(null);
    setScreenshotPreview(null);
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();

    if (!form.advertiser_id) { toast.error('Please select an employer'); return; }
    if (!form.title) { toast.error('Please enter a title'); return; }
    if (!form.description) { toast.error('Please enter a description'); return; }
    if (!form.instructions) { toast.error('Please enter instructions'); return; }
    if (!form.amount_per_worker) { toast.error('Please enter amount per worker'); return; }
    if (!form.workers_needed) { toast.error('Please enter workers needed'); return; }
    if (!form.min_duration) { toast.error('Please select a minimum duration'); return; }
    if (!form.approval_days) { toast.error('Please enter approval days'); return; }
    if (!form.approval_mode) { toast.error('Please select an approval mode'); return; }

    const amountPerWorker = parseFloat(form.amount_per_worker);
    const workersNeeded = parseInt(form.workers_needed, 10);
    const subtotal = amountPerWorker * workersNeeded;
    const platformFee = subtotal * 0.15;
    const totalAmount = subtotal + platformFee;

    const payload = {
      advertiser_id: form.advertiser_id,
      title: form.title,
      description: form.description,
      category: form.category,
      sub_category: form.sub_category,
      instructions: form.instructions,
      country: "Nigeria",
      reward: {
        currency: form.reward_currency || "NGN",
        amount: subtotal,
        amount_per_worker: amountPerWorker,
      },
      slots: {
        max: workersNeeded,
      },
      is_screenshot_required: !!form.screenshot_src,
      approval: {
        num_days: parseInt(form.approval_days, 10),
        mode: form.approval_mode,
      },
      attachment: form.screenshot_src ? [form.screenshot_src] : [],
      task_site: form.job_link || undefined,
      min_duration: form.min_duration,
      total_amount: totalAmount,
    };

    try {
      setSubmitting(true);
      await api.post('/tasks/admins', payload);
      toast.success('Special task created successfully!');
      handleDrawerClose();
      fetchTasks();
    } catch (err) {
      console.error('Error creating special task:', err);
      const msg = err.response?.data?.message || 'Failed to create special task';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="card-title">Tasks Management</h1>
        <span className="badge badge-primary">{filteredTasks.length}</span>
      </div>

      {/* Filters */}
      <div className="d-flex justify-content-between align-items-center mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className="d-flex gap-3" style={{ flexWrap: 'wrap' }}>
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
        <div className="d-flex gap-3">
          <button
            className="btn btn-primary"
            onClick={() => setShowDrawer(true)}
            style={{ whiteSpace: 'nowrap' }}
          >
            <i className="fas fa-plus"></i> Create Special Task
          </button>
          <button className="btn btn-outline" onClick={handleExport}>
            <i className="fas fa-download"></i> Export
          </button>
        </div>
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
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    <Spinner />
                  </td>
                </tr>
              ) : currentTasks.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">No tasks found</td>
                </tr>
              ) : currentTasks.map((task, index) => (
                <tr key={task._id} style={{ fontSize: '0.8rem' }}>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</td>
                  <td style={{ minWidth: '120px' }}>{task.advertiser?.first_name} {task.advertiser?.last_name}</td>
                  <td style={{ minWidth: '100px' }}>{task.category || 'N/A'}</td>
                  <td style={{ minWidth: '120px' }}>{task.sub_category || 'N/A'}</td>
                  <td>
                    <span className={`badge ${task.status === 'active' ? 'badge-success' :
                      task.status === 'paused' ? 'badge-warning' :
                        'badge-primary'
                      }`}>
                      <i className={`fas ${task.status === 'active' ? 'fa-play' :
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
                        ...(index >= currentTasks.length - 2 ? { bottom: '100%', marginBottom: '4px' } : { top: '100%', marginTop: '4px' }),
                        right: '10px',
                        background: 'var(--dh-card-bg)',
                        border: '1px solid var(--dh-border)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        minWidth: '180px',
                        overflow: 'hidden'
                      }}>
                        <div
                          onClick={() => handleTaskAction(task._id, 'view', task)}
                          style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--dh-border)' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dh-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <i className="fas fa-eye" style={{ width: '16px' }}></i>
                          <span>View Task</span>
                        </div>
                        <div
                          onClick={() => handleTaskAction(task._id, 'submissions', task)}
                          style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--dh-border)' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dh-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <i className="fas fa-list" style={{ width: '16px' }}></i>
                          <span>View Submissions</span>
                        </div>
                        {task.is_admin_created && (
                          <div
                            onClick={() => handleTaskAction(task._id, 'edit', task)}
                            style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--dh-border)' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dh-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <i className="fas fa-pencil-alt" style={{ width: '16px' }}></i>
                            <span>Edit Task</span>
                          </div>
                        )}
                        <div
                          onClick={() => handleTaskAction(task._id, 'delete', task)}
                          style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dh-hover)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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

      {/* ── Create Special Task Drawer ── */}
      {showDrawer && (
        <div className="drawer-overlay" onClick={handleDrawerClose}>
          <div
            className="drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="drawer-header">
              <div>
                <h2 className="drawer-title">Create Special Task</h2>
                <p className="drawer-subtitle">Fill in the details below to create a special task for an employer.</p>
              </div>
              <button className="drawer-close-btn" onClick={handleDrawerClose} aria-label="Close drawer">
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Drawer Body */}
            <form className="drawer-body" onSubmit={handleSubmitTask}>

              {/* Employer */}
              <div className="form-group">
                <label className="form-label">
                  Employer <span style={{ color: 'var(--dh-danger)' }}>*</span>
                </label>
                {employersLoading ? (
                  <div style={{ padding: '0.75rem', color: 'var(--dh-muted)', fontSize: '0.9rem' }}>
                    <i className="fas fa-spinner fa-spin"></i> Loading employers...
                  </div>
                ) : (
                  <select
                    className="form-control"
                    name="advertiser_id"
                    value={form.advertiser_id}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select an employer</option>
                    {employers.map(emp => (
                      <option key={emp._id} value={emp._id}>
                        {emp.first_name} {emp.last_name} — {emp.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Category & Sub Category */}
              <div className="drawer-row">
                <div className="form-group">
                  <label className="form-label">
                    Category <span style={{ color: 'var(--dh-danger)' }}>*</span>
                  </label>
                  <select
                    className="form-control"
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Sub Category <span style={{ color: 'var(--dh-danger)' }}>*</span>
                  </label>
                  <select
                    className="form-control"
                    name="sub_category"
                    value={form.sub_category}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select sub category</option>
                    {SUB_CATEGORY_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div className="form-group">
                <label className="form-label">
                  Title <span style={{ color: 'var(--dh-danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  placeholder="e.g. Download and Review Mobile Banking App"
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">
                  Description <span style={{ color: 'var(--dh-danger)' }}>*</span>
                </label>
                <textarea
                  id={descEditorId}
                  placeholder="Provide a detailed description of the task..."
                  defaultValue={form.description}
                  style={{ width: '100%', minHeight: '180px' }}
                />
                {!form.description && (
                  <input type="text" required style={{ opacity: 0, height: 0, position: 'absolute', pointerEvents: 'none' }} tabIndex={-1} />
                )}
              </div>

              {/* Instructions */}
              <div className="form-group">
                <label className="form-label">
                  Instructions <span style={{ color: 'var(--dh-danger)' }}>*</span>
                </label>
                <textarea
                  id={instrEditorId}
                  placeholder="Step-by-step instructions for workers..."
                  defaultValue={form.instructions}
                  style={{ width: '100%', minHeight: '180px' }}
                />
                {!form.instructions && (
                  <input type="text" required style={{ opacity: 0, height: 0, position: 'absolute', pointerEvents: 'none' }} tabIndex={-1} />
                )}
              </div>

              {/* Amount Per Worker & Workers Needed */}
              <div className="drawer-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">
                    Amount Per Worker (₦) <span style={{ color: 'var(--dh-danger)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount_per_worker"
                    value={form.amount_per_worker}
                    onChange={handleFormChange}
                    placeholder="e.g. 50"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">
                    Workers Needed <span style={{ color: 'var(--dh-danger)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="workers_needed"
                    value={form.workers_needed}
                    onChange={handleFormChange}
                    placeholder="e.g. 10"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Payment Summary */}
              {form.amount_per_worker && form.workers_needed && (() => {
                const apw = parseFloat(form.amount_per_worker) || 0;
                const wn = parseInt(form.workers_needed, 10) || 0;
                const sub = apw * wn;
                const fee = sub * 0.15;
                const tot = sub + fee;
                return (
                  <div className="payment-summary">
                    <h4 className="payment-summary-title">Payment Summary</h4>
                    <div className="payment-summary-row">
                      <span>Workers Needed</span>
                      <span>{wn.toLocaleString()}</span>
                    </div>
                    <div className="payment-summary-row">
                      <span>Amount Per Worker</span>
                      <span>NGN {apw.toLocaleString()}</span>
                    </div>
                    <div className="payment-summary-row">
                      <span>Platform Fee (15%)</span>
                      <span>NGN {fee.toLocaleString()}</span>
                    </div>
                    <div className="payment-summary-row payment-summary-total">
                      <span>Total Amount</span>
                      <span>NGN {tot.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Min Duration */}
              <div className="form-group">
                <label className="form-label">
                  Min Duration <span style={{ color: 'var(--dh-danger)' }}>*</span>
                </label>
                <select
                  className="form-control"
                  name="min_duration"
                  value={form.min_duration}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select duration</option>
                  {MIN_DURATION_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Approval Days & Approval Mode */}
              <div className="drawer-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">
                    Approval Days <span style={{ color: 'var(--dh-danger)' }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="approval_days"
                    value={form.approval_days}
                    onChange={handleFormChange}
                    placeholder="e.g. 3"
                    min="1"
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">
                    Approval Mode <span style={{ color: 'var(--dh-danger)' }}>*</span>
                  </label>
                  <select
                    className="form-control"
                    name="approval_mode"
                    value={form.approval_mode}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select mode</option>
                    {APPROVAL_MODE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Job Screenshot Sample */}
              <div className="form-group">
                <label className="form-label">Job Screenshot Sample</label>
                <div
                  className="file-upload-area"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: uploadingFile ? 'not-allowed' : 'pointer' }}
                >
                  {screenshotPreview ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={screenshotPreview}
                        alt="Screenshot preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '160px',
                          borderRadius: '8px',
                          objectFit: 'contain'
                        }}
                      />
                      {uploadingFile && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(255,255,255,0.7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px'
                        }}>
                          <i className="fas fa-spinner fa-spin" style={{ fontSize: '1.5rem', color: 'var(--dh-primary)' }}></i>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveScreenshot(); }}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: 'var(--dh-danger)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem'
                        }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                      <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: 'var(--dh-primary)', marginBottom: '0.5rem' }}></i>
                      <p style={{ color: 'var(--dh-muted)', fontSize: '0.875rem', margin: 0 }}>
                        Click to upload a screenshot sample
                      </p>
                      <p style={{ color: 'var(--dh-muted)', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  disabled={uploadingFile}
                />
              </div>

              {/* Job Link */}
              <div className="form-group">
                <label className="form-label">Job Link</label>
                <input
                  type="url"
                  className="form-control"
                  name="job_link"
                  value={form.job_link}
                  onChange={handleFormChange}
                  placeholder="https://example.com/task-url"
                />
              </div>

              {/* Reward Currency */}
              <div className="form-group">
                <label className="form-label">Reward Currency</label>
                <input
                  type="text"
                  className="form-control"
                  name="reward_currency"
                  value={form.reward_currency}
                  onChange={handleFormChange}
                  readOnly
                  style={{ background: 'var(--dh-hover)', cursor: 'not-allowed', opacity: 0.7 }}
                />
              </div>

              {/* Footer */}
              <div className="drawer-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleDrawerClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || uploadingFile}
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Creating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus"></i> Create Task
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── Edit Task Drawer ── */}
      {showEditDrawer && editTask && (
        <div className="drawer-overlay" onClick={handleEditDrawerClose}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="drawer-header">
              <div>
                <h2 className="drawer-title">Edit Task</h2>
                <p className="drawer-subtitle">Update the details of this admin-created task.</p>
              </div>
              <button className="drawer-close-btn" onClick={handleEditDrawerClose} aria-label="Close">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form className="drawer-body" onSubmit={handleEditSubmit}>

              {/* Title */}
              <div className="form-group">
                <label className="form-label">Title <span style={{ color: 'var(--dh-danger)' }}>*</span></label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditFormChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description <span style={{ color: 'var(--dh-danger)' }}>*</span></label>
                <textarea
                  id={editDescEditorId}
                  defaultValue={editForm.description}
                  style={{ width: '100%', minHeight: '180px' }}
                />
                {!editForm.description && (
                  <input type="text" required style={{ opacity: 0, height: 0, position: 'absolute', pointerEvents: 'none' }} tabIndex={-1} />
                )}
              </div>

              {/* Instructions */}
              <div className="form-group">
                <label className="form-label">Instructions <span style={{ color: 'var(--dh-danger)' }}>*</span></label>
                <textarea
                  id={editInstrEditorId}
                  defaultValue={editForm.instructions}
                  style={{ width: '100%', minHeight: '180px' }}
                />
                {!editForm.instructions && (
                  <input type="text" required style={{ opacity: 0, height: 0, position: 'absolute', pointerEvents: 'none' }} tabIndex={-1} />
                )}
              </div>

              {/* Amount Per Worker & Workers Needed */}
              <div className="drawer-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Amount Per Worker (₦) <span style={{ color: 'var(--dh-danger)' }}>*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount_per_worker"
                    value={editForm.amount_per_worker}
                    onChange={handleEditFormChange}
                    min={editMinValues.amount_per_worker}
                    required
                  />
                  <small style={{ color: 'var(--dh-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    Min: NGN {editMinValues.amount_per_worker.toLocaleString()}
                  </small>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Workers Needed <span style={{ color: 'var(--dh-danger)' }}>*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    name="workers_needed"
                    value={editForm.workers_needed}
                    onChange={handleEditFormChange}
                    min={editMinValues.workers_needed}
                    required
                  />
                  <small style={{ color: 'var(--dh-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                    Min: {editMinValues.workers_needed.toLocaleString()}
                  </small>
                </div>
              </div>

              {/* Payment Summary */}
              {editForm.amount_per_worker && editForm.workers_needed && (() => {
                const apw = parseFloat(editForm.amount_per_worker) || 0;
                const wn = parseInt(editForm.workers_needed, 10) || 0;
                const sub = apw * wn;
                const fee = sub * 0.15;
                const tot = sub + fee;
                return (
                  <div className="payment-summary">
                    <h4 className="payment-summary-title">Payment Summary</h4>
                    <div className="payment-summary-row">
                      <span>Workers Needed</span>
                      <span>{wn.toLocaleString()}</span>
                    </div>
                    <div className="payment-summary-row">
                      <span>Amount Per Worker</span>
                      <span>NGN {apw.toLocaleString()}</span>
                    </div>
                    <div className="payment-summary-row">
                      <span>Platform Fee (15%)</span>
                      <span>NGN {fee.toLocaleString()}</span>
                    </div>
                    <div className="payment-summary-row payment-summary-total">
                      <span>Total Amount</span>
                      <span>NGN {tot.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Min Duration */}
              <div className="form-group">
                <label className="form-label">Min Duration <span style={{ color: 'var(--dh-danger)' }}>*</span></label>
                <select
                  className="form-control"
                  name="min_duration"
                  value={editForm.min_duration}
                  onChange={handleEditFormChange}
                  required
                >
                  <option value="">Select duration</option>
                  {MIN_DURATION_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Approval Days & Mode */}
              <div className="drawer-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Approval Days <span style={{ color: 'var(--dh-danger)' }}>*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    name="approval_days"
                    value={editForm.approval_days}
                    onChange={handleEditFormChange}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Approval Mode <span style={{ color: 'var(--dh-danger)' }}>*</span></label>
                  <select
                    className="form-control"
                    name="approval_mode"
                    value={editForm.approval_mode}
                    onChange={handleEditFormChange}
                    required
                  >
                    <option value="">Select mode</option>
                    {APPROVAL_MODE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Job Screenshot Sample */}
              <div className="form-group">
                <label className="form-label">Job Screenshot Sample</label>
                <div
                  className="file-upload-area"
                  onClick={() => editFileInputRef.current?.click()}
                  style={{ cursor: editUploadingFile ? 'not-allowed' : 'pointer' }}
                >
                  {editScreenshotPreview ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={editScreenshotPreview}
                        alt="Screenshot preview"
                        style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px', objectFit: 'contain' }}
                      />
                      {editUploadingFile && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                          <i className="fas fa-spinner fa-spin" style={{ fontSize: '1.5rem', color: 'var(--dh-primary)' }}></i>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleEditRemoveScreenshot(); }}
                        style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--dh-danger)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                      <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: 'var(--dh-primary)', marginBottom: '0.5rem' }}></i>
                      <p style={{ color: 'var(--dh-muted)', fontSize: '0.875rem', margin: 0 }}>Click to upload a screenshot sample</p>
                      <p style={{ color: 'var(--dh-muted)', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={editFileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleEditFileChange}
                  disabled={editUploadingFile}
                />
              </div>

              {/* Job Link */}
              <div className="form-group">
                <label className="form-label">Job Link</label>
                <input
                  type="url"
                  className="form-control"
                  name="job_link"
                  value={editForm.job_link}
                  onChange={handleEditFormChange}
                  placeholder="https://example.com/task-url"
                />
              </div>

              {/* Footer */}
              <div className="drawer-footer">
                <button type="button" className="btn btn-outline" onClick={handleEditDrawerClose} disabled={editSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={editSubmitting || editUploadingFile}>
                  {editSubmitting ? (
                    <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                  ) : (
                    <><i className="fas fa-save"></i> Save Changes</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}