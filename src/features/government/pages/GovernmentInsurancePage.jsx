import React from 'react';
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
import { MOCK_POLICIES, MOCK_CLAIMS } from '../../../services/mockData/insuranceMock.js';

export const GovernmentInsurancePage = () => {
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
            className="flex items-center gap-2"
            onClick={() => alert('Exporting Treasury Subsidy Audit Ledger...')}
          >
            <Download className="w-4 h-4" /> Export Subsidy Audit (CSV)
          </Button>
        }
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Total Insured Trees
          </span>
          <p className="text-2xl font-black text-gray-900">4,280 <span className="text-xs font-normal text-gray-500">Trees</span></p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">84 Active Policies</span>
        </Card>

        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            State Subsidy Paid
          </span>
          <p className="text-2xl font-black text-emerald-700">₹8,45,000</p>
          <span className="text-xs text-gray-500 mt-1 block">40% Agroforestry Rebate</span>
        </Card>

        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Total Sum Insured
          </span>
          <p className="text-2xl font-black text-gray-900">₹3.45 Cr</p>
          <span className="text-xs text-gray-500 mt-1 block">District Valuation Pool</span>
        </Card>

        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Active Peril Claims
          </span>
          <p className="text-2xl font-black text-amber-600">3 <span className="text-xs font-normal text-gray-500">Claims</span></p>
          <span className="text-xs text-amber-700 font-medium mt-1 block">Storm & Hailstorm</span>
        </Card>
      </div>

      {/* Active Claims & Weather Disasters Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" /> Pending Field Loss Assessments
          </h3>
          <div className="divide-y divide-gray-100">
            {MOCK_CLAIMS.map((claim) => (
              <div key={claim.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {claim.claimNumber}
                  </span>
                  <h5 className="font-bold text-sm text-gray-900 mt-1">{claim.incidentType}</h5>
                  <p className="text-xs text-gray-500">Surveyor: {claim.inspectorName} ({claim.assignedPartner})</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900 text-sm">₹{claim.estimatedLoss.toLocaleString()}</span>
                  <Badge variant="warning" className="text-[10px] block mt-1">Inspection Scheduled</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CloudLightning className="w-5 h-5 text-blue-600" /> Parametric Weather Triggers Matrix
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            District automated weather stations (AWS) trigger direct payouts when windspeed exceeds 75km/h or continuous dry spells surpass 28 days.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Anand AWS Station 01:</span>
              <span className="font-bold text-emerald-700">Normal (Wind: 14 km/h • Rain: 4.2mm)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Umreth AWS Station 02:</span>
              <span className="font-bold text-emerald-700">Normal (Wind: 18 km/h • Rain: 0mm)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
