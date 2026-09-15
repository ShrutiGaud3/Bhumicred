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
  SUPPORT_TICKETS: 'bhumicred_data_support_tickets',
  CARBON_AUDITS: 'bhumicred_data_carbon_audits',
};

// Automatic cleanup of legacy/dummy farmer entries & auth sessions in client browser localStorage
try {
  const isMigrated = typeof window !== 'undefined' && localStorage.getItem('bhumicred_storage_clean_v8');
  if (!isMigrated && typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.APPROVALS);
    localStorage.removeItem(STORAGE_KEYS.LANDS);
    localStorage.removeItem(STORAGE_KEYS.CLAIMS);
    localStorage.removeItem(STORAGE_KEYS.POLICIES);
    localStorage.removeItem(STORAGE_KEYS.SOIL);
    localStorage.removeItem(STORAGE_KEYS.CARBON_AUDITS);
    localStorage.removeItem(STORAGE_KEYS.WALLET);
    localStorage.removeItem(STORAGE_KEYS.SUPPORT_TICKETS);
    localStorage.removeItem('bhumicred_data_users');
    localStorage.removeItem('bhumicred_user_data');
    localStorage.removeItem('bhumicred_access_token');
    localStorage.removeItem('bhumicred_refresh_token');
    localStorage.removeItem('bhumicred_token');
    localStorage.setItem('bhumicred_storage_clean_v8', 'true');
  }
} catch (e) {}

