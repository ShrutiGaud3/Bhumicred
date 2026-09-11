import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { carbonService } from './services/carbonService.js';

export const fetchCarbonOpportunities = createAsyncThunk(
  'carbon/fetchCarbonOpportunities',
  async (params, { rejectWithValue }) => {
    try {
      const res = await carbonService.getCarbonOpportunities(params);
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load carbon opportunities');
    }
  }
);

export const fetchCarbonAudits = createAsyncThunk(
  'carbon/fetchCarbonAudits',
  async (params, { rejectWithValue }) => {
    try {
      const res = await carbonService.getCarbonAudits(params);
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load satellite MRV audits');
    }
  }
);

export const fetchCarbonAuditById = createAsyncThunk(
  'carbon/fetchCarbonAuditById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await carbonService.getCarbonAuditById(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load MRV audit details');
    }
  }
);

export const requestCarbonAudit = createAsyncThunk(
  'carbon/requestCarbonAudit',
  async (auditData, { rejectWithValue }) => {
    try {
      const res = await carbonService.requestCarbonAudit(auditData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to schedule satellite MRV audit');
    }
  }
);

export const mintCarbonCredits = createAsyncThunk(
  'carbon/mintCarbonCredits',
  async (mintData, { rejectWithValue }) => {
    try {
      const res = await carbonService.mintCarbonCredits(mintData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to mint carbon credits');
    }
  }
);

export const fetchCarbonCredits = createAsyncThunk(
  'carbon/fetchCarbonCredits',
  async (params, { rejectWithValue }) => {
    try {
      const res = await carbonService.getCarbonCredits(params);
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load carbon credits');
    }
  }
);

export const retireCarbonCredit = createAsyncThunk(
  'carbon/retireCarbonCredit',
  async ({ id, retirementData }, { rejectWithValue }) => {
    try {
      const res = await carbonService.retireCarbonCredit(id, retirementData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to retire carbon credit');
    }
  }
);

export const fetchCarbonStats = createAsyncThunk(
  'carbon/fetchCarbonStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await carbonService.getCarbonStats();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load carbon statistics');
    }
  }
);

const initialState = {
  opportunities: [],
  audits: [],
  activeAudit: null,
  credits: [],
  stats: {
    totalCreditsMinted: 0,
    totalTCO2eSequestered: 0,
    totalCarbonEarningsINR: 0,
    currentCarbonSpotPriceINR: 1450,
    activeAuditsCount: 0,
    totalVerifiedTrees: 0,
    satelliteHealthIndex: '0.78 NDVI',
    registryStandard: 'Sovereign Agro-Carbon VCS VM0042',
  },
  isLoading: false,
  isRequesting: false,
  isMinting: false,
  isRetiring: false,
  error: null,
};

const carbonSlice = createSlice({
  name: 'carbon',
  initialState,
  reducers: {
    clearActiveAudit: (state) => {
      state.activeAudit = null;
    },
    clearCarbonError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Opportunities
      .addCase(fetchCarbonOpportunities.fulfilled, (state, action) => {
        state.opportunities = action.payload;
      })

      // Audits
      .addCase(fetchCarbonAudits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCarbonAudits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.audits = action.payload;
      })
      .addCase(fetchCarbonAudits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Single Audit
      .addCase(fetchCarbonAuditById.fulfilled, (state, action) => {
        state.activeAudit = action.payload;
      })

      // Request Audit
      .addCase(requestCarbonAudit.pending, (state) => {
        state.isRequesting = true;
        state.error = null;
      })
      .addCase(requestCarbonAudit.fulfilled, (state, action) => {
        state.isRequesting = false;
        state.audits.unshift(action.payload);
        state.stats.activeAuditsCount += 1;
      })
      .addCase(requestCarbonAudit.rejected, (state, action) => {
        state.isRequesting = false;
        state.error = action.payload;
      })

      // Mint Credits
      .addCase(mintCarbonCredits.pending, (state) => {
        state.isMinting = true;
        state.error = null;
      })
      .addCase(mintCarbonCredits.fulfilled, (state, action) => {
        state.isMinting = false;
        state.credits.unshift(action.payload);
        state.stats.totalCreditsMinted += 1;
        state.stats.totalTCO2eSequestered += action.payload.tCO2e || 0;
        state.stats.totalCarbonEarningsINR += action.payload.totalValue || 0;
      })
      .addCase(mintCarbonCredits.rejected, (state, action) => {
        state.isMinting = false;
        state.error = action.payload;
      })

      // Credits list
      .addCase(fetchCarbonCredits.fulfilled, (state, action) => {
        state.credits = action.payload;
      })

      // Retire
      .addCase(retireCarbonCredit.pending, (state) => {
        state.isRetiring = true;
        state.error = null;
      })
      .addCase(retireCarbonCredit.fulfilled, (state, action) => {
        state.isRetiring = false;
        const index = state.credits.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.credits[index] = action.payload;
        }
      })
      .addCase(retireCarbonCredit.rejected, (state, action) => {
        state.isRetiring = false;
        state.error = action.payload;
      })

      // Stats
      .addCase(fetchCarbonStats.fulfilled, (state, action) => {
        if (action.payload) {
          state.stats = { ...state.stats, ...action.payload };
        }
      });
  },
});

export const { clearActiveAudit, clearCarbonError } = carbonSlice.actions;
export default carbonSlice.reducer;
