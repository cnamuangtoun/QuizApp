import axios from 'axios';

const baseURL = 'http://localhost:8000/api/';

const API = axios.create({
  baseURL: baseURL,
  
  headers: {
    'Content-Type': 'application/json'
  }
});

API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default API;