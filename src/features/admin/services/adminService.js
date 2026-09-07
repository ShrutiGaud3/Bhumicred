import { api } from '../../../services/api.js';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/dashboard-stats');
    return response.data;
  },
  getRoles: async () => {
    const response = await api.get('/admin/roles');
    return response.data;
  },
  getAuditLogs: async (params = {}) => {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  },
  getHealth: async () => {
    const response = await api.get('/admin/health');
    return response.data;
  },
};
