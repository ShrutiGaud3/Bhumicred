import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { insuranceService } from './services/insuranceService.js';
import { storageService } from '../../services/storageService.js';

export const fetchPolicies = createAsyncThunk(
  'insurance/fetchPolicies',
  async (params, { getState }) => {
    try {
      const res = await insuranceService.getPolicies(params);
      const backendPolicies = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      return backendPolicies;
    } catch (err) {
      console.warn('Backend policies load warning:', err?.message);
      const authUser = getState().auth?.user;
      const userIdentifier = authUser?.mobile || authUser?.id || authUser?._id;
      return storageService.getPolicies(userIdentifier);
    }
  }
);

export const fetchPolicyById = createAsyncThunk(
  'insurance/fetchPolicyById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await insuranceService.getPolicyById(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load policy details');
    }
  }
);

export const applyPolicy = createAsyncThunk(
  'insurance/applyPolicy',
  async (policyData, { rejectWithValue }) => {
    try {
      const res = await insuranceService.applyPolicy(policyData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Policy application failed');
    }
  }
);

export const calculateQuote = createAsyncThunk(
  'insurance/calculateQuote',
  async (quoteData, { rejectWithValue }) => {
    try {
      const res = await insuranceService.calculateQuote(quoteData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Quote calculation failed');
    }
  }
);

export const fetchClaims = createAsyncThunk(
  'insurance/fetchClaims',
  async (params, { getState }) => {
    try {
      const res = await insuranceService.getClaims(params);
      const backendClaims = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      return backendClaims;
    } catch (err) {
      console.warn('Backend claims load warning:', err?.message);
      const authUser = getState().auth?.user;
      const userIdentifier = authUser?.mobile || authUser?.id || authUser?._id;
      return storageService.getClaims(userIdentifier);
    }
  }
);

export const fetchClaimById = createAsyncThunk(
  'insurance/fetchClaimById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await insuranceService.getClaimById(id);
      return res.data;
    } catch (err) {
      const localClaims = storageService.getClaims();
      const match = localClaims.find((c) => c.id === id || c._id === id || c.claimNumber === id);
      if (match) return match;
      return rejectWithValue(err.response?.data?.message || 'Failed to load claim details');
    }
  }
);

export const raiseClaim = createAsyncThunk(
  'insurance/raiseClaim',
  async (claimData, { rejectWithValue }) => {
    try {
      const res = await insuranceService.raiseClaim(claimData);
      const resultClaim = res?.data || res;
      if (resultClaim) {
        storageService.saveClaim(resultClaim);
        return resultClaim;
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to submit insurance claim';
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchInsuranceStats = createAsyncThunk(
  'insurance/fetchInsuranceStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await insuranceService.getInsuranceStats();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load insurance statistics');
    }
  }
);

const initialState = {
  policies: [],
  claims: [],
  activePolicy: null,
  activeClaim: null,
  calculatedQuote: null,
  stats: {
    totalPolicies: 0,
    activePolicies: 0,
    totalClaims: 0,
    settledClaims: 0,
    totalSumInsured: 0,
    totalInsuredTrees: 0,
    totalGovernmentSubsidyDisbursed: 0,
    claimsSettlementRatio: '98.4%',
  },
  isLoading: false,
  isApplying: false,
  isClaiming: false,
  error: null,
};

const insuranceSlice = createSlice({
  name: 'insurance',
  initialState,
  reducers: {
    clearCalculatedQuote: (state) => {
      state.calculatedQuote = null;
    },
    clearInsuranceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Policies
      .addCase(fetchPolicies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.policies = action.payload || [];
        const activePols = (action.payload || []).filter((p) => p.status === 'ACTIVE' || !p.status);
        const totalSum = activePols.reduce((acc, curr) => acc + (Number(curr.sumInsured) || 0), 0);
        const totalTrees = activePols.reduce((acc, curr) => acc + (Number(curr.insuredTreeCount || curr.treeCount) || 0), 0);
        const totalSubsidy = activePols.reduce((acc, curr) => acc + (Number(curr.governmentSubsidyAmount) || 0), 0);
        
        state.stats = {
          ...state.stats,
          totalPolicies: (action.payload || []).length,
          activePolicies: activePols.length,
          totalSumInsured: totalSum,
          totalInsuredTrees: totalTrees,
          totalGovernmentSubsidyDisbursed: totalSubsidy,
        };
      })
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Policy By ID
      .addCase(fetchPolicyById.fulfilled, (state, action) => {
        state.activePolicy = action.payload;
      })

      // Apply Policy
      .addCase(applyPolicy.pending, (state) => {
        state.isApplying = true;
        state.error = null;
      })
      .addCase(applyPolicy.fulfilled, (state, action) => {
        state.isApplying = false;
        state.policies.unshift(action.payload);
        state.stats.totalPolicies += 1;
        state.stats.activePolicies += 1;
        state.stats.totalSumInsured += (Number(action.payload?.sumInsured) || 0);
        state.stats.totalInsuredTrees += (Number(action.payload?.insuredTreeCount || action.payload?.treeCount) || 0);
        state.stats.totalGovernmentSubsidyDisbursed += (Number(action.payload?.governmentSubsidyAmount) || 0);
      })
      .addCase(applyPolicy.rejected, (state, action) => {
        state.isApplying = false;
        state.error = action.payload;
      })

      // Calculate Quote
      .addCase(calculateQuote.fulfilled, (state, action) => {
        state.calculatedQuote = action.payload;
      })

      // Fetch Claims
      .addCase(fetchClaims.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.isLoading = false;
        state.claims = action.payload;
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Claim By ID
      .addCase(fetchClaimById.fulfilled, (state, action) => {
        state.activeClaim = action.payload;
      })

      // Raise Claim
      .addCase(raiseClaim.pending, (state) => {
        state.isClaiming = true;
        state.error = null;
      })
      .addCase(raiseClaim.fulfilled, (state, action) => {
        state.isClaiming = false;
        state.claims.unshift(action.payload);
        state.stats.totalClaims += 1;
      })
      .addCase(raiseClaim.rejected, (state, action) => {
        state.isClaiming = false;
        state.error = action.payload;
      })

      // Insurance Stats
      .addCase(fetchInsuranceStats.fulfilled, (state, action) => {
        if (action.payload && (action.payload.totalSumInsured > 0 || action.payload.activePolicies > 0)) {
          state.stats = { ...state.stats, ...action.payload };
        }
      });
  },
});

export const { clearCalculatedQuote, clearInsuranceError } = insuranceSlice.actions;
export default insuranceSlice.reducer;
