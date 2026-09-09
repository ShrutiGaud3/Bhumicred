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

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  loginWithPassword: async (identifier, password) => {
    const response = await api.post('/auth/login', { identifier, password });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  getRoleMatrix: async () => {
    const response = await api.get('/auth/roles-matrix');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};