export const storageService = {
  // Clear all local storage records
  clearAllLocalStorage: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
      localStorage.removeItem('bhumicred_data_users');
    } catch (e) {}
  },
  // Lands
  getLands: (userIdOrMobile = null) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LANDS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!userIdOrMobile) return parsed;
        const clean = String(userIdOrMobile).replace(/\D/g, '');
        return parsed.filter((l) => {
          if (l.ownerId && String(l.ownerId) === String(userIdOrMobile)) return true;
          if (l.userId && String(l.userId) === String(userIdOrMobile)) return true;
          if (clean && l.ownerMobile && l.ownerMobile.replace(/\D/g, '') === clean) return true;
          if (clean && l.mobile && l.mobile.replace(/\D/g, '') === clean) return true;
          if (l.ownerName && l.ownerName.toLowerCase() === String(userIdOrMobile).toLowerCase()) return true;
          return false;
        });
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return [];
  },

  saveLand: (newLand) => {
    const current = storageService.getLands();
    const generatedId = newLand.id || newLand.landId || `LND-${Math.floor(1000 + Math.random() * 9000)}`;
    const landWithMeta = {
      ...newLand,
      id: generatedId,
      landId: generatedId,
      createdAt: newLand.createdAt || new Date().toISOString(),
      status: newLand.status || 'PENDING_VERIFICATION'
    };
    const updated = [landWithMeta, ...current.filter((l) => l.id !== generatedId && l.landId !== generatedId)];
    localStorage.setItem(STORAGE_KEYS.LANDS, JSON.stringify(updated));

    // Also add to Admin Approvals queue automatically!
    storageService.addApprovalItem({
      id: `APP-LND-${landWithMeta.id}`,
      applicationId: `APP-LND-${landWithMeta.id}`,
      type: 'LAND_REGISTRATION',
      title: `Land Title Registration - Khasra ${landWithMeta.khasraNumber || '412/9'} (Survey ${landWithMeta.surveyNumber || '108/A'})`,
      applicantName: landWithMeta.ownerName || landWithMeta.farmerName || landWithMeta.applicantName || 'Citizen Farmer',
      applicantRole: 'FARMER',
      applicantPhone: landWithMeta.ownerMobile || landWithMeta.mobile || '',
      submittedDate: 'Just now',
      submittedAt: new Date().toISOString(),
      createdAt: landWithMeta.createdAt || new Date().toISOString(),
      timestamp: landWithMeta.createdAt || new Date().toISOString(),
      status: 'PENDING_VERIFICATION',
      riskScore: 'LOW',
      details: `${landWithMeta.areaAcres || landWithMeta.area || 8.5} Acres in ${landWithMeta.village || 'Mogri'}, ${landWithMeta.district || 'Anand'}`,
      targetId: landWithMeta.id
    });

    // Also auto-generate Active Tree Insurance Policy if opted!
    if (landWithMeta.optInsurance || landWithMeta.treesInsured) {
      const treeCount = Number(landWithMeta.insuredTreeCount || landWithMeta.standingTreeCount || landWithMeta.treeCount || 50);
      const sumInsured = treeCount * 8000;
      const grossPremium = Math.round(sumInsured * 0.0125 * 3 * 0.9);
      const subsidy = Math.round(grossPremium * 0.4);
      const netPayable = grossPremium - subsidy;

      storageService.savePolicy({
        id: `BC-POL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        policyNumber: `BC-POL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        userName: landWithMeta.ownerName || landWithMeta.farmerName || 'Citizen Farmer',
        userMobile: landWithMeta.ownerMobile || landWithMeta.mobile || '',
        userId: landWithMeta.ownerId || landWithMeta.userId || '',
        landId: landWithMeta.id,
        landName: landWithMeta.landName || 'Registered Agricultural Parcel',
        surveyNumber: landWithMeta.surveyNumber || '108/A',
        khasraNumber: landWithMeta.khasraNumber || '412/9',
        planName: landWithMeta.insurancePlan || 'Parametric Indian Teak (Sagwan) Sovereign Cover',
        category: 'Commercial Agroforestry',
        insuredTreeCount: treeCount,
        treeCount: treeCount,
        speciesSummary: 'Indian Teak & High-Yield Agroforestry',
        sumInsured: sumInsured,
        annualPremium: Math.round(sumInsured * 0.0125),
        grossPremium: grossPremium,
        governmentSubsidyPercent: 40,
        governmentSubsidyAmount: subsidy,
        farmerNetPayable: netPayable,
        durationMonths: 36,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 36 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
        paymentStatus: 'PAID',
        coverageDetails: [
          'Storm, Cyclone & Windthrow (>70 km/h)',
          'Forest & Agro Fire Perils',
          'Stem Borer Infestation & Root Rot Outbreaks',
          'Severe Drought Stress (Revenue Trigger)',
          'Lightning Strike & Frost Damage',
        ],
      });
    }

    return landWithMeta;
  },

  // Approvals
  getApprovals: () => {
    let list = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPROVALS);
      if (stored) {
        list = JSON.parse(stored).filter((a) => !a.id?.startsWith('appr_'));
      }
    } catch (e) {
      list = [];
    }

    // Auto-inject any registered user KYC applications
    try {
      const storedUsers = storageService.getRegisteredUsers();
      storedUsers.forEach((u) => {
        const uCleanPhone = (u.mobile || '').replace(/\D/g, '');
        const appId = u.applicationId || `APP-USR-${u.id}`;
        
        const existingIndex = list.findIndex(
          (a) =>
            (a.type === 'FARMER_KYC' || a.type === 'GOVERNMENT_ONBOARDING' || a.type === 'PARTNER_ONBOARDING') &&
            (a.id === appId ||
              a.applicationId === appId ||
              a.targetId === u.id ||
              (a.applicantPhone && uCleanPhone && a.applicantPhone.replace(/\D/g, '') === uCleanPhone))
        );

        if (existingIndex >= 0) {
          // If the user is already approved/rejected in users store, ensure approval list reflects it
          if (u.status === 'APPROVED' || u.status === 'REJECTED' || u.status === 'ACTIVE') {
            list[existingIndex].status = u.status === 'ACTIVE' ? 'APPROVED' : u.status;
          }
        } else if (
          u.status === 'PENDING_APPROVAL' ||
          u.status === 'PENDING_VERIFICATION' ||
          u.status === 'PENDING_REVIEW' ||
          u.status === 'PENDING'
        ) {
          const appType =
            u.role === 'PARTNER'
              ? 'PARTNER_ONBOARDING'
              : u.role === 'GOVERNMENT'
              ? 'GOVERNMENT_ONBOARDING'
              : 'FARMER_KYC';
          const appTitle =
            u.role === 'PARTNER'
              ? `Partner Business Licensing - ${u.name || 'Partner'}`
              : u.role === 'GOVERNMENT'
              ? `Government Official Verification - ${u.name || 'Official'}`
              : `Citizen Aadhaar KYC - ${u.name || 'Citizen Applicant'}`;

          list.unshift({
            id: appId,
            applicationId: appId,
            type: appType,
            title: appTitle,
            applicantName: u.name || 'Citizen Applicant',
            applicantRole: u.role || 'FARMER',
            applicantPhone: u.mobile || '',
            submittedDate: 'Recently Submitted',
            submittedAt: u.updatedAt || u.createdAt || new Date().toISOString(),
            createdAt: u.updatedAt || u.createdAt || new Date().toISOString(),
            timestamp: u.updatedAt || u.createdAt || new Date().toISOString(),
            status: u.status || 'PENDING_VERIFICATION',
            riskScore: 'LOW',
            details: `Village: ${u.address?.village || u.village || 'Local'} • Mobile: ${u.mobile || ''}`,
            targetId: u.id,
          });
        }
      });
    } catch (e) {}

    // Auto-inject any locally stored lands that are pending verification
    try {
      const storedLands = storageService.getLands();
      storedLands.forEach((land) => {
        const appId = `APP-LND-${land.id || land.landId}`;
        const existingIndex = list.findIndex(
          (a) =>
            a.id === appId ||
            a.applicationId === appId ||
            a.targetId === land.id ||
            a.targetId === land.landId ||
            (a.type === 'LAND_REGISTRATION' && a.id === `APP-LND-${land.id}`)
        );
        
        if (existingIndex >= 0) {
          if (land.status === 'APPROVED' || land.status === 'REJECTED' || land.status === 'ACTIVE') {
            list[existingIndex].status = land.status === 'ACTIVE' ? 'APPROVED' : land.status;
          }
        } else if (land.status === 'PENDING_VERIFICATION' || land.status === 'PENDING_REVIEW' || !land.status) {
          list.unshift({
            id: appId,
            applicationId: appId,
            type: 'LAND_REGISTRATION',
            title: `Land Title Registration - ${land.landName || 'Plot'} - Khasra ${land.khasraNumber || 'N/A'} (Survey ${land.surveyNumber || 'N/A'})`,
            applicantName: land.ownerName || land.farmerName || 'Citizen Farmer',
            applicantRole: 'FARMER',
            applicantPhone: land.ownerMobile || land.mobile || '',
            submittedDate: 'Just now',
            submittedAt: land.createdAt || new Date().toISOString(),
            createdAt: land.createdAt || new Date().toISOString(),
            timestamp: land.createdAt || new Date().toISOString(),
            status: land.status || 'PENDING_VERIFICATION',
            riskScore: 'LOW',
            details: `${land.area || land.areaAcres || 0} Acres in ${land.village || land.district || 'Local'}`,
            targetId: land.id || land.landId,
          });
        }
      });
    } catch (e) {}

    // Auto-inject any locally stored insurance claims that are pending verification
    try {
      const storedClaims = storageService.getClaims();
      storedClaims.forEach((claim) => {
        const appId = `APP-CLM-${claim.claimNumber || claim.id}`;
        const existingIndex = list.findIndex(
          (a) => a.id === appId || a.applicationId === appId || a.targetId === claim.id || a.id === claim.claimNumber
        );

        if (existingIndex >= 0) {
          if (claim.status === 'APPROVED' || claim.status === 'SETTLED' || claim.status === 'REJECTED') {
            list[existingIndex].status = claim.status === 'REJECTED' ? 'REJECTED' : 'APPROVED';
          }
        } else if (
          claim.status === 'SUBMITTED' ||
          claim.status === 'PENDING_VERIFICATION' ||
          claim.status === 'PENDING' ||
          claim.status === 'UNDER_REVIEW' ||
          !claim.status
        ) {
          list.unshift({
            id: appId,
            applicationId: appId,
            type: 'INSURANCE_CLAIM',
            title: `Tree Loss Insurance Claim - ${claim.incidentType || 'Tree Loss'} (${claim.affectedTreeCount || 0} Trees)`,
            applicantName: claim.applicantName || claim.userName || 'Insured Farmer',
            applicantRole: 'FARMER',
            applicantPhone: claim.applicantPhone || claim.userMobile || claim.mobile || '',
            submittedDate: 'Recently Submitted',
            submittedAt: claim.createdAt || new Date().toISOString(),
            createdAt: claim.createdAt || new Date().toISOString(),
            timestamp: claim.createdAt || new Date().toISOString(),
            status: 'PENDING_VERIFICATION',
            riskScore: 'LOW',
            details: `Policy: ${claim.policyNumber || 'BC-POL'} • Estimated Loss: ₹${(Number(claim.estimatedLoss) || 0).toLocaleString('en-IN')}`,
            targetId: claim.id || claim.claimNumber,
          });
        }
      });
    } catch (e) {}

    // Sort by recent timestamp on top
    list.sort((a, b) => {
      const tA = new Date(a.timestamp || a.createdAt || a.submittedAt || 0).getTime();
      const tB = new Date(b.timestamp || b.createdAt || b.submittedAt || 0).getTime();
      return tB - tA;
    });

    return list;
  },

  addApprovalItem: (item) => {
    const current = storageService.getApprovals();
    const filtered = current.filter((c) => c.id !== item.id && c.applicationId !== item.id && (!item.targetId || c.targetId !== item.targetId));
    const updated = [item, ...filtered];
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(updated));
    return updated;
  },

  // Registered Users Directory
  getRegisteredUsers: () => {
    try {
      const stored = localStorage.getItem('bhumicred_data_users');
      if (stored) {
        return JSON.parse(stored);
      }
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
    const cleanPhoneFromId = String(id || '').replace(/\D/g, '');
    let targetItem = current.find(
      (a) =>
        a.id === id ||
        a.applicationId === id ||
        a.targetId === id ||
        (cleanPhoneFromId.length >= 10 && a.applicantPhone && a.applicantPhone.replace(/\D/g, '') === cleanPhoneFromId)
    );

    let foundInCurrent = false;
    const updated = current.map((a) => {
      const aCleanPhone = (a.applicantPhone || '').replace(/\D/g, '');
      const match =
        a.id === id ||
        a.applicationId === id ||
        a.targetId === id ||
        (cleanPhoneFromId.length >= 10 && aCleanPhone === cleanPhoneFromId);
      if (match) {
        foundInCurrent = true;
        return { ...a, status, reviewNotes: notes };
      }
      return a;
    });

    if (!foundInCurrent && targetItem) {
      updated.unshift({ ...targetItem, status, reviewNotes: notes });
    } else if (!foundInCurrent && id) {
      updated.unshift({ id, applicationId: id, status, reviewNotes: notes });
    }

    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(updated));

    // If land was approved, update the land in lands store too!
    if (targetItem && (targetItem.type === 'LAND_REGISTRATION' || String(targetItem.id || '').startsWith('APP-LND-') || String(id || '').startsWith('APP-LND-'))) {
      const rawId = targetItem?.targetId || targetItem?.id?.replace(/^APP-LND-/, '') || id?.replace(/^APP-LND-/, '');
      const lands = storageService.getLands();
      const targetLandStatus = status === 'APPROVED' ? 'APPROVED' : status === 'REJECTED' ? 'REJECTED' : 'QUERY_RAISED';
      const updatedLands = lands.map((l) =>
        l.id === rawId || l.landId === rawId || `APP-LND-${l.id}` === targetItem?.id || `APP-LND-${l.landId}` === targetItem?.id || `APP-LND-${l.id}` === id || `APP-LND-${l.landId}` === id
          ? { ...l, status: targetLandStatus }
          : l
      );
      localStorage.setItem(STORAGE_KEYS.LANDS, JSON.stringify(updatedLands));
    }

    // If insurance claim was approved/settled, update the claims store and add timeline milestone
    if (
      targetItem &&
      (targetItem.type === 'INSURANCE_CLAIM' ||
        String(targetItem.id || '').startsWith('APP-CLM-') ||
        String(id || '').startsWith('APP-CLM-') ||
        String(id || '').startsWith('CLM-'))
    ) {
      const rawClaimId = targetItem?.targetId || targetItem?.id?.replace(/^APP-CLM-/, '') || id?.replace(/^APP-CLM-/, '');
      const claims = storageService.getClaims();
      const targetClaimStatus = status === 'APPROVED' ? 'SETTLED' : status === 'REJECTED' ? 'REJECTED' : 'UNDER_REVIEW';
      const updatedClaims = claims.map((c) => {
        const isMatch =
          c.id === rawClaimId ||
          c.claimNumber === rawClaimId ||
          `APP-CLM-${c.id}` === targetItem?.id ||
          `APP-CLM-${c.claimNumber}` === targetItem?.id ||
          `APP-CLM-${c.id}` === id ||
          `APP-CLM-${c.claimNumber}` === id;
        if (isMatch) {
          return {
            ...c,
            status: targetClaimStatus,
            timeline: [
              ...(c.timeline || []),
              {
                title: status === 'APPROVED' ? 'DBT Direct Settlement Approved' : 'Claim Audit Decision',
                timestamp: 'Just now',
                completed: true,
                remarks: notes || `Super Admin finalized claim settlement decision as ${status}`,
              },
            ],
          };
        }
        return c;
      });
      localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(updatedClaims));
    }

    // Always synchronize User status across all user types (FARMER_KYC, GOVERNMENT_ONBOARDING, PARTNER_ONBOARDING, etc.)
    try {
      const users = storageService.getRegisteredUsers();
      const targetCleanPhone = (targetItem?.applicantPhone || cleanPhoneFromId || '').replace(/\D/g, '');
      const updatedUsers = users.map((u) => {
        const uCleanPhone = (u.mobile || '').replace(/\D/g, '');
        if (
          (targetItem && u.id === targetItem.targetId) ||
          u.id === id ||
          u.applicationId === id ||
          (targetItem && u.applicationId === targetItem.applicationId) ||
          (targetCleanPhone && uCleanPhone === targetCleanPhone)
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
        const pCleanPhone = (parsed.mobile || '').replace(/\D/g, '');
        if (
          (targetItem && parsed.id === targetItem.targetId) ||
          parsed.id === id ||
          parsed.applicationId === id ||
          (targetItem && parsed.applicationId === targetItem.applicationId) ||
          (targetCleanPhone && pCleanPhone === targetCleanPhone)
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

    return updated;
  },

  // Claims
  getClaims: (userIdOrMobile = null) => {
    let list = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLAIMS);
      if (stored) list = JSON.parse(stored);
    } catch (e) {}
    if (!userIdOrMobile) return list;
    const cleanMobile = String(userIdOrMobile).replace(/\D/g, '');
    return list.filter((c) => {
      const cMobile = (c.userMobile || c.mobile || c.applicantPhone || '').replace(/\D/g, '');
      if (cleanMobile && cMobile && (cMobile === cleanMobile || cMobile.endsWith(cleanMobile) || cleanMobile.endsWith(cMobile))) return true;
      if (c.userId && String(c.userId) === String(userIdOrMobile)) return true;
      if (c.userName && String(c.userName).trim().toLowerCase() === String(userIdOrMobile).trim().toLowerCase()) return true;
      return false;
    });
  },

  saveClaim: (claim) => {
    const current = storageService.getClaims();

    // Restriction: Only 1 claim allowed per policy
    const targetPolicyNumber = claim.policyNumber;
    const targetPolicyId = claim.policyId;
    const existing = current.find(
      (c) =>
        (targetPolicyNumber && (c.policyNumber === targetPolicyNumber || c.policyId === targetPolicyNumber)) ||
        (targetPolicyId && (c.policyId === targetPolicyId || c.policyNumber === targetPolicyId))
    );
    if (existing) {
      return existing;
    }

    const claimWithId = {
      ...claim,
      id: claim.id || `CLM-${Math.floor(1000 + Math.random() * 9000)}`,
      claimNumber: claim.claimNumber || `BC-CLM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    };
    const updated = [claimWithId, ...current];
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(updated));

    // Automatically inject into Super Admin approval queue immediately
    try {
      const appId = `APP-CLM-${claimWithId.claimNumber}`;
      storageService.addApprovalItem({
        id: appId,
        applicationId: appId,
        type: 'INSURANCE_CLAIM',
        title: `Tree Loss Insurance Claim - ${claimWithId.incidentType || 'Tree Loss'} (${claimWithId.affectedTreeCount || 0} Trees)`,
        applicantName: claimWithId.applicantName || claimWithId.userName || 'Insured Farmer',
        applicantRole: 'FARMER',
        applicantPhone: claimWithId.applicantPhone || claimWithId.userMobile || claimWithId.mobile || '',
        submittedDate: 'Just now',
        submittedAt: claimWithId.createdAt,
        createdAt: claimWithId.createdAt,
        timestamp: claimWithId.createdAt,
        status: 'PENDING_VERIFICATION',
        riskScore: 'LOW',
        details: `Policy: ${claimWithId.policyNumber || 'BC-POL'} • Estimated Loss: ₹${(Number(claimWithId.estimatedLoss) || 0).toLocaleString('en-IN')}`,
        targetId: claimWithId.id || claimWithId.claimNumber,
      });
    } catch (e) {}

    return claimWithId;
  },

  // Soil Requests
  getSoilRequests: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SOIL);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
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

  // Insurance Policies
  getPolicies: (userIdOrMobile = null) => {
    let policies = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.POLICIES);
      policies = stored ? JSON.parse(stored) : [];
    } catch (e) {
      policies = [];
    }

    // Also auto-synthesize policies from any insured lands in local storage
    try {
      const lands = storageService.getLands(userIdOrMobile);
      lands.forEach((l) => {
        if (l.optInsurance || l.treesInsured) {
          const landPolId = `BC-POL-${l.id || l.landId}`;
          const exists = policies.some((p) => p.landId === l.id || p.landId === l.landId || p.id === landPolId);
          if (!exists) {
            const treeCount = Number(l.insuredTreeCount || l.standingTreeCount || l.treeCount || 50);
            const sumInsured = treeCount * 8000;
            const gross = Math.round(sumInsured * 0.0125 * 3 * 0.9);
            const sub = Math.round(gross * 0.4);
            policies.unshift({
              id: landPolId,
              policyNumber: landPolId,
              userName: l.ownerName || l.farmerName || 'Citizen Farmer',
              userMobile: l.ownerMobile || l.mobile || '',
              userId: l.ownerId || l.userId || '',
              landId: l.id || l.landId,
              landName: l.landName || 'Registered Agricultural Parcel',
              surveyNumber: l.surveyNumber || '108/A',
              khasraNumber: l.khasraNumber || '412/9',
              planName: l.insurancePlan || 'Parametric Indian Teak (Sagwan) Sovereign Cover',
              category: 'Commercial Agroforestry',
              insuredTreeCount: treeCount,
              treeCount: treeCount,
              speciesSummary: 'Indian Teak & High-Yield Agroforestry',
              sumInsured: sumInsured,
              annualPremium: Math.round(sumInsured * 0.0125),
              grossPremium: gross,
              governmentSubsidyPercent: 40,
              governmentSubsidyAmount: sub,
              farmerNetPayable: gross - sub,
              durationMonths: 36,
              startDate: l.createdAt || new Date().toISOString(),
              endDate: new Date(Date.now() + 36 * 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'ACTIVE',
              paymentStatus: 'PAID',
              coverageDetails: [
                'Storm, Cyclone & Windthrow (>70 km/h)',
                'Forest & Agro Fire Perils',
                'Stem Borer Infestation & Root Rot Outbreaks',
                'Severe Drought Stress (Revenue Trigger)',
                'Lightning Strike & Frost Damage',
              ],
            });
          }
        }
      });
    } catch (lErr) {}

    if (!userIdOrMobile) return policies;
    const cleanMobile = String(userIdOrMobile).replace(/\D/g, '');
    return policies.filter((p) => {
      const pMobile = (p.userMobile || p.ownerMobile || '').replace(/\D/g, '');
      if (cleanMobile && pMobile && (pMobile === cleanMobile || pMobile.endsWith(cleanMobile) || cleanMobile.endsWith(pMobile))) return true;
      if (p.userId && String(p.userId) === String(userIdOrMobile)) return true;
      if (p.ownerId && String(p.ownerId) === String(userIdOrMobile)) return true;
      if (p.userName && String(p.userName).trim().toLowerCase() === String(userIdOrMobile).trim().toLowerCase()) return true;
      return false;
    });
  },

  savePolicy: (policy) => {
    const current = storageService.getPolicies();
    const policyWithId = {
      ...policy,
      id: policy.id || `BC-POL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      policyNumber: policy.policyNumber || `BC-POL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      status: policy.status || 'ACTIVE',
      createdAt: policy.createdAt || new Date().toISOString(),
    };
    const updated = [policyWithId, ...current.filter((p) => p.id !== policyWithId.id && p.policyNumber !== policyWithId.policyNumber)];
    localStorage.setItem(STORAGE_KEYS.POLICIES, JSON.stringify(updated));
    return policyWithId;
  },

  // Smart Wallet & Treasury
  getWallet: (userIdOrMobile = null) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WALLET);
      if (stored) return JSON.parse(stored);
      const defaultWallet = {
        availableBalance: 0,
        pendingBalance: 0,
        rewards: 0,
        currency: 'INR',
        transactions: [],
      };
      return defaultWallet;
    } catch (e) {
      return { availableBalance: 0, pendingBalance: 0, rewards: 0, currency: 'INR', transactions: [] };
    }
  },

  saveWallet: (walletData) => {
    try {
      localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(walletData));
      return walletData;
    } catch (e) {
      console.warn('Error saving wallet:', e);
      return walletData;
    }
  },

  // Invoices & Payment Receipts
  getInvoices: (userIdOrMobile = null) => {
    try {
      const lands = storageService.getLands(userIdOrMobile);
      const extractedFromLands = lands.map((l) => {
        if (l.invoice) {
          return {
            ...l.invoice,
            id: l.invoice.invoiceNumber || `INV-${l.id}`,
            invoiceNumber: l.invoice.invoiceNumber || `BC-INV-2026-${String(l.id).replace(/\D/g, '') || '9120'}`,
            type: 'LAND_REGISTRATION',
            category: 'Land Cadastral Registration & Soil GIS',
            landId: l.id || l.landId,
            parcelName: l.landName || 'Registered Agricultural Plot',
            surveyNumber: l.surveyNumber,
            khasraNumber: l.khasraNumber,
            farmerName: l.ownerName || 'Citizen Farmer',
            date: l.invoice.invoiceDate || (l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'Today'),
            acres: l.areaAcres || l.area || 5,
            amount: l.invoice.grandTotal || Number((149 * (l.area || 5) * 1.18).toFixed(2)),
            grandTotal: l.invoice.grandTotal || Number((149 * (l.area || 5) * 1.18).toFixed(2)),
            status: 'PAID',
          };
        }

        // Generate dynamic statutory GST invoice from registered land
        const acres = Number(l.area || l.areaAcres || 5);
        const landSubtotal = Number((acres * 149).toFixed(2));
        const treeInsuranceAmount = l.treesInsured ? Number(((l.treeCount || 0) * 31).toFixed(2)) : 0;
        const subtotal = Number((landSubtotal + treeInsuranceAmount).toFixed(2));
        const gstTotal = Number((subtotal * 0.18).toFixed(2));
        const grandTotal = Number((subtotal + gstTotal).toFixed(2));
        const cleanId = String(l.id || l.landId || '9100').replace(/\D/g, '').slice(-4) || '9100';

        return {
          id: `INV-BC-${cleanId}`,
          invoiceNumber: `BC-INV-2026-${cleanId}`,
          transactionId: `TXN-UPI-${cleanId}-2026`,
          invoiceDate: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'Today',
          invoiceTime: '11:30 AM',
          type: 'LAND_REGISTRATION',
          category: 'Land Cadastral Registration & Soil GIS',
          landId: l.id || l.landId,
          farmerName: l.ownerName || 'Citizen Farmer',
          fatherName: l.fatherName || 'Recorded Land Holder',
          mobile: l.ownerMobile || '',
          email: l.ownerEmail || 'farmer@bhumicred.in',
          address: l.address || `${l.village || 'Mogri'}, ${l.district || 'Anand'}`,
          parcelName: l.landName || 'Agricultural Parcel',
          surveyNumber: l.surveyNumber || '108/A',
          khasraNumber: l.khasraNumber || '412/9',
          acres: acres,
          soilTesting: Number((acres * 49).toFixed(2)),
          inspection: Number((acres * 50).toFixed(2)),
          carbonCredit: Number((acres * 35).toFixed(2)),
          fileCharges: Number((acres * 15).toFixed(2)),
          landSubtotal: landSubtotal,
          optInsurance: Boolean(l.treesInsured),
          treeCount: l.treeCount || 0,
          insuredTreeCount: l.treeCount || 0,
          insuranceRatePerTree: 31,
          treeInsuranceAmount: treeInsuranceAmount,
          subtotal: subtotal,
          cgst: Number((gstTotal / 2).toFixed(2)),
          sgst: Number((gstTotal / 2).toFixed(2)),
          gstTotal: gstTotal,
          grandTotal: grandTotal,
          amount: grandTotal,
          paymentMethod: 'BHIM UPI Instant (Verified)',
          status: 'PAID',
        };
      });

      return extractedFromLands;
    } catch (e) {
      console.warn('Error fetching invoices:', e);
      return [];
    }
  },

  // Reports (Soil, GIS, Drone, Carbon, Tree Asset)
  getReports: (userIdOrMobile = null) => {
    try {
      const lands = storageService.getLands(userIdOrMobile);
      const reports = [];

      lands.forEach((l) => {
        const cleanId = String(l.id || l.landId || '9100').replace(/\D/g, '').slice(-4) || '9100';
        const dateStr = l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Jan 2026';
        const acres = Number(l.area || l.areaAcres || 5);
        const hectares = Number((acres * 0.404686).toFixed(2));
        const treeCount = Number(l.treeCount || l.standingTreeCount || (l.treesInsured ? 12 : 0));
        const landName = l.landName || 'Agricultural Parcel';
        const surveyNo = l.surveyNumber || '108/A';
        const khasraNo = l.khasraNumber || '412/9';
        const farmerName = l.ownerName || l.farmerName || 'Citizen Farmer';
        const fatherName = l.fatherName || 'Landholder';
        const locationStr = `${l.village || 'Navli'}, ${l.district || 'Anand'}, ${l.state || 'Gujarat'}`;
        const soilType = l.soilType || 'Alluvial Loam';
        const currentCrop = l.crop || l.currentCrop || 'Wheat / Cotton';

        // 1. Cadastral GIS & RoR Audit Report
        reports.push({
          id: `REP-GIS-${cleanId}`,
          certId: `BC-CAD-2026-${cleanId}`,
          title: `High-Resolution Satellite GIS Cadastral Boundary Audit - ${landName}`,
          category: 'GIS & Land RoR',
          issuedDate: dateStr,
          parcel: `Survey ${surveyNo} • Khasra ${khasraNo}`,
          landName: landName,
          surveyNumber: surveyNo,
          khasraNumber: khasraNo,
          ownerName: farmerName,
          fatherName: fatherName,
          location: locationStr,
          areaAcres: acres,
          areaHectares: hectares,
          authority: 'State Remote Sensing Centre & Bhulekh Land Revenue Directorate',
          status: l.status === 'APPROVED' ? 'VERIFIED & REVENUE-SYNCED' : 'PENDING REVENUE AUDIT',
          score: l.status === 'APPROVED' ? '99.8% GIS Perimeter Match' : 'Polygon Under Review',
          satelliteResolution: '0.3m Ultra-HD (ISRO Cartosat-3 & Sentinel-2)',
          boundaryPerimeter: `${Math.round(Math.sqrt(acres * 4046.86) * 4)} meters`,
          bhulekhSyncId: `ROR-GJ-ANAND-${cleanId}-2026`,
          khataNo: l.khataNumber || `KH-${cleanId}`,
          disputeStatus: '0% Conflict / Clean Title Deed',
          elevation: '42m above MSL',
          soilType: soilType,
          geoCorners: [
            { label: 'Point A (NW)', lat: '22.5641° N', lng: '72.9284° E' },
            { label: 'Point B (NE)', lat: '22.5643° N', lng: '72.9312° E' },
            { label: 'Point C (SE)', lat: '22.5618° N', lng: '72.9309° E' },
            { label: 'Point D (SW)', lat: '22.5615° N', lng: '72.9281° E' }
          ],
          fileSize: '3.8 MB PDF',
        });

        // 2. Comprehensive Soil Nutrient & Laboratory Report
        reports.push({
          id: `REP-SOIL-${cleanId}`,
          certId: `BC-SHC-2026-${cleanId}`,
          title: `Comprehensive 12-Parameter Soil Health Diagnostic Card - ${landName}`,
          category: 'Soil Health',
          issuedDate: dateStr,
          parcel: `Survey ${surveyNo} (${acres} Acres)`,
          landName: landName,
          surveyNumber: surveyNo,
          khasraNumber: khasraNo,
          ownerName: farmerName,
          fatherName: fatherName,
          location: locationStr,
          areaAcres: acres,
          currentCrop: currentCrop,
          soilType: soilType,
          authority: 'NABL Accredited Regional Agricultural Chemistry Laboratory',
          labRegNo: 'NABL/TC-9042/2026',
          status: l.status === 'APPROVED' ? 'CERTIFIED & NABL VALIDATED' : 'SAMPLE ANALYZED & MAPPED',
          score: '86/100 (Optimal Fertility Index)',
          parameters: {
            ph: '7.1 (Optimal Neutral)',
            ec: '0.42 dS/m (Normal Non-Saline)',
            oc: '0.79% (High / Carbon Rich)',
            nitrogen: '285 kg/ha (Medium Adequate)',
            phosphorus: '24 kg/ha (High Fertility)',
            potassium: '320 kg/ha (High)',
            zinc: '0.85 ppm (Adequate)',
            iron: '5.2 ppm (Adequate)',
            copper: '0.48 ppm (Normal)',
            manganese: '3.8 ppm (Optimal)',
            boron: '0.65 ppm (Normal)',
            moisture: '64% Field Capacity'
          },
          recommendation: `Apply 45kg Neem-Coated Urea and 15kg Bio-NPK consortium per acre prior to ${currentCrop} sowing. Micronutrient profile is well balanced.`,
          fileSize: '2.8 MB PDF',
        });

        // 3. Carbon Credit & Agroforestry Sequestration Audit
        const annualCarbon = Number((acres * 0.95 + treeCount * 0.08).toFixed(1));
        reports.push({
          id: `REP-CARB-${cleanId}`,
          certId: `BC-CARB-2026-${cleanId}`,
          title: `Agroforestry Carbon Sequestration & Baseline Certificate - ${landName}`,
          category: 'Carbon Credits',
          issuedDate: dateStr,
          parcel: `Survey ${surveyNo} • ${acres} Acres`,
          landName: landName,
          surveyNumber: surveyNo,
          khasraNumber: khasraNo,
          ownerName: farmerName,
          location: locationStr,
          areaAcres: acres,
          authority: 'National Agroforestry Carbon Registry & ESG Standard Board',
          status: l.status === 'APPROVED' ? 'ELIGIBLE FOR TOKENIZATION' : 'BASELINE ESTIMATED',
          score: `${annualCarbon} tCO2e / yr`,
          annualSequestration: annualCarbon,
          standingTrees: `${treeCount} Standing Trees`,
          carbonTokens: `${Math.floor(annualCarbon)} Verified BC-CO2 Tokens`,
          estimatedAssetValue: `₹${(Math.floor(annualCarbon) * 1200).toLocaleString('en-IN')}`,
          methodology: 'VM0042 / IPCC Tier 2 Agro-Ecosystem Sequestration Protocol',
          fileSize: '3.2 MB PDF',
        });

        // 4. Tree Asset Biometric & Insurance Audit (if trees exist)
        if (treeCount > 0 || l.treesInsured || l.optInsurance) {
          reports.push({
            id: `REP-TREE-${cleanId}`,
            certId: `BC-TREE-2026-${cleanId}`,
            title: `Biometric Tree Asset & Multi-Angle Canopy Scan - ${landName}`,
            category: 'Tree Asset Audit',
            issuedDate: dateStr,
            parcel: `Survey ${surveyNo} • ${treeCount} Trees`,
            landName: landName,
            surveyNumber: surveyNo,
            khasraNumber: khasraNo,
            ownerName: farmerName,
            location: locationStr,
            authority: 'National Agroforestry Board & Biometric Tree Asset Registry',
            status: l.treesInsured || l.optInsurance ? 'INSURED (₹31/tree/yr)' : 'PASSED (LOW RISK)',
            score: '97% Canopy Health Index',
            insuredTreeCount: `${l.insuredTreeCount || treeCount} Trees`,
            treePhotosCount: `${l.treeAnglePhotos?.length || 5} Multi-Angle GPS Photos`,
            canopyCoverage: `${treeCount * 14.5} sq. meters`,
            dominantSpecies: 'Neem (Azadirachta indica), Teak, Mango',
            fungalPestRisk: 'Zero / Negligible (Class 1 Safe)',
            fileSize: '4.1 MB PDF',
          });
        }
      });

      return reports;
    } catch (e) {
      console.warn('Error fetching reports:', e);
      return [];
    }
  },

  // Support & Grievance Tickets
  getSupportTickets: (mobile = null) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SUPPORT_TICKETS);
      let tickets = stored ? JSON.parse(stored) : [];
      if (!mobile) return tickets;
      const cleanMobile = String(mobile).replace(/\D/g, '');
      return tickets.filter(
        (t) =>
          !t.mobile ||
          !cleanMobile ||
          t.mobile.replace(/\D/g, '') === cleanMobile ||
          cleanMobile.includes(t.mobile.replace(/\D/g, ''))
      );
    } catch (e) {
      console.warn('Error reading support tickets:', e);
      return [];
    }
  },

  saveSupportTicket: (ticket) => {
    try {
      const tickets = storageService.getSupportTickets();
      const generatedId = ticket.ticketId || ticket._id || `BC-TKT-${Math.floor(10000 + Math.random() * 90000)}`;
      const newTicket = {
        _id: ticket._id || `tkt_${Date.now()}`,
        ticketId: generatedId,
        subject: ticket.subject || 'Support Request',
        message: ticket.message || '',
        category: ticket.category || 'GENERAL',
        priority: ticket.priority || 'NORMAL',
        status: ticket.status || 'OPEN',
        name: ticket.name || 'Citizen User',
        email: ticket.email || '',
        mobile: ticket.mobile || '',
        createdAt: ticket.createdAt || new Date().toISOString(),
        responses: ticket.responses || [],
        resolutionNotes: ticket.resolutionNotes || '',
      };
      const filtered = tickets.filter((t) => t.ticketId !== newTicket.ticketId && t._id !== newTicket._id);
      const updated = [newTicket, ...filtered];
      localStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(updated));
      return newTicket;
    } catch (e) {
      console.warn('Error saving support ticket:', e);
      return ticket;
    }
  },

  replySupportTicket: (ticketId, replyObj) => {
    try {
      const tickets = storageService.getSupportTickets();
      const updated = tickets.map((t) => {
        if (t.ticketId === ticketId || t._id === ticketId) {
          const responses = t.responses ? [...t.responses] : [];
          responses.push({
            senderName: replyObj.senderName || 'Citizen User',
            senderRole: replyObj.senderRole || 'USER',
            message: replyObj.message || '',
            createdAt: replyObj.createdAt || new Date().toISOString(),
          });
          return { ...t, responses };
        }
        return t;
      });
      localStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(updated));
      return updated.find((t) => t.ticketId === ticketId || t._id === ticketId);
    } catch (e) {
      console.warn('Error replying to support ticket:', e);
      return null;
    }
  },

  // Land updates (e.g. treeCount, mrvStatus)
  updateLand: (landId, updates = {}) => {
    try {
      const lands = storageService.getLands();
      const updated = lands.map((l) => {
        if (l.id === landId || l.landId === landId || l._id === landId) {
          return { ...l, ...updates, updatedAt: new Date().toISOString() };
        }
        return l;
      });
      localStorage.setItem(STORAGE_KEYS.LANDS, JSON.stringify(updated));
      return updated.find((l) => l.id === landId || l.landId === landId || l._id === landId);
    } catch (e) {
      console.warn('Error updating land:', e);
      return null;
    }
  },

  // Carbon Audits (Sentinel-2 MRV Scans)
  getCarbonAudits: (userMobileOrId = null) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CARBON_AUDITS);
      let audits = stored ? JSON.parse(stored) : [];
      if (!userMobileOrId) return audits;
      const cleanMobile = String(userMobileOrId).replace(/\D/g, '');
      return audits.filter((a) => {
        const aMobile = (a.userMobile || a.ownerMobile || '').replace(/\D/g, '');
        if (cleanMobile && aMobile && (aMobile === cleanMobile || cleanMobile.includes(aMobile) || aMobile.includes(cleanMobile))) return true;
        if (a.ownerId && String(a.ownerId) === String(userMobileOrId)) return true;
        if (a.userId && String(a.userId) === String(userMobileOrId)) return true;
        if (a.ownerName && String(a.ownerName).toLowerCase() === String(userMobileOrId).toLowerCase()) return true;
        return false;
      });
    } catch (e) {
      console.warn('Error reading carbon audits:', e);
      return [];
    }
  },

  saveCarbonAudit: (audit) => {
    try {
      const audits = storageService.getCarbonAudits();
      const generatedId = audit.auditId || audit.id || `MRV-SENTINEL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newAudit = {
        _id: audit._id || `mrv_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        id: generatedId,
        auditId: generatedId,
        landId: audit.landId || '',
        landName: audit.landName || 'Registered Agricultural Parcel',
        surveyNumber: audit.surveyNumber || 'N/A',
        khasraNumber: audit.khasraNumber || 'N/A',
        areaAcres: audit.areaAcres || audit.area || 5.0,
        estimatedTreeCount: audit.estimatedTreeCount || audit.treeCount || 45,
        treeCount: audit.estimatedTreeCount || audit.treeCount || 45,
        agroforestryType: audit.agroforestryType || 'High-Resin Teak & Sandalwood Bio-Sequestration',
        userMobile: audit.userMobile || audit.ownerMobile || '',
        ownerMobile: audit.ownerMobile || audit.userMobile || '',
        ownerId: audit.ownerId || audit.userId || '',
        userId: audit.userId || audit.ownerId || '',
        ownerName: audit.ownerName || '',
        carbonSequestration: {
          annualSequestrationRateTons: audit.carbonSequestration?.annualSequestrationRateTons || Number(((audit.areaAcres || 5) * 0.95 + (audit.estimatedTreeCount || 45) * 0.08).toFixed(1)),
          estimated3YearTotalTons: audit.carbonSequestration?.estimated3YearTotalTons || Number((((audit.areaAcres || 5) * 0.95 + (audit.estimatedTreeCount || 45) * 0.08) * 3).toFixed(1)),
        },
        satelliteTelemetry: {
          satellite: 'Sentinel-2 MSI (10m Resolution)',
          sensorBand: 'B8 (NIR) / B4 (Red) / NDVI',
          ndviIndex: 0.78,
          canopyHealth: 'Optimal High Biomass',
          lastScanDate: new Date().toISOString(),
        },
        status: audit.status || 'SATELLITE_SCANNING',
        createdAt: audit.createdAt || new Date().toISOString(),
      };

      // Always prepend new scan as a distinct new scan record without overwriting previous scans
      const filtered = audits.filter((a) => a.auditId !== newAudit.auditId && a.id !== newAudit.id);
      const updated = [newAudit, ...filtered];
      localStorage.setItem(STORAGE_KEYS.CARBON_AUDITS, JSON.stringify(updated));

      // Also update the land's treeCount & mrvStatus in local lands!
      if (audit.landId) {
        storageService.updateLand(audit.landId, {
          treeCount: newAudit.estimatedTreeCount,
          standingTreeCount: newAudit.estimatedTreeCount,
          mrvAuditId: newAudit.auditId,
          mrvStatus: newAudit.status,
          annualCarbonRate: newAudit.carbonSequestration.annualSequestrationRateTons,
        });
      }

      return newAudit;
    } catch (e) {
      console.warn('Error saving carbon audit:', e);
      return audit;
    }
  },

  // Reset to initial factory mocks
  resetToFactoryDefaults: () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
};
