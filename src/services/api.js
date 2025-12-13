import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getAdmins: (params) => api.get('/users/admins', { params }),
  getById: (id) => api.get(`/users/${id}/admins`),
  getUserStats: () => api.get('/users/stats/admins'),
  update: (id, data) => api.patch(`/users/${id}/admins`, data),
  delete: (id) => api.delete(`/users/${id}`),
}

// Tasks API
export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  getById: (id) => api.get(`/tasks/${id}`),
  getPending: () => api.get('/tasks/pending'),
  approve: (id) => api.put(`/tasks/${id}/approve`),
  reject: (id, reason) => api.put(`/tasks/${id}/reject`, { reason }),
  delete: (id) => api.delete(`/tasks/${id}`),
  approveSubmission: (taskProofId) => api.post('/tasks/submissions/admins', { admin_approval_status: 'approved', task_proof_id: taskProofId }),
  rejectSubmission: (taskProofId, rejectionReason) => api.post('/tasks/submissions/admins', { approval_status: 'resubmit', task_proof_id: taskProofId, rejection_reason: rejectionReason }),
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivity: () => api.get('/dashboard/activity'),
}

// Auth API
export const authAPI = {
  login: (identifier, password) => api.post('/auths/admins/login', { identifier, password }),
  validateLogin: (identifier, password, token) => api.post('/auths/admins/validate-login', { identifier, password, token }),
}

// Advertisers API
export const advertisersAPI = {
  getAll: (params) => api.get('/advertisers/admins', { params }),
  getById: (id) => api.get(`/advertisers/${id}/admins`),
  getStats: () => api.get('/advertisers/stats/admins'),
  update: (id, data) => api.patch(`/advertisers/${id}/admins`, data),
}

export { api, API_BASE_URL }
export default api