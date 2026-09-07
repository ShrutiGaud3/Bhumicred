import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Trees,
  TrendingUp,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Leaf,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MOCK_LANDS } from '../../../services/mockData/landsMock.js';
import { CarbonCertificateModal } from '../components/CarbonCertificateModal.jsx';

export const CarbonOpportunitiesPage = () => {
  const navigate = useNavigate();
  const [treeCountSlider, setTreeCountSlider] = useState(305); // total trees across farmer plots
  const [showCertificate, setShowCertificate] = useState(false);

  // Carbon math: ~0.035 tCO2e per mature tree per year, at ₹1,850 per credit
  const annualCredits = (treeCountSlider * 0.035).toFixed(2);
  const creditPriceInr = 1850;
  const annualEarningEst = Math.round(annualCredits * creditPriceInr);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Carbon Credit Yield & Monetization"
        subtitle="Turn standing agroforestry trees and regenerative soil carbon into tradable green carbon credits."
        backTo="/farmer/dashboard"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Carbon Farming Hub' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowCertificate(true)}
            >
              <Leaf className="w-4 h-4 text-emerald-600" /> View Issued Certificate
            </Button>
            <Button
              variant="primary"
              className="flex items-center gap-2"
              onClick={() => navigate('/farmer/carbon/request-audit')}
            >
              <Sparkles className="w-4 h-4" /> Request Carbon Audit
            </Button>
          </div>
        }
      />

      {/* Carbon Yield Calculator Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-3">
            <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
              Gold Standard / Verra Aligned Methodology
            </Badge>
            <h3 className="text-2xl md:text-3xl font-black">
              Earn Passive Income from Agroforestry Carbon Sequestration
            </h3>
            <p className="text-xs md:text-sm text-emerald-100 max-w-xl leading-relaxed">
              Your registered plots in Mogri & Anand have <strong>305 verified trees</strong> absorbing approximately{' '}
              <strong className="text-emerald-300">10.67 tCO2e</strong> annually.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-3">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
              Estimated Annual Carbon Payout
            </span>
            <div className="text-3xl font-black text-white">
              ₹{annualEarningEst.toLocaleString()} <span className="text-xs font-normal text-emerald-200">/ yr</span>
            </div>
            <div className="text-xs text-emerald-200 flex justify-between pt-2 border-t border-white/10">
              <span>Sequestered: <strong>{annualCredits} tCO2e</strong></span>
              <span>Rate: <strong>₹{creditPriceInr}/tCO2e</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Parcels Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Enrolled Land Parcels for Carbon Offsetting</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_LANDS.slice(0, 2).map((land) => (
            <Card key={land.id} className="p-6 border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-gray-900">{land.landName}</h4>
                  <span className="text-xs text-gray-500">Survey No: {land.surveyNumber} • {land.area} {land.areaUnit}</span>
                </div>
                <Badge variant="success">Enrolled in Registry</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl text-center text-xs">
                <div>
                  <span className="text-gray-500 block">Tree Assets</span>
                  <span className="font-bold text-gray-900 text-sm">{land.treeCount} Trees</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Annual Carbon</span>
                  <span className="font-bold text-emerald-700 text-sm">~{(land.treeCount * 0.035).toFixed(1)} tCO2e</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Est. Revenue</span>
                  <span className="font-bold text-emerald-700 text-sm">₹{Math.round(land.treeCount * 0.035 * 1850).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Last Satellite LiDAR Pass: <strong>12 Aug 2026</strong></span>
                <span className="text-emerald-700 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/farmer/wallet')}>
                  View Wallet Payouts →
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Carbon Offset Certificate Printable Modal */}
      <CarbonCertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        carbonData={{
          id: 'VCS-CRB-2026-08912',
          farmerName: 'Ramesh Patel',
          projectName: 'Gujarat Agroforestry & Soil Carbon Sequestration Initiative',
          verifier: 'Verra / Gold Standard Accredited Third-Party Auditor',
          creditsIssued: Number(annualCredits) || 142.5,
          vintageYear: '2025-2026',
          issuedDate: '12 Feb 2026',
          serialNumber: 'IN-VCS-9081-2026-00142',
          equivalentOffset: `${annualCredits} Metric Tonnes of CO2e Sequestered`
        }}
      />
    </div>
  );
};
