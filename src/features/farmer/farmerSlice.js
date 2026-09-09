import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService.js';
import { MOCK_POLICIES } from '../../services/mockData/insuranceMock.js';
import { MOCK_SOIL_REQUESTS } from '../../services/mockData/soilMock.js';
import { MOCK_WALLET } from '../../services/mockData/walletMock.js';
import { MOCK_PROJECTS } from '../../services/mockData/projectsMock.js';
import { MOCK_SCHEMES } from '../../services/mockData/schemesMock.js';

export const fetchFarmerDashboard = createAsyncThunk(
  'farmer/fetchDashboard',
  async () => {
    const userLands = storageService.getLands();
    return {
      overview: {
        registeredLands: userLands.length,
        activePolicies: MOCK_POLICIES.length,
        soilTestRequests: MOCK_SOIL_REQUESTS.length,
        activeProjects: MOCK_PROJECTS.length,
        carbonOpportunities: 2,
      },
      wallet: {
        availableBalance: MOCK_WALLET.availableBalance,
        pendingBalance: MOCK_WALLET.pendingBalance,
        rewards: MOCK_WALLET.totalRewards,
      },
      status: 'APPROVED',
      recentActivities: [],
      recommendedSchemes: MOCK_SCHEMES.slice(0, 2),
    };
  }
);

const farmerSlice = createSlice({
  name: 'farmer',
  initialState: {
    dashboardData: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFarmerDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFarmerDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchFarmerDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message;
      });
  },
});

export default farmerSlice.reducer;
