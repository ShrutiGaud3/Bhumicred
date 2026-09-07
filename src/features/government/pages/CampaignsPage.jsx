import React, { useState } from 'react';
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

const MOCK_CAMPAIGNS = [
  {
    id: 'cmp_01',
    title: 'Anand District Green Canopy & Teak Plantation Drive 2026',
    category: 'Tree Plantation Drive',
    targetQuota: '50,000 Saplings',
    achieved: 38500,
    targetCount: 50000,
    budgetAllocated: '₹25,00,000',
    budgetSpent: '₹18,20,000',
    status: 'IN_PROGRESS',
    startDate: '01 Jun 2026',
    endDate: '31 Oct 2026',
    participatingFarmers: 412,
    leadDepartment: 'Gujarat State Social Forestry Division',
  },
  {
    id: 'cmp_02',
    title: 'Kharif Pre-Sowing Free Soil Health Testing Camp',
    category: 'Soil Testing Campaign',
    targetQuota: '2,500 Soil Cards',
    achieved: 2150,
    targetCount: 2500,
    budgetAllocated: '₹8,50,000',
    budgetSpent: '₹7,10,000',
    status: 'IN_PROGRESS',
    startDate: '15 May 2026',
    endDate: '30 Sep 2026',
    participatingFarmers: 1840,
    leadDepartment: 'District Agriculture Office, Anand',
  },
  {
    id: 'cmp_03',
    title: 'Solar Micro-Drip Subsidy Enrollment Mission',
    category: 'Subsidy Onboarding',
    targetQuota: '1,000 Ha Drip Installed',
    achieved: 1000,
    targetCount: 1000,
    budgetAllocated: '₹45,00,000',
    budgetSpent: '₹44,50,000',
    status: 'COMPLETED',
    startDate: '01 Jan 2026',
    endDate: '30 Jun 2026',
    participatingFarmers: 620,
    leadDepartment: 'Gujarat Green Revolution Company (GGRC)',
  },
];

export const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState(MOCK_CAMPAIGNS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    category: 'Tree Plantation Drive',
    targetQuota: '',
    budgetAllocated: '',
    startDate: '2026-09-15',
    endDate: '2026-12-31',
    description: '',
  });
  const [createSuccess, setCreateSuccess] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    const created = {
      id: `cmp_${Date.now()}`,
      title: newCampaign.title || 'New District Mission',
      category: newCampaign.category,
      targetQuota: newCampaign.targetQuota || '10,000 Units',
      achieved: 0,
      targetCount: 10000,
      budgetAllocated: `₹${Number(newCampaign.budgetAllocated || 500000).toLocaleString()}`,
      budgetSpent: '₹0',
      status: 'IN_PROGRESS',
      startDate: newCampaign.startDate,
      endDate: newCampaign.endDate,
      participatingFarmers: 0,
      leadDepartment: 'District Collectorate Office',
    };
    setCampaigns([created, ...campaigns]);
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setShowCreateModal(false);
    }, 1500);
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
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" /> Create New Campaign
          </Button>
        }
      />

      {/* Campaigns List */}
      <div className="space-y-6">
        {campaigns.map((camp) => {
          const progressPercent = Math.min(100, Math.round((camp.achieved / camp.targetCount) * 100));

          return (
            <Card key={camp.id} className="p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-all space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant="success">{camp.category}</Badge>
                    <StatusBadge status={camp.status} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{camp.title}</h3>
                  <p className="text-xs text-gray-500">
                    Lead Body: <strong className="text-gray-800">{camp.leadDepartment}</strong> • Duration: {camp.startDate} to {camp.endDate}
                  </p>
                </div>

                <div className="text-left lg:text-right space-y-1">
                  <span className="text-xs text-gray-400 block">Allocated State Budget</span>
                  <span className="text-2xl font-black text-gray-900">{camp.budgetAllocated}</span>
                  <span className="text-xs text-emerald-700 font-semibold block">
                    {camp.budgetSpent} Disbursed
                  </span>
                </div>
              </div>

              {/* Progress & Target Section */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-600 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-600" /> Target Quota: {camp.targetQuota}
                  </span>
                  <span className="text-emerald-800 font-bold">
                    {camp.achieved.toLocaleString()} Achieved ({progressPercent}%)
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
                  <Users className="w-4 h-4 text-emerald-600" /> {camp.participatingFarmers} Farmers Participating
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

      {/* Create Campaign Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Launch New District Campaign / Drive"
      >
        <form onSubmit={handleCreate} className="space-y-6 py-2">
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
                  label="Target Target / Count"
                  placeholder="e.g. 25,000 Saplings"
                  value={newCampaign.targetQuota}
                  onChange={(e) => setNewCampaign({ ...newCampaign, targetQuota: e.target.value })}
                  required
                />
                <FormInput
                  label="Budget Allocation (₹)"
                  type="number"
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

              <Button type="submit" variant="primary" className="w-full py-3">
                Publish & Dispatch Campaign
              </Button>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};
