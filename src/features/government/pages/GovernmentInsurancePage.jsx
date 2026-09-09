import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Trees,
  CloudLightning,
  AlertTriangle,
  Download,
  CheckCircle2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { insuranceService } from '../../insurance/services/insuranceService.js';

export const GovernmentInsurancePage = () => {
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
        title="Public Tree Insurance & Subsidy Audit"
        subtitle="District-level underwriting risk exposure, state agroforestry premium rebates, and disaster damage claims."
        backTo="/government/dashboard"
        breadcrumbs={[
          { label: 'Government Portal', path: '/government/dashboard' },
          { label: 'Insurance & Subsidies' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white"
            onClick={() => alert('Exporting Treasury Subsidy Audit Ledger...')}
          >
            <Download className="w-4 h-4" /> Export Subsidy Audit (CSV)
          </Button>
        }
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Insured Trees
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {stats?.totalInsuredTrees || 4280} <span className="text-xs font-normal text-slate-500">Trees</span>
          </p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            {stats?.activePolicies || policies.length} Active Policies
          </span>
        </Card>

        <Card className="p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            State Subsidy Paid
          </span>
          <p className="text-2xl font-black text-emerald-700 font-mono">
            ₹{(stats?.totalGovernmentSubsidyDisbursed || 845000).toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">40% Agroforestry Rebate</span>
        </Card>

        <Card className="p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Total Sum Insured
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            ₹{(stats?.totalSumInsured || 1830000).toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-blue-600 font-semibold mt-1 block">PM-KMY Risk Pool</span>
        </Card>

        <Card className="p-5 bg-white rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Disaster Claims
          </span>
          <p className="text-2xl font-black text-rose-600 font-mono">
            {claims.length} <span className="text-xs font-normal text-slate-500">Logged</span>
          </p>
          <span className="text-xs text-rose-700 font-medium mt-1 block">Hailstorm & Fire Perils</span>
        </Card>
      </div>

      {/* Active Subsidized Policies Table */}
      <Card className="p-6 bg-white rounded-3xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">State Subsidized Tree Policy Registry</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold">
                <th className="pb-3">Policy #</th>
                <th className="pb-3">Policyholder</th>
                <th className="pb-3">Land Plot</th>
                <th className="pb-3">Trees Insured</th>
                <th className="pb-3">Gross Premium</th>
                <th className="pb-3">40% State Subsidy</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {policies.map((p) => (
                <tr key={p._id || p.id || p.policyNumber} className="hover:bg-slate-50">
                  <td className="py-3 font-mono font-bold text-emerald-900">{p.policyNumber}</td>
                  <td className="py-3 font-semibold text-slate-800">{p.userName || 'Citizen Farmer'}</td>
                  <td className="py-3 text-slate-600">{p.landName} (Khasra #{p.khasraNumber})</td>
                  <td className="py-3 font-mono font-semibold">{p.insuredTreeCount} Trees</td>
                  <td className="py-3 font-mono font-semibold">₹{(p.grossPremium || 18200).toLocaleString('en-IN')}</td>
                  <td className="py-3 font-mono font-bold text-emerald-800">
                    ₹{(p.governmentSubsidyAmount || 7280).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3">
                    <Badge variant="success" className="text-[10px]">{p.status}</Badge>
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

export default GovernmentInsurancePage;
