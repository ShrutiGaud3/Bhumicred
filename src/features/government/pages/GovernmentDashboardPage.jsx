import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGovernmentDashboard } from '../governmentSlice.js';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { LoadingSkeleton } from '../../../components/states/LoadingSkeleton.jsx';
import { ErrorState } from '../../../components/states/ErrorState.jsx';
import {
  Building2,
  Users,
  MapPin,
  Landmark,
  ShieldAlert,
  FlaskConical,
  PlusCircle,
  FolderKanban,
  FileCheck2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const GovernmentDashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { dashboardData, isLoading, error } = useSelector((state) => state.government);

  useEffect(() => {
    dispatch(fetchGovernmentDashboard());
  }, [dispatch]);

  if (isLoading && !dashboardData) {
    return <LoadingSkeleton variant="cards" count={4} />;
  }

  if (error && !dashboardData) {
    return <ErrorState message={error} onRetry={() => dispatch(fetchGovernmentDashboard())} />;
  }

  const metrics = dashboardData?.metrics || dashboardData || {};
  const jurisdiction = user?.jurisdiction || dashboardData?.jurisdiction || {};

  return (
    <div className="space-y-8">
      {/* Government Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-400/20">
                Government Institution Portal
              </span>
              <StatusBadge status={user?.status || 'APPROVED'} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {user?.name || 'Local Governance Desk'}
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-xl">
              Jurisdiction:{' '}
              <span className="font-bold text-white">
                {jurisdiction.boundaryName || jurisdiction.village || 'Anand Region'}, {jurisdiction.district || 'District'} ({jurisdiction.state || 'Gujarat'})
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/government/campaigns">
              <Button variant="secondary" size="md" icon={PlusCircle}>
                Launch Farmer Campaign
              </Button>
            </Link>
            <Link to="/government/assets">
              <Button variant="outline" size="md" className="border-white/30 text-white hover:bg-white/10">
                Add Public Green Asset
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link to="/government/assets">
          <Card hoverable className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Public Assets
              </span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                {metrics.publicGreenAssetsCount ?? metrics.publicAssetsManaged ?? 3}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Parks & social forestry</p>
            </div>
          </Card>
        </Link>

        <Link to="/government/farmers">
          <Card hoverable className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Farmers in Area
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                {metrics.totalRegisteredFarmers ?? metrics.farmersInArea ?? 2}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Permitted local records</p>
            </div>
          </Card>
        </Link>

        <Link to="/government/campaigns">
          <Card hoverable className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Active Campaigns
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                {metrics.activeCampaignsCount ?? metrics.activeCampaigns ?? 2}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">On-demand service drives</p>
            </div>
          </Card>
        </Link>

        <Link to="/government/schemes">
          <Card hoverable className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Subsidy Schemes
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                {metrics.totalSchemesCount ?? 3}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">State & Central DBT</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Quick Access Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">Mobile Soil Labs</h4>
              <p className="text-xs text-slate-500">Dispatch vans to villages</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Monitor regional N-P-K levels and deploy mobile testing laboratories for free panchayat camps.
          </p>
          <Link to="/government/soil">
            <Button variant="outline" size="sm" className="w-full">
              Manage Soil Drives →
            </Button>
          </Link>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">Tree Insurance Audit</h4>
              <p className="text-xs text-slate-500">Subsidies & Risk Pool</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Audit government 40% premium subsidy disbursements and parametric cyclone/drought triggers.
          </p>
          <Link to="/government/insurance">
            <Button variant="outline" size="sm" className="w-full">
              Audit Insurance Subsidies →
            </Button>
          </Link>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">Area Projects</h4>
              <p className="text-xs text-slate-500">Sustainability & Carbon</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Inspect civic afforestation milestones, community nurseries, and private partner projects.
          </p>
          <Link to="/government/projects">
            <Button variant="outline" size="sm" className="w-full">
              View Area Projects →
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};
