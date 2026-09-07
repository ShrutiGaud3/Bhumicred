import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Landmark, Users, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';

export const GovernmentPublicPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase">
          <Building2 className="w-3.5 h-3.5" />
          <span>Civic & Institutional Governance</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Tools for Panchayats, Municipalities & Legislatures
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Enable Gram Panchayats, Nagar Palikas, Nagar Nigams, and Vidhan Sabhas to record public green assets, monitor permitted area farmers, and deploy targeted agricultural campaigns.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/login?role=GOVERNMENT">
            <Button size="lg" variant="secondary" icon={ArrowRight}>
              Access Government Portal
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">Public Asset Management</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Record, map, and insure municipal parks, village grazing commons, avenue trees, and civic water bodies with verified GIS layers.
          </p>
        </Card>

        <Card className="p-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
            <Landmark className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">On-Demand Campaigns</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Initiate soil testing drives, tree plantation initiatives, and farmer onboarding camps with automated partner assignment.
          </p>
        </Card>

        <Card className="p-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">Farmers in Jurisdiction</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Search, filter, and coordinate assisted enrollment for permitted area farmers while maintaining strict privacy and consent.
          </p>
        </Card>
      </div>
    </div>
  );
};
