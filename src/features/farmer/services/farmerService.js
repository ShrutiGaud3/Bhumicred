import { api } from '../../../services/api.js';

export const farmerService = {
  getDashboard: async () => {
    const response = await api.get('/farmer/dashboard');
    return response.data;
  },
};
