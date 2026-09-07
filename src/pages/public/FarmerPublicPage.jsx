import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, MapPin, ShieldAlert, FlaskConical, Landmark, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';

export const FarmerPublicPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
          <Leaf className="w-3.5 h-3.5" />
          <span>Empowering Sovereign Agriculture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Digital Land, Insurance & Soil Services for Farmers
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          BHUMICRED provides Indian farmers with digital land ownership mapping, high-value tree insurance, on-farm soil testing logistics, and direct access to state and central government subsidies.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/login?role=FARMER">
            <Button size="lg" variant="primary" icon={ArrowRight}>
              Access Farmer Portal
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">GIS Land Parcel Registration</h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Digitally map your farm boundaries with interactive GIS polygon drawing, Survey/Khasra number verification, and revenue certificate vault.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Boundary calculation & vertex coordinates</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Beneficiary selection (Myself / Someone Else)</li>
          </ul>
        </Card>

        <Card className="p-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Tree & Plantation Insurance</h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Insure valuable agroforestry trees like Sandalwood, Teak, Mahogany, and fruit orchards against cyclones, fire, drought, and infestations.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Single tree and commercial plantation catalogs</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Photographic evidence claim filing with timeline</li>
          </ul>
        </Card>

        <Card className="p-8">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Accredited Soil Health Testing</h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Book sample collection from your doorstep and receive certified lab analysis sheets measuring pH, Nitrogen (N), Phosphorus (P), Potassium (K), and Organic Carbon.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Doorstep collection slot scheduling</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tamper-proof downloadable PDF report</li>
          </ul>
        </Card>

        <Card className="p-8">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
            <Landmark className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Government Schemes & Subsidies</h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Check real eligibility and request digital application assistance for PM Kisan, organic farming drives, and state sapling programs.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Transparent requirement criteria</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Direct submission and status tracking</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
