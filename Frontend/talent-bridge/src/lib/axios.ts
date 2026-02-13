import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/',
  timeout: 10000, // 10 seconds timeout is standard
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // Standardize to Bearer for JWT (Django SimpleJWT)
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;