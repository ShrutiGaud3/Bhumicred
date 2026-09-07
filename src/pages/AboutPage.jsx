import React from 'react';
import { Card } from '../components/ui/Card.jsx';
import { ShieldCheck, Target, Heart, Award } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          About BHUMICRED
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Connect. Grow. Sustain.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          BHUMICRED is dedicated to building sovereign, trusted digital infrastructure that empowers agrarian economies, preserves ecological wealth, and bridges farmers with governance and certified service providers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">Our Mission</h3>
          <p className="text-xs text-slate-600">
            To provide transparent, digital-first land, tree insurance, and laboratory services that protect farmers' livelihoods and promote sustainable agricultural practices.
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">Data Sovereignty</h3>
          <p className="text-xs text-slate-600">
            Strict jurisdiction boundaries, robust RBAC, and backend-enforced governance ensure farmer data is secure, verifiable, and protected from unauthorized access.
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">Ecological Growth</h3>
          <p className="text-xs text-slate-600">
            Encouraging tree cover, organic soil restoration, carbon stewardship, and community-led green initiatives in partnership with local gram panchayats and municipal bodies.
          </p>
        </Card>
      </div>
    </div>
  );
};
