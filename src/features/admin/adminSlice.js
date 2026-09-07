import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_LANDS } from '../../services/mockData/landsMock.js';
import { MOCK_POLICIES, MOCK_CLAIMS } from '../../services/mockData/insuranceMock.js';
import { MOCK_SOIL_REQUESTS } from '../../services/mockData/soilMock.js';
import { MOCK_PROJECTS } from '../../services/mockData/projectsMock.js';

export const fetchAdminDashboardStats = createAsyncThunk(
  'admin/fetchStats',
  async () => {
    return {
      totalUsers: 1420,
      farmers: 1240,
      governmentBodies: 48,
      enterprisePartners: 132,
      pendingVerifications: 15,
      systemStatus: 'HEALTHY',
    };
  }
);

export const fetchAuditLogs = createAsyncThunk(
  'admin/fetchAuditLogs',
  async () => {
    return {
      logs: [
        {
          _id: 'aud_01',
          createdAt: new Date().toISOString(),
          actorName: 'Super Administrator',
          actorRole: 'SUPER_ADMIN',
          action: 'ONBOARDING_APPROVED',
          entityType: 'User',
          reason: 'KYC Aadhaar & land title verification completed',
        },
        {
          _id: 'aud_02',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          actorName: 'Land Desk Officer',
          actorRole: 'ADMIN_STAFF',
          action: 'GIS_POLYGON_VERIFIED',
          entityType: 'Land',
          reason: 'Khasra 118/2 boundary matches state revenue shapefile',
        },
        {
          _id: 'aud_03',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          actorName: 'Finance Reviewer',
          actorRole: 'ADMIN_STAFF',
          action: 'WITHDRAWAL_PAID',
          entityType: 'Wallet',
          reason: 'Bank payout ref #WTH-2026-0711 dispatched via IMPS',
        },
      ],
      total: 3,
      totalPages: 1,
      page: 1,
    };
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    auditLogs: [],
    totalLogs: 0,
    totalPages: 1,
    currentPage: 1,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.auditLogs = action.payload.logs;
        state.totalLogs = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page;
      });
  },
});

export default adminSlice.reducer;
