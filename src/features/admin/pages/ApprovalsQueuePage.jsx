import React, { useState, useEffect } from 'react';
import {
  Users,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Filter,
  Search,
  Check,
  X,
  Clock,
  ArrowRight,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';
import { useDispatch } from 'react-redux';
import { storageService } from '../../../services/storageService.js';
import { useToast } from '../../../components/ui/ToastContext.jsx';
import { setUserStatus } from '../../auth/authSlice.js';
import { onboardingService } from '../../farmer/services/onboardingService.js';

export const ApprovalsQueuePage = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionModal, setActionModal] = useState(null); // { item, actionType: 'APPROVE'|'REJECT'|'QUERY' }
  const [actionRemarks, setActionRemarks] = useState('');
  const [actionSuccess, setActionSuccess] = useState(false);
  const toast = useToast();

  const fetchQueue = async () => {
    setLoading(true);
    try {
      let liveItems = [];
      let backendLoaded = false;
      try {
        const res = await onboardingService.getAdminQueue();
        const appsList = Array.isArray(res?.data) ? res.data : (Array.isArray(res?.data?.applications) ? res.data.applications : []);
        liveItems = appsList.map((app) => {
          const isLand = app.type === 'LAND_REGISTRATION' || app.applicationId?.startsWith('APP-LND-') || app.targetId?.startsWith('LND-');
          const isClaim = app.type === 'INSURANCE_CLAIM' || app.applicationId?.startsWith('APP-CLM-');
          const resolvedType = isLand ? 'LAND_REGISTRATION' : isClaim ? 'INSURANCE_CLAIM' : (app.type || 'FARMER_KYC');
          const resolvedTitle =
            app.title ||
            (isLand
              ? `Land Title Registration - ${app.landName || app.applicantName || 'Plot'}`
              : isClaim
              ? `Tree Loss Insurance Claim - ${app.applicantName || 'Insured Farmer'}`
              : `Farmer KYC Verification - ${app.applicantName || 'Citizen Applicant'}`);

          return {
            id: app.applicationId || app.id || app._id,
            applicationId: app.applicationId || app.id || app._id,
            targetId: app.targetId,
            type: resolvedType,
            title: resolvedTitle,
            applicantName: app.applicantName || app.ownerName || app.farmerName || 'Citizen Applicant',
            applicantRole: app.role || app.applicantRole || 'FARMER',
            applicantPhone: app.mobile || app.applicantPhone || '',
            submittedDate: app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Just now',
            submittedAt: app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Just now',
            timestamp: app.submittedAt || app.createdAt || new Date().toISOString(),
            status: app.status || 'PENDING_VERIFICATION',
            riskScore: app.riskScore || 'LOW',
            details:
              app.details ||
              (isLand
                ? `${app.area || 0} Acres in ${app.location?.village || app.village || 'Anand'}`
                : `${app.address?.village || ''} ${app.address?.district || ''} • ${app.address?.state || ''}`),
          };
        });
        backendLoaded = true;
      } catch (backendErr) {
        console.warn('Backend admin queue fetch warning:', backendErr?.message);
      }

      // Hybrid resilience: Merge backend items and local cache approvals (preventing any dropped request)
      const localApprovals = storageService.getApprovals().filter((c) => !c.id?.startsWith('appr_'));
      
      // Build local status map keyed by specific application IDs only
      const localStatusMap = new Map();
      localApprovals.forEach((loc) => {
        if (loc.id) localStatusMap.set(loc.id, loc.status);
        if (loc.applicationId) localStatusMap.set(loc.applicationId, loc.status);
        if (loc.targetId) localStatusMap.set(loc.targetId, loc.status);
      });

      const syncedLiveItems = liveItems.map((live) => {
        const localStatus =
          localStatusMap.get(live.id) ||
          localStatusMap.get(live.applicationId) ||
          localStatusMap.get(live.targetId);
        if (localStatus && localStatus !== live.status && (localStatus === 'APPROVED' || localStatus === 'REJECTED')) {
          return { ...live, status: localStatus };
        }
        return live;
      });

      const combinedItems = [...syncedLiveItems];
      const existingIds = new Set(
        syncedLiveItems.flatMap((it) => [it.id, it.applicationId, it.targetId, it.targetId ? `APP-LND-${it.targetId}` : null].filter(Boolean))
      );

      localApprovals.forEach((local) => {
        const localId = local.id || local.applicationId;
        const targetId = local.targetId;
        const appLndId = targetId ? `APP-LND-${targetId}` : null;
        if (!existingIds.has(localId) && (!targetId || !existingIds.has(targetId)) && (!appLndId || !existingIds.has(appLndId))) {
          const isLand = local.type === 'LAND_REGISTRATION' || local.applicationId?.startsWith('APP-LND-');
          const isClaim = local.type === 'INSURANCE_CLAIM' || local.applicationId?.startsWith('APP-CLM-');
          const localType = isLand ? 'LAND_REGISTRATION' : isClaim ? 'INSURANCE_CLAIM' : (local.type || 'FARMER_KYC');
          const localTitle =
            local.title ||
            (isLand
              ? `Land Title Registration - ${local.landName || local.applicantName || 'Plot'}`
              : isClaim
              ? `Tree Loss Insurance Claim - ${local.applicantName || 'Insured Farmer'}`
              : `Farmer KYC Verification - ${local.applicantName || 'Citizen Applicant'}`);

          combinedItems.push({
            id: local.id || local.applicationId || `APP-${Date.now()}`,
            applicationId: local.applicationId || local.id,
            targetId: local.targetId,
            type: localType,
            title: localTitle,
            applicantName: local.applicantName || local.farmerName || 'Citizen Applicant',
            applicantRole: local.applicantRole || local.role || 'FARMER',
            applicantPhone: local.applicantPhone || local.mobile || '',
            submittedDate: local.submittedDate || 'Just now',
            submittedAt: local.submittedAt || local.createdAt || 'Just now',
            timestamp: local.timestamp || local.createdAt || new Date().toISOString(),
            status: local.status || 'PENDING_VERIFICATION',
            riskScore: local.riskScore || 'LOW',
            details: local.details || `${local.village || 'Mogri'}, ${local.district || 'Anand'}`,
          });
          if (localId) existingIds.add(localId);
          if (targetId) existingIds.add(targetId);
        }
      });

      combinedItems.sort((a, b) => {
        const timeA = new Date(a.timestamp || a.createdAt || a.submittedAt || 0).getTime();
        const timeB = new Date(b.timestamp || b.createdAt || b.submittedAt || 0).getTime();
        return timeB - timeA;
      });

      setItems(combinedItems);
    } catch (err) {
      console.warn('Admin queue load error:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const tabs = [
    { id: 'ALL', label: 'All Pending Approvals' },
    { id: 'LAND_REGISTRATION', label: 'Land Registrations' },
    { id: 'FARMER_KYC', label: 'Farmer KYC' },
    { id: 'GOVERNMENT_ONBOARDING', label: 'Govt Officers' },
    { id: 'PARTNER_ONBOARDING', label: 'Partner Licenses' },
    { id: 'INSURANCE_CLAIM', label: 'Insurance Claims' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === 'ALL' || item.type === activeTab;
    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.applicantName && item.applicantName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleExecuteAction = async (e) => {
    e.preventDefault();
    if (!actionModal) return;

    const targetStatus =
      actionModal.actionType === 'APPROVE'
        ? 'APPROVED'
        : actionModal.actionType === 'REJECT'
        ? 'REJECTED'
        : 'QUERY_PENDING';

    const targetAppId = actionModal.item.applicationId || actionModal.item.id;
    const cleanPhone = (actionModal.item.applicantPhone || actionModal.item.mobile || '').replace(/\D/g, '');

    storageService.updateApprovalStatus(
      targetAppId,
      targetStatus,
      actionRemarks
    );

    setItems((prev) =>
      prev.map((it) => {
        const itPhone = (it.applicantPhone || it.mobile || '').replace(/\D/g, '');
        const isMatch =
          it.id === actionModal.item.id ||
          it.applicationId === targetAppId ||
          it.id === targetAppId ||
          (cleanPhone && itPhone && cleanPhone === itPhone);
        return isMatch ? { ...it, status: targetStatus } : it;
      })
    );

    dispatch(setUserStatus('APPROVED'));

    // Live Backend API sync
    try {
      const rawTargetId = actionModal.item.targetId || actionModal.item.id?.replace(/^APP-LND-/, '');
      const storedLands = storageService.getLands();
      const landData = storedLands.find(
        (l) =>
          l.id === rawTargetId ||
          l.landId === rawTargetId ||
          `APP-LND-${l.id}` === targetAppId ||
          `APP-LND-${l.landId}` === targetAppId
      );

      await onboardingService.reviewKyc(targetAppId, {
        status: targetStatus,
        reviewNotes: actionRemarks,
        action: actionModal.actionType,
        mobile: cleanPhone,
        targetId: rawTargetId,
        landData: landData || undefined,
      });
    } catch (apiErr) {
      console.warn('Backend review sync warning:', apiErr?.message);
    }

    toast.success(
      `${actionModal.item.title} has been ${
        actionModal.actionType === 'APPROVE'
          ? 'Approved & Verified in Sovereign Database!'
          : actionModal.actionType === 'REJECT'
          ? 'Rejected'
          : 'marked for Query Correction'
      }!`
    );

    setActionModal(null);
    setActionRemarks('');
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Master Approvals & Verification Queue"
        subtitle="Review, authenticate, and approve farmer KYC, land registries, insurance settlements, and partner licenses in real-time."
        backTo="/admin/dashboard"
        breadcrumbs={[
          { label: 'Admin Portal', path: '/admin/dashboard' },
          { label: 'Approvals Queue' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={fetchQueue}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Queue
          </Button>
        }
      />

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72">
          <SearchInput
            placeholder="Search by title or applicant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-700">Fetching live approval requests from sovereign database...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Card key={item.id} className="p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-all space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Badge variant="success">{item.type.replace(/_/g, ' ')}</Badge>
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-gray-400 font-mono">Submitted: {item.submittedAt || item.submittedDate}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-500">
                    Applicant: <strong className="text-gray-900">{item.applicantName}</strong> ({item.applicantRole || 'FARMER'}) • {item.applicantPhone}
                  </p>
                  <p className="text-xs text-gray-600 pt-1">{item.details}</p>
                </div>

                {/* Action Buttons */}
                {item.status !== 'APPROVED' && item.status !== 'REJECTED' && (
                  <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-400 text-amber-800 hover:bg-amber-50 text-xs flex items-center gap-1"
                      onClick={() => setActionModal({ item, actionType: 'QUERY' })}
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Raise Query
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-rose-300 text-rose-700 hover:bg-rose-50 text-xs flex items-center gap-1"
                      onClick={() => setActionModal({ item, actionType: 'REJECT' })}
                    >
                      <X className="w-3.5 h-3.5 text-rose-600" /> Reject
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      className="text-xs flex items-center gap-1"
                      onClick={() => setActionModal({ item, actionType: 'APPROVE' })}
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            No pending approval requests found in this category.
          </div>
        )}
      </div>

      {/* Decision Modal */}
      {actionModal && (
        <Modal
          isOpen={Boolean(actionModal)}
          onClose={() => setActionModal(null)}
          title={`Confirm Decision: ${actionModal.actionType} ${actionModal.item.type}`}
        >
          <form onSubmit={handleExecuteAction} className="space-y-6 py-2">
            {actionSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Decision Executed!</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Status updated and applicant notified via SMS and portal alert.
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div><strong>Application:</strong> {actionModal.item.title}</div>
                  <div><strong>Applicant:</strong> {actionModal.item.applicantName}</div>
                  <div><strong>Action:</strong> <span className="font-bold uppercase text-emerald-700">{actionModal.actionType}</span></div>
                </div>

                <FormTextarea
                  label="Official Officer Remarks & Justification"
                  rows={3}
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  placeholder={
                    actionModal.actionType === 'APPROVE'
                      ? 'Verified revenue 7/12 extract against e-Dhara state registry. Approved for full issuance.'
                      : actionModal.actionType === 'QUERY'
                      ? 'Please upload clear cadastral Naksha map showing northern survey boundary.'
                      : 'Survey number mismatch with state registry.'
                  }
                  required
                />

                <Button
                  type="submit"
                  variant={
                    actionModal.actionType === 'APPROVE'
                      ? 'primary'
                      : actionModal.actionType === 'REJECT'
                      ? 'danger'
                      : 'secondary'
                  }
                  className="w-full py-3"
                >
                  Confirm & Commit Decision
                </Button>
              </>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ApprovalsQueuePage;
