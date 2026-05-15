import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor: adiciona o token JWT automaticamente em toda requisicao
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: se 401/403, limpa sessao e manda pro login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      const path = window.location.pathname;
      // Só redireciona se já não está em uma página pública
      if (path !== '/login' && path !== '/registro' && path !== '/' && path !== '/produtos') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// Helper: monta a URL completa para uma imagem do backend
export const buildImageUrl = (img) => {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `${UPLOADS_URL}/${img}`;
};

export default api;
