import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { insuranceService } from './services/insuranceService.js';

export const fetchPolicies = createAsyncThunk(
  'insurance/fetchPolicies',
  async (params, { rejectWithValue }) => {
    try {
      const res = await insuranceService.getPolicies(params);
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load policies');
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
  async (params, { rejectWithValue }) => {
    try {
      const res = await insuranceService.getClaims(params);
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load claims');
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
      return rejectWithValue(err.response?.data?.message || 'Failed to load claim details');
    }
  }
);

export const raiseClaim = createAsyncThunk(
  'insurance/raiseClaim',
  async (claimData, { rejectWithValue }) => {
    try {
      const res = await insuranceService.raiseClaim(claimData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit claim');
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
        state.policies = action.payload;
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
        if (action.payload) {
          state.stats = action.payload;
        }
      });
  },
});

export const { clearCalculatedQuote, clearInsuranceError } = insuranceSlice.actions;
export default insuranceSlice.reducer;
