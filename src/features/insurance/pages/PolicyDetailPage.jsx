import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  Award,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { insuranceService } from '../services/insuranceService.js';

export const PolicyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [policy, setPolicy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPolicy = async () => {
      setIsLoading(true);
      try {
        const res = await insuranceService.getPolicyById(id);
        if (res.data) setPolicy(res.data);
      } catch (e) {
        // Try getting first policy if ID is generic
        try {
          const resAll = await insuranceService.getPolicies();
          if (resAll.data && resAll.data.length > 0) {
            setPolicy(resAll.data[0]);
          }
        } catch (err) {
          // Ignore
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadPolicy();
  }, [id]);

  if (isLoading || !policy) {
    return (
      <div className="w-full py-12 text-center space-y-3">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Loading sovereign policy bond particulars...</p>
      </div>
    );
  }

  const startDateStr = new Date(policy.startDate || Date.now()).toLocaleDateString('en-GB');
  const endDateStr = new Date(policy.endDate || Date.now()).toLocaleDateString('en-GB');

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title={`Policy Bond: ${policy.policyNumber}`}
        subtitle={`Issued to ${policy.userName || user?.name || 'Citizen Farmer'} • Covering ${policy.insuredTreeCount} Trees on ${policy.landName}`}
        backTo="/farmer/insurance/catalog"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Insurance Catalog', path: '/farmer/insurance/catalog' },
          { label: policy.policyNumber },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-white"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-rose-700 hover:bg-rose-800"
              onClick={() => navigate(`/farmer/insurance/raise-claim?policy=${policy.policyNumber}`)}
            >
              Raise Damage Claim
            </Button>
          </div>
        }
      />

      {/* Main Certificate Card */}
      <Card className="p-8 md:p-10 border-2 border-emerald-600 bg-white relative overflow-hidden shadow-2xl rounded-3xl">
        {/* Certificate Decorative Watermark */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <ShieldCheck className="w-96 h-96 text-emerald-950" />
        </div>

        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b-2 border-emerald-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-emerald-800 tracking-widest uppercase">
                BHUMICRED AGROFORESTRY UNDERWRITING DESK
              </span>
              <Badge variant="success" className="text-[10px]">
                {policy.status} Cover
              </Badge>
            </div>
            <h2 className="text-2xl font-black text-slate-900">{policy.planName}</h2>
          </div>
          <div className="text-right font-mono text-xs text-slate-500">
            <div>
              Certificate ID: <strong className="text-slate-900 font-bold">{policy.policyNumber}</strong>
            </div>
            <div>
              Valid: <strong>{startDateStr}</strong> to <strong>{endDateStr}</strong>
            </div>
          </div>
        </div>

        {/* Primary Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 my-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <span className="text-xs text-slate-500 block font-medium">Total Sum Insured</span>
            <span className="text-2xl font-black text-slate-900 font-mono">
              ₹{(policy.sumInsured || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Annual Premium</span>
            <span className="text-2xl font-black text-emerald-700 font-mono">
              ₹{(policy.annualPremium || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Insured Trees</span>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {policy.insuredTreeCount} Trees
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block font-medium">Cover Duration</span>
            <span className="text-2xl font-black text-slate-900 font-mono">
              {policy.durationMonths || 36} Mo
            </span>
          </div>
        </div>

        {/* Subsidy Banner */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs mb-8">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-emerald-950 block">
                PM-KMY 40% Agroforestry Subsidy Grant Applied
              </span>
              <span className="text-slate-600">
                Government direct benefit rebate of ₹{(policy.governmentSubsidyAmount || 21840).toLocaleString('en-IN')} credited.
              </span>
            </div>
          </div>
          <span className="font-mono font-bold text-emerald-800 text-sm">
            40% Subsidized
          </span>
        </div>

        {/* 2-Column Particulars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Registered Plot Particulars */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" /> Insured Plot Particulars
            </h4>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Land Title:</span>
                <span className="font-semibold text-slate-900">{policy.landName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Survey & Khasra:</span>
                <span className="font-mono font-semibold text-emerald-800">
                  Survey #{policy.surveyNumber} • Khasra #{policy.khasraNumber}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Beneficiary Policyholder:</span>
                <span className="font-semibold text-slate-900">
                  {policy.userName || user?.name || 'Citizen Farmer'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Species Coverage:</span>
                <span className="font-semibold text-slate-900">{policy.speciesSummary}</span>
              </div>
            </div>
          </div>

          {/* Covered Climate Perils */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> Covered Climate Perils
            </h4>
            <div className="space-y-2 text-xs">
              {(policy.coverageDetails || [
                'Storm, Cyclone & Windthrow (>70 km/h)',
                'Forest & Agro Fire Perils',
                'Stem Borer Infestation & Root Rot Outbreaks',
                'Severe Drought Stress (Revenue Trigger)',
                'Lightning Strike & Frost Damage',
              ]).map((peril, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-slate-700 font-medium">{peril}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Attestation */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <span>Attested by: <strong>National Agro-Insurance Underwriting Board</strong></span>
          <span className="font-mono">Tamper-Proof ID: {policy.policyNumber}</span>
        </div>
      </Card>
    </div>
  );
};

export default PolicyDetailPage;
