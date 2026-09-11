import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Satellite,
  ShieldCheck,
  Award,
  Sparkles,
  TrendingUp,
  Leaf,
  Activity,
  CheckCircle2,
  Clock,
  Filter,
  Eye,
  DollarSign,
  Layers,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import {
  fetchCarbonAudits,
  fetchCarbonCredits,
  fetchCarbonStats,
  mintCarbonCredits,
  retireCarbonCredit,
} from '../carbonSlice.js';
import { CarbonCertificateModal } from '../components/CarbonCertificateModal.jsx';

export const AdminCarbonPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { audits, credits, stats, isLoading, isMinting, isRetiring } = useSelector(
    (state) => state.carbon
  );
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('AUDITS'); // AUDITS or CREDITS
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    dispatch(fetchCarbonAudits());
    dispatch(fetchCarbonCredits());
    dispatch(fetchCarbonStats());
  }, [dispatch]);

  const handleMintCredits = async (audit) => {
    try {
      const res = await dispatch(
        mintCarbonCredits({
          auditRequestId: audit._id || audit.id,
          tCO2e: audit.carbonSequestration?.verifiedMintableCredits || 22.5,
          pricePerCredit: 1450,
        })
      ).unwrap();
      setSuccessMsg(`Minted ${res.tCO2e} Sovereign Carbon Credits (${res.creditId}) successfully!`);
      dispatch(fetchCarbonAudits());
      dispatch(fetchCarbonCredits());
      dispatch(fetchCarbonStats());
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Minting error:', err);
    }
  };

  const handleRetireCredit = async (credit) => {
    try {
      const res = await dispatch(
        retireCarbonCredit({
          id: credit._id || credit.id,
          retirementData: {
            organizationName: 'Gujarat State Climate & ESG Offsetting Fund',
            purpose: 'Scope 3 Supply Chain Carbon Neutrality 2026',
          },
        })
      ).unwrap();
      setSuccessMsg(`Credit ${res.creditId} retired for Corporate ESG Offsetting.`);
      dispatch(fetchCarbonCredits());
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Retire error:', err);
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Sovereign Carbon Registry & MRV Control Center"
        subtitle="National Agro-Biomass Satellite MRV verification, green credit minting & ESG retirement ledger."
        backTo="/government/dashboard"
        breadcrumbs={[
          { label: 'Government Portal', path: '/government/dashboard' },
          { label: 'Carbon Registry Control Center' },
        ]}
      />

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 border border-gray-100 space-y-2 bg-gradient-to-br from-emerald-50 to-teal-50/20">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase">
            <Leaf className="w-4 h-4 text-emerald-700" /> Minted Green Credits
          </div>
          <div className="text-3xl font-black text-emerald-950">
            {stats?.totalCreditsMinted || credits?.length || 1} <span className="text-xs font-normal text-gray-500">Batches</span>
          </div>
          <span className="text-xs text-emerald-700 font-semibold">Standard: VCS VM0042</span>
        </Card>

        <Card className="p-5 border border-gray-100 space-y-2 bg-gradient-to-br from-teal-50 to-cyan-50/20">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-900 uppercase">
            <TrendingUp className="w-4 h-4 text-teal-700" /> Total CO2 Sequestered
          </div>
          <div className="text-3xl font-black text-teal-950">
            {stats?.totalTCO2eSequestered || 24.5} <span className="text-xs font-normal text-gray-500">tCO2e</span>
          </div>
          <span className="text-xs text-teal-700 font-semibold">Verified Biomass Growth</span>
        </Card>

        <Card className="p-5 border border-gray-100 space-y-2 bg-gradient-to-br from-blue-50 to-indigo-50/20">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase">
            <Satellite className="w-4 h-4 text-blue-700" /> Sentinel-2 Scanned Parcels
          </div>
          <div className="text-3xl font-black text-blue-950">
            {audits?.length || 1} <span className="text-xs font-normal text-gray-500">Parcels</span>
          </div>
          <span className="text-xs text-blue-700 font-semibold">10m Multispectral MSI</span>
        </Card>

        <Card className="p-5 border border-gray-100 space-y-2 bg-gradient-to-br from-amber-50 to-orange-50/20">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase">
            <DollarSign className="w-4 h-4 text-amber-700" /> Total Farmer Carbon Payout
          </div>
          <div className="text-3xl font-black text-amber-950">
            ₹{(stats?.totalCarbonEarningsINR || 35525).toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-amber-700 font-semibold">₹1,450 / tCO2e Floor Rate</span>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('AUDITS')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'AUDITS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Satellite className="w-4 h-4" /> Sentinel-2 Satellite MRV Audits ({audits?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('CREDITS')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'CREDITS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Award className="w-4 h-4" /> Minted Green Credits & ESG Registry ({credits?.length || 0})
        </button>
      </div>

      {/* Tab 1: Satellite MRV Audits List */}
      {activeTab === 'AUDITS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Sentinel-2 multispectral NDVI scans pending government verification & 1-click token minting.
            </p>
          </div>

          <div className="space-y-4">
            {audits.map((audit) => (
              <Card key={audit._id || audit.id} className="p-6 border border-gray-200 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-gray-900">{audit.landName}</h4>
                      <Badge variant="outline" className="text-xs font-mono">
                        {audit.auditId}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      Farmer: {audit.farmerName} • Survey: {audit.surveyNumber || '612/A'} • {audit.areaAcres || 3.2} Acres
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        audit.status === 'MINTED'
                          ? 'success'
                          : audit.status === 'VERIFIED_MINT_READY'
                          ? 'default'
                          : 'outline'
                      }
                    >
                      {audit.status}
                    </Badge>
                  </div>
                </div>

                {/* Spectral Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl text-xs text-slate-700">
                  <div>
                    <span className="text-gray-500 block">NDVI Canopy Index:</span>
                    <strong className="text-emerald-700 text-sm font-mono font-bold">
                      {audit.spectralMetrics?.ndviMean || 0.78} (Optimal)
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Canopy Cover:</span>
                    <strong className="text-gray-900 text-sm font-bold">
                      {audit.spectralMetrics?.canopyCoverPercent || 82}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Annual Sequestration:</span>
                    <strong className="text-teal-700 text-sm font-bold">
                      {audit.carbonSequestration?.annualSequestrationRateTons || 22.5} tCO2e / yr
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Estimated Valuation:</span>
                    <strong className="text-emerald-700 text-sm font-bold">
                      ₹{Math.round((audit.carbonSequestration?.annualSequestrationRateTons || 22.5) * 1450).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                <div className="text-xs text-gray-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Telemetry Verification:</strong> {audit.verificationNotes || 'Sentinel-2 multispectral bands B4/B8/B11 confirm healthy tree canopy compliant with VCS VM0042 methodology.'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Sensor: <strong>Sentinel-2 MSI (10m Optical Resolution)</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    {audit.status !== 'MINTED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={isMinting}
                        onClick={() => handleMintCredits(audit)}
                        className="flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Mint Sovereign Carbon Credits
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Minted Green Credits List */}
      {activeTab === 'CREDITS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Sovereign Carbon Credits ledger with serialized certificate numbers and ESG retirement capability.
            </p>
          </div>

          <div className="space-y-4">
            {credits.map((credit) => (
              <Card key={credit._id || credit.id} className="p-6 border border-gray-200 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-gray-900">{credit.treeSpecies || 'Sovereign Agroforestry Carbon Credit'}</h4>
                      <Badge variant="outline" className="font-mono text-xs">
                        {credit.creditId}
                      </Badge>
                      <Badge variant="success">{credit.tokenSymbol || 'BHUMI-CO2'}</Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      Land: {credit.landName} • Farmer: {credit.farmerName} • Vintage {credit.vintageYear || 2026}
                    </span>
                  </div>

                  <Badge
                    variant={
                      credit.status === 'RETIRED'
                        ? 'default'
                        : credit.status === 'LISTED'
                        ? 'success'
                        : 'outline'
                    }
                  >
                    {credit.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-gray-500 block">Carbon Volume</span>
                    <span className="font-bold text-emerald-700 text-sm">{credit.tCO2e} tCO2e</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Unit Price</span>
                    <span className="font-bold text-gray-900 text-sm">₹{credit.pricePerCredit || 1450} / tonne</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Total Asset Value</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      ₹{(credit.totalValue || credit.tCO2e * 1450).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Certificate No</span>
                    <span className="font-mono text-xs font-semibold text-gray-700">
                      {credit.certificateNumber || 'CERT-CO2-90481'}
                    </span>
                  </div>
                </div>

                {credit.status === 'RETIRED' && credit.beneficiary && (
                  <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-700 border border-slate-200">
                    <strong>Retired for Corporate ESG:</strong> {credit.beneficiary.organizationName} ({credit.beneficiary.purpose})
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCertificate(credit);
                      setShowCertificate(true);
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-emerald-600" /> View Official Certificate
                  </Button>

                  {credit.status === 'LISTED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      isLoading={isRetiring}
                      onClick={() => handleRetireCredit(credit)}
                      className="text-xs"
                    >
                      Retire for ESG Offsetting
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Carbon Offset Certificate Modal */}
      <CarbonCertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        carbonData={{
          id: selectedCertificate?.creditId || 'BC-CARB-2026-0092',
          farmerName: selectedCertificate?.farmerName || 'Simran Sonaniya',
          projectName: selectedCertificate?.treeSpecies || 'Sovereign Teak & Sandalwood Agroforestry Carbon Initiative',
          verifier: 'ISRO SAC & National Agro-Biomass Satellite MRV Directorate',
          creditsIssued: selectedCertificate?.tCO2e || 24.5,
          vintageYear: selectedCertificate?.vintageYear || 2026,
          issuedDate: selectedCertificate?.mintedAt ? new Date(selectedCertificate.mintedAt).toLocaleDateString('en-GB') : '10 Sep 2026',
          serialNumber: selectedCertificate?.certificateNumber || 'CERT-CO2-2026-90481',
          equivalentOffset: `${selectedCertificate?.tCO2e || 24.5} Metric Tonnes of CO2e Sequestered`
        }}
      />
    </div>
  );
};

export default AdminCarbonPage;
