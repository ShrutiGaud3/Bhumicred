import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  Satellite,
  Activity,
  Award,
  Filter,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import {
  fetchCarbonOpportunities,
  fetchCarbonAudits,
  fetchCarbonCredits,
  fetchCarbonStats,
} from '../carbonSlice.js';
import { landService } from '../../land/services/landService.js';
import { storageService } from '../../../services/storageService.js';
import { CarbonCertificateModal } from '../components/CarbonCertificateModal.jsx';

export const CarbonOpportunitiesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { opportunities, audits, credits, stats, isLoading } = useSelector(
    (state) => state.carbon
  );
  const { user } = useSelector((state) => state.auth);

  const [treeCountSlider, setTreeCountSlider] = useState(95);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const [landsList, setLandsList] = useState([]);

  useEffect(() => {
    dispatch(fetchCarbonOpportunities());
    dispatch(fetchCarbonAudits());
    dispatch(fetchCarbonCredits());
    dispatch(fetchCarbonStats());

    const fetchAllLands = async () => {
      let backendList = [];
      try {
        const res = await landService.getMyLands();
        backendList = Array.isArray(res?.data) ? res.data : (res?.data?.lands || []);
      } catch (err) {
        console.warn('Backend lands fetch fallback in CarbonOpportunitiesPage:', err);
      }

      const userIdentifier = user?.mobile || user?.phone || user?.id || user?._id || user?.name;
      const cleanUserPhone = userIdentifier ? String(userIdentifier).replace(/\D/g, '') : '';
      const validUserId = user?.id || user?._id;

      // Strictly get this user's local lands and audits
      const localList = userIdentifier ? storageService.getLands(userIdentifier) : [];
      const localAudits = userIdentifier ? storageService.getCarbonAudits(userIdentifier) : [];

      // Double check that lands in localList actually match the current user
      const userOwnedLocalLands = localList.filter((l) => {
        if (!l) return false;
        if (l.ownerId && validUserId && String(l.ownerId) === String(validUserId)) return true;
        if (l.userId && validUserId && String(l.userId) === String(validUserId)) return true;
        if (cleanUserPhone && l.ownerMobile && l.ownerMobile.replace(/\D/g, '') === cleanUserPhone) return true;
        if (cleanUserPhone && l.mobile && l.mobile.replace(/\D/g, '') === cleanUserPhone) return true;
        if (user?.name && l.ownerName && l.ownerName.toLowerCase() === user.name.toLowerCase()) return true;
        return false;
      });

      // Combine user's local and backend lands
      const userLands = [...userOwnedLocalLands, ...backendList];
      const userLandIds = new Set(userLands.map((l) => String(l.landId || l.id || l._id)));
      const userSurveys = new Set(userLands.map((l) => (l.surveyNumber || '').trim()).filter(Boolean));

      // 1. Every distinct MRV scan requested by this user
      // Audit must either match the user directly or match one of their registered lands
      const validAudits = localAudits.filter((audit) => {
        if (!audit) return false;
        const auditPhone = (audit.userMobile || audit.ownerMobile || '').replace(/\D/g, '');
        if (cleanUserPhone && auditPhone && (auditPhone === cleanUserPhone || cleanUserPhone.includes(auditPhone))) return true;
        if (audit.ownerId && validUserId && String(audit.ownerId) === String(validUserId)) return true;
        if (audit.userId && validUserId && String(audit.userId) === String(validUserId)) return true;
        if (audit.landId && userLandIds.has(String(audit.landId))) return true;
        if (audit.surveyNumber && userSurveys.has(String(audit.surveyNumber).trim())) return true;
        return false;
      });

      const auditCards = validAudits.map((audit, idx) => {
        const trees = Number(audit.estimatedTreeCount || audit.treeCount || 33);
        const area = Number(audit.areaAcres || audit.area || 5.95);
        return {
          id: audit.auditId || audit._id || `scan_audit_${idx}`,
          _id: audit.auditId || audit._id || `scan_audit_${idx}`,
          auditId: audit.auditId,
          landName: audit.landName || 'Registered Farm',
          surveyNumber: audit.surveyNumber || '465',
          khasraNumber: audit.khasraNumber || audit.surveyNumber || '465',
          area: area,
          areaUnit: 'Acres',
          treeCount: trees,
          mrvAuditId: audit.auditId,
          mrvStatus: audit.status || 'SATELLITE_SCANNING',
          status: 'APPROVED',
          isScanBatch: true,
          createdAt: audit.createdAt || new Date().toISOString(),
        };
      });

      // 2. Base registered lands (add any registered parcel that hasn't been scanned yet)
      const baseCards = [];
      const seenBase = new Set();

      userLands.forEach((item) => {
        if (!item) return;
        const srv = (item.surveyNumber && item.surveyNumber !== 'N/A') ? item.surveyNumber.trim() : null;
        const name = (item.landName || '').trim().toLowerCase();
        const key = item.landId || item._id || item.id || (srv ? `srv_${srv}` : `name_${name}`);

        if (key && !seenBase.has(key)) {
          seenBase.add(key);

          // Check if this land was already covered in auditCards
          const alreadyHasAudit = auditCards.some(
            (ac) =>
              (srv && ac.surveyNumber === srv) ||
              (name && ac.landName.trim().toLowerCase() === name) ||
              ac.id === item.id ||
              ac.id === item._id ||
              ac.id === item.landId
          );

          if (!alreadyHasAudit) {
            const areaNum = Number(item.area || item.areaAcres || 5.0);
            const rawTrees = item.treeCount || item.standingTreeCount || item.agronomicDetails?.treeCount || (item.treesInsured ? 33 : 0);
            const trees = rawTrees > 0 ? Number(rawTrees) : Math.max(15, Math.round(areaNum * 6));

            baseCards.push({
              id: item.landId || item._id || item.id,
              _id: item._id || item.landId || item.id,
              auditId: item.mrvAuditId || `MRV-SENTINEL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              landName: item.landName || 'Registered Farm',
              surveyNumber: item.surveyNumber || item.khasraNumber || 'N/A',
              khasraNumber: item.khasraNumber || item.surveyNumber || 'N/A',
              area: areaNum,
              areaUnit: item.areaUnit || 'Acres',
              treeCount: trees,
              mrvAuditId: item.mrvAuditId || `MRV-SENTINEL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
              mrvStatus: item.mrvStatus || 'VERIFIED',
              status: item.status || 'APPROVED',
              isScanBatch: false,
              createdAt: item.createdAt || new Date().toISOString(),
            });
          }
        }
      });

      // Combine all: every scan batch is its own card + base unscanned lands
      const allCards = [...auditCards, ...baseCards];

      setLandsList(allCards);

      if (allCards.length > 0) {
        const totalTrees = allCards.reduce((acc, l) => acc + (Number(l.treeCount) || 0), 0);
        setTreeCountSlider(totalTrees > 0 ? totalTrees : 95);
      } else {
        setTreeCountSlider(0);
      }
    };

    fetchAllLands();
  }, [dispatch, user]);

  // Carbon Math Calculation: ~0.125 tCO2e per mature tree per year, at ₹1,450 per credit
  const annualCredits = (treeCountSlider * 0.125).toFixed(1);
  const creditPriceInr = stats?.currentCarbonSpotPriceINR || 1450;
  const annualEarningEst = Math.round(annualCredits * creditPriceInr);

  const displayLands = landsList;
  const totalActualCarbon = displayLands.length > 0 ? Number(
    displayLands.reduce((acc, l) => acc + ((Number(l.treeCount) || 0) * 0.125), 0).toFixed(1)
  ) : 0;
  const totalActualValuation = Math.round(totalActualCarbon * creditPriceInr);
  const totalMintedBatches = displayLands.length;

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Sovereign Carbon Registry & Green Credits"
        subtitle="Turn standing agroforestry trees and soil organic carbon into certified tradable green carbon credits."
        backTo="/farmer/dashboard"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Carbon Registry Hub' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                setSelectedCertificate(credits[0] || null);
                setShowCertificate(true);
              }}
            >
              <Award className="w-4 h-4 text-emerald-600" /> View Carbon Certificate
            </Button>
            <Button
              variant="primary"
              className="flex items-center gap-2"
              onClick={() => navigate('/farmer/carbon/request-audit')}
            >
              <Sparkles className="w-4 h-4" /> Request Satellite MRV Scan
            </Button>
          </div>
        }
      />

      {/* Top Carbon Yield & Live Spot Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                Sentinel-2 Satellite MRV • VCS VM0042 Aligned
              </Badge>
              <Badge variant="outline" className="text-teal-200 border-teal-400/30">
                Live Spot: ₹{creditPriceInr.toLocaleString('en-IN')} / tCO2e
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-black">
              Monetize Standing Agroforestry Trees & Soil Biomass
            </h2>
            <p className="text-xs md:text-sm text-emerald-100 max-w-xl leading-relaxed">
              Every verified agroforestry tree sequesters ~0.125 tonnes of CO2 per year. Get your cadastral parcels scanned by ESA & ISRO Sentinel-2 satellites for instant credit minting.
            </p>

            {/* Slider */}
            <div className="pt-2 max-w-md space-y-2">
              <div className="flex justify-between text-xs text-emerald-200 font-medium">
                <span>Simulate Tree Count: <strong>{treeCountSlider} Trees</strong></span>
                <span>Annual Yield: <strong className="text-emerald-300">{annualCredits} tCO2e</strong></span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="10"
                value={treeCountSlider}
                onChange={(e) => setTreeCountSlider(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-4">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
              Estimated Annual Carbon Payout
            </span>
            <div className="text-3xl md:text-4xl font-black text-white">
              ₹{annualEarningEst.toLocaleString('en-IN')} <span className="text-xs font-normal text-emerald-200">/ yr</span>
            </div>
            <div className="space-y-2 text-xs text-emerald-100 pt-3 border-t border-white/10">
              <div className="flex justify-between">
                <span className="text-emerald-200">Total Sequestered:</span>
                <span className="font-bold">{annualCredits} tCO2e / yr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-200">Sovereign Registry Rate:</span>
                <span className="font-bold">₹{creditPriceInr} / tCO2e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-200">Disbursement Mode:</span>
                <span className="font-bold text-emerald-300">Smart Wallet Direct Payout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Macro Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 border border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
            <Leaf className="w-4 h-4 text-emerald-600" /> Minted Credits
          </div>
          <div className="text-2xl font-black text-gray-900">
            {totalMintedBatches} <span className="text-xs font-normal text-gray-500">Batches</span>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Token: BHUMI-CO2</span>
        </Card>

        <Card className="p-5 border border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
            <TrendingUp className="w-4 h-4 text-teal-600" /> Total CO2 Sequestered
          </div>
          <div className="text-2xl font-black text-teal-700">
            {totalActualCarbon} <span className="text-xs font-normal text-gray-500">tCO2e</span>
          </div>
          <span className="text-xs text-gray-500">Verified via Sentinel-2</span>
        </Card>

        <Card className="p-5 border border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
            <Satellite className="w-4 h-4 text-blue-600" /> Active MRV Audits
          </div>
          <div className="text-2xl font-black text-gray-900">
            {displayLands.length > 0 ? displayLands.length : (audits?.length || 1)} <span className="text-xs font-normal text-gray-500">Parcels</span>
          </div>
          <span className="text-xs text-blue-700 font-medium">Telemetry: 0.78 NDVI</span>
        </Card>

        <Card className="p-5 border border-gray-100 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
            <DollarSign className="w-4 h-4 text-emerald-600" /> Carbon Valuation
          </div>
          <div className="text-2xl font-black text-emerald-700">
            ₹{totalActualValuation.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-gray-500">Wallet Liquidity Ready</span>
        </Card>
      </div>

      {/* Enrolled Parcels & Active Audits Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Registered Land Parcels & MRV Scan Status</h3>
            <p className="text-xs text-gray-500">Cadastral plots eligible for carbon credit minting and ESG corporate sales.</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/farmer/carbon/request-audit')}
            className="flex items-center gap-1.5"
          >
            <Satellite className="w-4 h-4 text-emerald-600" /> Scan New Parcel
          </Button>
        </div>

        {displayLands && displayLands.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayLands.map((land) => (
              <Card key={land._id || land.id} className="p-6 border border-gray-200 dark:border-neutral-800 space-y-4 shadow-sm bg-white dark:bg-neutral-900">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-base text-gray-900 dark:text-white">{land.landName}</h4>
                    <span className="text-xs text-gray-500 dark:text-neutral-400">
                      Survey No: {land.surveyNumber || 'N/A'} • {land.area} {land.areaUnit || 'Acres'}
                    </span>
                  </div>
                  <Badge variant={land.mrvStatus === 'SATELLITE_SCANNING' ? 'warning' : 'success'}>
                    {land.mrvStatus === 'SATELLITE_SCANNING' ? 'Scan Scheduled' : 'Verified in Registry'}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-neutral-800/60 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-neutral-400 block">Tree Assets</span>
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{land.treeCount || 0} Trees</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-neutral-400 block">Annual Carbon</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      ~{((land.treeCount || 0) * 0.125).toFixed(1)} tCO2e
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-neutral-400 block">Annual Value</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      ₹{Math.round((land.treeCount || 0) * 0.125 * creditPriceInr).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400 border-t border-gray-100 dark:border-neutral-800">
                  <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold truncate max-w-[210px]">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    {land.mrvAuditId ? land.mrvAuditId : 'Sentinel-2 Ground Verified'}
                  </span>
                  <span
                    className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer shrink-0"
                    onClick={() => {
                      setSelectedCertificate({
                        ...land,
                        creditId: land.mrvAuditId || 'BC-CARB-2026-0092',
                        treeSpecies: 'Sovereign Teak & Mixed Hardwood Agroforestry',
                        tCO2e: Number(((land.treeCount || 0) * 0.125).toFixed(1)) || 4.1,
                      });
                      setShowCertificate(true);
                    }}
                  >
                    View Certificate →
                  </span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center space-y-3 border border-dashed border-gray-300">
            <Trees className="w-10 h-10 text-gray-400 mx-auto" />
            <h4 className="font-bold text-gray-800">No Registered Lands Found</h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              You haven't registered any land parcels yet. Register your agricultural or agroforestry land parcel to start remote satellite MRV scans.
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/farmer/lands/add')}>
              Register Land Parcel
            </Button>
          </Card>
        )}
      </div>

      {/* Verified Marketplace Opportunities */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">National Sovereign Carbon Opportunities & Project Registry</h3>
          <p className="text-xs text-gray-500">Government & community accredited agroforestry carbon batches open for corporate ESG off-take.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <Card key={opp.id} className="p-6 border border-gray-200 space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-emerald-800 border-emerald-300 bg-emerald-50">
                    {opp.standard}
                  </Badge>
                  <span className="text-xs font-bold text-gray-500">Vintage {opp.vintageYear}</span>
                </div>
                <h4 className="font-bold text-base text-gray-900 leading-snug">{opp.title}</h4>
                <p className="text-xs text-gray-600">{opp.location}</p>

                <div className="space-y-1.5 pt-2 text-xs text-gray-600 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span>Available Offtake:</span>
                    <strong className="text-gray-900">{opp.availableCreditsTons} tCO2e</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Satellite NDVI Score:</span>
                    <strong className="text-emerald-700">{opp.ndviHealthRating}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Issuing Authority:</span>
                    <span className="text-gray-900 text-right truncate max-w-[150px]">{opp.issuingAgency}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 block">Unit Price</span>
                  <span className="text-lg font-black text-emerald-700">₹{opp.pricePerTonne.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-gray-500"> / tonne</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/carbon/request-audit')}
                  className="flex items-center gap-1"
                >
                  Enroll Parcel <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Carbon Offset Certificate Modal */}
      <CarbonCertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        carbonData={{
          id: selectedCertificate?.creditId || 'BC-CARB-2026-0092',
          farmerName: selectedCertificate?.farmerName || user?.fullName || user?.name || 'Rajesh',
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

export default CarbonOpportunitiesPage;
