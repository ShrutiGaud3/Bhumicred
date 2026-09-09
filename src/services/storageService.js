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
    return [];
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
      title: `Land Title Registration - Khasra ${landWithMeta.khasraNumber || '412/9'} (Survey ${landWithMeta.surveyNumber || '108/A'})`,
      applicantName: landWithMeta.ownerName || landWithMeta.farmerName || landWithMeta.applicantName || 'Citizen Farmer',
      applicantRole: 'FARMER',
      applicantPhone: landWithMeta.ownerMobile || landWithMeta.mobile || '',
      submittedDate: 'Just now',
      status: 'PENDING_REVIEW',
      riskScore: 'LOW',
      details: `${landWithMeta.areaAcres || landWithMeta.area || 8.5} Acres in ${landWithMeta.village || 'Mogri'}, ${landWithMeta.district || 'Anand'}`,
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

  // Registered Users Directory
  getRegisteredUsers: () => {
    try {
      const stored = localStorage.getItem('bhumicred_data_users');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Storage read error for users:', e);
    }
    return [];
  },

  saveRegisteredUser: (user) => {
    if (!user) return;
    const current = storageService.getRegisteredUsers();
    const cleanMobile = user.mobile?.replace(/\D/g, '') || '';
    const filtered = current.filter(
      (u) => (u.mobile?.replace(/\D/g, '') !== cleanMobile && u.id !== user.id && u.applicationId !== user.applicationId)
    );
    const updated = [{ ...user, updatedAt: new Date().toISOString() }, ...filtered];
    localStorage.setItem('bhumicred_data_users', JSON.stringify(updated));
    return user;
  },

  getRegisteredUserByMobile: (mobile) => {
    const cleanMobile = mobile?.replace(/\D/g, '') || '';
    if (!cleanMobile) return null;
    const users = storageService.getRegisteredUsers();
    return users.find((u) => u.mobile?.replace(/\D/g, '') === cleanMobile) || null;
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

    // If Farmer KYC was approved, update the registered users list and current session
    if (targetItem && targetItem.type === 'FARMER_KYC') {
      try {
        const users = storageService.getRegisteredUsers();
        const targetCleanPhone = targetItem.applicantPhone?.replace(/\D/g, '');
        const updatedUsers = users.map((u) => {
          if (
            u.id === targetItem.targetId ||
            u.mobile?.replace(/\D/g, '') === targetCleanPhone ||
            u.applicationId === targetItem.applicationId
          ) {
            return {
              ...u,
              status: status === 'APPROVED' ? 'APPROVED' : status === 'REJECTED' ? 'REJECTED' : 'QUERY_PENDING',
              kycStatus: status === 'APPROVED' ? 'APPROVED' : 'PENDING',
            };
          }
          return u;
        });
        localStorage.setItem('bhumicred_data_users', JSON.stringify(updatedUsers));

        const currentUserData = localStorage.getItem('bhumicred_user_data');
        if (currentUserData) {
          const parsed = JSON.parse(currentUserData);
          if (
            parsed.id === targetItem.targetId ||
            parsed.mobile?.replace(/\D/g, '') === targetCleanPhone ||
            parsed.applicationId === targetItem.applicationId
          ) {
            const updatedUser = {
              ...parsed,
              status: status === 'APPROVED' ? 'APPROVED' : status === 'REJECTED' ? 'REJECTED' : 'QUERY_PENDING',
              kycStatus: status === 'APPROVED' ? 'APPROVED' : 'PENDING',
            };
            localStorage.setItem('bhumicred_user_data', JSON.stringify(updatedUser));
          }
        }
      } catch (e) {
        console.warn('Error syncing KYC user:', e);
      }
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

  // Invoices & Payment Receipts
  getInvoices: () => {
    try {
      const lands = storageService.getLands();
      const extractedFromLands = lands
        .filter((l) => l.invoice)
        .map((l) => ({
          ...l.invoice,
          id: l.invoice.invoiceNumber || `INV-${l.id}`,
          type: 'LAND_REGISTRATION',
          category: 'Land Cadastral Registration & Soil GIS',
          landId: l.id,
          date: l.invoice.invoiceDate || 'Today',
          acres: l.areaAcres || 12.4,
          amount: l.invoice.grandTotal || 2180.17,
          status: 'PAID',
        }));

      const defaultInvoices = [
        {
          id: 'BC-INV-2026-9106',
          invoiceNumber: 'BC-INV-2026-9106',
          transactionId: 'TXN-BHUMI-52525630',
          invoiceDate: '08 Sept 2026',
          invoiceTime: '12:58 PM',
          farmerName: 'Ramesh Patel',
          fatherName: 'Dahybhai Patel',
          mobile: '+91 98765 43210',
          email: 'farmer.ramesh@bhumicred.gov.in',
          address: 'Survey 402/A, Village Mogri, Anand District, Gujarat - 388345',
          surveyNumber: '402/A',
          khasraNumber: '118/2',
          parcelName: 'Registered Agricultural Parcel A',
          acres: 12.4,
          soilTesting: 607.6,
          inspection: 620.0,
          carbonCredit: 434.0,
          fileCharges: 186.0,
          subtotal: 1847.6,
          cgst: 166.28,
          sgst: 166.28,
          gstTotal: 332.57,
          grandTotal: 2180.17,
          paymentMethod: 'BHIM UPI Instant (Verified)',
          type: 'LAND_REGISTRATION',
          category: 'Cadastral GIS Land Registration Fee',
          status: 'PAID & VERIFIED',
        },
        {
          id: 'BC-INV-2026-4421',
          invoiceNumber: 'BC-INV-2026-4421',
          transactionId: 'TXN-BHUMI-33190241',
          invoiceDate: '24 Aug 2026',
          invoiceTime: '10:15 AM',
          farmerName: 'Ramesh Patel',
          fatherName: 'Dahybhai Patel',
          mobile: '+91 98765 43210',
          email: 'farmer.ramesh@bhumicred.gov.in',
          address: 'Survey 108/B, Mogri, Anand, Gujarat',
          surveyNumber: '108/B',
          khasraNumber: '204/1',
          parcelName: 'West Orchard Plot & Sandalwood Grove',
          acres: 8.5,
          soilTesting: 416.5,
          inspection: 425.0,
          carbonCredit: 297.5,
          fileCharges: 127.5,
          subtotal: 1266.5,
          cgst: 113.99,
          sgst: 113.99,
          gstTotal: 227.97,
          grandTotal: 1494.47,
          paymentMethod: 'RuPay Debit Card',
          type: 'LAND_REGISTRATION',
          category: 'Cadastral GIS Land Registration Fee',
          status: 'PAID & VERIFIED',
        },
        {
          id: 'BC-INV-2026-1180',
          invoiceNumber: 'BC-INV-2026-1180',
          transactionId: 'TXN-BHUMI-88219012',
          invoiceDate: '15 July 2026',
          invoiceTime: '03:40 PM',
          farmerName: 'Ramesh Patel',
          fatherName: 'Dahybhai Patel',
          mobile: '+91 98765 43210',
          email: 'farmer.ramesh@bhumicred.gov.in',
          address: 'Survey 402/A, Mogri, Anand, Gujarat',
          surveyNumber: '402/A',
          khasraNumber: '118/2',
          parcelName: 'Teakwood & Mango Agroforestry Shield',
          acres: 12.4,
          soilTesting: 0,
          inspection: 0,
          carbonCredit: 0,
          fileCharges: 0,
          subtotal: 1425.0,
          cgst: 128.25,
          sgst: 128.25,
          gstTotal: 256.5,
          grandTotal: 1681.5,
          paymentMethod: 'State Bank of India NetBanking',
          type: 'TREE_INSURANCE',
          category: 'Comprehensive Tree Insurance Policy Premium',
          status: 'PAID & VERIFIED',
        },
      ];

      // Merge and remove duplicates by invoiceNumber
      const combined = [...extractedFromLands, ...defaultInvoices];
      const seen = new Set();
      return combined.filter((item) => {
        const key = item.invoiceNumber || item.id;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    } catch (e) {
      console.warn('Error fetching invoices:', e);
      return [];
    }
  },

  // Reports (Soil, GIS, Drone, Carbon)
  getReports: () => {
    return [
      {
        id: 'REP-SOIL-2026-08',
        title: 'Comprehensive N-P-K & Soil Nutrient Laboratory Card',
        category: 'Soil Health',
        issuedDate: '01 Sept 2026',
        parcel: 'Survey 402/A (12.4 Acres)',
        authority: 'Anand District Agri Chemistry Central Lab',
        status: 'READY & CERTIFIED',
        score: '84/100 (Optimal Fertility)',
        parameters: { nitrogen: 'Medium (280 kg/ha)', phosphorus: 'Optimal (22 kg/ha)', potassium: 'High (340 kg/ha)', ph: '7.2 (Neutral)' },
        fileSize: '2.4 MB PDF',
      },
      {
        id: 'REP-GIS-2026-92',
        title: 'High-Resolution Satellite GIS Cadastral Boundary Audit',
        category: 'GIS & Land RoR',
        issuedDate: '08 Sept 2026',
        parcel: 'Survey 402/A • Khasra 118/2',
        authority: 'State Remote Sensing & Bhulekh Verification Directorate',
        status: 'VERIFIED & SYNCED',
        score: '100% Perimeter Match',
        parameters: { vertices: '5 Geo-corners', perimeter: '920 meters', droneResolution: '3.2 cm/pixel' },
        fileSize: '3.8 MB PDF',
      },
      {
        id: 'REP-CARB-2026-14',
        title: 'Agroforestry Biomass Carbon Sequestration Baseline Audit',
        category: 'Carbon Credits',
        issuedDate: '28 Aug 2026',
        parcel: 'Survey 402/A • 45 Standing Timber Trees',
        authority: 'Global Carbon Agro-Registry & TerraAgri Labs',
        status: 'ACCREDITED (MINT READY)',
        score: '18.6 tCO2e Annual Carbon Offset',
        parameters: { treeDensity: '3.6/acre', timberMaturity: '8.5 Years', carbonPriceEst: '₹1,850/ton' },
        fileSize: '1.9 MB PDF',
      },
      {
        id: 'REP-TREE-2026-31',
        title: 'Biometric Individual Tree Health & LiDAR Canopy Scan',
        category: 'Tree Asset Audit',
        issuedDate: '15 Aug 2026',
        parcel: 'Survey 108/B (8.5 Acres)',
        authority: 'National Agroforestry Board Assessment Unit',
        status: 'PASSED (LOW RISK)',
        score: '96% Canopy Vitality',
        parameters: { treeTypes: 'Teak, Sandalwood, Neem', averageHeight: '9.4 meters', pestRisk: 'Low' },
        fileSize: '4.2 MB PDF',
      },
    ];
  },

  // Reset to initial factory mocks
  resetToFactoryDefaults: () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
};
