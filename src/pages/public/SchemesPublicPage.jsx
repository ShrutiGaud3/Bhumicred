import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, ArrowRight, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { schemeService } from '../../features/schemes/services/schemeService.js';

export const SchemesPublicPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSchemes = async () => {
      setLoading(true);
      try {
        const res = await schemeService.getSchemes();
        if (res.data) {
          setSchemes(res.data);
        }
      } catch (e) {
        console.warn('Failed to load public schemes:', e);
      } finally {
        setLoading(false);
      }
    };
    loadSchemes();
  }, []);

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

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
          <p className="text-sm font-semibold">Loading public government schemes...</p>
        </div>
      ) : schemes.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-gray-200">
          <Landmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700">No active government subsidy schemes found</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {schemes.map((sch) => {
            const schId = sch._id || sch.id;
            return (
              <Card key={schId} className="p-6 md:p-8 space-y-4">
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SchemesPublicPage;
