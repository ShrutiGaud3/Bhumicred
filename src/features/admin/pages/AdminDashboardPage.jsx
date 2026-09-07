import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDashboardStats, fetchAuditLogs } from '../adminSlice.js';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card.jsx';
import { Table, TableRow, TableCell } from '../../../components/ui/Table.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { LoadingSkeleton } from '../../../components/states/LoadingSkeleton.jsx';
import { ErrorState } from '../../../components/states/ErrorState.jsx';
import { formatDateTime } from '../../../utils/formatters.js';
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
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, auditLogs, isLoading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminDashboardStats());
    dispatch(fetchAuditLogs({ limit: 5 }));
  }, [dispatch]);

  if (isLoading && !stats) {
    return <LoadingSkeleton variant="cards" count={4} />;
  }

  if (error && !stats) {
    return <ErrorState message={error} onRetry={() => dispatch(fetchAdminDashboardStats())} />;
  }

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-400/20">
                Super Admin Desk
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                RBAC Level 1: Full Control
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Administrative & Governance Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Real-time monitoring across user verifications, GIS land validation, insurance underwriters, laboratory queues, and immutable financial audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div>
              <div className="text-xs font-bold text-slate-200">System Health</div>
              <div className="text-[11px] text-emerald-400 font-medium">100% Operational</div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card hoverable className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Users
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-slate-500 mt-0.5">Registered accounts</p>
          </div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Farmers
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{stats?.farmers || 0}</div>
            <p className="text-xs text-slate-500 mt-0.5">Active farmer profiles</p>
          </div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Govt Bodies
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{stats?.governmentBodies || 0}</div>
            <p className="text-xs text-slate-500 mt-0.5">Panchayats & Municipalities</p>
          </div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Partners
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{stats?.enterprisePartners || 0}</div>
            <p className="text-xs text-slate-500 mt-0.5">Field & lab organizations</p>
          </div>
        </Card>
      </div>

      {/* Audit Log Table */}
      <Card>
        <CardHeader
          title="Recent Security & System Audit Logs"
          subtitle="Immutable record of administrative decisions and authentication events"
          action={
            <Link to="/admin/audit" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
              View Full Audit Trail <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <div className="p-1">
          {auditLogs && auditLogs.length > 0 ? (
            <Table headers={['Timestamp', 'Actor', 'Role', 'Action', 'Entity', 'Reason']}>
              {auditLogs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="font-mono text-xs text-slate-500">
                    {formatDateTime(log.createdAt)}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900 text-xs">
                    {log.actorName || 'System'}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-slate-100 text-slate-700">
                      {log.actorRole}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-emerald-800">
                    {log.action}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {log.entityType}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 truncate max-w-xs">
                    {log.reason || '—'}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Audit log stream active. Authentication events and mutations are automatically logged.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
