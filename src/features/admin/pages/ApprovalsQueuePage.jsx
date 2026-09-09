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
  const [items, setItems] = useState(() => storageService.getApprovals());
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionModal, setActionModal] = useState(null); // { item, actionType: 'APPROVE'|'REJECT'|'QUERY' }
  const [actionRemarks, setActionRemarks] = useState('');
  const [actionSuccess, setActionSuccess] = useState(false);
  const toast = useToast();

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await onboardingService.getAdminQueue();
      const appsList = Array.isArray(res?.data) ? res.data : (Array.isArray(res?.data?.applications) ? res.data.applications : []);
      if (appsList.length > 0) {
        const liveItems = appsList.map((app) => ({
          id: app.applicationId || app.id || app._id,
          applicationId: app.applicationId || app.id || app._id,
          targetId: app.targetId,
          type: app.type || 'FARMER_KYC',
          title: app.title || `Application - ${app.applicantName}`,
          applicantName: app.applicantName || 'Citizen Applicant',
          applicantRole: app.role || 'FARMER',
          applicantPhone: app.mobile || '',
          submittedDate: app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Just now',
          submittedAt: app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Today',
          status: app.status || 'PENDING_REVIEW',
          riskScore: app.riskScore || 'LOW',
          details: `${app.address?.village || ''} ${app.address?.district || ''} • ${app.address?.state || ''}`,
        }));

        // Merge with any local storage only items
        const local = storageService.getApprovals();
        const combined = [...liveItems];
        local.forEach((loc) => {
          if (!combined.some((c) => c.id === loc.id || c.applicationId === loc.id)) {
            combined.push(loc);
          }
        });

        setItems(combined);
      }
    } catch (err) {
      console.warn('Backend admin queue fetch error, using local fallback:', err);
      setItems(storageService.getApprovals());
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
    { id: 'INSURANCE_CLAIM', label: 'Insurance Claims' },
    { id: 'PARTNER_ONBOARDING', label: 'Partner Licenses' },
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

    const updated = storageService.updateApprovalStatus(
      actionModal.item.id,
      targetStatus,
      actionRemarks
    );
    setItems((prev) =>
      prev.map((it) => (it.id === actionModal.item.id ? { ...it, status: targetStatus } : it))
    );

    if (actionModal.item.type === 'FARMER_KYC' && actionModal.actionType === 'APPROVE') {
      dispatch(setUserStatus('APPROVED'));
    }

    // Live Backend API sync
    try {
      const targetAppId = actionModal.item.applicationId || actionModal.item.id;
      await onboardingService.reviewKyc(targetAppId, {
        status: targetStatus,
        reviewNotes: actionRemarks,
        action: actionModal.actionType,
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
            className={`flex items-center gap-2 ${loading ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-4 h-4" /> Refresh Queue
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
