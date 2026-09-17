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
  AlertTriangle,
  Building,
  TreePine,
  ShieldAlert,
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
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionModal, setActionModal] = useState(null); // { item, actionType: 'APPROVE'|'REJECT'|'QUERY' }
  const [actionRemarks, setActionRemarks] = useState('');
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const toast = useToast();

  const fetchQueue = async () => {
    setLoading(true);
    try {
      let liveItems = [];
      let backendLoaded = false;
      try {
        const res = await onboardingService.getAdminQueue();
        const appsList = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.applications)
          ? res.data.applications
          : [];

        liveItems = appsList.map((app) => {
          const isLand =
            app.type === 'LAND_REGISTRATION' ||
            app.applicationId?.startsWith('APP-LND-') ||
            app.targetId?.startsWith('LND-');
          const isClaim =
            app.type === 'INSURANCE_CLAIM' || app.applicationId?.startsWith('APP-CLM-');
          const isGovt =
            app.type === 'GOVERNMENT_ONBOARDING' || app.role === 'GOVERNMENT';
          const isPartner =
            app.type === 'PARTNER_ONBOARDING' || app.role === 'PARTNER';

          const resolvedType = isLand
            ? 'LAND_REGISTRATION'
            : isClaim
            ? 'INSURANCE_CLAIM'
            : isGovt
            ? 'GOVERNMENT_ONBOARDING'
            : isPartner
            ? 'PARTNER_ONBOARDING'
            : app.type || 'FARMER_KYC';

          const resolvedTitle =
            app.title ||
            (isLand
              ? `Land Title Registration - ${app.landName || app.applicantName || 'Plot'}`
              : isClaim
              ? `Tree Loss Insurance Claim - ${app.applicantName || 'Insured Farmer'}`
              : isGovt
              ? `Government Official Verification - ${app.applicantName || 'Officer'}`
              : isPartner
              ? `Enterprise Partner Verification - ${app.applicantName || 'Partner'}`
              : `Farmer KYC Verification - ${app.applicantName || 'Citizen Applicant'}`);

          return {
            id: app.applicationId || app.id || app._id,
            applicationId: app.applicationId || app.id || app._id,
            targetId: app.targetId,
            type: resolvedType,
            title: resolvedTitle,
            applicantName:
              app.applicantName || app.ownerName || app.farmerName || 'Citizen Applicant',
            applicantRole: app.role || app.applicantRole || 'FARMER',
            applicantPhone: app.mobile || app.applicantPhone || '',
            submittedDate: app.submittedAt
              ? new Date(app.submittedAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recent',
            submittedAt: app.submittedAt
              ? new Date(app.submittedAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : 'Recent',
            timestamp: app.submittedAt || app.createdAt || new Date().toISOString(),
            status: app.status || 'PENDING_VERIFICATION',
            riskScore: app.riskScore || 'LOW',
            reviewNotes: app.reviewNotes || '',
            reviewedByName: app.reviewedByName || '',
            details:
              app.details ||
              (isLand
                ? `${app.area || 0} Acres in ${app.location?.village || app.village || 'Anand'}`
                : `${app.address?.village || app.address?.city || ''} ${
                    app.address?.district || ''
                  } • ${app.address?.state || ''}`),
          };
        });
        backendLoaded = true;
      } catch (backendErr) {
        console.warn('Backend admin queue fetch warning:', backendErr?.message);
      }

      if (backendLoaded) {
        const uniqueLiveItems = [];
        const seenAppIds = new Set();
        liveItems.forEach((it) => {
          const k = it.applicationId || it.id || it.targetId;
          if (!seenAppIds.has(k)) {
            seenAppIds.add(k);
            uniqueLiveItems.push(it);
          }
        });

        uniqueLiveItems.sort((a, b) => {
          const timeA = new Date(a.timestamp || 0).getTime();
          const timeB = new Date(b.timestamp || 0).getTime();
          return timeB - timeA;
        });

        setItems(uniqueLiveItems);
      } else {
        const localApprovals = storageService.getApprovals().filter((c) => !c.id?.startsWith('appr_'));
        setItems(localApprovals);
      }
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
    { id: 'ALL', label: 'All Applications' },
    { id: 'FARMER_KYC', label: 'Farmer KYC' },
    { id: 'LAND_REGISTRATION', label: 'Land Registrations' },
    { id: 'GOVERNMENT_ONBOARDING', label: 'Govt Officers' },
    { id: 'PARTNER_ONBOARDING', label: 'Partner Licenses' },
    { id: 'INSURANCE_CLAIM', label: 'Insurance Claims' },
  ];

  const totalCount = items.length;
  const pendingCount = items.filter(
    (i) =>
      i.status === 'PENDING_VERIFICATION' ||
      i.status === 'PENDING_APPROVAL' ||
      i.status === 'SUBMITTED' ||
      i.status === 'UNDER_REVIEW'
  ).length;
  const approvedCount = items.filter((i) => i.status === 'APPROVED' || i.status === 'ACTIVE').length;
  const queryCount = items.filter(
    (i) => i.status === 'QUERY_PENDING' || i.status === 'QUERY_RAISED' || i.status === 'REJECTED'
  ).length;

  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === 'ALL' || item.type === activeTab;

    let matchesStatus = true;
    if (statusFilter === 'PENDING') {
      matchesStatus =
        item.status === 'PENDING_VERIFICATION' ||
        item.status === 'PENDING_APPROVAL' ||
        item.status === 'SUBMITTED' ||
        item.status === 'UNDER_REVIEW';
    } else if (statusFilter === 'APPROVED') {
      matchesStatus = item.status === 'APPROVED' || item.status === 'ACTIVE';
    } else if (statusFilter === 'QUERY_REJECT') {
      matchesStatus =
        item.status === 'QUERY_PENDING' ||
        item.status === 'QUERY_RAISED' ||
        item.status === 'REJECTED';
    }

    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.applicantName && item.applicantName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.applicantPhone && item.applicantPhone.includes(searchQuery)) ||
      (item.applicationId && item.applicationId.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesStatus && matchesSearch;
  });

  const handleExecuteAction = async (e) => {
    e.preventDefault();
    if (!actionModal) return;

    setActionSubmitting(true);
    const targetStatus =
      actionModal.actionType === 'APPROVE'
        ? 'APPROVED'
        : actionModal.actionType === 'REJECT'
        ? 'REJECTED'
        : 'QUERY_PENDING';

    const targetAppId = actionModal.item.applicationId || actionModal.item.id;
    const cleanPhone = (actionModal.item.applicantPhone || actionModal.item.mobile || '').replace(
      /\D/g,
      ''
    );

    storageService.updateApprovalStatus(targetAppId, targetStatus, actionRemarks);

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

      toast.success(
        `${actionModal.item.title} has been ${
          actionModal.actionType === 'APPROVE'
            ? 'Approved & Verified in Sovereign Database!'
            : actionModal.actionType === 'REJECT'
            ? 'Rejected'
            : 'marked for Query Correction'
        }!`
      );
    } catch (apiErr) {
      console.warn('Backend review sync warning:', apiErr?.message);
      toast.error(apiErr?.response?.data?.message || 'Review updated with local confirmation.');
    }

    setActionSubmitting(false);
    setActionModal(null);
    setActionRemarks('');

    // Immediately refresh live queue
    await fetchQueue();
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Master Approvals & Sovereign Verification Desk"
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

      {/* KPI Overview Summary Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-2xl cursor-pointer transition-all border ${
            statusFilter === 'ALL'
              ? 'ring-2 ring-slate-900 border-slate-900 bg-slate-50 shadow-md'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Total Submissions
            </span>
            <div className={`p-2 rounded-xl ${statusFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black mt-2 tracking-tight text-slate-900">{totalCount}</div>
          <span className="text-[11px] block mt-1 text-slate-500 font-medium">
            Across all categories
          </span>
        </Card>

        <Card
          onClick={() => setStatusFilter('PENDING')}
          className={`p-4 rounded-2xl cursor-pointer transition-all border ${
            statusFilter === 'PENDING'
              ? 'ring-2 ring-amber-600 border-amber-600 bg-amber-50/60 shadow-md'
              : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Pending Review
            </span>
            <div className={`p-2 rounded-xl ${statusFilter === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'}`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black mt-2 tracking-tight text-amber-700">
            {pendingCount}
          </div>
          <span className="text-[11px] block mt-1 text-amber-600 font-medium">
            Requires administrative action
          </span>
        </Card>

        <Card
          onClick={() => setStatusFilter('APPROVED')}
          className={`p-4 rounded-2xl cursor-pointer transition-all border ${
            statusFilter === 'APPROVED'
              ? 'ring-2 ring-emerald-600 border-emerald-600 bg-emerald-50/60 shadow-md'
              : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Approved & Verified
            </span>
            <div className={`p-2 rounded-xl ${statusFilter === 'APPROVED' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black mt-2 tracking-tight text-emerald-700">
            {approvedCount}
          </div>
          <span className="text-[11px] block mt-1 text-emerald-600 font-medium">
            Authenticated in database
          </span>
        </Card>

        <Card
          onClick={() => setStatusFilter('QUERY_REJECT')}
          className={`p-4 rounded-2xl cursor-pointer transition-all border ${
            statusFilter === 'QUERY_REJECT'
              ? 'ring-2 ring-rose-600 border-rose-600 bg-rose-50/60 shadow-md'
              : 'border-slate-200 bg-white hover:border-rose-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">
              Queries & Rejected
            </span>
            <div className={`p-2 rounded-xl ${statusFilter === 'QUERY_REJECT' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700'}`}>
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black mt-2 tracking-tight text-rose-700">
            {queryCount}
          </div>
          <span className="text-[11px] block mt-1 text-rose-600 font-medium">
            Pending applicant re-upload
          </span>
        </Card>
      </div>

      {/* Tabs, Status Pills & Search */}
      <div className="space-y-3">
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

          <div className="w-full md:w-80">
            <SearchInput
              placeholder="Search by name, mobile, survey, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter Bar */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Status Filter:</span>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              statusFilter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              statusFilter === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Pending Only ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('APPROVED')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              statusFilter === 'APPROVED' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setStatusFilter('QUERY_REJECT')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              statusFilter === 'QUERY_REJECT' ? 'bg-rose-700 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Queries / Rejected ({queryCount})
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-700">
              Fetching live verification queue from MongoDB Atlas...
            </p>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const isPending =
              item.status === 'PENDING_VERIFICATION' ||
              item.status === 'PENDING_APPROVAL' ||
              item.status === 'SUBMITTED' ||
              item.status === 'UNDER_REVIEW';

            return (
              <Card
                key={item.id}
                className="p-6 md:p-7 border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all space-y-4 rounded-3xl bg-white"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <Badge variant="success" className="text-xs">
                        {item.type.replace(/_/g, ' ')}
                      </Badge>
                      <StatusBadge status={item.status} />
                      <span className="text-xs text-slate-400 font-mono">
                        App ID: <strong className="text-slate-700">{item.applicationId}</strong> • Submitted: {item.submittedAt || item.submittedDate}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{item.title}</h3>
                    <p className="text-xs text-slate-600">
                      Applicant: <strong className="text-slate-900">{item.applicantName}</strong> (
                      <span className="font-semibold text-emerald-800">{item.applicantRole || 'FARMER'}</span>
                      ) {item.applicantPhone && <span>• Mobile: {item.applicantPhone}</span>}
                    </p>
                    <p className="text-xs text-slate-600 pt-0.5">{item.details}</p>

                    {item.reviewNotes && (
                      <div className="mt-2 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[11px] text-slate-500">Official Decision Remarks:</strong>
                          <span>{item.reviewNotes}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {isPending && (
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
                        className="text-xs flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800"
                        onClick={() => setActionModal({ item, actionType: 'APPROVE' })}
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
            No approval requests found matching the active filters.
          </div>
        )}
      </div>

      {/* Decision Modal */}
      {actionModal && (
        <Modal
          isOpen={Boolean(actionModal)}
          onClose={() => setActionModal(null)}
          title={`Confirm Decision: ${actionModal.actionType} ${actionModal.item.type.replace(/_/g, ' ')}`}
        >
          <form onSubmit={handleExecuteAction} className="space-y-6 py-2">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div>
                <strong>Application:</strong> {actionModal.item.title}
              </div>
              <div>
                <strong>Applicant:</strong> {actionModal.item.applicantName} ({actionModal.item.applicantPhone})
              </div>
              <div>
                <strong>Action:</strong>{' '}
                <span
                  className={`font-bold uppercase ${
                    actionModal.actionType === 'APPROVE'
                      ? 'text-emerald-700'
                      : actionModal.actionType === 'REJECT'
                      ? 'text-rose-700'
                      : 'text-amber-700'
                  }`}
                >
                  {actionModal.actionType}
                </span>
              </div>
            </div>

            <FormTextarea
              label="Official Officer Remarks & Justification"
              rows={3}
              value={actionRemarks}
              onChange={(e) => setActionRemarks(e.target.value)}
              placeholder={
                actionModal.actionType === 'APPROVE'
                  ? 'Verified official credentials against state database. Approved for full platform access.'
                  : actionModal.actionType === 'QUERY'
                  ? 'Please upload clear identity/document credentials showing valid government designation.'
                  : 'Document mismatch with official registry.'
              }
              required
            />

            <Button
              type="submit"
              disabled={actionSubmitting}
              variant={
                actionModal.actionType === 'APPROVE'
                  ? 'primary'
                  : actionModal.actionType === 'REJECT'
                  ? 'danger'
                  : 'secondary'
              }
              className="w-full py-3"
            >
              {actionSubmitting ? 'Committing Decision to Database...' : 'Confirm & Commit Decision'}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ApprovalsQueuePage;
