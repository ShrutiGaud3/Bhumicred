import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { landService } from '../land/services/landService.js';
import { insuranceService } from '../insurance/services/insuranceService.js';
import { walletService } from '../wallet/services/walletService.js';
import { soilService } from '../soil/services/soilService.js';
import { api } from '../../services/api.js';
import { storageService } from '../../services/storageService.js';

export const fetchFarmerDashboard = createAsyncThunk(
  'farmer/fetchDashboard',
  async (_, { getState }) => {
    const state = getState();
    const user = state.auth?.user;
    const userIdentifier = user?.mobile || user?.id || user?._id || user?.name;

    let lands = [];
    let policies = [];
    let claims = [];
    let wallet = { availableBalance: 0, pendingBalance: 0, rewards: 0 };
    let soilRequests = [];
    let schemes = [];

    try {
      const [landRes, polRes, claimRes, walletRes, soilRes, schemeRes] = await Promise.allSettled([
        landService.getMyLands(),
        insuranceService.getPolicies(),
        insuranceService.getClaims(),
        walletService.getMyWallet(),
        soilService.getSoilRequests(),
        api.get('/schemes'),
      ]);

      if (landRes.status === 'fulfilled' && landRes.value) {
        const rawLands = landRes.value.data || landRes.value;
        lands = Array.isArray(rawLands) ? rawLands : [];
      }
      if (polRes.status === 'fulfilled' && polRes.value) {
        const rawPols = polRes.value.data || polRes.value;
        policies = Array.isArray(rawPols) ? rawPols : [];
      }
      if (claimRes.status === 'fulfilled' && claimRes.value) {
        const rawClaims = claimRes.value.data || claimRes.value;
        claims = Array.isArray(rawClaims) ? rawClaims : [];
      }
      if (walletRes.status === 'fulfilled' && walletRes.value) {
        const rawWallet = walletRes.value.data || walletRes.value;
        if (rawWallet) {
          wallet = {
            availableBalance: Number(rawWallet.balance || rawWallet.availableBalance || 0),
            pendingBalance: Number(rawWallet.pendingBalance || 0),
            rewards: Number(rawWallet.rewards || 0),
          };
        }
      }
      if (soilRes.status === 'fulfilled' && soilRes.value) {
        const rawSoil = soilRes.value.data || soilRes.value;
        soilRequests = Array.isArray(rawSoil) ? rawSoil : [];
      }
      if (schemeRes.status === 'fulfilled' && schemeRes.value) {
        const rawSchemes = schemeRes.value.data?.data || schemeRes.value.data || schemeRes.value;
        schemes = Array.isArray(rawSchemes) ? rawSchemes : [];
      }
    } catch (apiErr) {
      console.warn('Dashboard live API fetch note:', apiErr?.message);
    }

    // Dynamic metrics calculated from database lands and policies
    const totalLandsCount = lands.length;
    const totalTrees = lands.reduce(
      (acc, l) => acc + (Number(l.treeCount || l.standingTreeCount || l.agronomicDetails?.treeCount) || 0),
      0
    );
    const totalCarbonTons = Number((totalTrees * 0.125).toFixed(1));
    const carbonValuation = Math.round(totalCarbonTons * 1450);

    const activePoliciesCount = policies.filter(
      (p) => p.status !== 'CANCELLED' && p.status !== 'EXPIRED'
    ).length;

    const soilCount = soilRequests.length;
    const carbonCount = lands.filter(
      (l) => (Number(l.treeCount || l.standingTreeCount || l.agronomicDetails?.treeCount) || 0) > 0
    ).length;

    // Dynamic activity ledger from real database events
    const recentActivities = [];
    claims.forEach((c) => {
      recentActivities.push({
        id: `ACT-CLM-${c._id || c.claimNumber}`,
        type: 'INSURANCE',
        title: `Tree Damage Claim: ${c.claimNumber}`,
        subtitle: `${c.incidentType} (${c.affectedTreeCount} trees)`,
        badge: c.status,
        time: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : 'Recently',
        timestamp: c.createdAt || new Date().toISOString(),
      });
    });

    policies.forEach((p) => {
      recentActivities.push({
        id: `ACT-POL-${p._id || p.policyNumber}`,
        type: 'INSURANCE',
        title: `Policy Active: ${p.policyNumber}`,
        subtitle: `${p.insuredTreeCount} Trees Covered • ${p.planName}`,
        badge: p.status || 'ACTIVE',
        time: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : 'Recently',
        timestamp: p.createdAt || new Date().toISOString(),
      });
    });

    lands.forEach((l) => {
      recentActivities.push({
        id: `ACT-LND-${l._id || l.landId}`,
        type: 'LAND',
        title: `Land Registered: ${l.landName || 'Plot'}`,
        subtitle: `Survey ${l.surveyNumber || 'N/A'} • Khasra ${l.khasraNumber || 'N/A'} (${l.area || 0} Acres)`,
        badge: l.status || 'VERIFIED',
        time: l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-IN') : 'Recently',
        timestamp: l.createdAt || new Date().toISOString(),
      });
    });

    soilRequests.forEach((s) => {
      recentActivities.push({
        id: `ACT-SOIL-${s._id || s.id}`,
        type: 'SOIL',
        title: `Soil Diagnostics: ${s.sampleId || s.id}`,
        subtitle: `Sample collection on Plot ${s.landName || s.khasraNumber || ''}`,
        badge: s.status || 'IN_REVIEW',
        time: s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN') : 'Recently',
        timestamp: s.createdAt || new Date().toISOString(),
      });
    });

    recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const userReports = storageService.getReports ? storageService.getReports(userIdentifier) : [];
    const userInvoices = storageService.getInvoices ? storageService.getInvoices(userIdentifier) : [];

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
      wallet,
      lands,
      policies,
      claims,
      soilRequests,
      reports: userReports,
      invoices: userInvoices,
      status: user?.status || 'APPROVED',
      recentActivities: recentActivities.slice(0, 6),
      recommendedSchemes: schemes.length > 0 ? schemes.slice(0, 4) : [
        {
          id: 'SCH-01',
          title: 'PM-KMY National Agroforestry Subsidy Scheme',
          authority: 'Ministry of Agriculture & Farmers Welfare',
          benefit: '40% Direct Premium Subsidy on Commercial Tree Plantation',
        },
        {
          id: 'SCH-02',
          title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
          authority: 'National Organic Farming Council',
          benefit: '₹50,000 / hectare financial assistance for organic conversion',
        },
      ],
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
