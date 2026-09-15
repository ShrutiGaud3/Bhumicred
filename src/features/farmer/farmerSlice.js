import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService.js';
import { MOCK_POLICIES } from '../../services/mockData/insuranceMock.js';
import { MOCK_SOIL_REQUESTS } from '../../services/mockData/soilMock.js';
import { MOCK_WALLET } from '../../services/mockData/walletMock.js';
import { MOCK_PROJECTS } from '../../services/mockData/projectsMock.js';
import { MOCK_SCHEMES } from '../../services/mockData/schemesMock.js';

export const fetchFarmerDashboard = createAsyncThunk(
  'farmer/fetchDashboard',
  async (_, { getState }) => {
    const state = getState();
    const user = state.auth?.user;
    const userIdentifier = user?.mobile || user?.id || user?._id || user?.name;
    const userLands = storageService.getLands(userIdentifier);
    const userPolicies = storageService.getPolicies ? storageService.getPolicies(userIdentifier) : [];
    const userSoil = storageService.getSoilRequests ? storageService.getSoilRequests() : [];
    const userAudits = storageService.getCarbonAudits ? storageService.getCarbonAudits(userIdentifier) : [];
    const userWallet = storageService.getWallet ? storageService.getWallet(userIdentifier) : { availableBalance: 0, pendingBalance: 0, rewards: 0, transactions: [] };
    const userReports = storageService.getReports ? storageService.getReports(userIdentifier) : [];
    const userInvoices = storageService.getInvoices ? storageService.getInvoices(userIdentifier) : [];

    const totalLandsCount = userLands.length;
    const totalTrees = userLands.reduce((acc, l) => acc + (Number(l.treeCount) || 0), 0) || (userAudits.length > 0 ? userAudits.reduce((acc, a) => acc + Number(a.treeCount || a.estimatedTreeCount || 0), 0) : 0);
    const totalCarbonTons = Number((totalTrees * 0.125).toFixed(1));
    const carbonValuation = Math.round(totalCarbonTons * 1450);

    const activePoliciesCount = userPolicies.length || userLands.filter(l => l.treesInsured || l.optInsurance).length || 0;
    const soilCount = userSoil.length || 0;
    const carbonCount = userAudits.length || 0;

    return {
      overview: {
        registeredLands: totalLandsCount,
        activePolicies: activePoliciesCount,
        soilTestRequests: soilCount,
        activeProjects: 0,
        carbonOpportunities: carbonCount,
        totalTrees,
        totalCarbonTons,
        carbonValuation,
      },
      wallet: {
        availableBalance: userWallet.availableBalance || 0,
        pendingBalance: userWallet.pendingBalance || 0,
        rewards: userWallet.rewards || 0,
      },
      lands: userLands,
      audits: userAudits,
      policies: userPolicies,
      reports: userReports,
      invoices: userInvoices,
      status: user?.status || 'APPROVED',
      recentActivities: [],
      recommendedSchemes: [],
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
