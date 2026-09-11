import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FileText,
  Search,
  Filter,
  ShieldCheck,
  Clock,
  Download,
  User,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { fetchAuditLogs } from '../adminSlice.js';
import { adminService } from '../services/adminService.js';

const ROLE_OPTIONS = [
  { value: 'ALL', label: 'All Roles' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'GOVERNMENT', label: 'Government Nodal' },
  { value: 'PARTNER', label: 'Enterprise Partner' },
  { value: 'FARMER', label: 'Citizen Farmer' },
  { value: 'SYSTEM', label: 'System Automated' },
];

const RESOURCE_OPTIONS = [
  { value: 'ALL', label: 'All Resources' },
  { value: 'LAND', label: 'Land Parcels & GIS' },
  { value: 'CLAIM', label: 'Insurance Claims' },
  { value: 'SOIL', label: 'Soil Health Reports' },
  { value: 'WALLET', label: 'Smart Wallet & Payouts' },
  { value: 'CARBON', label: 'Carbon & ESG Credits' },
  { value: 'SETTING', label: 'System Settings' },
  { value: 'SCHEME', label: 'Government Schemes' },
];

export const AdminAuditLogsPage = () => {
  const dispatch = useDispatch();
  const { auditLogs, totalLogs, totalPages, currentPage, isLoading } = useSelector(
    (state) => state.admin
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [resourceFilter, setResourceFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    dispatch(
      fetchAuditLogs({
        search: searchQuery,
        role: roleFilter,
        resourceType: resourceFilter,
        page,
        limit: 15,
      })
    );
  }, [dispatch, searchQuery, roleFilter, resourceFilter, page]);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const blob = await adminService.exportAuditLogsCSV({
        search: searchQuery,
        role: roleFilter,
        resourceType: resourceFilter,
      });

      const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `bhumicred_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('CSV export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Success
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3" /> Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <XCircle className="w-3 h-3" /> Failed
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Immutable Audit Trails & Security Logs"
        subtitle="Cryptographically sealed audit trail capturing user mutations, approval decisions, financial disbursements, and access telemetry."
        backTo="/admin/dashboard"
        breadcrumbs={[
          { label: 'Admin Portal', path: '/admin/dashboard' },
          { label: 'Security & Audit Logs' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              loading={isLoading}
              onClick={() =>
                dispatch(
                  fetchAuditLogs({
                    search: searchQuery,
                    role: roleFilter,
                    resourceType: resourceFilter,
                    page,
                    limit: 15,
                  })
                )
              }
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Download}
              loading={exporting}
              onClick={handleExportCSV}
            >
              Export Audit Trail (CSV)
            </Button>
          </div>
        }
      />

      <Card className="p-6 md:p-8 space-y-6">
        {/* Filters & Search Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-neutral-800">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              System Mutation Logs
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {totalLogs} Recorded
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Real-time immutable ledger synced with MongoDB Atlas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-48">
              <FormSelect
                name="roleFilter"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                options={ROLE_OPTIONS}
              />
            </div>

            <div className="w-48">
              <FormSelect
                name="resourceFilter"
                value={resourceFilter}
                onChange={(e) => {
                  setResourceFilter(e.target.value);
                  setPage(1);
                }}
                options={RESOURCE_OPTIONS}
              />
            </div>

            <div className="w-full sm:w-64">
              <SearchInput
                placeholder="Search actor, action, IP..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-neutral-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-neutral-800/80 border-b border-slate-200 dark:border-neutral-800 uppercase font-bold text-slate-500 dark:text-neutral-400 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Timestamp (IST)</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target Resource</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 dark:text-neutral-700 mb-1.5" />
                    No audit logs matching this search filter
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr
                    key={log._id || log.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-neutral-400 whitespace-nowrap">
                      {new Date(log.createdAt || log.timestamp).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {log.actorName || log.actor}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700">
                        {log.actorRole || log.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-700 dark:text-emerald-400">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-neutral-300 max-w-xs truncate">
                      {log.resource}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(log.status || 'SUCCESS')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 rounded-lg text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors font-semibold"
                        title="View Full Payload & Metadata"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500 dark:text-neutral-400">
            Page <strong className="text-slate-800 dark:text-white">{currentPage}</strong> of{' '}
            <strong className="text-slate-800 dark:text-white">{totalPages || 1}</strong>
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={ChevronLeft}
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={ChevronRight}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-xl w-full border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 sm:p-7 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Audit Log Inspection #{selectedLog._id?.slice(-8) || selectedLog.id}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedLog.action}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-neutral-800 rounded-xl">
                <span className="text-slate-400 block mb-0.5">Actor</span>
                <strong className="text-slate-900 dark:text-white">{selectedLog.actorName || selectedLog.actor}</strong>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-neutral-800 rounded-xl">
                <span className="text-slate-400 block mb-0.5">Role</span>
                <strong className="text-slate-900 dark:text-white">{selectedLog.actorRole || selectedLog.role}</strong>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-neutral-800 rounded-xl">
                <span className="text-slate-400 block mb-0.5">Timestamp (IST)</span>
                <strong className="text-slate-900 dark:text-white font-mono">
                  {new Date(selectedLog.createdAt || selectedLog.timestamp).toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-neutral-800 rounded-xl">
                <span className="text-slate-400 block mb-0.5">IP Address</span>
                <strong className="text-slate-900 dark:text-white font-mono">{selectedLog.ipAddress || '127.0.0.1'}</strong>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-neutral-800 rounded-xl text-xs space-y-1">
              <span className="text-slate-400 block">Target Resource</span>
              <p className="font-bold text-slate-900 dark:text-white">{selectedLog.resource}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 dark:text-neutral-300">
                Cryptographic Metadata & Payload Details:
              </span>
              <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48">
                {JSON.stringify(selectedLog.details || {}, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedLog(null)}>
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogsPage;
