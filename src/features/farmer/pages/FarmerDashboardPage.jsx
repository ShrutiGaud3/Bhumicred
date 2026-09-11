import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFarmerDashboard } from '../farmerSlice.js';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { LoadingSkeleton } from '../../../components/states/LoadingSkeleton.jsx';
import { ErrorState } from '../../../components/states/ErrorState.jsx';
import { formatCurrency } from '../../../utils/formatters.js';
import {
  MapPin,
  ShieldAlert,
  FlaskConical,
  ShoppingBag,
  FolderKanban,
  Wallet,
  Gift,
  ArrowRight,
  PlusCircle,
  Sparkles,
  Landmark,
  Leaf,
  Receipt,
  FileText,
  BarChart3,
  CloudSun,
  Satellite,
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { MandiWeatherWidget } from '../../../components/common/MandiWeatherWidget.jsx';
import { PendingApproval } from '../../../components/states/PendingApproval.jsx';
import { FarmerReportsInvoicesPage } from './FarmerReportsInvoicesPage.jsx';

export const FarmerDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { dashboardData, isLoading, error } = useSelector((state) => state.farmer);
  const [dashboardTab, setDashboardTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'REPORTS_INVOICES' | 'MANDI' | 'SCHEMES'

  useEffect(() => {
    dispatch(fetchFarmerDashboard());
  }, [dispatch]);

  // If farmer registration is pending review, show PendingApproval state
  if (user?.status === 'PENDING_APPROVAL' || user?.status === 'PENDING_VERIFICATION') {
    return (
      <div className="py-6">
        <PendingApproval
          roleTitle="Farmer Registration Profile"
          applicationId={user?.applicationId || `BC-APP-${user?.id?.slice(-6) || '883921'}`}
          submittedAt={user?.submittedAt || 'Recently Submitted'}
        />
      </div>
    );
  }

  if (isLoading && !dashboardData) {
    return <LoadingSkeleton variant="cards" count={4} />;
  }

  if (error && !dashboardData) {
    return <ErrorState message={error} onRetry={() => dispatch(fetchFarmerDashboard())} />;
  }

  const wallet = dashboardData?.wallet || { availableBalance: 14850, pendingBalance: 2900, rewards: 1250 };
  const overview = dashboardData?.overview || {
    registeredLands: 1,
    activePolicies: 1,
    soilTestRequests: 1,
    carbonOpportunities: 1,
    totalTrees: 33,
    totalCarbonTons: 4.1,
    carbonValuation: 5981,
  };
  const activities = dashboardData?.recentActivities || [];
  const lands = dashboardData?.lands || [];

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/20">
                Sovereign Farmer Portal
              </span>
              <StatusBadge status={user?.status || 'APPROVED'} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.name || user?.fullName || 'Ramesh Patel'}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl leading-relaxed">
              Connect. Grow. Sustain. Manage your cadastral land parcels, tree insurance, soil chemistry diagnostics, and carbon credit monetization.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setDashboardTab('REPORTS_INVOICES')}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4 text-emerald-700" />
              Tax Invoices & Reports
            </button>
            <Link to="/farmer/lands/add" className="flex-1 sm:flex-initial">
              <Button variant="secondary" size="md" icon={PlusCircle} className="w-full justify-center">
                Register Land
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* DASHBOARD TAB NAVIGATION BAR */}
      <div className="w-full overflow-x-auto no-scrollbar scroll-smooth py-1">
        <div className="flex items-center justify-start sm:justify-center gap-2 p-1.5 bg-slate-200/90 dark:bg-neutral-800/90 rounded-2xl border border-slate-300/80 dark:border-neutral-700 w-max sm:w-auto max-w-4xl mx-auto shadow-inner">
          {[
            { id: 'OVERVIEW', label: 'Overview & Assets', icon: BarChart3 },
            { id: 'MANDI', label: 'Live Mandi & Weather', icon: CloudSun },
            { id: 'REPORTS_INVOICES', label: 'Reports & Tax Invoices', icon: Receipt, badge: 'New' },
            { id: 'SCHEMES', label: 'Govt Schemes & Subsidies', icon: Landmark },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = dashboardTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDashboardTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-700 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                      isActive
                        ? 'bg-emerald-700 text-emerald-100 border border-emerald-500'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT 1: REPORTS & TAX INVOICES TAB */}
      {dashboardTab === 'REPORTS_INVOICES' && (
        <div className="space-y-6">
          <FarmerReportsInvoicesPage isEmbedded={true} />
        </div>
      )}

      {/* TAB CONTENT 2: LIVE MANDI & WEATHER TAB */}
      {dashboardTab === 'MANDI' && (
        <div className="space-y-6">
          <MandiWeatherWidget />
        </div>
      )}

      {/* TAB CONTENT 3: SCHEMES TAB */}
      {dashboardTab === 'SCHEMES' && (
        <Card>
          <CardHeader
            title="Recommended Government Agricultural Schemes & Subsidies"
            subtitle="Verified central & state agroforestry, soil health and DBT subsidy initiatives"
            action={
              <Link to="/schemes" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
                View All Schemes <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          />
          <CardContent className="space-y-4">
            {(dashboardData?.recommendedSchemes || []).map((sch) => (
              <div
                key={sch.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-200 dark:border-neutral-700 hover:border-emerald-300 transition-colors flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{sch.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">{sch.authority}</p>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold pt-1">{sch.benefit}</p>
                </div>
                <Link to="/schemes">
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TAB CONTENT 4: MAIN OVERVIEW (DEFAULT) */}
      {dashboardTab === 'OVERVIEW' && (
        <div className="space-y-8">
          {/* 1. Live Mandi Spot Rates & Hyperlocal Weather Advisory */}
          <MandiWeatherWidget />

          {/* 2. Overview 4-Stat Macro Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: My Lands */}
            <Link to="/farmer/lands" className="block group">
              <Card hoverable className="p-5 border border-slate-200 dark:border-neutral-800 dark:bg-neutral-900 transition-all group-hover:border-emerald-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                    My Registered Lands
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {overview.registeredLands || 1} <span className="text-xs font-normal text-slate-400">Plots</span>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 5.95 Acres Cadastral GIS Mapped
                  </p>
                </div>
              </Card>
            </Link>

            {/* Card 2: Tree Insurance */}
            <Link to="/farmer/insurance" className="block group">
              <Card hoverable className="p-5 border border-slate-200 dark:border-neutral-800 dark:bg-neutral-900 transition-all group-hover:border-amber-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                    Tree Insurance
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {overview.activePolicies || 1} <span className="text-xs font-normal text-slate-400">Policy</span>
                  </div>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 font-semibold">
                    {overview.totalTrees || 33} Trees Underwritten
                  </p>
                </div>
              </Card>
            </Link>

            {/* Card 3: Soil Testing */}
            <Link to="/farmer/soil" className="block group">
              <Card hoverable className="p-5 border border-slate-200 dark:border-neutral-800 dark:bg-neutral-900 transition-all group-hover:border-sky-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                    Soil Health Card
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 flex items-center justify-center">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    12-Parameter <span className="text-xs font-normal text-slate-400">Card</span>
                  </div>
                  <p className="text-xs text-sky-700 dark:text-sky-400 mt-0.5 font-semibold">
                    pH 7.1 Optimal • NABL Validated
                  </p>
                </div>
              </Card>
            </Link>

            {/* Card 4: Smart Wallet */}
            <Link to="/wallet" className="block group">
              <Card hoverable className="p-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/30 dark:from-emerald-950/40 dark:to-neutral-900 border border-emerald-200/80 dark:border-emerald-800/60 transition-all group-hover:border-emerald-500">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    Smart Wallet
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-emerald-950 dark:text-emerald-200">
                    {formatCurrency(wallet.availableBalance || 14850)}
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5 font-medium">
                    +{formatCurrency(wallet.rewards || 1250)} Rewards • Payout Ready
                  </p>
                </div>
              </Card>
            </Link>
          </div>

          {/* 3. Dedicated Carbon & Satellite MRV Snapshot Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase border border-emerald-500/30">
                  <Satellite className="w-3.5 h-3.5" />
                  Sentinel-2 Multi-Spectral MRV Active
                </div>
                <h3 className="text-xl font-black">
                  Agroforestry Carbon Sequestration & Green Asset Registry
                </h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Your standing trees are mapped on ISRO & ESA Sentinel-2 telemetry. Monetize verified annual carbon sequestration tokens on the Sovereign Carbon Registry.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[120px]">
                  <span className="text-[11px] text-emerald-200 block">Annual Carbon</span>
                  <span className="text-lg font-black text-white">~{overview.totalCarbonTons || 4.1} tCO2e</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[120px]">
                  <span className="text-[11px] text-emerald-200 block">Carbon Valuation</span>
                  <span className="text-lg font-black text-emerald-400">
                    ₹{(overview.carbonValuation || 5981).toLocaleString('en-IN')}
                  </span>
                </div>
                <Button
                  variant="primary"
                  className="py-3 px-5 shadow-lg shadow-emerald-950/40"
                  onClick={() => navigate('/carbon')}
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Carbon Opportunities
                </Button>
              </div>
            </div>
          </div>

          {/* 4. Two Column Section: Recent Activity Ledger & Quick Operations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Sovereign Activity Ledger */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 border border-slate-200 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-800">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      Recent Sovereign Ledger Activities
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      Real-time immutable event trail for land, insurance, soil diagnostics, and payouts.
                    </p>
                  </div>
                  <Link to="/farmer/invoices" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
                    View Audit Logs →
                  </Link>
                </div>

                <div className="space-y-3.5 pt-4">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/80 dark:border-neutral-700/60 flex items-center justify-between gap-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
                          {act.type === 'CARBON' ? (
                            <Satellite className="w-4 h-4" />
                          ) : act.type === 'SOIL' ? (
                            <FlaskConical className="w-4 h-4" />
                          ) : act.type === 'INSURANCE' ? (
                            <ShieldAlert className="w-4 h-4" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{act.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">{act.subtitle}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                          {act.badge}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recommended Schemes */}
              <Card className="p-6 border border-slate-200 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-800">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-emerald-600" />
                      Recommended Government Schemes & Direct DBT Subsidies
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-neutral-400">
                      Central & State agroforestry, solar pump, and soil health initiatives.
                    </p>
                  </div>
                  <Link to="/schemes" className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
                    View All →
                  </Link>
                </div>

                <div className="space-y-3 pt-4">
                  {(dashboardData?.recommendedSchemes || []).map((sch) => (
                    <div
                      key={sch.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/80 dark:border-neutral-700/60 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{sch.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-neutral-400">{sch.authority}</p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">{sch.benefit}</p>
                      </div>
                      <Link to="/schemes">
                        <Button variant="outline" size="sm">
                          Apply
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right 1 Col: Quick Operations Hub */}
            <div className="space-y-6">
              <Card className="p-6 border border-slate-200 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Quick Action Hub
                </h3>
                <div className="space-y-2.5">
                  <Link
                    to="/farmer/carbon/request-audit"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors border border-slate-200/60 dark:border-neutral-700"
                  >
                    <span className="flex items-center gap-2">
                      <Satellite className="w-4 h-4 text-emerald-600" />
                      Scan New Parcel (Satellite MRV)
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/farmer/soil/book"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors border border-slate-200/60 dark:border-neutral-700"
                  >
                    <span className="flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-sky-600" />
                      Book Soil Test Pickup
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/farmer/insurance/apply"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors border border-slate-200/60 dark:border-neutral-700"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      Apply for Tree Insurance
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/marketplace"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors border border-slate-200/60 dark:border-neutral-700"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-600" />
                      Organic Inputs Marketplace
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to="/wallet"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-neutral-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold text-slate-700 dark:text-neutral-200 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors border border-slate-200/60 dark:border-neutral-700"
                  >
                    <span className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      Withdraw Payouts & DBT
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </Card>

              {/* Kisan Support Card */}
              <Card className="p-5 bg-gradient-to-br from-emerald-900 to-teal-950 text-white border-0 shadow-lg">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-300 mb-1">
                  24/7 Kisan Call Helpline
                </h4>
                <p className="text-xl font-black">1800-BHUMI-CRED</p>
                <p className="text-[11px] text-emerald-200/80 mt-1">
                  Toll-free tele-assistance for GIS mapping, soil collection, and insurance payouts.
                </p>
                <Link
                  to="/support"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white"
                >
                  Open Grievance Desk →
                </Link>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboardPage;
