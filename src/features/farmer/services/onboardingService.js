import { api } from '../../../services/api.js';

export const onboardingService = {
  submitKyc: async (formData) => {
    const response = await api.post('/onboarding/submit', formData);
    return response.data;
  },

  getMyKycStatus: async (params = {}) => {
    const response = await api.get('/onboarding/status', { params });
    return response.data;
  },

  getAdminQueue: async (filters = {}) => {
    const response = await api.get('/onboarding/admin/queue', { params: filters });
    return response.data;
  },

  reviewKyc: async (applicationId, reviewPayload) => {
    const response = await api.patch(`/onboarding/admin/review/${applicationId}`, reviewPayload);
    return response.data;
  },

  resubmitKyc: async (applicationId, updateData) => {
    const response = await api.post(`/onboarding/resubmit/${applicationId}`, updateData);
    return response.data;
  },
};
