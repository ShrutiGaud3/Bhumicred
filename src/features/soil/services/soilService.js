import { api } from '../../../services/api.js';

export const soilService = {
  /**
   * Book a new soil test sample collection
   */
  bookSoilTest: async (testData) => {
    const response = await api.post('/soil/requests', testData);
    return response.data;
  },

  /**
   * Get all soil test requests and health cards
   */
  getSoilRequests: async (params = {}) => {
    const response = await api.get('/soil/requests', { params });
    return response.data;
  },

  /**
   * Get single soil test report by ID
   */
  getSoilRequestById: async (id) => {
    const response = await api.get(`/soil/requests/${id}`);
    return response.data;
  },

  /**
   * Update test metrics and report (Lab/Admin)
   */
  updateSoilReport: async (id, reportData) => {
    const response = await api.patch(`/soil/requests/${id}/report`, reportData);
    return response.data;
  },

  /**
   * Dispatch Mobile Soil Testing Van (Government/Admin)
   */
  dispatchMobileVan: async (vanData) => {
    const response = await api.post('/soil/dispatch-van', vanData);
    return response.data;
  },

  /**
   * List all mobile testing van dispatches
   */
  getMobileVanDispatches: async () => {
    const response = await api.get('/soil/dispatches');
    return response.data;
  },

  /**
   * Get soil fertility and intelligence stats
   */
  getSoilStats: async () => {
    const response = await api.get('/soil/stats');
    return response.data;
  },
};

export default soilService;
