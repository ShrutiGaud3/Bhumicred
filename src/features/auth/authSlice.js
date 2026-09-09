import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tokenStorage } from '../../utils/tokenStorage.js';
import { ROLES } from '../../constants/roles.js';
import { storageService } from '../../services/storageService.js';
import { authService } from './services/authService.js';

// Real Database-Driven Async Thunks
export const sendLoginOtp = createAsyncThunk(
  'auth/sendOtp',
  async ({ mobile, role }, { rejectWithValue }) => {
    const cleanMobile = (mobile || '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
    try {
      const res = await authService.sendOtp(cleanMobile, role);
      return res;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || err.message || 'Failed to send OTP. Please check your mobile number.',
      });
    }
  }
);

export const verifyLoginOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ mobile, otp, role }, { rejectWithValue }) => {
    const cleanMobile = (mobile || '').replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');

    try {
      const res = await authService.verifyOtp(cleanMobile, otp, role);
      const { user, accessToken, refreshToken } = res.data;

      // Sync with local registered user storage
      if (user) {
        storageService.saveRegisteredUser(user);
      }

      tokenStorage.setAccessToken(accessToken);
      if (refreshToken) tokenStorage.setRefreshToken(refreshToken);
      tokenStorage.setUser(user);

      return { user, accessToken, refreshToken };
    } catch (err) {
      return rejectWithValue({
        message:
          err.response?.data?.message ||
          'Authentication failed. Please verify your registered mobile number and OTP (123456).',
      });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await authService.register(formData);
      const { user, accessToken, refreshToken } = res.data;

      storageService.saveRegisteredUser(user);
      tokenStorage.setAccessToken(accessToken);
      if (refreshToken) tokenStorage.setRefreshToken(refreshToken);
      tokenStorage.setUser(user);

      // Enqueue to Admin Approvals in local state as well
      storageService.addApprovalItem({
        id: `APP-KYC-${(user.applicationId || '982143').slice(-6)}`,
        type: 'FARMER_KYC',
        title: `Citizen KYC & Registration - ${user.name}`,
        applicantName: user.name,
        applicantRole: user.role,
        applicantPhone: user.mobile,
        submittedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: user.status || 'PENDING_VERIFICATION',
        riskScore: 'LOW',
        details: `${formData.gramPanchayat || ''}, ${formData.city || ''}, ${formData.district || ''}, ${formData.state || ''}`,
        targetId: user.id,
        applicationId: user.applicationId,
        userObject: user,
      });

      return { user, accessToken, refreshToken };
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || 'Registration failed. Please verify your form inputs.',
      });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authService.getMe();
      if (res.data) {
        tokenStorage.setUser(res.data);
        return res.data;
      }
    } catch (e) {
      // Return local token user if valid
    }
    const user = tokenStorage.getUser();
    if (user) return user;
    return rejectWithValue({ message: 'No stored session' });
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authService.logout();
    } catch (e) {
      // Ignore
    }
    tokenStorage.clearAll();
  }
);

const storedUser = tokenStorage.getUser();
const storedToken = tokenStorage.getAccessToken();

const initialState = {
  user: storedUser || null,
  token: storedToken || null,
  selectedRole: storedUser?.role || null,
  targetMobile: '',
  devOtp: '123456',
  isLoading: false,
  isOtpSent: false,
  error: null,
  isAuthenticated: Boolean(storedUser && storedToken),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
    },
    setTargetMobile: (state, action) => {
      state.targetMobile = action.payload;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    resetOtpState: (state) => {
      state.isOtpSent = false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.selectedRole = action.payload?.role || 'FARMER';
      state.isAuthenticated = true;
      tokenStorage.setUser(action.payload);
    },
    setUserStatus: (state, action) => {
      if (state.user) {
        state.user.status = action.payload;
        if (action.payload === 'APPROVED' || action.payload === 'ACTIVE') {
          state.user.kycStatus = 'APPROVED';
        }
        tokenStorage.setUser(state.user);
        storageService.saveRegisteredUser(state.user);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendLoginOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendLoginOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isOtpSent = true;
        state.devOtp = action.payload.data?.devOtp || '123456';
      })
      .addCase(sendLoginOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to send OTP';
      })
      .addCase(verifyLoginOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Invalid OTP';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        // keep fallback
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isOtpSent = false;
      });
  },
});

export const { setSelectedRole, setTargetMobile, clearAuthError, resetOtpState, setUser, setUserStatus } = authSlice.actions;
export default authSlice.reducer;
