import { api } from '../../../services/api.js';

export const adminService = {
  /**
   * Fetch Audit Logs with filters & pagination
   */
  getAuditLogs: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/audit-logs${query ? `?${query}` : ''}`);
    return response.data?.data;
  },

  /**
   * Download Audit Trail CSV
   */
  exportAuditLogsCSV: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/admin/audit-logs/export${query ? `?${query}` : ''}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get Platform Telemetry & System Statistics
   */
  getTelemetry: async () => {
    const response = await api.get('/admin/telemetry');
    return response.data?.data;
  },

  /**
   * Get Global System Settings
   */
  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data?.data;
  },

  /**
   * Update Global System Settings
   */
  updateSettings: async (settingsData) => {
    const response = await api.patch('/admin/settings', settingsData);
    return response.data?.data;
  },

  /**
   * Universal Global Cross-Entity Search
   */
  globalSearch: async (queryStr) => {
    if (!queryStr || queryStr.trim().length < 2) return [];
    const response = await api.get(`/admin/search?q=${encodeURIComponent(queryStr)}`);
    return response.data?.data || [];
  },
};

export default adminService;
