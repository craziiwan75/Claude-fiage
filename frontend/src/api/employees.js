import api from './client';

export const listEmployees    = (page = 1, pageSize = 50) =>
  api.get('/api/employees', { params: { page, page_size: pageSize } });
export const getEmployee      = (id) => api.get(`/api/employees/${id}`);
export const createEmployee   = (payload) => api.post('/api/employees', payload);
export const updateEmployee   = (id, payload) => api.put(`/api/employees/${id}`, payload);
export const deleteEmployee   = (id) => api.delete(`/api/employees/${id}`);
