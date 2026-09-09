import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import schemeService from './services/schemeService.js';

export const fetchSchemes = createAsyncThunk(
  'schemes/fetchSchemes',
  async (params, { rejectWithValue }) => {
    try {
      const response = await schemeService.getSchemes(params);
      return response.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch schemes');
    }
  }
);

export const fetchSchemeById = createAsyncThunk(
  'schemes/fetchSchemeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await schemeService.getSchemeById(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch scheme details');
    }
  }
);

export const applyForScheme = createAsyncThunk(
  'schemes/applyForScheme',
  async ({ schemeId, applicationData }, { rejectWithValue }) => {
    try {
      const response = await schemeService.applyForScheme(schemeId, applicationData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to apply for scheme');
    }
  }
);

const schemesSlice = createSlice({
  name: 'schemes',
  initialState: {
    items: [],
    selectedScheme: null,
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearSchemeErrors: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch schemes
      .addCase(fetchSchemes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSchemes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchSchemes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single scheme
      .addCase(fetchSchemeById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSchemeById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedScheme = action.payload;
      })
      .addCase(fetchSchemeById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Apply for scheme
      .addCase(applyForScheme.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyForScheme.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedScheme = action.payload;
        // update in list if present
        state.items = state.items.map((s) => (s._id === action.payload._id ? action.payload : s));
        state.successMessage = 'Scheme application submitted successfully!';
      })
      .addCase(applyForScheme.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSchemeErrors } = schemesSlice.actions;
export default schemesSlice.reducer;
