import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, CheckCircle2, Layers } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { MapPlaceholder } from '../../components/ui/MapPlaceholder.jsx';

export const LandPublicPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
          <MapPin className="w-3.5 h-3.5" />
          <span>GIS Boundary Mapping</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Sovereign Digital Land Registry
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Create structured, verifiable digital records of agricultural land parcels with polygon drawing, Khasra tagging, and revenue certificate verification.
        </p>
        <div className="pt-2">
          <Link to="/login?role=FARMER">
            <Button size="lg" variant="primary" icon={ArrowRight}>
              Register Your Land
            </Button>
          </Link>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-700" />
          Interactive GIS Simulator
        </h3>
        <MapPlaceholder height="h-80 sm:h-96" />
      </Card>
    </div>
  );
};
