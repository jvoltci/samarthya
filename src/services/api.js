import axios from 'axios';

// Create a new axios instance
const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8080/api/v1',
  baseURL: 'https://samarthyax.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
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

export default axiosInstance;
