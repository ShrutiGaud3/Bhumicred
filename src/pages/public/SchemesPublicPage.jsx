import React from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { MOCK_SCHEMES } from '../../services/mockData/schemesMock.js';

export const SchemesPublicPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
          <Landmark className="w-3.5 h-3.5" />
          <span>Sovereign Subsidies</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Government Agriculture Schemes Directory
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Comprehensive, transparent repository of central and state government subsidy schemes, eligibility requirements, and digital assistance.
        </p>
      </div>

      <div className="space-y-6">
        {MOCK_SCHEMES.map((sch) => (
          <Card key={sch.id} className="p-6 md:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {sch.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{sch.title}</h3>
                <p className="text-xs text-slate-500">{sch.authority}</p>
              </div>
              <Link to="/login?role=FARMER" className="flex-shrink-0">
                <Button variant="primary" size="sm" icon={ArrowRight}>
                  Apply / Request Help
                </Button>
              </Link>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{sch.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs text-slate-700">
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Benefit:</span>
                <span>{sch.benefits}</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Eligibility:</span>
                <span>{sch.eligibility}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
