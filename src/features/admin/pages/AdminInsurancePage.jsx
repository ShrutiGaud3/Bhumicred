import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Trees,
  CheckCircle2,
  AlertTriangle,
  Download,
  CloudLightning,
  TrendingUp,
  Check,
  X,
  Eye,
  FileText,
  UserCheck,
  ArrowRight,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { useToast } from '../../../components/ui/ToastContext.jsx';
import { insuranceService } from '../../insurance/services/insuranceService.js';
import { storageService } from '../../../services/storageService.js';

export const AdminInsurancePage = () => {
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      let pList = [];
      let cList = [];
      let sData = null;

      try {
        const [pRes, cRes, sRes] = await Promise.allSettled([
          insuranceService.getPolicies(),
          insuranceService.getClaims(),
          insuranceService.getInsuranceStats(),
        ]);
        if (pRes.status === 'fulfilled' && pRes.value?.data) pList = pRes.value.data;
        if (cRes.status === 'fulfilled' && cRes.value?.data) cList = cRes.value.data;
        if (sRes.status === 'fulfilled' && sRes.value?.data) sData = sRes.value.data;
      } catch (apiErr) {
        console.warn('API fetch note:', apiErr?.message);
      }

      // Deduplicate policies and claims by policyNumber / claimNumber
      const uniquePolicies = [];
      const seenPols = new Set();
      (pList || []).forEach((p) => {
        const k = p.policyNumber || p._id || p.id;
        if (!seenPols.has(k)) {
          seenPols.add(k);
          uniquePolicies.push(p);
        }
      });

      const uniqueClaims = [];
      const seenClms = new Set();
      (cList || []).forEach((c) => {
        const k = c.claimNumber || c._id || c.id;
        if (!seenClms.has(k)) {
          seenClms.add(k);
          uniqueClaims.push(c);
        }
      });

      setPolicies(uniquePolicies);
      setClaims(uniqueClaims);
      setStats(sData);
    } catch (e) {
      console.warn('Data load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveClaim = async (claim) => {
    const targetClaimId = claim.claimNumber || claim.id || claim._id;
    storageService.updateApprovalStatus(targetClaimId, 'APPROVED', 'Approved by Super Admin Underwriting Desk');

    setClaims((prev) =>
      prev.map((c) =>
        c.claimNumber === targetClaimId || c.id === targetClaimId || c._id === targetClaimId
          ? { ...c, status: 'SETTLED' }
          : c
      )
    );

    try {
      await insuranceService.updateClaimStatus(claim._id || claim.id || targetClaimId, {
        status: 'SETTLED',
        remarks: 'Claim DBT payout authorized by Super Admin',
      });
    } catch (err) {
      console.warn('Backend claim status note:', err?.message);
    }

    toast.success(`Claim ${targetClaimId} approved & settled for DBT payout!`);
    setSelectedClaim(null);
  };

  const handleRejectClaim = async (claim) => {
    const targetClaimId = claim.claimNumber || claim.id || claim._id;
    storageService.updateApprovalStatus(targetClaimId, 'REJECTED', 'Rejected by Super Admin Desk');

    setClaims((prev) =>
      prev.map((c) =>
        c.claimNumber === targetClaimId || c.id === targetClaimId || c._id === targetClaimId
          ? { ...c, status: 'REJECTED' }
          : c
      )
    );

    try {
      await insuranceService.updateClaimStatus(claim._id || claim.id || targetClaimId, {
        status: 'REJECTED',
        remarks: 'Claim rejected by Super Admin Desk',
      });
    } catch (err) {
      console.warn('Backend claim status note:', err?.message);
    }

    toast.error(`Claim ${targetClaimId} marked as Rejected.`);
    setSelectedClaim(null);
  };

  // Dynamic summary stats
  const totalSumInsured =
    stats?.totalSumInsured ||
    policies.reduce((sum, p) => sum + (Number(p.sumInsured) || 0), 0) ||
    400000;
  const activePoliciesCount = stats?.activePolicies || policies.filter((p) => p.status === 'ACTIVE' || !p.status).length || policies.length;
  const inFlightClaimsCount = claims.filter((c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW' || c.status === 'PENDING_VERIFICATION' || !c.status).length;
  const settledClaimsCount = claims.filter((c) => c.status === 'SETTLED' || c.status === 'APPROVED').length;

  const filteredClaims = claims.filter((c) => {
    const matchStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'PENDING' && (c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW' || c.status === 'PENDING_VERIFICATION' || !c.status)) ||
      (filterStatus === 'SETTLED' && (c.status === 'SETTLED' || c.status === 'APPROVED')) ||
      (filterStatus === 'REJECTED' && c.status === 'REJECTED');

    const matchSearch =
      !searchQuery ||
      (c.claimNumber && c.claimNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.userName && c.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.policyNumber && c.policyNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.incidentType && c.incidentType.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchStatus && matchSearch;
  });

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Underwriting & Risk Pool Control Center"
        subtitle="Manage parametric insurance triggers, monitor loss ratios, and authorize claim settlements."
        backTo="/admin/dashboard"
        breadcrumbs={[
          { label: 'Admin Portal', path: '/admin/dashboard' },
          { label: 'Underwriting & Claims' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            className="flex items-center gap-1.5 border-slate-300 hover:bg-slate-50 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Feed
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Sum Insured
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            ₹{totalSumInsured.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Active Risk Pool</span>
        </Card>

        <Card className="p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Active Policies
          </span>
          <p className="text-2xl font-black text-emerald-700 font-mono">
            {activePoliciesCount}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Underwritten Portfolio</span>
        </Card>

        <Card className="p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Settlement Ratio
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {stats?.claimsSettlementRatio || '100%'}
          </p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Healthy Underwriting Band</span>
        </Card>

        <Card className="p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Claims In-Flight
          </span>
          <p className={`text-2xl font-black font-mono ${inFlightClaimsCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
            {inFlightClaimsCount}
          </p>
          <span className="text-xs text-amber-700 font-medium mt-1 block">GPS Drone Validations</span>
        </Card>
      </div>

      {/* Claims List Table Card */}
      <Card className="p-6 bg-white rounded-3xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Underwriting Claims & Field Audits</h3>
            <p className="text-xs text-slate-500">Live feed of reported tree losses, agronomist drone audits, and direct settlement payouts.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1 rounded-lg transition-all ${filterStatus === 'ALL' ? 'bg-white shadow text-slate-900 font-bold' : 'text-slate-600'}`}
              >
                All ({claims.length})
              </button>
              <button
                onClick={() => setFilterStatus('PENDING')}
                className={`px-3 py-1 rounded-lg transition-all ${filterStatus === 'PENDING' ? 'bg-white shadow text-amber-800 font-bold' : 'text-slate-600'}`}
              >
                Pending ({inFlightClaimsCount})
              </button>
              <button
                onClick={() => setFilterStatus('SETTLED')}
                className={`px-3 py-1 rounded-lg transition-all ${filterStatus === 'SETTLED' ? 'bg-white shadow text-emerald-800 font-bold' : 'text-slate-600'}`}
              >
                Settled ({settledClaimsCount})
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredClaims.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-2">Claim ID</th>
                  <th className="pb-3 px-2">Policyholder</th>
                  <th className="pb-3 px-2">Peril Event</th>
                  <th className="pb-3 px-2">Damaged Trees</th>
                  <th className="pb-3 px-2">Estimated Loss</th>
                  <th className="pb-3 px-2">Assigned Agronomist</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClaims.map((c) => {
                  const isPending = c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW' || c.status === 'PENDING_VERIFICATION' || !c.status;
                  return (
                    <tr key={c._id || c.id || c.claimNumber} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-2 font-mono font-bold text-emerald-900">
                        {c.claimNumber || `BC-CLM-${c.id}`}
                      </td>
                      <td className="py-3.5 px-2">
                        <div className="font-semibold text-slate-900">{c.userName || c.applicantName || 'Citizen Farmer'}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{c.userMobile || c.applicantPhone || c.mobile || '—'}</div>
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="font-medium text-slate-800 block">{c.incidentType}</span>
                        <span className="text-[11px] text-slate-400">Policy: {c.policyNumber || 'BC-POL-2026'}</span>
                      </td>
                      <td className="py-3.5 px-2 font-mono font-bold text-slate-900">
                        🌲 {c.affectedTreeCount || 18} Trees
                      </td>
                      <td className="py-3.5 px-2 font-mono font-bold text-emerald-800">
                        ₹{(Number(c.estimatedLoss) || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-2 text-slate-600">
                        <div className="font-medium">{c.inspectorName || 'Dr. A. Verma (Agronomist)'}</div>
                        <div className="text-[10px] text-slate-400">AgriTech Drone Survey</div>
                      </td>
                      <td className="py-3.5 px-2">
                        <StatusBadge status={c.status === 'SUBMITTED' ? 'PENDING_VERIFICATION' : c.status} />
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedClaim(c)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-all"
                            title="View Incident Particulars"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApproveClaim(c)}
                                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
                                title="Approve & Settle DBT Payout"
                              >
                                <Check className="w-3.5 h-3.5" /> Settle
                              </button>
                              <button
                                onClick={() => handleRejectClaim(c)}
                                className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-all"
                                title="Reject Claim"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">No Claims Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No insurance claims match the selected filter. As farmers report weather or pest incidents, claims will show up here for agronomist drone audits and direct DBT settlement.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Claim Detail Inspection Modal */}
      {selectedClaim && (
        <Modal
          isOpen={!!selectedClaim}
          onClose={() => setSelectedClaim(null)}
          title={`Claim Audit Dossier • ${selectedClaim.claimNumber || selectedClaim.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="grid grid-cols-2 gap-3 pb-2.5 border-b border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Policyholder Name:</span>
                  <span className="font-bold text-slate-900">{selectedClaim.userName || selectedClaim.applicantName || 'Citizen Farmer'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Contact Mobile:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedClaim.userMobile || selectedClaim.applicantPhone || selectedClaim.mobile || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Policy Number:</span>
                  <span className="font-mono font-semibold text-emerald-800">{selectedClaim.policyNumber || 'BC-POL-2026'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Claim Status:</span>
                  <StatusBadge status={selectedClaim.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-2.5 border-b border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Peril / Event Type:</span>
                  <span className="font-semibold text-slate-900">{selectedClaim.incidentType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Reported Loss Amount:</span>
                  <span className="font-mono font-bold text-rose-700 text-sm">
                    ₹{(Number(selectedClaim.estimatedLoss) || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Damaged Tree Inventory:</span>
                  <span className="font-bold text-slate-900">🌲 {selectedClaim.affectedTreeCount} Trees</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Assigned Agronomist:</span>
                  <span className="font-semibold text-slate-800">{selectedClaim.inspectorName || 'Dr. A. Verma (Senior Surveyor)'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-1">Field Observation & Damage Notes:</span>
                <p className="p-3 bg-white rounded-xl border border-slate-200 text-slate-800 leading-relaxed">
                  {selectedClaim.claimDescription || selectedClaim.description || 'High-velocity storm gusts (>80km/h) caused severe crown fracture and branch detachment on insured teak trees.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setSelectedClaim(null)}>
                Close
              </Button>
              {(selectedClaim.status === 'SUBMITTED' || selectedClaim.status === 'UNDER_REVIEW' || selectedClaim.status === 'PENDING_VERIFICATION' || !selectedClaim.status) && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-rose-300 text-rose-700 hover:bg-rose-50"
                    onClick={() => handleRejectClaim(selectedClaim)}
                  >
                    Reject Claim
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-emerald-700 hover:bg-emerald-800"
                    onClick={() => handleApproveClaim(selectedClaim)}
                  >
                    Authorize & Settle DBT
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminInsurancePage;

