import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
});

// Interceptor: Antes de qualquer requisição sair do Front-end, ele faz isto:
api.interceptors.request.use(config => {
  // Procura no localStorage PRIMEIRO. Se não achar, procura no sessionStorage.
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;