import { api } from './api.js';
import { storageService } from './storageService.js';

export const notificationService = {
  /**
   * Get all notifications for current user/role
   */
  getNotifications: async (filter = 'ALL') => {
    try {
      const response = await api.get(`/notifications?filter=${filter}`);
      return response.data?.data || [];
    } catch (err) {
      console.warn('Backend notifications unavailable, returning empty list:', err);
      return [];
    }
  },

  /**
   * Get total unread count
   */
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data?.data?.unreadCount || 0;
    } catch (err) {
      return 0;
    }
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (id) => {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data;
    } catch (err) {
      return { success: true };
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      const response = await api.post('/notifications/mark-all-read');
      return response.data;
    } catch (err) {
      return { success: true };
    }
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (id) => {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    } catch (err) {
      return { success: true };
    }
  },

  /**
   * Admin broadcast notification
   */
  broadcastNotification: async (payload) => {
    const response = await api.post('/notifications/broadcast', payload);
    return response.data;
  },

  // ================= SUPPORT / GRIEVANCES ================= //

  /**
   * Submit support ticket
   */
  createSupportTicket: async (ticketData) => {
    try {
      const response = await api.post('/support/ticket', ticketData);
      if (response.data?.data) {
        storageService.saveSupportTicket(response.data.data);
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend createSupportTicket failed, using local storage:', err);
    }
    return storageService.saveSupportTicket(ticketData);
  },

  /**
   * Get user's submitted support tickets
   */
  getMySupportTickets: async (mobile = '') => {
    try {
      const response = await api.get(`/support/my-tickets${mobile ? `?mobile=${mobile}` : ''}`);
      if (response.data?.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        response.data.data.forEach((t) => storageService.saveSupportTicket(t));
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend getMySupportTickets failed, loading from local store:', err);
    }
    return storageService.getSupportTickets(mobile);
  },

  /**
   * Admin: Get all tickets
   */
  getAdminSupportTickets: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/support/admin/all${queryString ? `?${queryString}` : ''}`);
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend getAdminSupportTickets failed:', err);
    }
    return storageService.getSupportTickets();
  },

  /**
   * Admin: Update ticket status
   */
  updateSupportTicket: async (id, updateData) => {
    try {
      const response = await api.patch(`/support/ticket/${id}`, updateData);
      return response.data?.data;
    } catch (err) {
      console.warn('Backend updateSupportTicket failed:', err);
      return null;
    }
  },

  /**
   * Reply to support ticket
   */
  replySupportTicket: async (id, message) => {
    try {
      const response = await api.post(`/support/ticket/${id}/reply`, { message });
      if (response.data?.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('Backend replySupportTicket failed, updating locally:', err);
    }
    return storageService.replySupportTicket(id, {
      senderName: 'Citizen User',
      senderRole: 'FARMER',
      message,
      createdAt: new Date().toISOString(),
    });
  },
};

export default notificationService;
