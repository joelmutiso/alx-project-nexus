import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // We standardized on 'access_token' in our previous dashboard code
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    
    if (token) {
      // Standard JWTs (which your Django backend uses) use 'Bearer'
      const authPrefix = token.includes('.') ? 'Bearer' : 'Token';
      config.headers.Authorization = `${authPrefix} ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;