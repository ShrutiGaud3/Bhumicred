import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MOCK_USERS } from '../../services/mockData/usersMock.js';
import { MOCK_PROJECTS } from '../../services/mockData/projectsMock.js';

export const fetchGovernmentDashboard = createAsyncThunk(
  'government/fetchDashboard',
  async () => {
    return {
      jurisdiction: MOCK_USERS.GOVERNMENT.jurisdiction,
      metrics: {
        publicAssetsManaged: 12,
        farmersInArea: 348,
        activeCampaigns: 3,
        areaProjects: MOCK_PROJECTS.length,
        soilTestingDrives: 4,
      },
      status: 'APPROVED',
      activeCampaignsList: [],
      recentPublicAssets: [],
    };
  }
);

const governmentSlice = createSlice({
  name: 'government',
  initialState: {
    dashboardData: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGovernmentDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGovernmentDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchGovernmentDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message;
      });
  },
});

export default governmentSlice.reducer;
