import apiClient from './client';

export const purchasesApi = {
  getAll: (ingredientId) =>
    apiClient
      .get('/purchases', { params: ingredientId ? { ingredientId } : undefined })
      .then((r) => r.data),
  getById: (id) => apiClient.get(`/purchases/${id}`).then((r) => r.data),
  create: (data) => apiClient.post('/purchases', data).then((r) => r.data),
  update: (id, data) => apiClient.put(`/purchases/${id}`, data).then((r) => r.data),
  remove: (id) => apiClient.delete(`/purchases/${id}`),
};
