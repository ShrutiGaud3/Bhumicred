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

  const metrics = dashboardData?.metrics || {};
  const jurisdiction = dashboardData?.jurisdiction || {};

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
                {jurisdiction.boundaryName || jurisdiction.village || 'Anand Region'}, {jurisdiction.district || 'District'} ({jurisdiction.state || 'State'})
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
            <div className="text-2xl font-black text-slate-900">{metrics.publicAssetsManaged || 0}</div>
            <p className="text-xs text-slate-500 mt-0.5">Parks & public lands</p>
          </div>
        </Card>

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
            <div className="text-2xl font-black text-slate-900">{metrics.farmersInArea || 0}</div>
            <p className="text-xs text-slate-500 mt-0.5">Permitted local records</p>
          </div>
        </Card>

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
            <div className="text-2xl font-black text-slate-900">{metrics.activeCampaigns || 0}</div>
            <p className="text-xs text-slate-500 mt-0.5">On-demand service drives</p>
          </div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Soil Testing Drives
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{metrics.soilTestingDrives || 0}</div>
            <p className="text-xs text-slate-500 mt-0.5">Area lab batches</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
