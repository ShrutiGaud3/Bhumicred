import { MOCK_LANDS } from './mockData/landsMock.js';
import { MOCK_CLAIMS, MOCK_POLICIES } from './mockData/insuranceMock.js';
import { MOCK_SOIL_REQUESTS } from './mockData/soilMock.js';
import { MOCK_APPROVALS } from './mockData/approvalsMock.js';
import { MOCK_WALLET } from './mockData/walletMock.js';

const STORAGE_KEYS = {
  LANDS: 'bhumicred_data_lands',
  CLAIMS: 'bhumicred_data_claims',
  POLICIES: 'bhumicred_data_policies',
  SOIL: 'bhumicred_data_soil',
  APPROVALS: 'bhumicred_data_approvals',
  WALLET: 'bhumicred_data_wallet',
};

export const storageService = {
  // Lands
  getLands: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LANDS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return MOCK_LANDS;
  },

  saveLand: (newLand) => {
    const current = storageService.getLands();
    const landWithMeta = {
      ...newLand,
      id: newLand.id || `LND-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: newLand.status || 'PENDING_VERIFICATION'
    };
    const updated = [landWithMeta, ...current];
    localStorage.setItem(STORAGE_KEYS.LANDS, JSON.stringify(updated));

    // Also add to Admin Approvals queue automatically!
    storageService.addApprovalItem({
      id: `APP-LND-${landWithMeta.id}`,
      type: 'LAND_REGISTRATION',
      title: `Land Title Registration - Khasra ${landWithMeta.khasraNumber}`,
      applicantName: 'Ramesh Patel',
      applicantRole: 'FARMER',
      applicantPhone: '+91 98765 43210',
      submittedDate: 'Just now',
      status: 'PENDING_REVIEW',
      riskScore: 'LOW',
      details: `${landWithMeta.areaAcres || 8.5} Acres in ${landWithMeta.village || 'Navli'}, ${landWithMeta.district || 'Anand'}`,
      targetId: landWithMeta.id
    });

    return landWithMeta;
  },

  // Approvals
  getApprovals: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPROVALS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return MOCK_APPROVALS;
  },

  addApprovalItem: (item) => {
    const current = storageService.getApprovals();
    const updated = [item, ...current];
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(updated));
    return updated;
  },

  updateApprovalStatus: (id, status, notes = '') => {
    const current = storageService.getApprovals();
    const targetItem = current.find(a => a.id === id);
    const updated = current.map(a => a.id === id ? { ...a, status, reviewNotes: notes } : a);
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(updated));

    // If land was approved, update the land in lands store too!
    if (targetItem && targetItem.type === 'LAND_REGISTRATION' && targetItem.targetId) {
      const lands = storageService.getLands();
      const updatedLands = lands.map(l => l.id === targetItem.targetId ? { ...l, status: status === 'APPROVED' ? 'VERIFIED' : 'REJECTED' } : l);
      localStorage.setItem(STORAGE_KEYS.LANDS, JSON.stringify(updatedLands));
    }

    return updated;
  },

  // Claims
  getClaims: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLAIMS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return MOCK_CLAIMS;
  },

  saveClaim: (claim) => {
    const current = storageService.getClaims();
    const claimWithId = {
      ...claim,
      id: claim.id || `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString()
    };
    const updated = [claimWithId, ...current];
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(updated));
    return claimWithId;
  },

  // Soil Requests
  getSoilRequests: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SOIL);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return MOCK_SOIL_REQUESTS;
  },

  saveSoilRequest: (req) => {
    const current = storageService.getSoilRequests();
    const reqWithId = {
      ...req,
      id: req.id || `SOIL-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'SAMPLE_COLLECTION_PENDING',
      createdAt: new Date().toISOString()
    };
    const updated = [reqWithId, ...current];
    localStorage.setItem(STORAGE_KEYS.SOIL, JSON.stringify(updated));
    return reqWithId;
  },

  // Reset to initial factory mocks
  resetToFactoryDefaults: () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
};
