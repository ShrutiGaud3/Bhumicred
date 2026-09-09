import { api } from '../../../services/api.js';

export const documentService = {
  /**
   * Fetch all documents in user's vault with optional query filters
   */
  getDocuments: async (params = {}) => {
    const response = await api.get('/documents', { params });
    return response.data;
  },

  /**
   * Upload and register a new document in the vault
   */
  uploadDocument: async (docData) => {
    const response = await api.post('/documents', docData);
    return response.data;
  },

  /**
   * Get single document details
   */
  getDocumentById: async (id) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  /**
   * Delete a document from vault
   */
  deleteDocument: async (id) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },

  /**
   * Fetch vault statistics
   */
  getVaultStats: async () => {
    const response = await api.get('/documents/stats');
    return response.data;
  },

  /**
   * Admin verify document
   */
  verifyDocument: async (id, verificationData) => {
    const response = await api.patch(`/documents/${id}/verify`, verificationData);
    return response.data;
  },
};

export default documentService;
