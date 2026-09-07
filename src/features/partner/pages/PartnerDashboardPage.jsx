import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerDashboard } from '../partnerSlice.js';
import { Card } from '../../../components/ui/Card.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { LoadingSkeleton } from '../../../components/states/LoadingSkeleton.jsx';
import { ErrorState } from '../../../components/states/ErrorState.jsx';
import {
  FolderKanban,
  MapPin,
  FileCheck2,
  FlaskConical,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PartnerDashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { dashboardData, isLoading, error } = useSelector((state) => state.partner);

  useEffect(() => {
    dispatch(fetchPartnerDashboard());
  }, [dispatch]);

  if (isLoading && !dashboardData) {
    return <LoadingSkeleton variant="cards" count={4} />;
  }

  if (error && !dashboardData) {
    return <ErrorState message={error} onRetry={() => dispatch(fetchPartnerDashboard())} />;
  }

  const metrics = dashboardData?.metrics || {};

  return (
    <div className="space-y-8">
      {/* Partner Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/20">
                Enterprise Partner Portal
              </span>
              <StatusBadge status={user?.status || 'APPROVED'} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {user?.name || 'AgriTech Partner Operations'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Assigned Field Inspections, GPS Visit Verification, Laboratory Sample Queues, and Milestone Evidence Uploads.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/partner/tasks">
              <Button variant="secondary" size="md" icon={FolderKanban}>
                View Task Queue
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
              Assigned Tasks
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{metrics.assignedTasks || 0}</div>
            <p className="text-xs text-slate-500 mt-0.5">Tasks awaiting execution</p>
          </div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Visits
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{metrics.scheduledVisits || 0}</div>
            <p className="text-xs text-slate-500 mt-0.5">GPS geotagged visits</p>
          </div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Lab Samples
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{metrics.samplesInLabQueue || 0}</div>
            <p className="text-xs text-slate-500 mt-0.5">Samples undergoing analysis</p>
          </div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Reports Submitted
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{metrics.submittedReports || 0}</div>
            <p className="text-xs text-slate-500 mt-0.5">Pending admin review</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
