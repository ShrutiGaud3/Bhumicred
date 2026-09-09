import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Trees,
  CheckCircle2,
  AlertTriangle,
  Download,
  CloudLightning,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { insuranceService } from '../../insurance/services/insuranceService.js';

export const AdminInsurancePage = () => {
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pRes, cRes, sRes] = await Promise.all([
          insuranceService.getPolicies(),
          insuranceService.getClaims(),
          insuranceService.getInsuranceStats(),
        ]);
        if (pRes.data) setPolicies(pRes.data);
        if (cRes.data) setClaims(cRes.data);
        if (sRes.data) setStats(sRes.data);
      } catch (e) {
        // Ignore
      }
    };
    loadData();
  }, []);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Underwriting & Risk Pool Control Center"
        subtitle="Manage parametric insurance triggers, monitor loss ratios, and authorize claim settlements."
        backTo="/admin/dashboard"
        breadcrumbs={[
          { label: 'Admin Portal', path: '/admin/dashboard' },
          { label: 'Underwriting & Claims' },
        ]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Sum Insured
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            ₹{(stats?.totalSumInsured || 1830000).toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Active Risk Pool</span>
        </Card>

        <Card className="p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Active Policies
          </span>
          <p className="text-2xl font-black text-emerald-700 font-mono">
            {stats?.activePolicies || policies.length}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">Underwritten Portfolio</span>
        </Card>

        <Card className="p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Settlement Ratio
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {stats?.claimsSettlementRatio || '98.4%'}
          </p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Healthy Underwriting Band</span>
        </Card>

        <Card className="p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Claims In-Flight
          </span>
          <p className="text-2xl font-black text-rose-600 font-mono">
            {claims.length}
          </p>
          <span className="text-xs text-amber-700 font-medium mt-1 block">GPS Drone Validations</span>
        </Card>
      </div>

      {/* Claims List Table */}
      <Card className="p-6 bg-white rounded-3xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Underwriting Claims & Field Audits</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                <th className="pb-3">Claim ID</th>
                <th className="pb-3">Policyholder</th>
                <th className="pb-3">Peril Event</th>
                <th className="pb-3">Damaged Trees</th>
                <th className="pb-3">Estimated Loss</th>
                <th className="pb-3">Assigned Agronomist</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.map((c) => (
                <tr key={c._id || c.id || c.claimNumber} className="hover:bg-slate-50">
                  <td className="py-3 font-mono font-bold text-emerald-900">{c.claimNumber}</td>
                  <td className="py-3 font-semibold text-slate-800">{c.userName || 'Citizen Farmer'}</td>
                  <td className="py-3 text-slate-700">{c.incidentType}</td>
                  <td className="py-3 font-mono font-semibold">🌲 {c.affectedTreeCount} Trees</td>
                  <td className="py-3 font-mono font-bold text-slate-900">
                    ₹{(c.estimatedLoss || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 text-slate-600">{c.inspectorName || 'Devang Joshi'}</td>
                  <td className="py-3">
                    <StatusBadge status={c.status} />
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

export default AdminInsurancePage;
