import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Download,
  Calendar,
  Trees,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Clock,
  Printer,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MOCK_POLICIES } from '../../../services/mockData/insuranceMock.js';

export const PolicyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const policy = MOCK_POLICIES.find((p) => p.id === id) || MOCK_POLICIES[0];

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title={`Policy Certificate: ${policy.policyNumber}`}
        subtitle={`Issued to Ramesh Patel • Covering ${policy.insuredTreeCount} Trees on ${policy.landName}`}
        backTo="/farmer/insurance/catalog"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Insurance', path: '/farmer/insurance' },
          { label: policy.policyNumber },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/farmer/insurance/raise-claim?policyId=${policy.id}`)}
            >
              Raise Damage Claim
            </Button>
          </div>
        }
      />

      {/* Main Certificate Card */}
      <Card className="p-8 md:p-10 border-2 border-emerald-600 bg-white relative overflow-hidden shadow-lg">
        {/* Certificate Decorative Watermark */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <ShieldCheck className="w-96 h-96 text-emerald-950" />
        </div>

        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b-2 border-emerald-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-emerald-800 tracking-widest uppercase">
                BHUMICRED AGROFORESTRY UNDERWRITING
              </span>
              <Badge variant="success">Active Cover</Badge>
            </div>
            <h2 className="text-2xl font-black text-gray-900">{policy.planName}</h2>
          </div>
          <div className="text-right font-mono text-xs text-gray-500">
            <div>Certificate ID: <strong className="text-gray-900 font-bold">{policy.policyNumber}</strong></div>
            <div>Valid From: {new Date(policy.startDate).toLocaleDateString('en-GB')} to {new Date(policy.endDate).toLocaleDateString('en-GB')}</div>
          </div>
        </div>

        {/* Primary Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <span className="text-xs text-gray-500 block">Total Sum Insured</span>
            <span className="text-2xl font-black text-gray-900">₹{policy.sumInsured.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Annual Premium</span>
            <span className="text-2xl font-black text-emerald-700">₹{policy.annualPremium.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Insured Trees</span>
            <span className="text-2xl font-black text-gray-900">{policy.insuredTreeCount} Trees</span>
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Cover Duration</span>
            <span className="text-2xl font-black text-gray-900">{policy.durationMonths} Months</span>
          </div>
        </div>

        {/* Details & Species */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">
              Registered Plot & Asset Inventory
            </h4>
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Covered Parcel:</span>
                <span className="font-semibold text-gray-900">{policy.landName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Species Breakdown:</span>
                <span className="font-semibold text-gray-900">{policy.speciesSummary}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deductible / Excess:</span>
                <span className="font-semibold text-gray-900">₹500 flat per claim</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Underwriting Partner:</span>
                <span className="font-semibold text-gray-900">AgriGeneral Sovereign Reinsurance Ltd</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">
              Covered Perils & Triggers
            </h4>
            <ul className="space-y-2">
              {policy.coverageDetails.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Authentication */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Cryptographically sealed & digitally signed by BHUMICRED Underwriting Engine.</span>
          </div>
          <span className="font-mono">HASH: 9a8b7c6d5e4f3a2b1c</span>
        </div>
      </Card>
    </div>
  );
};
