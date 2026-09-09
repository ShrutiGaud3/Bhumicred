import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from './services/projectService.js';

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await projectService.getProjects(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await projectService.getProjectById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch project details');
    }
  }
);

export const enrollLandInProject = createAsyncThunk(
  'projects/enrollLand',
  async ({ projectId, landId }, { rejectWithValue }) => {
    try {
      const response = await projectService.enrollLand(projectId, landId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to enroll land in project');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await projectService.createProject(projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

export const updateProjectMilestone = createAsyncThunk(
  'projects/updateMilestone',
  async ({ projectId, milestoneIndex, milestoneData }, { rejectWithValue }) => {
    try {
      const response = await projectService.updateMilestone(projectId, milestoneIndex, milestoneData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update milestone');
    }
  }
);

export const fetchProjectStats = createAsyncThunk(
  'projects/fetchProjectStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectService.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  stats: null,
  loading: false,
  enrolling: false,
  error: null,
  enrollSuccess: false,
};

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    resetEnrollStatus: (state) => {
      state.enrollSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProjects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload || [];
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchProjectById
    builder
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // enrollLandInProject
    builder
      .addCase(enrollLandInProject.pending, (state) => {
        state.enrolling = true;
        state.error = null;
        state.enrollSuccess = false;
      })
      .addCase(enrollLandInProject.fulfilled, (state, action) => {
        state.enrolling = false;
        state.enrollSuccess = true;
        const updated = action.payload;
        const index = state.projects.findIndex((p) => (p._id || p.id) === (updated._id || updated.id));
        if (index >= 0) {
          state.projects[index] = updated;
        }
        if (state.currentProject && (state.currentProject._id || state.currentProject.id) === (updated._id || updated.id)) {
          state.currentProject = updated;
        }
      })
      .addCase(enrollLandInProject.rejected, (state, action) => {
        state.enrolling = false;
        state.error = action.payload;
      });

    // createProject
    builder
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
      });

    // updateMilestone
    builder
      .addCase(updateProjectMilestone.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.projects.findIndex((p) => (p._id || p.id) === (updated._id || updated.id));
        if (index >= 0) {
          state.projects[index] = updated;
        }
        if (state.currentProject && (state.currentProject._id || state.currentProject.id) === (updated._id || updated.id)) {
          state.currentProject = updated;
        }
      });

    // fetchProjectStats
    builder
      .addCase(fetchProjectStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearCurrentProject, resetEnrollStatus } = projectSlice.actions;
export default projectSlice.reducer;
