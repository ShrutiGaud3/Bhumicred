import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDashboardStats, fetchAuditLogs } from '../adminSlice.js';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card.jsx';
import { Table, TableRow, TableCell } from '../../../components/ui/Table.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { LoadingSkeleton } from '../../../components/states/LoadingSkeleton.jsx';
import { ErrorState } from '../../../components/states/ErrorState.jsx';
import { formatDateTime } from '../../../utils/formatters.js';
import { storageService } from '../../../services/storageService.js';
import { useToast } from '../../../components/ui/ToastContext.jsx';
import {
  ShieldCheck,
  Users,
  Building2,
  MapPin,
  CheckCircle2,
  FileText,
  Activity,
  ArrowRight,
  Shield,
  Layers,
  Trees,
  FlaskConical,
  CloudSun,
  Wallet,
  Headphones,
  Settings,
  AlertCircle,
  Check,
  ExternalLink,
  RefreshCw,
  Clock,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const { stats, auditLogs, isLoading, error } = useSelector((state) => state.admin);

  const [pendingItems, setPendingItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchAdminDashboardStats()),
      dispatch(fetchAuditLogs({ limit: 6 })),
    ]);
    const approvals = storageService.getApprovals();
    const pending = approvals.filter(
      (a) =>
        a.status === 'PENDING_APPROVAL' ||
        a.status === 'PENDING_VERIFICATION' ||
        a.status === 'PENDING' ||
        a.status === 'PENDING_REVIEW'
    );
    setPendingItems(pending.slice(0, 4));
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const handleQuickApprove = (e, item) => {
    e.stopPropagation();
    storageService.updateApprovalStatus(item.id || item.applicationId, 'APPROVED', 'Quick approved via Super Admin Dashboard');
    toast.showSuccess(`Approved application for ${item.applicantName || 'Citizen'}`);
    loadData();
  };

  if (isLoading && !stats) {
    return <LoadingSkeleton variant="cards" count={6} />;
  }

  if (error && !stats) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Super Admin Executive Header */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Desk
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                RBAC Level 1: Full Sovereign Control
              </span>
              <span className="px-2.5 py-1 rounded-full bg-teal-900/50 text-teal-300 text-xs font-semibold border border-teal-500/30">
                Live Node: Delhi-NCR
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Administrative & Governance Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              Real-time monitoring across citizen KYC onboarding, GIS land boundary validation, parametric tree insurance underwriting, NABL soil labs, carbon MRV audits, and platform treasury.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={loadData}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-2xl text-xs font-bold border border-slate-700 transition shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Telemetry
            </button>
            <div className="flex items-center gap-3 bg-slate-800/90 px-4 py-2.5 rounded-2xl border border-slate-700">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse shrink-0" />
              <div>
                <div className="text-xs font-bold text-slate-200">System Telemetry</div>
                <div className="text-[11px] text-emerald-400 font-bold">{stats?.uptime || '99.99%'} Uptime • Healthy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8-Card Macro Operational Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* 1. Total Registered Users */}
        <Card hoverable className="p-5 border-slate-200/80 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Citizen Registry
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {(stats?.totalUsers || 420).toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-slate-500 font-sans">Accounts</span>
            </div>
            <div className="text-xs text-slate-500 mt-1.5 truncate">
              <span className="font-semibold text-emerald-700">{stats?.farmers || 380} Farmers</span> •{' '}
              <span>{stats?.governmentBodies || 12} Gov</span> •{' '}
              <span>{stats?.enterprisePartners || 28} Partners</span>
            </div>
          </div>
        </Card>

        {/* 2. Pending Approvals Queue */}
        <Card
          hoverable
          onClick={() => navigate('/admin/approvals')}
          className="p-5 border-amber-200/80 bg-gradient-to-br from-white to-amber-50/40 hover:border-amber-400 cursor-pointer transition-all relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Pending Approvals
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-amber-900 tracking-tight">
                {stats?.pendingApprovals || 0}
              </span>
              <span className="text-xs font-bold text-amber-700 font-sans">In Queue</span>
            </div>
            <div className="flex items-center justify-between mt-1.5 gap-2">
              <span className="text-xs font-semibold text-amber-700 truncate">Awaiting Review</span>
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-0.5 hover:underline shrink-0">
                Review <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </Card>

        {/* 3. GIS Land Parcels */}
        <Card
          hoverable
          onClick={() => navigate('/admin/lands')}
          className="p-5 border-slate-200/80 hover:border-emerald-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Cadastral Lands
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {(stats?.totalLands || 18).toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-slate-500 font-sans">Parcels</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 truncate">
              <span className="font-bold text-slate-800">{stats?.totalAcres || 142.8} Acres</span> •{' '}
              <span className="font-bold text-teal-700">{(stats?.totalTrees || 18450).toLocaleString('en-IN')} trees</span>
            </p>
          </div>
        </Card>

        {/* 4. Parametric Tree Insurance */}
        <Card
          hoverable
          onClick={() => navigate('/admin/insurance')}
          className="p-5 border-slate-200/80 hover:border-emerald-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tree Insurance
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Trees className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {stats?.totalPolicies || 140}
              </span>
              <span className="text-xs font-bold text-slate-500 font-sans">Policies</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 truncate">
              <span className="font-bold text-amber-700">{stats?.activeClaims || 2} Open Claims</span> • ₹31/tree/yr
            </p>
          </div>
        </Card>

        {/* 5. Soil Health Diagnostics */}
        <Card
          hoverable
          onClick={() => navigate('/admin/soil')}
          className="p-5 border-slate-200/80 hover:border-emerald-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Soil Testing
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {stats?.totalSoilTests || 24}
              </span>
              <span className="text-xs font-bold text-slate-500 font-sans">Tests</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 truncate">
              <span className="font-bold text-slate-800">{stats?.pendingSoilTests || 3} in Lab Queue</span> • NABL
            </p>
          </div>
        </Card>

        {/* 6. Carbon Credit MRV */}
        <Card
          hoverable
          onClick={() => navigate('/admin/carbon')}
          className="p-5 border-slate-200/80 hover:border-emerald-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Carbon Registry
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
              <CloudSun className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {Number(stats?.totalCarbonCredits || 1250).toLocaleString('en-IN', { maximumFractionDigits: 1 })}
              </span>
              <span className="text-xs font-bold text-slate-500 font-sans">tCO2e</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 truncate">
              <span className="font-bold text-cyan-700">{stats?.totalCarbonAudits || 3} MRV Scans</span> • Sentinel-2
            </p>
          </div>
        </Card>

        {/* 7. Citizen Support Grievances */}
        <Card
          hoverable
          onClick={() => navigate('/admin/support')}
          className="p-5 border-slate-200/80 hover:border-emerald-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Citizen Grievances
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {stats?.totalSupportTickets || 8}
              </span>
              <span className="text-xs font-bold text-slate-500 font-sans">Tickets</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 truncate">
              <span className="font-bold text-emerald-700">{stats?.openTickets || 1} Active</span> • Avg 2.4h
            </p>
          </div>
        </Card>

        {/* 8. Platform Treasury Liquidity */}
        <Card
          hoverable
          onClick={() => navigate('/admin/finance')}
          className="p-5 border-slate-200/80 hover:border-emerald-300 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sovereign Treasury
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ₹{Number(stats?.treasuryBalance || 8450000).toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 truncate">
              <span className="font-bold text-emerald-700">100% Escrow Backed</span> • DBT Liquidity
            </p>
          </div>
        </Card>
      </div>

      {/* Actionable Pending Approvals Queue Quick Review */}
      <Card className="border-amber-200/90 shadow-md">
        <CardHeader
          title="Pending Approvals & Verification Queue"
          subtitle="Citizen Aadhaar KYC, Land Title Registrations, and Partner Business Licenses requiring administrative sign-off"
          action={
            <Link
              to="/admin/approvals"
              className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition"
            >
              Open Full Approvals Queue ({stats?.pendingApprovals || pendingItems.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <div className="p-4 sm:p-6 space-y-3">
          {pendingItems && pendingItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {pendingItems.map((item) => (
                <div
                  key={item.id || item.applicationId}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 shadow-sm flex flex-col justify-between transition group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        {item.type || (item.applicationId?.startsWith('APP-LND-') ? 'LAND REGISTRATION' : 'FARMER KYC')}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-slate-400">
                        {item.applicationId || item.id}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition">
                      {item.title || item.applicantName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {item.details || `Applicant: ${item.applicantName || 'Citizen Farmer'}`}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2 font-medium">
                      <Clock className="w-3 h-3" /> Submitted: {item.submittedDate || 'Recently'}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to="/admin/approvals"
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      Inspect Dossier <ExternalLink className="w-3 h-3" />
                    </Link>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate('/admin/approvals')}
                        className="text-xs py-1 px-2.5 h-8"
                      >
                        Review
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => handleQuickApprove(e, item)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs py-1 px-3 h-8 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-800">All Approvals Up To Date!</div>
              <p className="text-xs text-slate-500 mt-0.5">
                No citizen onboarding or land verification applications are pending super admin sign-off.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Admin Quick Action Hub */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-extrabold text-slate-900">Governance & Operations Hub</h2>
          <p className="text-xs text-slate-500">Fast access to manage cadastral registers, underwriters, soil labs, and ESG markets.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <Link
            to="/admin/approvals"
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-md transition text-center group flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:scale-110 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-900">Approvals Queue</div>
            <span className="text-[10px] text-amber-700 font-semibold">{stats?.pendingApprovals || 0} Pending</span>
          </Link>

          <Link
            to="/admin/lands"
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-400 hover:shadow-md transition text-center group flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-900">Cadastral GIS</div>
            <span className="text-[10px] text-slate-500 font-semibold">{stats?.totalLands || 18} Parcels</span>
          </Link>

          <Link
            to="/admin/insurance"
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition text-center group flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
              <Trees className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-900">Tree Insurance</div>
            <span className="text-[10px] text-emerald-700 font-semibold">{stats?.totalPolicies || 140} Active</span>
          </Link>

          <Link
            to="/admin/soil"
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-md transition text-center group flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-900">Soil Testing Lab</div>
            <span className="text-[10px] text-slate-500 font-semibold">{stats?.totalSoilTests || 24} Orders</span>
          </Link>

          <Link
            to="/admin/carbon"
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-cyan-400 hover:shadow-md transition text-center group flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center group-hover:scale-110 transition">
              <CloudSun className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-900">Carbon MRV</div>
            <span className="text-[10px] text-cyan-700 font-semibold">{stats?.totalCarbonCredits || 1250} tCO2e</span>
          </Link>

          <Link
            to="/admin/finance"
            className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-400 hover:shadow-md transition text-center group flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-slate-900">Finance & Escrow</div>
            <span className="text-[10px] text-emerald-700 font-semibold">DBT Verified</span>
          </Link>
        </div>
      </div>

      {/* Immutable Security & Audit Log Stream */}
      <Card>
        <CardHeader
          title="Recent Security & System Audit Logs"
          subtitle="Cryptographically verified immutable record of administrative actions, state verifications, and payouts"
          action={
            <Link
              to="/admin/audit"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
            >
              View Full Audit Trail ({auditLogs?.length || 5}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <div className="p-1">
          {auditLogs && auditLogs.length > 0 ? (
            <Table headers={['Timestamp', 'Actor', 'Role', 'Action', 'Entity', 'Audit Context']}>
              {auditLogs.map((log) => (
                <TableRow key={log._id || log.id}>
                  <TableCell className="font-mono text-xs text-slate-500">
                    {formatDateTime(log.createdAt || log.timestamp)}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900 text-xs">
                    {log.actorName || 'System Automated Node'}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                        log.actorRole === 'SUPER_ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : log.actorRole === 'GOVERNMENT'
                          ? 'bg-teal-100 text-teal-800'
                          : log.actorRole === 'PARTNER'
                          ? 'bg-amber-100 text-amber-800'
                          : log.actorRole === 'SYSTEM'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.actorRole || 'SYSTEM'}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-emerald-800">
                    {log.action}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 font-semibold">
                    {log.resourceType || log.entityType || 'SYSTEM'}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 max-w-sm truncate">
                    {log.reason || log.resource || log.details?.applicant || 'Operational activity verified.'}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Audit log stream active. Authentication events and administrative mutations are automatically recorded.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;

