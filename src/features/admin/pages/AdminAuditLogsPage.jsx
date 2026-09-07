import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  ShieldCheck,
  Clock,
  Download,
  User,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';

const MOCK_AUDIT_LOGS = [
  {
    id: 'log_01',
    actor: 'Vikram Singh',
    role: 'SUPER_ADMIN',
    action: 'APPROVE_LAND_REGISTRATION',
    resource: 'Parcel: Shree Ram Farm (Survey 402/A)',
    ipAddress: '103.24.12.89',
    timestamp: '2026-09-07T11:32:00Z',
    status: 'SUCCESS',
  },
  {
    id: 'log_02',
    actor: 'Devang Joshi',
    role: 'PARTNER',
    action: 'UPLOAD_SOIL_REPORT',
    resource: 'Report SR-2026-9921',
    ipAddress: '103.24.18.42',
    timestamp: '2026-09-07T10:15:00Z',
    status: 'SUCCESS',
  },
  {
    id: 'log_03',
    actor: 'Kavita Sharma',
    role: 'GOVERNMENT',
    action: 'DISPATCH_SMS_BROADCAST',
    resource: 'Audience: 412 Farmers (Anand District)',
    ipAddress: '14.139.120.10',
    timestamp: '2026-09-06T15:45:00Z',
    status: 'SUCCESS',
  },
  {
    id: 'log_04',
    actor: 'Ramesh Patel',
    role: 'FARMER',
    action: 'RAISE_INSURANCE_CLAIM',
    resource: 'Policy BC-POL-2026-00481',
    ipAddress: '157.34.88.19',
    timestamp: '2026-09-05T14:10:00Z',
    status: 'SUCCESS',
  },
];

export const AdminAuditLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = MOCK_AUDIT_LOGS.filter(
    (l) =>
      l.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.resource.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Immutable Audit Trails & Security Logs"
        subtitle="Cryptographically sealed audit log trail capturing user mutations, approval decisions, and system access."
        backTo="/admin/dashboard"
        breadcrumbs={[
          { label: 'Admin Portal', path: '/admin/dashboard' },
          { label: 'Security & Audit Logs' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => alert('Exporting Audit Trail to CSV...')}
          >
            <Download className="w-4 h-4" /> Export Audit Trail (CSV)
          </Button>
        }
      />

      <Card className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-gray-900">System Mutation Logs ({filteredLogs.length})</h3>
          <div className="w-full sm:w-72">
            <SearchInput
              placeholder="Search actor, action, resource..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 uppercase font-bold text-slate-500">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-500">
                    {new Date(log.timestamp).toLocaleString('en-GB')}
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">{log.actor}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-800 font-bold">{log.action}</td>
                  <td className="py-3 px-4 text-gray-700">{log.resource}</td>
                  <td className="py-3 px-4 font-mono text-gray-400">{log.ipAddress}</td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant="success">Success</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
