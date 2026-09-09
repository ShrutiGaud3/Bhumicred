import { api } from '../../../services/api.js';

export const schemeService = {
  /**
   * Fetch all government subsidy schemes (supports category, state, search filtering)
   */
  async getSchemes(params = {}) {
    const response = await api.get('/schemes', { params });
    return response.data;
  },

  /**
   * Fetch a single scheme by ID
   */
  async getSchemeById(id) {
    const response = await api.get(`/schemes/${id}`);
    return response.data;
  },

  /**
   * Apply for a subsidy scheme (DBT) linked with land plot
   */
  async applyForScheme(schemeId, applicationData) {
    const response = await api.post(`/schemes/${schemeId}/apply`, applicationData);
    return response.data;
  },
};

export default schemeService;
