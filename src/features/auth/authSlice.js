import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tokenStorage } from '../../utils/tokenStorage.js';
import { MOCK_USERS } from '../../services/mockData/usersMock.js';
import { ROLES } from '../../constants/roles.js';

// Frontend Mock Async Thunks for OTP and Authentication
export const sendLoginOtp = createAsyncThunk(
  'auth/sendOtp',
  async ({ mobile, role }, { rejectWithValue }) => {
    // Frontend mock delay (400ms)
    await new Promise((r) => setTimeout(r, 400));
    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      return rejectWithValue({ message: 'Please enter a valid 10-digit mobile number' });
    }
    return {
      success: true,
      message: 'OTP sent successfully',
      data: { devOtp: '123456', expiresAt: new Date(Date.now() + 5 * 60000).toISOString() },
    };
  }
);

export const verifyLoginOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ mobile, otp, role }, { rejectWithValue }) => {
    await new Promise((r) => setTimeout(r, 500));
    if (otp !== '123456') {
      return rejectWithValue({ message: 'Invalid OTP code. Please enter 123456 for demo verification.' });
    }

    // Match role from mock users or create session
    const matchedRole = role || ROLES.FARMER;
    const baseMock = MOCK_USERS[matchedRole] || MOCK_USERS.FARMER;
    const user = {
      ...baseMock,
      mobile,
      role: matchedRole,
    };

    const accessToken = 'mock_jwt_token_bhumicred_2026';
    const refreshToken = 'mock_refresh_token_bhumicred_2026';

    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);
    tokenStorage.setUser(user);

    return { user, accessToken, refreshToken };
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    const user = tokenStorage.getUser();
    if (user) return user;
    return rejectWithValue({ message: 'No stored session' });
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    tokenStorage.clearAll();
  }
);

const initialState = {
  user: tokenStorage.getUser() || MOCK_USERS.FARMER, // Pre-seed demo user for rich UI testing
  token: tokenStorage.getAccessToken() || 'mock_jwt_token_bhumicred_2026',
  selectedRole: 'FARMER',
  targetMobile: '9123456780',
  devOtp: '123456',
  isLoading: false,
  isOtpSent: false,
  error: null,
  isAuthenticated: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
      const matched = MOCK_USERS[action.payload] || MOCK_USERS.FARMER;
      state.user = matched;
      tokenStorage.setUser(matched);
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
        tokenStorage.setUser(state.user);
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
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        // keep fallback demo
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
