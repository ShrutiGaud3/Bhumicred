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
    const userPolicies = storageService.getPolicies ? storageService.getPolicies(userIdentifier) : MOCK_POLICIES;
    const userSoil = storageService.getSoilRequests ? storageService.getSoilRequests() : MOCK_SOIL_REQUESTS;
    const userAudits = storageService.getCarbonAudits ? storageService.getCarbonAudits(userIdentifier) : [];
    const userWallet = storageService.getWallet ? storageService.getWallet(userIdentifier) : { availableBalance: 14850, pendingBalance: 2900, rewards: 1250 };
    const userReports = storageService.getReports ? storageService.getReports(userIdentifier) : [];
    const userInvoices = storageService.getInvoices ? storageService.getInvoices(userIdentifier) : [];

    const totalLandsCount = userLands.length > 0 ? userLands.length : 1;
    const totalTrees = userLands.reduce((acc, l) => acc + (Number(l.treeCount) || 33), 0) || (userAudits.length > 0 ? userAudits.reduce((acc, a) => acc + Number(a.treeCount || a.estimatedTreeCount || 33), 0) : 33);
    const totalCarbonTons = Number((totalTrees * 0.125).toFixed(1));
    const carbonValuation = Math.round(totalCarbonTons * 1450);

    const activePoliciesCount = userLands.filter(l => l.treesInsured || l.optInsurance).length || userPolicies.length || 1;
    const soilCount = userSoil.length || userLands.length || 1;
    const carbonCount = userAudits.length || 1;

    return {
      overview: {
        registeredLands: totalLandsCount,
        activePolicies: activePoliciesCount,
        soilTestRequests: soilCount,
        activeProjects: 1,
        carbonOpportunities: carbonCount,
        totalTrees,
        totalCarbonTons,
        carbonValuation,
      },
      wallet: {
        availableBalance: userWallet.availableBalance || 14850,
        pendingBalance: userWallet.pendingBalance || 2900,
        rewards: userWallet.rewards || 1250,
      },
      lands: userLands,
      audits: userAudits,
      policies: userPolicies,
      reports: userReports,
      invoices: userInvoices,
      status: user?.status || 'APPROVED',
      recentActivities: [
        {
          id: 'act_1',
          type: 'CARBON',
          title: 'Sentinel-2 Satellite MRV Biomass Scan',
          subtitle: `Krishna Farm (Survey 465) • Status: Scan Scheduled (10m Multi-spectral)`,
          time: 'Just now',
          badge: 'Carbon Scan',
        },
        {
          id: 'act_2',
          type: 'LAND',
          title: 'Land Title GIS Boundary Mapped',
          subtitle: 'Khasra 412/9 • 5.95 Acres cadastral polygon verified',
          time: '2 hours ago',
          badge: 'GIS Mapped',
        },
        {
          id: 'act_3',
          type: 'SOIL',
          title: '12-Parameter Soil Health Diagnostic Generated',
          subtitle: 'NABL Certified Chemistry Lab • Optimal pH 7.1 & High Carbon',
          time: 'Yesterday',
          badge: 'NABL Certified',
        },
        {
          id: 'act_4',
          type: 'INSURANCE',
          title: 'Parametric Tree Plantation Cover Active',
          subtitle: '33 Standing Hardwood Trees underwritten with satellite trigger',
          time: '3 days ago',
          badge: 'Policy Active',
        },
      ],
      recommendedSchemes: MOCK_SCHEMES.slice(0, 3),
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
