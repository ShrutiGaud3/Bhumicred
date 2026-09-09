import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Calendar,
  Plus,
  Trees,
  TestTube,
  DollarSign,
  CheckCircle2,
  Users,
  Target,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Landmark,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { fetchCampaigns, createCampaign, clearGovernmentErrors } from '../governmentSlice.js';

export const CampaignsPage = () => {
  const dispatch = useDispatch();
  const { campaigns, isLoading, error, successMessage } = useSelector((state) => state.government);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    category: 'Tree Plantation Drive',
    targetQuota: '',
    budgetAllocated: '1500000',
    startDate: '2026-09-15',
    endDate: '2026-12-31',
    description: '',
    leadDepartment: 'Gujarat State Social Forestry Division',
  });

  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionError(null);
    const actionResult = await dispatch(createCampaign(newCampaign));
    if (createCampaign.fulfilled.match(actionResult)) {
      setCreateSuccess(true);
      setTimeout(() => {
        setCreateSuccess(false);
        setShowCreateModal(false);
        setNewCampaign({
          title: '',
          category: 'Tree Plantation Drive',
          targetQuota: '',
          budgetAllocated: '1500000',
          startDate: '2026-09-15',
          endDate: '2026-12-31',
          description: '',
          leadDepartment: 'Gujarat State Social Forestry Division',
        });
        dispatch(clearGovernmentErrors());
        dispatch(fetchCampaigns());
      }, 1500);
    } else {
      setActionError(actionResult.payload || 'Failed to create campaign. Please verify input fields.');
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="District Campaigns & Plantation Drives"
        subtitle="Organize tree distribution missions, free soil testing drives, and subsidy quotas."
        backTo="/government/dashboard"
        breadcrumbs={[
          { label: 'Government Portal', path: '/government/dashboard' },
          { label: 'Campaigns & Drives' },
        ]}
        actions={
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => {
              setActionError(null);
              setShowCreateModal(true);
            }}
          >
            <Plus className="w-4 h-4" /> Create New Campaign
          </Button>
        }
      />

      {isLoading && campaigns.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
          <p className="text-sm font-semibold">Loading district campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-gray-200">
          <Landmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700">No active campaigns in this district</p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={() => {
              setActionError(null);
              setShowCreateModal(true);
            }}
          >
            Launch First Campaign
          </Button>
        </Card>
      ) : (
        /* Campaigns List */
        <div className="space-y-6">
          {campaigns.map((camp) => {
            const campId = camp._id || camp.id;
            const targetCount = camp.targetCount || 10000;
            const achieved = camp.achievedCount ?? camp.achieved ?? 0;
            const progressPercent = Math.min(100, Math.round((achieved / targetCount) * 100));

            const allocatedFormatted = camp.budget?.allocated
              ? `₹${camp.budget.allocated.toLocaleString('en-IN')}`
              : camp.budgetAllocated || '₹15,00,000';

            const spentFormatted = camp.budget?.spent
              ? `₹${camp.budget.spent.toLocaleString('en-IN')}`
              : camp.budgetSpent || '₹0';

            const startDateStr = camp.startDate ? new Date(camp.startDate).toLocaleDateString('en-GB') : 'Sep 2026';
            const endDateStr = camp.endDate ? new Date(camp.endDate).toLocaleDateString('en-GB') : 'Dec 2026';

            return (
              <Card
                key={campId}
                className="p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-all space-y-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="success">{camp.categoryLabel || camp.category}</Badge>
                      <StatusBadge status={camp.status || 'IN_PROGRESS'} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{camp.title}</h3>
                    <p className="text-xs text-gray-500">
                      Lead Body: <strong className="text-gray-800">{camp.leadDepartment || 'District Agriculture Office'}</strong> • Duration: {startDateStr} to {endDateStr}
                    </p>
                  </div>

                  <div className="text-left lg:text-right space-y-1">
                    <span className="text-xs text-gray-400 block">Allocated State Budget</span>
                    <span className="text-2xl font-black text-gray-900">{allocatedFormatted}</span>
                    <span className="text-xs text-emerald-700 font-semibold block">
                      {spentFormatted} Disbursed
                    </span>
                  </div>
                </div>

                {/* Progress & Target Section */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-600 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-600" /> Target Quota: {camp.targetQuota || `${targetCount.toLocaleString()} Units`}
                    </span>
                    <span className="text-emerald-800 font-bold">
                      {achieved.toLocaleString()} Achieved ({progressPercent}%)
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 pt-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Users className="w-4 h-4 text-emerald-600" /> {camp.participatingFarmersCount ?? camp.participatingFarmers ?? 0} Farmers Participating
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert(`Opening inspection log for ${camp.title}...`)}
                  >
                    View Quota Report
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Campaign Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Launch New District Campaign / Drive"
      >
        <form onSubmit={handleCreate} className="space-y-5 py-2">
          {createSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Campaign Created Successfully!</h4>
              <p className="text-sm text-gray-500 mt-1">
                Field Officers and Panchayat Sevaks notified of targets.
              </p>
            </div>
          ) : (
            <>
              {actionError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                  {actionError}
                </div>
              )}

              <FormInput
                label="Campaign Title"
                placeholder="e.g. Anand South Agroforestry Sapling Distribution 2026"
                value={newCampaign.title}
                onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                required
              />

              <FormSelect
                label="Campaign Purpose Category"
                value={newCampaign.category}
                onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })}
                options={[
                  { value: 'Tree Plantation Drive', label: 'Tree Plantation & Bund Forestry Drive' },
                  { value: 'Soil Testing Campaign', label: 'Free Soil Testing & Lab Analysis Week' },
                  { value: 'Subsidy Onboarding', label: 'State Agro Subsidy Direct Enrollment' },
                  { value: 'Carbon Cluster Aggregation', label: 'Farmer Carbon Credit Aggregation Camp' },
                ]}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Target Quota Description"
                  placeholder="e.g. 25,000 Saplings"
                  value={newCampaign.targetQuota}
                  onChange={(e) => setNewCampaign({ ...newCampaign, targetQuota: e.target.value })}
                  required
                />
                <FormInput
                  label="Budget Allocation (₹)"
                  placeholder="e.g. 1500000"
                  value={newCampaign.budgetAllocated}
                  onChange={(e) => setNewCampaign({ ...newCampaign, budgetAllocated: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Start Date"
                  type="date"
                  value={newCampaign.startDate}
                  onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                  required
                />
                <FormInput
                  label="End Date"
                  type="date"
                  value={newCampaign.endDate}
                  onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                  required
                />
              </div>

              <FormTextarea
                label="Operational Guidelines & Scope"
                rows={3}
                placeholder="Guidelines for field partner distribution, nursery pickup points, and eligibility rules..."
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
              />

              <Button type="submit" variant="primary" className="w-full py-3" isLoading={isLoading}>
                Publish & Dispatch Campaign
              </Button>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default CampaignsPage;
