import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShieldCheck,
  Trees,
  Check,
  Zap,
  ArrowRight,
  HelpCircle,
  FileCheck,
  Award,
  AlertTriangle,
  Flame,
  CloudLightning,
  Bug,
  Calculator,
  Plus,
  Shield,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { fetchPolicies, fetchInsuranceStats, calculateQuote } from '../insuranceSlice.js';

const PLANS = [
  {
    id: 'plan_single',
    title: 'Individual High-Value Tree Guard',
    tagline: 'Ideal for small orchards, fruiting trees, and precious sandalwood clusters.',
    category: 'Single / Cluster Trees',
    baseRatePerTree: 95,
    minTrees: 10,
    maxTrees: 100,
    popular: false,
    perils: [
      'Storm & Cyclone (> 75 km/h)',
      'Direct Lightning Strike',
      'Wild Animal Encroachment',
      'Frost & Extreme Winter Freeze',
    ],
    subsidyEligible: true,
    subsidyPercent: 30,
  },
  {
    id: 'plan_agroforestry',
    title: 'Comprehensive Agroforestry Cover',
    tagline: 'Full-cycle commercial timber & boundary bund plantation protection.',
    category: 'Commercial Agroforestry',
    baseRatePerTree: 75,
    minTrees: 50,
    maxTrees: 2000,
    popular: true,
    perils: [
      'Storm, Cyclone & Windthrow',
      'Wildfire & Surface Fire Spread',
      'Severe Stem Borer & Fungal Blight Outbreaks',
      'Catastrophic Drought Stress (Parametric Index)',
      'Flooding & Waterlogging Root Rot (> 96 hrs)',
    ],
    subsidyEligible: true,
    subsidyPercent: 40,
  },
  {
    id: 'plan_carbon_timber',
    title: 'Carbon Asset & High-Density Timber Shield',
    tagline: 'High sum insured protection integrated with carbon credit yield guarantee.',
    category: 'Institutional / Carbon Plots',
    baseRatePerTree: 110,
    minTrees: 200,
    maxTrees: 10000,
    popular: false,
    perils: [
      'All Natural Perils (Fire, Storm, Flood)',
      'Carbon Credit Revenue Shortfall Guarantee',
      'Pest Incursion Early Remediation Payout',
      'Drone LiDAR Re-planting Reimbursement',
    ],
    subsidyEligible: true,
    subsidyPercent: 25,
  },
];

