import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FolderKanban, MapPin, FlaskConical, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';

export const PartnerPublicPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase">
          <Users className="w-3.5 h-3.5" />
          <span>Operational Execution Grid</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Field Operations & Laboratory Network
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          For certified agronomy agencies, surveying teams, tree inspectors, and accredited soil testing laboratories seeking seamless task assignment, visit tracking, and transparent invoicing.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/login?role=PARTNER">
            <Button size="lg" variant="secondary" icon={ArrowRight}>
              Partner Portal Login
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">Task Dispatch & Acknowledgment</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Receive field task assignments from BHUMICRED Super Admin with complete instructions, boundary coordinates, and required evidence checklists.
          </p>
        </Card>

        <Card className="p-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">GPS Field Visits & Evidence</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Execute on-site tree inspections and boundary surveys with automatic GPS geotagging, timestamp capture, and tamper-proof photo uploads.
          </p>
        </Card>

        <Card className="p-6">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-slate-900 mb-2">Laboratory Testing Queue</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Manage assigned soil and water sample intakes, record N-P-K nutrient readings, generate official certificates, and track automated invoice payouts.
          </p>
        </Card>
      </div>
    </div>
  );
};
