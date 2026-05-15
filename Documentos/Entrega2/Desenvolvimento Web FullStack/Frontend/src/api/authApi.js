import api from './client.js';

export const authApi = {
  login: (email, senha) => api.post('/auth/login', { email, senha }),

  register: (formData) =>
    api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  logout: () => api.post('/auth/logout'),

  forgotPassword: (email, novaSenha) =>
    api.post('/auth/forgot-password', { email, novaSenha }),

  profile: () => api.get('/usuarios/profile'),

  updateMe: (formData) =>
    api.put('/usuarios/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
