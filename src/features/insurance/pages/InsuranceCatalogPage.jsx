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
            ₹{(stats?.totalSumInsured || 1450000).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-300/80 mt-1 block">
            {stats?.activePolicies || policies.length} Active Policies
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
            {stats?.totalInsuredTrees || 180} <span className="text-xs font-normal text-slate-500">Trees</span>
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
            ₹{(stats?.totalGovernmentSubsidyDisbursed || 21840).toLocaleString('en-IN')}
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
      <Card className="p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 border border-emerald-200 rounded-3xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 uppercase tracking-wider">
              <Calculator className="w-4 h-4 text-emerald-700" />
              <span>Instant Parametric Underwriting Estimator</span>
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Calculate Your Subsidized Tree Coverage
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Premiums are actuarially calculated using satellite NDVI baseline, species maturation index, and 40% PM-KMY government grant.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 font-medium">Species:</span>
                <select
                  value={selectedSpecies}
                  onChange={(e) => handleRecalculate(treeCountInput, e.target.value)}
                  className="font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="TEAK">Indian Teak (Sagwan)</option>
                  <option value="SANDALWOOD">Red Sandalwood (Chandan)</option>
                  <option value="MANGO">Alphonso Mango (Kesar)</option>
                  <option value="COCONUT">Hybrid Coconut Palm</option>
                  <option value="EUCALYPTUS">Clonal Eucalyptus</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 font-medium">Tree Count:</span>
                <input
                  type="number"
                  min="10"
                  max="5000"
                  value={treeCountInput}
                  onChange={(e) => handleRecalculate(parseInt(e.target.value, 10) || 10, selectedSpecies)}
                  className="w-20 font-mono font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Real-time Calculation Badge */}
          {calculatedQuote && (
            <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-md text-left sm:text-right space-y-2 w-full md:w-auto shrink-0 min-w-0 sm:min-w-[260px]">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Total Sum Insured</span>
                <span className="font-mono font-black text-2xl text-slate-900">
                  ₹{calculatedQuote.sumInsured?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold">40% Govt Grant:</span>
                <span className="font-bold text-emerald-800">
                  -₹{calculatedQuote.subsidyRebate?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold">Farmer Net Payable:</span>
                <span className="font-mono font-black text-xl text-emerald-900">
                  ₹{calculatedQuote.netPayable?.toLocaleString('en-IN')}
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full mt-2 bg-emerald-700 hover:bg-emerald-800 text-xs"
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
        <h3 className="text-lg font-bold text-slate-900 mb-4">Available Sovereign Insurance Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`p-6 flex flex-col justify-between rounded-3xl transition-all ${
                plan.popular
                  ? 'border-2 border-emerald-600 bg-white shadow-xl ring-2 ring-emerald-600/10'
                  : 'border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">
                    {plan.category}
                  </span>
                  {plan.popular && (
                    <Badge variant="success" className="text-[10px]">Most Popular</Badge>
                  )}
                </div>

                <h4 className="text-lg font-black text-slate-900 mb-1">{plan.title}</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{plan.tagline}</p>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                  <span className="text-[11px] text-slate-400 block">Base Parametric Rate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono font-black text-2xl text-emerald-900">
                      ₹{plan.baseRatePerTree}
                    </span>
                    <span className="text-xs text-slate-500">/ tree / year</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
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
      {policies.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Your Active Tree Policies</h3>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
              {policies.length} Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map((policy) => (
              <Card
                key={policy._id || policy.id || policy.policyNumber}
                className="p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all rounded-2xl bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-black text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded">
                      {policy.policyNumber}
                    </span>
                    <Badge variant="success" className="text-[10px]">
                      {policy.status}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mb-1">{policy.planName}</h4>
                  <p className="text-xs text-slate-500 mb-3">
                    {policy.landName} • Khasra #{policy.khasraNumber}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Sum Insured:</span>
                      <span className="font-mono font-bold text-slate-900">
                        ₹{(policy.sumInsured || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Insured Trees:</span>
                      <span className="font-semibold text-emerald-800">
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
