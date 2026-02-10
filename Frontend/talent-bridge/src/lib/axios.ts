import axios from 'axios';

const api = axios.create({
  baseURL: 'https://talent-bridge-backend-detd.onrender.com/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🚀 THE FIX: This "Interceptor" runs before EVERY request
api.interceptors.request.use(
  (config) => {
    // Look for the token in local storage right now
    const token = localStorage.getItem('token') || localStorage.getItem('access_token');
    
    if (token) {
      // Attach the fresh token to the header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;