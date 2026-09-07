import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MOCK_POLICIES } from '../../../services/mockData/insuranceMock.js';

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
  const [treeCountInput, setTreeCountInput] = useState(150);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Tree & Agroforestry Insurance Catalog"
        subtitle="Sovereign backed, climate-indexed protection for your farm trees with up to 40% government subsidy."
        backTo="/farmer/insurance"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Insurance', path: '/farmer/insurance' },
          { label: 'Insurance Plans' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/farmer/insurance/claims')}
          >
            View Active Claims
          </Button>
        }
      />

      {/* Quick Calculator Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
              Interactive Premium Estimator
            </Badge>
            <h3 className="text-2xl font-bold">Calculate Your Tree Cover & Subsidy in Seconds</h3>
            <p className="text-sm text-emerald-100 max-w-xl">
              Enter your total standing tree asset count to see estimated annual premium with the state agroforestry rebate applied.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <label className="block text-xs font-semibold text-emerald-200 mb-2">
              Number of Trees to Insure: <strong className="text-white text-base">{treeCountInput}</strong>
            </label>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={treeCountInput}
              onChange={(e) => setTreeCountInput(Number(e.target.value))}
              className="w-full accent-emerald-400 h-2 bg-emerald-950 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-emerald-300 mt-2 font-mono">
              <span>10 Trees</span>
              <span>500 Trees</span>
              <span>1,000 Trees</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {PLANS.map((plan) => {
          const rawPremium = plan.baseRatePerTree * treeCountInput;
          const discountedPremium = Math.round(rawPremium * (1 - plan.subsidyPercent / 100));

          return (
            <Card
              key={plan.id}
              className={`p-6 md:p-7 flex flex-col justify-between transition-all hover:shadow-xl relative ${
                plan.popular ? 'border-2 border-emerald-500 ring-4 ring-emerald-500/10' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Most Popular for Farmers
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {plan.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">{plan.title}</h3>
                <p className="text-xs text-gray-500 mb-5 leading-relaxed">{plan.tagline}</p>

                {/* Pricing Box */}
                <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-100">
                  <span className="text-xs text-gray-400 block">Est. Annual Premium ({treeCountInput} Trees)</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-gray-900">
                      ₹{discountedPremium.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{rawPremium.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      ({plan.subsidyPercent}% Subsidy)
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-1">
                    ₹{Math.round(discountedPremium / treeCountInput)} / tree / year net cost
                  </span>
                </div>

                {/* Covered Perils */}
                <div className="space-y-3 mb-6">
                  <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Covered Perils & Triggers:
                  </h5>
                  <ul className="space-y-2 text-xs text-gray-600">
                    {plan.perils.map((peril, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{peril}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => navigate(`/farmer/insurance/apply?planId=${plan.id}&trees=${treeCountInput}`)}
                >
                  Apply for Cover <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Why Insure Trees FAQ / Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <Card className="p-5 flex items-start gap-3 bg-white">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <CloudLightning className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Parametric Weather Triggers</h4>
            <p className="text-xs text-gray-500 mt-1">
              Automated claims processing based on satellite wind-speed and rainfall grid data.
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-start gap-3 bg-white">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Trees className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">GPS Tree Geotagging</h4>
            <p className="text-xs text-gray-500 mt-1">
              Each high-value tree is cataloged with GPS coordinates for effortless claim validation.
            </p>
          </div>
        </Card>

        <Card className="p-5 flex items-start gap-3 bg-white">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Direct Subsidy Pass-through</h4>
            <p className="text-xs text-gray-500 mt-1">
              State agroforestry incentives are credited directly to lower your upfront premium.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
