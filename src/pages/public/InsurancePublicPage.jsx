import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';

export const InsurancePublicPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Agroforestry Risk Protection</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Tree & Commercial Plantation Insurance
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Safeguard your valuable timber, fruit orchards, and plantation assets against natural perils with transparent policies and evidence-backed claims.
        </p>
        <div className="pt-2">
          <Link to="/login?role=FARMER">
            <Button size="lg" variant="secondary" icon={ArrowRight}>
              Explore Policies
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-base text-slate-900 mb-2">Single Tree Guard</h3>
          <p className="text-xs text-slate-600 mb-4">
            Individual policy protection tailored for premium species like Sandalwood, Teak, and Rosewood.
          </p>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
            From ₹45 / tree / year
          </span>
        </Card>

        <Card className="p-6 border-2 border-emerald-500/40 relative">
          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
            Most Popular
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">Agroforestry Cluster</h3>
          <p className="text-xs text-slate-600 mb-4">
            Coverage for batch plantings of 25 to 500 trees across field bunds or intercropped parcels.
          </p>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
            Custom Volume Pricing
          </span>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-base text-slate-900 mb-2">Commercial Farm / Estate</h3>
          <p className="text-xs text-slate-600 mb-4">
            Comprehensive multi-year enterprise coverage for large plantations, municipal parks, and orchards.
          </p>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
            Institutional Underwriting
          </span>
        </Card>
      </div>
    </div>
  );
};
