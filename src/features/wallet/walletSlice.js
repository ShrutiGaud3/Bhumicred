import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { walletService } from './services/walletService.js';

export const fetchWallet = createAsyncThunk(
  'wallet/fetchWallet',
  async (_, { rejectWithValue }) => {
    try {
      const res = await walletService.getMyWallet();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load wallet');
    }
  }
);

export const topupWallet = createAsyncThunk(
  'wallet/topupWallet',
  async (topupData, { rejectWithValue }) => {
    try {
      const res = await walletService.topupWallet(topupData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to process wallet top-up');
    }
  }
);

export const requestWithdrawal = createAsyncThunk(
  'wallet/requestWithdrawal',
  async (withdrawalData, { rejectWithValue }) => {
    try {
      const res = await walletService.requestWithdrawal(withdrawalData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to process bank payout');
    }
  }
);

export const fetchTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async (params, { rejectWithValue }) => {
    try {
      const res = await walletService.getTransactions(params);
      return {
        transactions: res.data || [],
        pagination: res.pagination,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load transaction ledger');
    }
  }
);

export const fetchAdminTreasury = createAsyncThunk(
  'wallet/fetchAdminTreasury',
  async (_, { rejectWithValue }) => {
    try {
      const res = await walletService.getAdminTreasuryOverview();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load platform treasury');
    }
  }
);

const initialState = {
  wallet: {
    availableBalance: 24500,
    escrowBalance: 12000,
    lockedBalance: 0,
    totalEarnings: 36500,
    totalSpent: 4200,
    rewardPoints: 3200,
    bankAccount: {
      bankName: 'HDFC Bank',
      accountNumber: 'XXXXXX2901',
      ifscCode: 'HDFC0001044',
      accountHolderName: 'Farmer Member',
      upiId: 'farmer@okhdfcbank',
      isVerified: true,
    },
    status: 'ACTIVE',
  },
  transactions: [],
  pagination: null,
  treasury: null,
  isLoading: false,
  isTopupLoading: false,
  isWithdrawLoading: false,
  error: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWalletError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wallet
      .addCase(fetchWallet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.wallet = action.payload;
        }
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Topup Wallet
      .addCase(topupWallet.pending, (state) => {
        state.isTopupLoading = true;
        state.error = null;
      })
      .addCase(topupWallet.fulfilled, (state, action) => {
        state.isTopupLoading = false;
        if (action.payload?.wallet) {
          state.wallet = action.payload.wallet;
        }
        if (action.payload?.transaction) {
          state.transactions.unshift(action.payload.transaction);
        }
      })
      .addCase(topupWallet.rejected, (state, action) => {
        state.isTopupLoading = false;
        state.error = action.payload;
      })

      // Request Withdrawal
      .addCase(requestWithdrawal.pending, (state) => {
        state.isWithdrawLoading = true;
        state.error = null;
      })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.isWithdrawLoading = false;
        if (action.payload?.wallet) {
          state.wallet = action.payload.wallet;
        }
        if (action.payload?.transaction) {
          state.transactions.unshift(action.payload.transaction);
        }
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.isWithdrawLoading = false;
        state.error = action.payload;
      })

      // Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Admin Treasury
      .addCase(fetchAdminTreasury.fulfilled, (state, action) => {
        state.treasury = action.payload;
      });
  },
});

export const { clearWalletError } = walletSlice.actions;
export default walletSlice.reducer;
