import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { soilService } from './services/soilService.js';

export const fetchSoilRequests = createAsyncThunk(
  'soil/fetchSoilRequests',
  async (params, { rejectWithValue }) => {
    try {
      const res = await soilService.getSoilRequests(params);
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load soil test requests');
    }
  }
);

export const fetchSoilRequestById = createAsyncThunk(
  'soil/fetchSoilRequestById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await soilService.getSoilRequestById(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load soil report');
    }
  }
);

export const bookSoilTest = createAsyncThunk(
  'soil/bookSoilTest',
  async (testData, { rejectWithValue }) => {
    try {
      const res = await soilService.bookSoilTest(testData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to schedule soil sample collection');
    }
  }
);

export const dispatchMobileVan = createAsyncThunk(
  'soil/dispatchMobileVan',
  async (vanData, { rejectWithValue }) => {
    try {
      const res = await soilService.dispatchMobileVan(vanData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to dispatch mobile soil van');
    }
  }
);

export const fetchMobileVanDispatches = createAsyncThunk(
  'soil/fetchMobileVanDispatches',
  async (_, { rejectWithValue }) => {
    try {
      const res = await soilService.getMobileVanDispatches();
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load van dispatches');
    }
  }
);

export const fetchSoilStats = createAsyncThunk(
  'soil/fetchSoilStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await soilService.getSoilStats();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load soil statistics');
    }
  }
);

const initialState = {
  requests: [],
  activeReport: null,
  dispatches: [],
  stats: {
    totalRequests: 0,
    testedParcelsCount: 0,
    completedReports: 0,
    avgOrganicCarbon: '0.82%',
    avgHealthScore: 84,
    validity: 'Valid (2026-2027)',
    activeMobileVans: 2,
    accreditedLabsCount: 2,
  },
  isLoading: false,
  isBooking: false,
  isDispatching: false,
  error: null,
};

const soilSlice = createSlice({
  name: 'soil',
  initialState,
  reducers: {
    clearActiveReport: (state) => {
      state.activeReport = null;
    },
    clearSoilError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Requests
      .addCase(fetchSoilRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSoilRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload;
      })
      .addCase(fetchSoilRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Single Report By ID
      .addCase(fetchSoilRequestById.fulfilled, (state, action) => {
        state.activeReport = action.payload;
      })

      // Book Test
      .addCase(bookSoilTest.pending, (state) => {
        state.isBooking = true;
        state.error = null;
      })
      .addCase(bookSoilTest.fulfilled, (state, action) => {
        state.isBooking = false;
        state.requests.unshift(action.payload);
        state.stats.totalRequests += 1;
      })
      .addCase(bookSoilTest.rejected, (state, action) => {
        state.isBooking = false;
        state.error = action.payload;
      })

      // Dispatch Mobile Van
      .addCase(dispatchMobileVan.pending, (state) => {
        state.isDispatching = true;
        state.error = null;
      })
      .addCase(dispatchMobileVan.fulfilled, (state, action) => {
        state.isDispatching = false;
        state.dispatches.unshift(action.payload);
      })
      .addCase(dispatchMobileVan.rejected, (state, action) => {
        state.isDispatching = false;
        state.error = action.payload;
      })

      // Fetch Mobile Van Dispatches
      .addCase(fetchMobileVanDispatches.fulfilled, (state, action) => {
        state.dispatches = action.payload;
      })

      // Fetch Soil Stats
      .addCase(fetchSoilStats.fulfilled, (state, action) => {
        if (action.payload) {
          state.stats = { ...state.stats, ...action.payload };
        }
      });
  },
});

export const { clearActiveReport, clearSoilError } = soilSlice.actions;
export default soilSlice.reducer;
