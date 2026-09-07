import { api } from '../../../services/api.js';

export const partnerService = {
  getDashboard: async () => {
    const response = await api.get('/partner/dashboard');
    return response.data;
  },
};
