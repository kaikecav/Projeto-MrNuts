import api from './client.js';

export const usuariosApi = {
  list: () => api.get('/usuarios'),

  getById: (id) => api.get(`/usuarios/${id}`),

  create: (formData) =>
    api.post('/usuarios', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id, formData) =>
    api.put(`/usuarios/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  remove: (id) => api.delete(`/usuarios/${id}`),
};
