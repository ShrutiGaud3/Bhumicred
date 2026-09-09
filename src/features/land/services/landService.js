import { api } from '../../../services/api.js';

export const landService = {
  /**
   * Register a new land parcel
   */
  registerLand: async (landData) => {
    const response = await api.post('/lands', landData);
    return response.data;
  },

  /**
   * Get all registered lands for logged-in user
   */
  getMyLands: async (params = {}) => {
    const response = await api.get('/lands/my', { params });
    return response.data;
  },

  /**
   * Get single land details by ID
   */
  getLandById: async (id) => {
    const response = await api.get(`/lands/${id}`);
    return response.data;
  },

  /**
   * Update land parcel details
   */
  updateLand: async (id, updateData) => {
    const response = await api.put(`/lands/${id}`, updateData);
    return response.data;
  },

  /**
   * Get all lands (Admin / Officer view)
   */
  getAllLands: async (params = {}) => {
    const response = await api.get('/lands', { params });
    return response.data;
  },

  /**
   * Verify land parcel (Admin review)
   */
  verifyLand: async (id, reviewData) => {
    const response = await api.patch(`/lands/${id}/verify`, reviewData);
    return response.data;
  },

  /**
   * Get GIS statistics
   */
  getGisStats: async () => {
    const response = await api.get('/lands/stats/gis');
    return response.data;
  },
};

export default landService;
