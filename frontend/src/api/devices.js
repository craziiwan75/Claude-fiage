import api from './client';

export const listDevices  = (categoryId) =>
  api.get('/api/devices', { params: categoryId ? { category_id: categoryId } : {} });
export const getDevice    = (id) => api.get(`/api/devices/${id}`);
export const createDevice = (payload) => api.post('/api/devices', payload);
export const updateDevice = (id, payload) => api.put(`/api/devices/${id}`, payload);
export const deleteDevice = (id) => api.delete(`/api/devices/${id}`);
