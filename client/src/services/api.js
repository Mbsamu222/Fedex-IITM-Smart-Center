import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public API calls
export const publicApi = {
  getHero: () => api.get('/hero'),
  getStats: () => api.get('/stats'),
  getResearchAreas: () => api.get('/research-areas'),
  getProjects: (featured) => api.get('/projects', { params: { featured, public: true } }),
  getProject: (idOrSlug) => api.get(`/projects/${idOrSlug}`),
  getEvents: (params) => api.get('/events', { params }),
  getEvent: (slug) => api.get(`/events/slug/${slug}`),
  getActivities: (params) => api.get('/activities', { params }),
  getNews: (params) => api.get('/news', { params }),
  getBlogs: (params) => api.get('/blogs', { params }),
  getPublications: (params) => api.get('/publications', { params }),
  getTeam: (category) => api.get('/team', { params: { category } }),
  getGallery: (category) => api.get('/gallery', { params: { category } }),
  getContact: () => api.get('/contact'),
  getSettings: () => api.get('/settings'),
  submitContact: (data) => api.post('/contact/message', data),
};

// Admin API calls
export const adminApi = {
  // Auth
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),

  // Hero
  getHeroAll: () => api.get('/hero/all'),
  createHero: (data) => api.post('/hero', data),
  updateHero: (id, data) => api.put(`/hero/${id}`, data),
  deleteHero: (id) => api.delete(`/hero/${id}`),

  // Stats
  getStats: () => api.get('/stats'),
  createStat: (data) => api.post('/stats', data),
  updateStat: (id, data) => api.put(`/stats/${id}`, data),
  deleteStat: (id) => api.delete(`/stats/${id}`),

  // Research Areas
  getResearchAreas: () => api.get('/research-areas'),
  createResearchArea: (data) => api.post('/research-areas', data),
  updateResearchArea: (id, data) => api.put(`/research-areas/${id}`, data),
  deleteResearchArea: (id) => api.delete(`/research-areas/${id}`),

  // Projects
  getProjects: () => api.get('/projects'),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),

  // Events
  getEvents: () => api.get('/events'),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),

  // Activities
  getActivities: () => api.get('/activities'),
  createActivity: (data) => api.post('/activities', data),
  updateActivity: (id, data) => api.put(`/activities/${id}`, data),
  deleteActivity: (id) => api.delete(`/activities/${id}`),

  // News & Updates
  getNews: () => api.get('/news'),
  createNews: (data) => api.post('/news', data),
  updateNews: (id, data) => api.put(`/news/${id}`, data),
  deleteNews: (id) => api.delete(`/news/${id}`),

  // Blogs
  getBlogs: () => api.get('/blogs/all'),
  createBlog: (data) => api.post('/blogs', data),
  updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),

  // Publications
  getPublications: () => api.get('/publications'),
  createPublication: (data) => api.post('/publications', data),
  updatePublication: (id, data) => api.put(`/publications/${id}`, data),
  deletePublication: (id) => api.delete(`/publications/${id}`),

  // Team
  getTeam: (category) => api.get('/team', { params: { category } }),
  createTeamMember: (data) => api.post('/team', data),
  updateTeamMember: (id, data) => api.put(`/team/${id}`, data),
  deleteTeamMember: (id) => api.delete(`/team/${id}`),

  // Gallery
  getGallery: () => api.get('/gallery'),
  createGalleryImage: (data) => api.post('/gallery', data),
  updateGalleryImage: (id, data) => api.put(`/gallery/${id}`, data),
  deleteGalleryImage: (id) => api.delete(`/gallery/${id}`),

  // Contact Messages
  getMessages: () => api.get('/contact/messages'),
  markMessageRead: (id) => api.put(`/contact/messages/${id}/read`),
  deleteMessage: (id) => api.delete(`/contact/messages/${id}`),

  // Settings
  getSettings: () => api.get('/settings'),
  updateSettings: (data) => api.put('/settings', data),

  // File Upload
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads')) {
    const backendUrl = API_BASE_URL.replace('/api', '');
    return `${backendUrl}${url}`;
  }
  return url;
};

export default api;
