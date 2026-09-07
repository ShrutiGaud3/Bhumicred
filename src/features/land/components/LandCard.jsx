import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/ui/Card.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { MapPin, ShieldAlert, FlaskConical, ArrowRight, Layers } from 'lucide-react';

export const LandCard = ({ land }) => {
  return (
    <Card hoverable className="p-6 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 leading-snug">{land.landName}</h3>
              <p className="text-xs text-slate-500 font-mono">Survey: {land.surveyNumber} • Khasra: {land.khasraNumber}</p>
            </div>
          </div>
          <StatusBadge status={land.status} />
        </div>

        <div className="grid grid-cols-2 gap-2 my-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Area</span>
            <span className="font-bold text-slate-800">{land.area} {land.areaUnit}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Land Type</span>
            <span className="font-bold text-slate-800 truncate block">{land.landType}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Trees Insured</span>
            <span className={`font-bold ${land.treesInsured ? 'text-emerald-700' : 'text-amber-700'}`}>
              {land.treesInsured ? `Active (${land.treeCount} trees)` : 'Not Insured'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Soil Report</span>
            <span className="font-bold text-slate-800">
              {land.soilReportStatus === 'REPORT_READY' ? 'Verified (Ready)' : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <Link to={`/farmer/lands/${land.id}`} className="w-full block">
          <Button variant="outline" size="sm" className="w-full flex items-center justify-between">
            <span className="font-semibold">View Land & GIS Polygon</span>
            <ArrowRight className="w-4 h-4 shrink-0 ml-1.5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
