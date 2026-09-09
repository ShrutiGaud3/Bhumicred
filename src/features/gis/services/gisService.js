import { api } from '../../../services/api.js';

export const gisService = {
  /**
   * Get all active spatial GIS layers (Cadastral grid, NDVI, canals)
   */
  getLayers: async (params = {}) => {
    const response = await api.get('/gis/layers', { params });
    return response.data;
  },

  /**
   * Get regional macro GIS metrics
   */
  getMacroMetrics: async (district = 'Anand') => {
    const response = await api.get('/gis/stats', { params: { district } });
    return response.data;
  },

  /**
   * Analyze polygon geometry with geodesic calculations
   */
  analyzePolygon: async (coordinates) => {
    const response = await api.post('/gis/analyze-polygon', { coordinates });
    return response.data;
  },

  /**
   * Get specific land parcel GIS spatial features and NDVI audit
   */
  getParcelSpatialData: async (landId) => {
    const response = await api.get(`/gis/parcel/${landId}`);
    return response.data;
  },
};

export default gisService;
