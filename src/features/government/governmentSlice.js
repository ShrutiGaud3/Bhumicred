import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import governmentService from './services/governmentService.js';

export const fetchGovernmentDashboard = createAsyncThunk(
  'government/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await governmentService.getDashboardStats();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch government dashboard stats');
    }
  }
);

export const fetchPublicAssets = createAsyncThunk(
  'government/fetchPublicAssets',
  async (params, { rejectWithValue }) => {
    try {
      const response = await governmentService.getPublicAssets(params);
      return response.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch public assets');
    }
  }
);

export const createPublicAsset = createAsyncThunk(
  'government/createPublicAsset',
  async (assetData, { rejectWithValue }) => {
    try {
      const response = await governmentService.createPublicAsset(assetData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create public asset');
    }
  }
);

export const fetchCampaigns = createAsyncThunk(
  'government/fetchCampaigns',
  async (params, { rejectWithValue }) => {
    try {
      const response = await governmentService.getCampaigns(params);
      return response.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch campaigns');
    }
  }
);

export const createCampaign = createAsyncThunk(
  'government/createCampaign',
  async (campaignData, { rejectWithValue }) => {
    try {
      const response = await governmentService.createCampaign(campaignData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create campaign');
    }
  }
);

export const fetchFarmersInArea = createAsyncThunk(
  'government/fetchFarmersInArea',
  async (params, { rejectWithValue }) => {
    try {
      const response = await governmentService.getFarmersInArea(params);
      return response.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch farmers in area');
    }
  }
);

const governmentSlice = createSlice({
  name: 'government',
  initialState: {
    dashboardData: null,
    publicAssets: [],
    campaigns: [],
    farmersInArea: [],
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearGovernmentErrors: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard stats
      .addCase(fetchGovernmentDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGovernmentDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchGovernmentDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Public Assets
      .addCase(fetchPublicAssets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicAssets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicAssets = action.payload;
      })
      .addCase(fetchPublicAssets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Public Asset
      .addCase(createPublicAsset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPublicAsset.fulfilled, (state, action) => {
        state.isLoading = false;
        state.publicAssets.unshift(action.payload);
        state.successMessage = 'Public Asset registered successfully!';
      })
      .addCase(createPublicAsset.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Campaigns
      .addCase(fetchCampaigns.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Campaign
      .addCase(createCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns.unshift(action.payload);
        state.successMessage = 'District Campaign launched successfully!';
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Farmers In Area
      .addCase(fetchFarmersInArea.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFarmersInArea.fulfilled, (state, action) => {
        state.isLoading = false;
        state.farmersInArea = action.payload;
      })
      .addCase(fetchFarmersInArea.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGovernmentErrors } = governmentSlice.actions;
export default governmentSlice.reducer;
