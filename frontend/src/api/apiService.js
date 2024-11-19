// src/api/apiService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para logging
api.interceptors.request.use(request => {
  console.log('Request:', {
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers
  });
  return request;
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token anexado ao header:', config.headers.Authorization);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com respostas de erro 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Remover token e redirecionar para login se o token for inválido ou expirado
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;