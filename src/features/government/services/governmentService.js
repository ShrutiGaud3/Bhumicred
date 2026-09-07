import { api } from '../../../services/api.js';

export const governmentService = {
  getDashboard: async () => {
    const response = await api.get('/government/dashboard');
    return response.data;
  },
};
