import api from './client';

export const listCategories     = () => api.get('/api/categories');
export const createCategory     = (payload) => api.post('/api/categories', payload);
export const updateCategory     = (id, payload) => api.put(`/api/categories/${id}`, payload);
export const deleteCategory     = (id) => api.delete(`/api/categories/${id}`);
export const listCategoryDevices = (id) => api.get(`/api/categories/${id}/devices`);
