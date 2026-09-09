import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { gisService } from './services/gisService.js';

export const fetchGisLayers = createAsyncThunk(
  'gis/fetchLayers',
  async (params, { rejectWithValue }) => {
    try {
      const res = await gisService.getLayers(params);
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load GIS layers');
    }
  }
);

export const fetchMacroMetrics = createAsyncThunk(
  'gis/fetchMacroMetrics',
  async (district, { rejectWithValue }) => {
    try {
      const res = await gisService.getMacroMetrics(district);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch macro GIS metrics');
    }
  }
);

export const analyzePolygon = createAsyncThunk(
  'gis/analyzePolygon',
  async (coordinates, { rejectWithValue }) => {
    try {
      const res = await gisService.analyzePolygon(coordinates);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Geometric analysis failed');
    }
  }
);

export const fetchParcelSpatialData = createAsyncThunk(
  'gis/fetchParcelSpatialData',
  async (landId, { rejectWithValue }) => {
    try {
      const res = await gisService.getParcelSpatialData(landId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load parcel GIS geometry');
    }
  }
);

const initialState = {
  layers: [],
  macroMetrics: {
    district: 'Anand',
    totalParcelsDigitized: 0,
    approvedParcels: 0,
    totalMappedAcres: 0,
    totalStandingTrees: 0,
    macroNdviAverage: 0.71,
    canopyCoverageDensity: '44.8%',
    activeGisLayers: 3,
    satelliteSensor: 'Sentinel-2 MSI Multispectral (10m)',
    lastOrbitalSync: new Date().toISOString(),
  },
  activeLayerMode: 'SATELLITE', // 'SATELLITE' | 'CADASTRAL' | 'NDVI' | 'WATER' | 'TREES'
  selectedParcelSpatial: null,
  layerOpacity: 0.85,
  isLoading: false,
  error: null,
};

const gisSlice = createSlice({
  name: 'gis',
  initialState,
  reducers: {
    setActiveLayerMode: (state, action) => {
      state.activeLayerMode = action.payload;
    },
    setLayerOpacity: (state, action) => {
      state.layerOpacity = action.payload;
    },
    setSelectedParcelSpatial: (state, action) => {
      state.selectedParcelSpatial = action.payload;
    },
    clearGisError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Layers
      .addCase(fetchGisLayers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGisLayers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.layers = action.payload;
      })
      .addCase(fetchGisLayers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Macro Metrics
      .addCase(fetchMacroMetrics.fulfilled, (state, action) => {
        if (action.payload) {
          state.macroMetrics = action.payload;
        }
      })

      // Parcel Spatial Data
      .addCase(fetchParcelSpatialData.fulfilled, (state, action) => {
        state.selectedParcelSpatial = action.payload;
      });
  },
});

export const {
  setActiveLayerMode,
  setLayerOpacity,
  setSelectedParcelSpatial,
  clearGisError,
} = gisSlice.actions;

export default gisSlice.reducer;
