import apiClient from './client';

export const statisticsApi = {
  get: () => apiClient.get('/statistics').then((r) => r.data),
  getIngredients: () => apiClient.get('/statistics/ingredients').then((r) => r.data),
};
