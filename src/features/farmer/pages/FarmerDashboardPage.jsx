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
  CloudSun
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MandiWeatherWidget } from '../../../components/common/MandiWeatherWidget.jsx';
import { PendingApproval } from '../../../components/states/PendingApproval.jsx';
import { FarmerReportsInvoicesPage } from './FarmerReportsInvoicesPage.jsx';

export const FarmerDashboardPage = () => {
  const dispatch = useDispatch();
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

  const wallet = dashboardData?.wallet || { availableBalance: 0, pendingBalance: 0, rewards: 0 };
  const overview = dashboardData?.overview || {};

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/20">
                Farmer Web Portal
              </span>
              <StatusBadge status={user?.status || 'APPROVED'} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Kisan Bandhu'}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl leading-relaxed">
              Connect. Grow. Sustain. Manage your registered land parcels, tree insurance policies, soil testing requests, and official tax invoices.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setDashboardTab('REPORTS_INVOICES')}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-all shadow-md flex items-center gap-2"
            >
              <Receipt className="w-4 h-4 text-emerald-700" />
              View Invoices & Reports
            </button>
            <Link to="/farmer/lands">
              <Button variant="secondary" size="md" icon={PlusCircle}>
                Add Land
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* DASHBOARD TAB NAVIGATION BAR (Centered) */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-200/90 rounded-2xl border border-slate-300/80 overflow-x-auto max-w-4xl mx-auto shadow-inner">
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                  isActive ? 'bg-emerald-700 text-emerald-100 border border-emerald-500' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
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
            subtitle="Verified central & state agroforestry, soil health and drone subsidy initiatives"
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
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                    <h4 className="text-sm font-bold text-slate-900">{sch.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500">{sch.authority}</p>
                  <p className="text-xs text-emerald-800 font-semibold pt-1">{sch.benefit}</p>
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
          {/* Live Mandi Spot Rates & Hyperlocal Weather Advisory */}
          <MandiWeatherWidget />

          {/* Overview Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card hoverable className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              My Lands
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{overview.registeredLands || 0}</div>
            <p className="text-xs text-slate-500 mt-0.5">Parcels mapped with GIS</p>
          </div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tree Policies
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{overview.activePolicies || 0}</div>
            <p className="text-xs text-slate-500 mt-0.5">Trees & plantations insured</p>
          </div>
        </Card>

        <Card hoverable className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Soil Requests
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{overview.soilTestRequests || 0}</div>
            <p className="text-xs text-slate-500 mt-0.5">Lab test orders</p>
          </div>
        </Card>

        <Card hoverable className="p-5 bg-gradient-to-br from-emerald-50/50 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Wallet Balance
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-900">
              {formatCurrency(wallet.availableBalance)}
            </div>
            <p className="text-xs text-emerald-700 mt-0.5 font-medium">
              +{formatCurrency(wallet.rewards)} Rewards Earned
            </p>
          </div>
        </Card>
      </div>

      {/* Recommended Schemes & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Recommended Government Schemes"
              subtitle="Verified central & state agricultural initiatives"
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
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <h4 className="text-sm font-bold text-slate-900">{sch.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500">{sch.authority}</p>
                    <p className="text-xs text-emerald-800 font-semibold pt-1">{sch.benefit}</p>
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
        </div>

        {/* Quick Operations Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-sm text-slate-900 mb-4">Quick Operations</h3>
            <div className="space-y-2">
              <Link
                to="/farmer/soil"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-xs font-semibold text-slate-700 hover:text-emerald-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-emerald-700" />
                  Book Soil Health Test
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                to="/marketplace"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-xs font-semibold text-slate-700 hover:text-emerald-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  Agri Marketplace
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                to="/carbon"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-xs font-semibold text-slate-700 hover:text-emerald-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  Carbon Credit Verification
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                to="/rewards"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-xs font-semibold text-slate-700 hover:text-emerald-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-700" />
                  Referral & Earn Rewards
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )}
</div>
  );
};
