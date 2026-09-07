import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, ArrowRight, CheckCircle2, Award, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';

export const SoilPublicPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Accredited Lab Grid</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Soil Health Testing & Lab Network
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Book doorstep farm soil collection, track testing in accredited labs, and receive standardized nutritional health certificates.
        </p>
        <div className="pt-2">
          <Link to="/login?role=FARMER">
            <Button size="lg" variant="primary" icon={ArrowRight}>
              Book Soil Test
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-emerald-700 font-black text-2xl mb-1">01</div>
          <h3 className="font-bold text-base text-slate-900 mb-2">Doorstep Pickup</h3>
          <p className="text-xs text-slate-600">
            An authorized field partner visits your geo-tagged land and collects representative soil core samples.
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-emerald-700 font-black text-2xl mb-1">02</div>
          <h3 className="font-bold text-base text-slate-900 mb-2">Lab Analysis</h3>
          <p className="text-xs text-slate-600">
            Accredited laboratories perform precision chemical assays for pH, Organic Carbon, Nitrogen, Phosphorus, Potassium, and micronutrients.
          </p>
        </Card>
        <Card className="p-6">
          <div className="text-emerald-700 font-black text-2xl mb-1">03</div>
          <h3 className="font-bold text-base text-slate-900 mb-2">Digital Certificate</h3>
          <p className="text-xs text-slate-600">
            Download your tamper-proof PDF report with personalized crop and organic fertilization recommendations.
          </p>
        </Card>
      </div>
    </div>
  );
};