export const InsuranceCatalogPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { policies, stats, calculatedQuote, isLoading } = useSelector((state) => state.insurance);
  const [treeCountInput, setTreeCountInput] = useState(150);
  const [selectedSpecies, setSelectedSpecies] = useState('TEAK');

  useEffect(() => {
    dispatch(fetchPolicies());
    dispatch(fetchInsuranceStats());
    dispatch(calculateQuote({ treeCount: treeCountInput, species: selectedSpecies, ageYears: 4, durationMonths: 36 }));
  }, [dispatch]);

  const handleRecalculate = (count, species) => {
    setTreeCountInput(count);
    setSelectedSpecies(species);
    dispatch(calculateQuote({ treeCount: count, species: species, ageYears: 4, durationMonths: 36 }));
  };

  // User-wise strict filtering and deduplication
  const userCleanPhone = (user?.mobile || '').replace(/\D/g, '');
  const userPolicies = (policies || []).filter((p) => {
    if (user?.role === 'SUPER_ADMIN') return true;
    const pPhone = (p.userMobile || p.ownerMobile || '').replace(/\D/g, '');
    if (userCleanPhone && pPhone && (pPhone === userCleanPhone || pPhone.endsWith(userCleanPhone) || userCleanPhone.endsWith(pPhone))) return true;
    if (user?.id && (p.userId === user.id || p.userId?._id === user.id || p.ownerId === user.id)) return true;
    if (user?._id && (p.userId === user._id || p.userId?._id === user._id || p.ownerId === user._id)) return true;
    if (user?.name && p.userName && p.userName.trim().toLowerCase() === user.name.trim().toLowerCase()) return true;
    return false;
  });

  const uniqueUserPolicies = [];
  const seenPolicyKeys = new Set();
  userPolicies.forEach((p) => {
    const key = p.policyNumber || `${p.khasraNumber}-${p.surveyNumber}`;
    if (!seenPolicyKeys.has(key)) {
      seenPolicyKeys.add(key);
      uniqueUserPolicies.push(p);
    }
  });

  // Dynamically compute live stats from actual user policies array
  const activePoliciesList = uniqueUserPolicies.filter((p) => p.status !== 'CANCELLED' && p.status !== 'EXPIRED');
  const computedSum = activePoliciesList.reduce((sum, p) => sum + (Number(p.sumInsured) || 0), 0);
  const computedTrees = activePoliciesList.reduce((sum, p) => sum + (Number(p.insuredTreeCount || p.treeCount) || 0), 0);
  const computedSubsidy = activePoliciesList.reduce((sum, p) => sum + (Number(p.governmentSubsidyAmount) || 0), 0);

  const totalSumInsured = (stats?.totalSumInsured > 0 ? stats.totalSumInsured : computedSum) || computedSum;
  const activePoliciesCount = (stats?.activePolicies > 0 ? stats.activePolicies : (activePoliciesList.length || uniqueUserPolicies.length)) || uniqueUserPolicies.length;
  const totalInsuredTrees = (stats?.totalInsuredTrees > 0 ? stats.totalInsuredTrees : computedTrees) || computedTrees;
  const totalSubsidy = (stats?.totalGovernmentSubsidyDisbursed > 0 ? stats.totalGovernmentSubsidyDisbursed : computedSubsidy) || computedSubsidy;

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Tree & Agroforestry Insurance Catalog"
        subtitle="Sovereign backed, climate-indexed protection for your farm trees with up to 40% government subsidy."
        backTo="/farmer/dashboard"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Tree Insurance' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/farmer/insurance/claims')}
            >
              Track Claims ({stats?.totalClaims || 0})
            </Button>
            <Button
              variant="primary"
              className="bg-emerald-700 hover:bg-emerald-800"
              onClick={() => navigate('/farmer/insurance/apply')}
            >
              <Plus className="w-4 h-4 mr-1" /> Apply Policy
            </Button>
          </div>
        }
      />

      {/* Top Stats Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl border-0 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-200 font-medium">Active Policy Cover</span>
            <div className="p-2 bg-white/10 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
          </div>
          <div className="text-2xl font-black mt-2 tracking-tight">
            ₹{totalSumInsured.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-300/80 mt-1 block">
            {activePoliciesCount} Active {activePoliciesCount === 1 ? 'Policy' : 'Policies'}
          </span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Insured Tree Inventory</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <Trees className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            {totalInsuredTrees.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">Trees</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <Check className="w-3 h-3" /> 100% Geo-Tagged
          </span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Govt Subsidy Applied</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            ₹{totalSubsidy.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-amber-800 font-medium mt-1 block">
            40% PM-KMY Agro Grant
          </span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Settlement Speed</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            {stats?.claimsSettlementRatio || '98.4%'}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Fast GPS Drone Review</span>
        </Card>
      </div>

      {/* Live Parametric Quote Calculator Box */}
      <Card className="p-6 sm:p-7 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 dark:from-emerald-950 dark:via-emerald-900/90 dark:to-teal-950 border border-emerald-600/40 dark:border-emerald-700/60 rounded-3xl shadow-xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-lg">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-200 dark:text-emerald-400 uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-emerald-300 dark:text-emerald-400" />
              <span>Instant Parametric Underwriting Estimator</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Calculate Your Subsidized Tree Coverage
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Premiums are actuarially calculated using satellite NDVI baseline, species maturation index, and 40% PM-KMY government grant.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 bg-emerald-950/40 dark:bg-neutral-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 dark:border-neutral-700 text-xs text-white">
                <span className="text-emerald-200 dark:text-slate-400 font-medium">Species:</span>
                <select
                  value={selectedSpecies}
                  onChange={(e) => handleRecalculate(treeCountInput, e.target.value)}
                  className="font-bold text-white bg-transparent focus:outline-none cursor-pointer"
                >
                  <option className="bg-emerald-950 dark:bg-neutral-900 text-white" value="TEAK">Indian Teak (Sagwan)</option>
                  <option className="bg-emerald-950 dark:bg-neutral-900 text-white" value="SANDALWOOD">Red Sandalwood (Chandan)</option>
                  <option className="bg-emerald-950 dark:bg-neutral-900 text-white" value="MANGO">Alphonso Mango (Kesar)</option>
                  <option className="bg-emerald-950 dark:bg-neutral-900 text-white" value="COCONUT">Hybrid Coconut Palm</option>
                  <option className="bg-emerald-950 dark:bg-neutral-900 text-white" value="EUCALYPTUS">Clonal Eucalyptus</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-emerald-950/40 dark:bg-neutral-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 dark:border-neutral-700 text-xs text-white">
                <span className="text-emerald-200 dark:text-slate-400 font-medium">Tree Count:</span>
                <input
                  type="number"
                  min="10"
                  max="5000"
                  value={treeCountInput}
                  onChange={(e) => handleRecalculate(parseInt(e.target.value, 10) || 10, selectedSpecies)}
                  className="w-20 font-mono font-bold text-white bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Real-time Calculation Badge */}
          {calculatedQuote && (
            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-5 rounded-2xl border border-white/30 dark:border-neutral-700 shadow-xl text-left sm:text-right space-y-2 w-full md:w-auto shrink-0 min-w-0 sm:min-w-[260px] text-slate-900 dark:text-white">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Total Sum Insured</span>
                <span className="font-mono font-black text-2xl text-slate-900 dark:text-white">
                  ₹{calculatedQuote.sumInsured?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="border-t border-slate-200/80 dark:border-neutral-700 pt-2 flex items-center justify-between text-xs">
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">40% Govt Grant:</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  -₹{calculatedQuote.subsidyRebate?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="border-t border-slate-200/80 dark:border-neutral-700 pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Farmer Net Payable:</span>
                <span className="font-mono font-black text-xl text-emerald-900 dark:text-emerald-400">
                  ₹{calculatedQuote.netPayable?.toLocaleString('en-IN')}
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full mt-2 bg-emerald-700 hover:bg-emerald-800 text-xs text-white"
                onClick={() => navigate(`/farmer/insurance/apply?trees=${treeCountInput}&species=${selectedSpecies}`)}
              >
                Apply for This Cover <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Available Plans Grid */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Available Sovereign Insurance Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`p-6 flex flex-col justify-between rounded-3xl transition-all ${
                plan.popular
                  ? 'border-2 border-emerald-600 bg-white dark:bg-neutral-900 shadow-xl ring-2 ring-emerald-600/10'
                  : 'border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-emerald-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    {plan.category}
                  </span>
                  {plan.popular && (
                    <Badge variant="success" className="text-[10px]">Most Popular</Badge>
                  )}
                </div>

                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1">{plan.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{plan.tagline}</p>

                <div className="p-3 bg-slate-50 dark:bg-neutral-800 rounded-2xl border border-slate-100 dark:border-neutral-700 mb-4">
                  <span className="text-[11px] text-slate-400 block">Base Parametric Rate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono font-black text-2xl text-emerald-900 dark:text-emerald-400">
                      ₹{plan.baseRatePerTree}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">/ tree / year</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block mt-1">
                    ✓ {plan.subsidyPercent}% Government Subsidized
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  <span className="text-xs font-bold text-slate-800 block">Covered Climate Perils:</span>
                  {plan.perils.map((peril, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{peril}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                className={`w-full ${plan.popular ? 'bg-emerald-700 hover:bg-emerald-800' : ''}`}
                onClick={() => navigate(`/farmer/insurance/apply?plan=${plan.id}`)}
              >
                Select {plan.title.split(' ')[0]} Plan
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Active Policies List */}
      {uniqueUserPolicies.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Your Active Tree Policies</h3>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
              {uniqueUserPolicies.length} Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uniqueUserPolicies.map((policy) => (
              <Card
                key={policy._id || policy.id || policy.policyNumber}
                className="p-5 border border-slate-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-700/60 hover:shadow-md transition-all rounded-2xl bg-white dark:bg-neutral-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/80 px-2.5 py-0.5 rounded-lg shadow-2xs">
                      {policy.policyNumber}
                    </span>
                    <Badge
                      variant={
                        policy.status === 'ACTIVE'
                          ? 'success'
                          : policy.status?.includes('CLAIM') || policy.status?.includes('PROGRESS')
                          ? 'warning'
                          : 'default'
                      }
                      className="text-[10px] uppercase font-bold tracking-wider"
                    >
                      {policy.status}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{policy.planName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {policy.landName} • Khasra #{policy.khasraNumber}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 dark:border-neutral-800 pt-3">
                    <div>
                      <span className="text-slate-400 dark:text-slate-400 block text-[10px]">Sum Insured:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        ₹{(policy.sumInsured || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-400 block text-[10px]">Insured Trees:</span>
                      <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                        🌲 {policy.insuredTreeCount} Trees
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Valid till: {new Date(policy.endDate).toLocaleDateString('en-GB')}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => navigate(`/farmer/insurance/${policy._id || policy.id || policy.policyNumber}`)}
                    >
                      View Policy Bond
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-rose-700 hover:bg-rose-800 text-xs"
                      onClick={() => navigate(`/farmer/insurance/raise-claim?policy=${policy.policyNumber}`)}
                    >
                      Raise Claim
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceCatalogPage;
