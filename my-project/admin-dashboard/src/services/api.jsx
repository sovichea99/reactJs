import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Accept': 'application/json',
    // We'll remove 'Content-Type' from the default headers because axios will automatically set it for multipart/form-data
  }
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // If the request contains form data, don't set Content-Type manually
  if (config.headers['Content-Type'] === 'multipart/form-data') {
    delete config.headers['Content-Type'];
  }

  return config;
});

export default api;
