import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Leaf,
  FlaskConical,
  Users,
  Building2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  HelpCircle,
  ShoppingBag,
  FolderKanban,
  Landmark,
} from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';

export const HomePage = () => {
  const steps = [
    {
      num: '01',
      title: 'Choose Role & Verify',
      desc: 'Select Farmer, Government Body, or Partner portal and authenticate with secure mobile OTP.',
    },
    {
      num: '02',
      title: 'Digital Land & Asset Onboarding',
      desc: 'Draw precise GIS boundary polygons, enter revenue survey numbers, and upload identity proofs.',
    },
    {
      num: '03',
      title: 'Independent Review & Verification',
      desc: 'BHUMICRED verification desks validate title deeds, revenue boundaries, and institution mandates.',
    },
    {
      num: '04',
      title: 'Access Sovereign Agriculture Services',
      desc: 'Insure trees, book certified soil lab tests, launch civic campaigns, and earn carbon ledger rewards.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-b-[40px] sm:rounded-b-[56px] shadow-2xl px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Sovereign Agri & Sustainability Infrastructure</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
            Connect. Grow.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Sustain.
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The unified multi-role digital ecosystem connecting Farmers, Local Government Bodies, and Enterprise Partners across verified GIS land mapping, tree insurance, soil health lab grids, and verified green carbon assets.
          </p>

          {/* Role Entry Cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link
              to="/farmer"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-left transition-all hover:-translate-y-1 hover:border-emerald-400 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white flex items-center justify-between">
                Farmer Portal
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-300 mt-1">Register land, insure trees, test soil & get schemes</p>
            </Link>

            <Link
              to="/government"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-left transition-all hover:-translate-y-1 hover:border-teal-400 group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white flex items-center justify-between">
                Government Body
                <ArrowRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-300 mt-1">Jurisdiction mapping, campaigns & public green assets</p>
            </Link>

            <Link
              to="/partner"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-left transition-all hover:-translate-y-1 hover:border-amber-400 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white flex items-center justify-between">
                Enterprise Partner
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-300 mt-1">Field inspections, soil lab queue & project execution</p>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Button to="/role-select" size="lg" variant="primary" icon={ArrowRight}>
              Get Started Now
            </Button>
            <Button to="/solutions" size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Explore Solutions
            </Button>
          </div>
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Sovereign Features
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Integrated Agricultural Capabilities
          </h2>
          <p className="text-sm text-slate-600 mt-3">
            Every module is backed by immutable audit trails, strict RBAC authorization, and real-time backend intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/land">
            <Card hoverable className="p-6 h-full flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">GIS Land Mapping</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Polygon boundary drawing with server-side GeoJSON validation, survey verification, and beneficiary management.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          <Link to="/tree-insurance">
            <Card hoverable className="p-6 h-full flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">Tree & Plantation Insurance</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Catalog protection for single trees, farm agro-forestry, and plantation crops with evidence-backed claim processing.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          <Link to="/soil-testing">
            <Card hoverable className="p-6 h-full flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <FlaskConical className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">Soil Health Lab Grid</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  End-to-end sample scheduling, lab partner assignment, N-P-K & organic carbon analysis with downloadable reports.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          <Link to="/marketplace-overview">
            <Card hoverable className="p-6 h-full flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">Agri Marketplace</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Certified high-yield saplings, bio-organic fertilizers, automated solar drip controllers, and tools.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          <Link to="/projects-overview">
            <Card hoverable className="p-6 h-full flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">Civic Projects & Drives</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Transparent milestone monitoring for community agroforestry and soil restoration works.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          <Link to="/schemes-overview">
            <Card hoverable className="p-6 h-full flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                  <Landmark className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">Government Schemes</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verified central and state farmer subsidies, eligibility verification, and application assistance.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* How BHUMICRED Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Operational Blueprint
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            How BHUMICRED Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <Card key={idx} className="p-6 relative overflow-hidden">
              <div className="text-3xl font-black text-emerald-800/20 mb-2">{step.num}</div>
              <h3 className="font-bold text-sm text-slate-900 mb-2">{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust & Architecture Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Integrity & Governance
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Server-Authoritative RBAC & Audit Trails
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
                BHUMICRED ensures that all approvals, financial mutations, survey polygons, and insurance statuses are verified on the backend. No client-side bypass or unauthorized data access is ever permitted.
              </p>
              <div className="mt-6 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Granular action-level permissions and jurisdiction boundaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Comprehensive state machine (Pending, Query Raised, Approved, Rejected)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Bhumitra AI contextually scoped to user permissions</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <span className="text-xs font-semibold text-slate-400">Target Launch</span>
                <span className="text-xs font-bold text-emerald-400">21 September 2026</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <span className="text-xs font-semibold text-slate-400">Supported Roles</span>
                <span className="text-xs font-bold text-white">Farmer, Govt, Partner, Super Admin</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <span className="text-xs font-semibold text-slate-400">Security Architecture</span>
                <span className="text-xs font-bold text-amber-300">OTP Auth + JWT + RBAC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">AI Assistance</span>
                <span className="text-xs font-bold text-emerald-400">Bhumitra AI Assistant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center py-12 max-w-3xl mx-auto px-4 space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Ready to experience the future of agricultural stewardship?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Join thousands of farmers, gram panchayats, and certified agritech service partners on BHUMICRED.
        </p>
        <Button to="/role-select" size="xl" variant="primary" icon={ArrowRight}>
          Select Your Role to Begin
        </Button>
      </section>
    </div>
  );
};
