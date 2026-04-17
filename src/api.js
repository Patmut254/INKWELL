import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      const refresh = localStorage.getItem('refresh');
      if (refresh) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh/`, { refresh });
          localStorage.setItem('access', res.data.access);
          err.config.headers.Authorization = `Bearer ${res.data.access}`;
          return api(err.config);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login/', data),
  register: (data) => api.post('/auth/register/', data),
  verifyEmail: (data) => api.post('/auth/verify-email/', data),
  resendVerification: (data) => api.post('/auth/resend-verification/', data),
  me: () => api.get('/auth/me/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
};

export const postsAPI = {
  getAll: (params) => api.get('/posts/', { params }),
  getOne: (id) => api.get(`/posts/${id}/`),
  create: (data) => api.post('/posts/', data),
  update: (id, data) => api.patch(`/posts/${id}/`, data),
  delete: (id) => api.delete(`/posts/${id}/`),
  like: (id) => api.post(`/posts/${id}/like/`),
  myPosts: () => api.get('/posts/my_posts/'),
  trending: () => api.get('/posts/trending/'),
};

export const commentsAPI = {
  getAll: (postId) => api.get(`/posts/${postId}/comments/`),
  create: (postId, data) => api.post(`/posts/${postId}/comments/`, data),
  update: (postId, commentId, data) => api.patch(`/posts/${postId}/comments/${commentId}/`, data),
  delete: (postId, commentId) => api.delete(`/posts/${postId}/comments/${commentId}/`),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories/'),
  create: (data) => api.post('/categories/', data),
  update: (id, data) => api.patch(`/categories/${id}/`, data),
  delete: (id) => api.delete(`/categories/${id}/`),
};

export const adminAPI = {
  getUsers: () => api.get('/admin/users/'),
  deleteUser: (id) => api.delete(`/admin/users/${id}/delete/`),
  toggleStaff: (id) => api.patch(`/admin/users/${id}/toggle-staff/`),
  getStats: () => api.get('/admin/stats/'),
  getContacts: () => api.get('/admin/contacts/'),
  markContactRead: (id) => api.patch(`/admin/contacts/${id}/read/`),
};

export const contactAPI = {
  send: (data) => api.post('/contact/', data),
};

export default api;
