import api from '../../../services/api.js';

export const carbonService = {
  // 1. Get Carbon Opportunities & Project Registries
  getCarbonOpportunities: async (params = {}) => {
    const res = await api.get('/carbon/opportunities', { params });
    return res.data;
  },

  // 2. Request Sentinel-2 Satellite MRV Audit
  requestCarbonAudit: async (auditData) => {
    const res = await api.post('/carbon/audits', auditData);
    return res.data;
  },

  // 3. Get User / Regional MRV Audits
  getCarbonAudits: async (params = {}) => {
    const res = await api.get('/carbon/audits', { params });
    return res.data;
  },

  // 4. Get Single Audit Details
  getCarbonAuditById: async (id) => {
    const res = await api.get(`/carbon/audits/${id}`);
    return res.data;
  },

  // 5. Process Satellite MRV
  processSatelliteMRV: async (id, updateData) => {
    const res = await api.patch(`/carbon/audits/${id}/mrv`, updateData);
    return res.data;
  },

  // 6. Mint Carbon Credits
  mintCarbonCredits: async (mintData) => {
    const res = await api.post('/carbon/credits/mint', mintData);
    return res.data;
  },

  // 7. Get Minted Carbon Credits
  getCarbonCredits: async (params = {}) => {
    const res = await api.get('/carbon/credits', { params });
    return res.data;
  },

  // 8. Get Single Credit Details
  getCarbonCreditById: async (id) => {
    const res = await api.get(`/carbon/credits/${id}`);
    return res.data;
  },

  // 9. Retire Carbon Credits (ESG Offsetting)
  retireCarbonCredit: async (id, retirementData) => {
    const res = await api.post(`/carbon/credits/${id}/retire`, retirementData);
    return res.data;
  },

  // 10. Macro Carbon Stats
  getCarbonStats: async () => {
    const res = await api.get('/carbon/stats');
    return res.data;
  },
};

export default carbonService;
