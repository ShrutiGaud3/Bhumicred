import { api } from '../../../services/api.js';

export const governmentService = {
  /**
   * Fetch government dashboard statistics
   */
  async getDashboardStats() {
    const response = await api.get('/government/stats');
    return response.data;
  },

  /**
   * Fetch public social forestry and green assets
   */
  async getPublicAssets(params = {}) {
    const response = await api.get('/government/assets', { params });
    return response.data;
  },

  /**
   * Register a new public green asset
   */
  async createPublicAsset(assetData) {
    const response = await api.post('/government/assets', assetData);
    return response.data;
  },

  /**
   * Fetch district on-demand campaigns
   */
  async getCampaigns(params = {}) {
    const response = await api.get('/government/campaigns', { params });
    return response.data;
  },

  /**
   * Launch a new district campaign
   */
  async createCampaign(campaignData) {
    const response = await api.post('/government/campaigns', campaignData);
    return response.data;
  },

  /**
   * Fetch directory of registered farmers in area / district
   */
  async getFarmersInArea(params = {}) {
    const response = await api.get('/government/farmers', { params });
    return response.data;
  },
};

export default governmentService;
