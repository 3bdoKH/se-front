import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

// Product APIs
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  getFeatured: () => API.get('/products/featured/list'),
  getByCategory: (categoryId) => API.get(`/products/category/${categoryId}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
  addReview: (id, data) => API.post(`/products/${id}/review`, data),
};

// Category APIs
export const categoryAPI = {
  getAll: () => API.get('/products/categories/all'),
  create: (data) => API.post('/products/categories', data),
  update: (id, data) => API.put(`/products/categories/${id}`, data),
  delete: (id) => API.delete(`/products/categories/${id}`),
};

// Cart APIs
export const cartAPI = {
  get: () => API.get('/cart'),
  add: (data) => API.post('/cart/add', data),
  update: (itemId, data) => API.put(`/cart/update/${itemId}`, data),
  remove: (itemId) => API.delete(`/cart/remove/${itemId}`),
  clear: () => API.delete('/cart/clear'),
};

// Order APIs
export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/my-orders'),
  getById: (id) => API.get(`/orders/${id}`),
  cancel: (id) => API.put(`/orders/${id}/cancel`),
  getAll: (params) => API.get('/orders', { params }),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: (params) => API.get('/admin/users', { params }),
  blockUser: (id) => API.put(`/admin/users/${id}/block`),
  updateUserRole: (id, data) => API.put(`/admin/users/${id}/role`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getSales: (params) => API.get('/admin/sales', { params }),
  getInventoryAlerts: (params) => API.get('/admin/inventory-alerts', { params }),
};

export default API;

