import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { documentService } from './services/documentService.js';

export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (params, { rejectWithValue }) => {
    try {
      const res = await documentService.getDocuments(params);
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load vault documents');
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async (docData, { rejectWithValue }) => {
    try {
      const res = await documentService.uploadDocument(docData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to upload document');
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (id, { rejectWithValue }) => {
    try {
      await documentService.deleteDocument(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete document');
    }
  }
);

export const fetchVaultStats = createAsyncThunk(
  'documents/fetchVaultStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await documentService.getVaultStats();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch vault statistics');
    }
  }
);

export const verifyDocument = createAsyncThunk(
  'documents/verifyDocument',
  async ({ id, status, verificationNotes }, { rejectWithValue }) => {
    try {
      const res = await documentService.verifyDocument(id, { status, verificationNotes });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to verify document');
    }
  }
);

const initialState = {
  documents: [],
  selectedCategory: 'ALL',
  searchQuery: '',
  stats: {
    totalDocs: 0,
    verifiedDocs: 0,
    pendingDocs: 0,
    categoryBreakdown: {
      IDENTITY: 0,
      LAND: 0,
      INSURANCE: 0,
      SOIL: 0,
      OTHER: 0,
    },
  },
  isLoading: false,
  isUploading: false,
  error: null,
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearDocumentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Documents
      .addCase(fetchDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Upload Document
      .addCase(uploadDocument.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isUploading = false;
        state.documents.unshift(action.payload);
        state.stats.totalDocs += 1;
        if (action.payload.status === 'VERIFIED') {
          state.stats.verifiedDocs += 1;
        }
        const cat = action.payload.category || 'OTHER';
        if (state.stats.categoryBreakdown[cat] !== undefined) {
          state.stats.categoryBreakdown[cat] += 1;
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload;
      })

      // Delete Document
      .addCase(deleteDocument.fulfilled, (state, action) => {
        const deletedId = action.payload;
        const index = state.documents.findIndex(
          (d) => d._id === deletedId || d.id === deletedId || d.docId === deletedId
        );
        if (index !== -1) {
          const doc = state.documents[index];
          state.documents.splice(index, 1);
          state.stats.totalDocs = Math.max(0, state.stats.totalDocs - 1);
          if (doc.status === 'VERIFIED') {
            state.stats.verifiedDocs = Math.max(0, state.stats.verifiedDocs - 1);
          }
          const cat = doc.category || 'OTHER';
          if (state.stats.categoryBreakdown[cat] !== undefined) {
            state.stats.categoryBreakdown[cat] = Math.max(0, state.stats.categoryBreakdown[cat] - 1);
          }
        }
      })

      // Vault Stats
      .addCase(fetchVaultStats.fulfilled, (state, action) => {
        if (action.payload) {
          state.stats = action.payload;
        }
      })

      // Verify Document
      .addCase(verifyDocument.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.documents.findIndex(
          (d) => d._id === updated._id || d.docId === updated.docId
        );
        if (index !== -1) {
          state.documents[index] = updated;
        }
      });
  },
});

export const { setSelectedCategory, setSearchQuery, clearDocumentError } = documentsSlice.actions;
export default documentsSlice.reducer;
