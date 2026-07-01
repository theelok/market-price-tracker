import apiClient from './client';

export const ingredientsApi = {
  getAll: () => apiClient.get('/ingredients').then((r) => r.data),
  getById: (id) => apiClient.get(`/ingredients/${id}`).then((r) => r.data),
  create: (data) => apiClient.post('/ingredients', data).then((r) => r.data),
  update: (id, data) => apiClient.put(`/ingredients/${id}`, data).then((r) => r.data),
  remove: (id) => apiClient.delete(`/ingredients/${id}`),
};
