// ============================================================
// Axios API Client Configuration
// ============================================================
// Centralized HTTP client that all components use to
// communicate with the API Gateway. Automatically
// attaches JWT tokens to authenticated requests.
// ============================================================

import axios from 'axios';

// Dynamic API URL detection: Uses env var if set, otherwise falls back to current hostname
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:4000`;
// Dynamic Socket URL detection
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || `http://${window.location.hostname}:4005`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ---- Request Interceptor ----
// Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartbite_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Response Interceptor ----
// Handle 401 errors (expired/invalid tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smartbite_token');
      localStorage.removeItem('smartbite_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
