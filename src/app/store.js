import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import farmerReducer from '../features/farmer/farmerSlice.js';
import governmentReducer from '../features/government/governmentSlice.js';
import partnerReducer from '../features/partner/partnerSlice.js';
import adminReducer from '../features/admin/adminSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    farmer: farmerReducer,
    government: governmentReducer,
    partner: partnerReducer,
    admin: adminReducer,
  },
});
