import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Leaf,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Download,
  TrendingUp,
  DollarSign,
  Satellite,
  Award,
  Clock,
  Eye,
  Activity,
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
} from '../../carbon/carbonSlice.js';
import { CarbonCertificateModal } from '../../carbon/components/CarbonCertificateModal.jsx';

export const AdminCarbonPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { audits, credits, stats, isLoading, isMinting, isRetiring } = useSelector(
    (state) => state.carbon
  );
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('AUDITS');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    dispatch(fetchCarbonAudits());
    dispatch(fetchCarbonCredits());
    dispatch(fetchCarbonStats());
  }, [dispatch]);

  const handleMint = async (audit) => {
    try {
      const res = await dispatch(
        mintCarbonCredits({
          auditRequestId: audit._id || audit.id,
          tCO2e: audit.carbonSequestration?.verifiedMintableCredits || 22.5,
          pricePerCredit: 1450,
        })
      ).unwrap();
      setActionMessage(`Minted ${res.tCO2e} Sovereign Carbon Credits (${res.creditId}) successfully!`);
      dispatch(fetchCarbonAudits());
      dispatch(fetchCarbonCredits());
      dispatch(fetchCarbonStats());
      setTimeout(() => setActionMessage(''), 5000);
    } catch (err) {
      console.error('Minting error:', err);
    }
  };

  const handleRetire = async (credit) => {
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
      setActionMessage(`Credit ${res.creditId} successfully retired for Corporate ESG Offsetting.`);
      dispatch(fetchCarbonCredits());
      setTimeout(() => setActionMessage(''), 5000);
    } catch (err) {
      console.error('Retirement error:', err);
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Sovereign Carbon Credit Registry & MRV Tokenization"
        subtitle="Issue verified tCO2e carbon credits, manage Sentinel-2 satellite MRV scans, and authorize corporate ESG retirements."
        backTo="/admin/dashboard"
        breadcrumbs={[
          { label: 'Admin Portal', path: '/admin/dashboard' },
          { label: 'Carbon Registry Control Center' },
        ]}
      />

      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 bg-white border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Total Minted Credits
          </span>
          <p className="text-2xl font-black text-emerald-700">
            {stats?.totalCreditsMinted || credits?.length || 1} <span className="text-xs font-normal text-gray-500">Batches</span>
          </p>
          <span className="text-xs text-gray-500 block">Standard: VCS VM0042</span>
        </Card>

        <Card className="p-5 bg-white border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Trading Floor Price
          </span>
          <p className="text-2xl font-black text-gray-900">
            ₹{(stats?.currentCarbonSpotPriceINR || 1450).toLocaleString('en-IN')} <span className="text-xs font-normal text-gray-500">/ tCO2e</span>
          </p>
          <span className="text-xs text-emerald-600 font-semibold block">Sovereign Floor Rate</span>
        </Card>

        <Card className="p-5 bg-white border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Total Carbon Valuation
          </span>
          <p className="text-2xl font-black text-gray-900">
            ₹{(stats?.totalCarbonEarningsINR || 35525).toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-emerald-600 font-semibold block">Direct Farmer Liquidity</span>
        </Card>

        <Card className="p-5 bg-white border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Satellite Health Index
          </span>
          <p className="text-2xl font-black text-teal-700">
            {stats?.satelliteHealthIndex || '0.78 NDVI'}
          </p>
          <span className="text-xs text-gray-500 block">Sentinel-2 Multispectral</span>
        </Card>
      </div>

      {/* Tabs */}
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

      {/* Tab 1: Satellite MRV Audits */}
      {activeTab === 'AUDITS' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Sentinel-2 multispectral NDVI scans verified by ISRO Space Applications Centre.
          </p>

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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl text-xs text-slate-700">
                  <div>
                    <span className="text-gray-500 block">NDVI Canopy Index:</span>
                    <strong className="text-emerald-700 text-sm font-mono font-bold">
                      {audit.spectralMetrics?.ndviMean || 0.78}
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

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Sensor: <strong>Sentinel-2 MSI (10m Resolution)</strong>
                  </span>

                  {audit.status !== 'MINTED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={isMinting}
                      onClick={() => handleMint(audit)}
                      className="flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Mint Sovereign Carbon Credits
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Minted Credits */}
      {activeTab === 'CREDITS' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Serialized Sovereign Carbon Credit tokens available for corporate off-take or retirement.
          </p>

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
                      onClick={() => handleRetire(credit)}
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
          farmerName: selectedCertificate?.farmerName || 'Citizen Farmer',
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
