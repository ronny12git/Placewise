import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.get('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateDetails: (data) => api.put('/auth/updatedetails', data),
  updatePassword: (data) => api.put('/auth/updatepassword', data),
  forgotPassword: (data) => api.post('/auth/forgotpassword', data),
  resetPassword: (token, data) => api.put(`/auth/resetpassword/${token}`, data),
};

// Profile API calls
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  uploadResume: (formData) =>
    api.post('/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadProfileImage: (formData) =>
    api.post('/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getPublicProfile: (id) => api.get(`/profile/${id}`),
};

// Company API calls
export const companyAPI = {
  createCompany: (data) => api.post('/companies', data),
  getCompanies: () => api.get('/companies'),
  getCompany: (id) => api.get(`/companies/${id}`),
  getMyCompany: () => api.get('/companies/my/company'),
  updateCompany: (id, data) => api.put(`/companies/${id}`, data),
  deleteCompany: (id) => api.delete(`/companies/${id}`),
  uploadLogo: (id, formData) =>
    api.post(`/companies/${id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Job API calls
export const jobAPI = {
  createJob: (data) => api.post('/jobs', data),
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/my/jobs'),
  getRecommendedJobs: () => api.get('/jobs/recommended'),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
};

// Application API calls
export const applicationAPI = {
  applyForJob: (jobId, data) => api.post(`/applications/${jobId}`, data),
  getMyApplications: () => api.get('/applications/my'),
  getJobApplications: (jobId, params) =>
    api.get(`/applications/job/${jobId}`, { params }),
  getApplication: (id) => api.get(`/applications/${id}`),
  updateApplicationStatus: (id, data) =>
    api.put(`/applications/${id}/status`, data),
  deleteApplication: (id) => api.delete(`/applications/${id}`),
  getApplicationStats: () => api.get('/applications/stats/overview'),
};

// Saved Jobs API calls
export const savedJobAPI = {
  saveJob: (jobId) => api.post(`/saved-jobs/${jobId}`),
  getSavedJobs: () => api.get('/saved-jobs'),
  unsaveJob: (jobId) => api.delete(`/saved-jobs/${jobId}`),
  checkSavedJob: (jobId) => api.get(`/saved-jobs/check/${jobId}`),
};

// Admin API calls
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/stats'),
  getAllUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllCompanies: (params) => api.get('/admin/companies', { params }),
  approveCompany: (id, data) => api.put(`/admin/companies/${id}/approve`, data),
  getAllJobs: (params) => api.get('/admin/jobs', { params }),
  approveJob: (id, data) => api.put(`/admin/jobs/${id}/approve`, data),
  getAllApplications: (params) => api.get('/admin/applications', { params }),
};

export default api;
