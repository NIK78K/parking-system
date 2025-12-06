import axios from 'axios';
import { API_URL, getToken, removeToken, removeUser } from '../config/config';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  // withCredentials: true, // Disable for token-based auth
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      removeToken();
      removeUser();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
};

// Parking API
export const parkingAPI = {
  checkIn: (data) => api.post('/parking/check-in', data),
  checkOut: (qrCode, data) => api.post('/parking/check-out', { qr_code: qrCode, ...data }),
  scanQR: (qrCode) => api.get(`/parking/scan/${qrCode}`),
  getActive: () => api.get('/parking/active'),
  getHistory: (params) => api.get('/parking/history', { params }),
  getTransaction: (id) => api.get(`/parking/transaction/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Rates API
export const ratesAPI = {
  getAll: () => api.get('/rates'),
  getOne: (id) => api.get(`/rates/${id}`),
  update: (id, data) => api.put(`/rates/${id}`, data),
};

// Reports API
export const reportsAPI = {
  getDaily: (params) => api.get('/reports/daily', { params }),
  getMonthly: (params) => api.get('/reports/monthly', { params }),
  export: (params) => api.get('/reports/export', { params }),
};

export default api;
