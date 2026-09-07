import { api } from '../../../services/api.js';

export const authService = {
  sendOtp: async (mobile, role) => {
    const response = await api.post('/auth/send-otp', { mobile, role });
    return response.data;
  },

  verifyOtp: async (mobile, otp, role) => {
    const response = await api.post('/auth/verify-otp', { mobile, otp, role });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};
