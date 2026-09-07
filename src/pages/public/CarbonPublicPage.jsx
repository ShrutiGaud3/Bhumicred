import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';

export const CarbonPublicPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
          <Leaf className="w-3.5 h-3.5" />
          <span>Carbon & Ecological Stewardship</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Agroforestry Carbon & Green Opportunities
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Unlock verified economic rewards for tree canopy expansion, regenerative soil practices, and ecological preservation backed by verified backend ledgers.
        </p>
        <div className="pt-2">
          <Link to="/login?role=FARMER">
            <Button size="lg" variant="primary" icon={ArrowRight}>
              Submit Carbon Opportunity Request
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-base text-slate-900 mb-2">1. Request & Baseline</h3>
          <p className="text-xs text-slate-600">
            Submit your registered land parcel and tree inventory for baseline carbon sequestration modeling.
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-base text-slate-900 mb-2">2. Independent Verification</h3>
          <p className="text-xs text-slate-600">
            Assigned certified partner conducts periodic geotagged drone/field audits to verify survival and biomass gain.
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-base text-slate-900 mb-2">3. Direct Wallet Credits</h3>
          <p className="text-xs text-slate-600">
            Approved ecological units are credited directly to your BHUMICRED Wallet for immediate payout into your bank account.
          </p>
        </Card>
      </div>
    </div>
  );
};
