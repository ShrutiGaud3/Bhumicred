import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import farmerReducer from '../features/farmer/farmerSlice.js';
import governmentReducer from '../features/government/governmentSlice.js';
import partnerReducer from '../features/partner/partnerSlice.js';
import adminReducer from '../features/admin/adminSlice.js';
import documentsReducer from '../features/documents/documentsSlice.js';
import gisReducer from '../features/gis/gisSlice.js';
import insuranceReducer from '../features/insurance/insuranceSlice.js';
import soilReducer from '../features/soil/soilSlice.js';
import marketplaceReducer from '../features/marketplace/marketplaceSlice.js';
import projectReducer from '../features/projects/projectSlice.js';
import schemesReducer from '../features/schemes/schemesSlice.js';
import carbonReducer from '../features/carbon/carbonSlice.js';
import walletReducer from '../features/wallet/walletSlice.js';
import notificationReducer from '../features/notifications/notificationSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    farmer: farmerReducer,
    government: governmentReducer,
    partner: partnerReducer,
    admin: adminReducer,
    documents: documentsReducer,
    gis: gisReducer,
    insurance: insuranceReducer,
    soil: soilReducer,
    marketplace: marketplaceReducer,
    projects: projectReducer,
    schemes: schemesReducer,
    carbon: carbonReducer,
    wallet: walletReducer,
    notifications: notificationReducer,
  },
});

