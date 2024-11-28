import axios from 'axios';

const api = axios.create({
  // Altere a baseURL para usar HTTPS e o subdomínio api
  baseURL: 'https://api.wesleydionisio.online',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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