import { api } from '../../../services/api.js';

export const insuranceService = {
  /**
   * Calculate live parametric insurance premium quote
   */
  calculateQuote: async (quoteData) => {
    const response = await api.post('/insurance/quote', quoteData);
    return response.data;
  },

  /**
   * Get all policies of user
   */
  getPolicies: async (params = {}) => {
    const response = await api.get('/insurance/policies', { params });
    return response.data;
  },

  /**
   * Apply / purchase insurance policy
   */
  applyPolicy: async (policyData) => {
    const response = await api.post('/insurance/policies', policyData);
    return response.data;
  },

  /**
   * Get single policy by ID
   */
  getPolicyById: async (id) => {
    const response = await api.get(`/insurance/policies/${id}`);
    return response.data;
  },

  /**
   * Get all claims
   */
  getClaims: async (params = {}) => {
    const response = await api.get('/insurance/claims', { params });
    return response.data;
  },

  /**
   * Raise a new claim
   */
  raiseClaim: async (claimData) => {
    const response = await api.post('/insurance/claims', claimData);
    return response.data;
  },

  /**
   * Get single claim by ID
   */
  getClaimById: async (id) => {
    const response = await api.get(`/insurance/claims/${id}`);
    return response.data;
  },

  /**
   * Update claim status (Admin/Partner)
   */
  updateClaimStatus: async (id, statusData) => {
    const response = await api.patch(`/insurance/claims/${id}/status`, statusData);
    return response.data;
  },

  /**
   * Get insurance & claims stats
   */
  getInsuranceStats: async () => {
    const response = await api.get('/insurance/stats');
    return response.data;
  },
};

export default insuranceService;
