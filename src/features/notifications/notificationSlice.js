import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationService } from '../../services/notificationService.js';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (filter = 'ALL', { rejectWithValue }) => {
    try {
      return await notificationService.getNotifications(filter);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      return await notificationService.getUnreadCount();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

export const submitSupportTicket = createAsyncThunk(
  'notifications/submitSupportTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      return await notificationService.createSupportTicket(ticketData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit support ticket');
    }
  }
);

export const fetchUserSupportTickets = createAsyncThunk(
  'notifications/fetchUserSupportTickets',
  async (mobile = '', { rejectWithValue }) => {
    try {
      return await notificationService.getMySupportTickets(mobile);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch support tickets');
    }
  }
);

const initialState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
  userTickets: [],
  ticketsLoading: false,
  ticketSubmitting: false,
  lastSubmittedTicket: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearSubmittedTicket: (state) => {
      state.lastSubmittedTicket = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Unread Count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })

      // Mark single read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const item = state.items.find((n) => n._id === action.payload || n.id === action.payload);
        if (item && !item.read) {
          item.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // Mark all read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.items.forEach((n) => {
          n.read = true;
        });
        state.unreadCount = 0;
      })

      // Submit ticket
      .addCase(submitSupportTicket.pending, (state) => {
        state.ticketSubmitting = true;
      })
      .addCase(submitSupportTicket.fulfilled, (state, action) => {
        state.ticketSubmitting = false;
        state.lastSubmittedTicket = action.payload;
        state.userTickets.unshift(action.payload);
      })
      .addCase(submitSupportTicket.rejected, (state, action) => {
        state.ticketSubmitting = false;
        state.error = action.payload;
      })

      // Fetch user tickets
      .addCase(fetchUserSupportTickets.pending, (state) => {
        state.ticketsLoading = true;
      })
      .addCase(fetchUserSupportTickets.fulfilled, (state, action) => {
        state.ticketsLoading = false;
        state.userTickets = action.payload;
      })
      .addCase(fetchUserSupportTickets.rejected, (state, action) => {
        state.ticketsLoading = false;
      });
  },
});

export const { clearSubmittedTicket } = notificationSlice.actions;
export default notificationSlice.reducer;
