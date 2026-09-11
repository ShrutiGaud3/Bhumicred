import api from '../../../services/api.js';

export const walletService = {
  /**
   * Get user's wallet
   */
  getMyWallet: async () => {
    const res = await api.get('/wallet/me');
    return res.data;
  },

  /**
   * Instant UPI / Card Top-up
   */
  topupWallet: async (topupData) => {
    const res = await api.post('/wallet/topup', topupData);
    return res.data;
  },

  /**
   * Request Instant Bank Withdrawal (IMPS / UPI)
   */
  requestWithdrawal: async (withdrawalData) => {
    const res = await api.post('/wallet/withdraw', withdrawalData);
    return res.data;
  },

  /**
   * Get Transaction History
   */
  getTransactions: async (params = {}) => {
    const res = await api.get('/wallet/transactions', { params });
    return res.data;
  },

  /**
   * Get Single Transaction Details
   */
  getTransactionById: async (id) => {
    const res = await api.get(`/wallet/transactions/${id}`);
    return res.data;
  },

  /**
   * Admin Treasury & Escrow Overview
   */
  getAdminTreasuryOverview: async () => {
    const res = await api.get('/wallet/admin/overview');
    return res.data;
  },
};

export default walletService;
