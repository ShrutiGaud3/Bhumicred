import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_PROJECTS } from '../../services/mockData/projectsMock.js';
import { MOCK_CLAIMS } from '../../services/mockData/insuranceMock.js';
import { MOCK_SOIL_REQUESTS } from '../../services/mockData/soilMock.js';

export const fetchPartnerDashboard = createAsyncThunk(
  'partner/fetchDashboard',
  async () => {
    return {
      metrics: {
        assignedTasks: 0,
        scheduledVisits: 0,
        pendingInspections: MOCK_CLAIMS?.length || 0,
        samplesInLabQueue: MOCK_SOIL_REQUESTS?.length || 0,
        submittedReports: 0,
      },
      status: 'APPROVED',
      upcomingVisits: [],
      assignedTasksQueue: [],
    };
  }
);

const partnerSlice = createSlice({
  name: 'partner',
  initialState: {
    dashboardData: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPartnerDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPartnerDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchPartnerDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message;
      });
  },
});

export default partnerSlice.reducer;
