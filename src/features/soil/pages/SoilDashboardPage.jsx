import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  TestTube,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  FlaskConical,
  Award,
  Sparkles,
  Download,
  Layers,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import {
  fetchSoilRequests,
  fetchSoilStats,
} from '../soilSlice.js';

export const SoilDashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { requests, stats, isLoading } = useSelector((state) => state.soil);

  useEffect(() => {
    dispatch(fetchSoilRequests());
    dispatch(fetchSoilStats());
  }, [dispatch]);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Soil Health & Lab Testing Hub"
        subtitle="Precision 12-parameter nutrient mapping, organic carbon indexing, and fertilizer advice."
        backTo="/farmer/dashboard"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Soil Health Hub' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                dispatch(fetchSoilRequests());
                dispatch(fetchSoilStats());
              }}
              className="flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
            <Button
              variant="primary"
              className="flex items-center gap-2"
              onClick={() => navigate('/farmer/soil/book')}
            >
              <Plus className="w-4 h-4" /> Book Soil Test
            </Button>
          </div>
        }
      />

      {/* Featured Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-emerald-900 to-teal-950 text-white border-0 shadow-md">
          <FlaskConical className="w-8 h-8 text-emerald-400 mb-3" />
          <h4 className="text-sm font-semibold text-emerald-200">Active Tested Parcels</h4>
          <p className="text-3xl font-extrabold mt-1">
            {stats.testedParcelsCount || requests.length || 0}{' '}
            <span className="text-base font-medium text-emerald-300">Plots</span>
          </p>
          <span className="text-xs text-emerald-300 mt-2 block">100% Organic Carbon Benchmarked</span>
        </Card>

        <Card className="p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600" /> Avg Organic Carbon
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.avgOrganicCarbon || '0.82%'}</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            High Fertility Range (&gt;0.75%)
          </span>
        </Card>

        <Card className="p-6 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4 text-emerald-600" /> Soil Card Validity
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {requests.length > 0 ? 'Valid' : 'No Tests'}
          </p>
          <span className="text-xs text-gray-500 mt-1 block">
            {requests.length > 0 ? 'Annual recertification due 2027' : 'Schedule sample collection below'}
          </span>
        </Card>
      </div>

      {/* Test Requests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Recent Soil Test Requests & Reports</h3>
          <span className="text-xs text-gray-500 font-mono">
            {requests.length} Requests logged
          </span>
        </div>

        {isLoading && requests.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-emerald-600" />
            <p className="text-sm">Loading soil testing records from Sovereign Database...</p>
          </div>
        ) : requests.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-slate-200 space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <TestTube className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">No Soil Tests Recorded Yet</h4>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Schedule your first NABL-accredited soil sample collection to receive your digital Soil Health Card and precision crop dosage advisory.
            </p>
            <Button
              variant="primary"
              className="inline-flex items-center gap-2"
              onClick={() => navigate('/farmer/soil/book')}
            >
              <Plus className="w-4 h-4" /> Book First Soil Test
            </Button>
          </Card>
        ) : (
          requests.map((req) => {
            const reqId = req._id || req.id;
            return (
              <Card
                key={reqId}
                className="p-6 border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {req.requestNumber}
                      </span>
                      <StatusBadge status={req.status || 'REPORT_READY'} />
                      {req.fee === 0 ? (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                          Government Free Scheme
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                          ₹{req.fee} Paid
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg font-bold text-gray-900">{req.packageType}</h4>
                    <p className="text-xs text-gray-500">
                      Parcel: <strong className="text-gray-800">{req.landName}</strong> • Lab:{' '}
                      {req.assignedLab || 'NABL Accredited Regional Lab'}
                    </p>
                  </div>

                  {/* Status and Action */}
                  <div className="flex items-center gap-4">
                    {req.status === 'REPORT_READY' || req.reportData ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => navigate(`/farmer/soil/report/${reqId}`)}
                      >
                        View Soil Health Card <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                        <Clock className="w-4 h-4 animate-spin" /> Sample in Lab Analysis
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SoilDashboardPage;
