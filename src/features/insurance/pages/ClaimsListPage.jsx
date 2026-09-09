import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  Calendar,
  Trees,
  UserCheck,
  ArrowRight,
  Plus,
  FileText,
  AlertCircle,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { Timeline } from '../../../components/ui/Timeline.jsx';
import { fetchClaims } from '../insuranceSlice.js';

export const ClaimsListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { claims, isLoading } = useSelector((state) => state.insurance);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    dispatch(fetchClaims());
  }, [dispatch]);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Insurance Claims Tracker"
        subtitle="Monitor field inspection milestones, agronomist drone audits, and direct wallet settlement decisions."
        backTo="/farmer/insurance"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Tree Insurance', path: '/farmer/insurance' },
          { label: 'Claims Tracking' },
        ]}
        actions={
          <Button
            variant="primary"
            className="flex items-center gap-1.5 bg-rose-700 hover:bg-rose-800"
            onClick={() => navigate('/farmer/insurance/raise-claim')}
          >
            <Plus className="w-4 h-4" /> Raise New Claim
          </Button>
        }
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <Card key={n} className="p-6 border border-slate-200 animate-pulse space-y-3 rounded-2xl">
              <div className="h-5 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && claims.length === 0 && (
        <Card className="p-12 text-center rounded-3xl border-dashed border-2 border-slate-300 bg-slate-50/50">
          <ShieldAlert className="w-14 h-14 text-emerald-300 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-slate-900 mb-1">Zero Active Claims</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            Your tree assets are currently in good health with zero open emergency claims.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => navigate('/farmer/insurance/catalog')}>
              View Active Policies
            </Button>
            <Button
              variant="primary"
              className="bg-emerald-700 hover:bg-emerald-800"
              onClick={() => navigate('/farmer/insurance/raise-claim')}
            >
              Report Damage
            </Button>
          </div>
        </Card>
      )}

      {/* Claims List */}
      {!isLoading && claims.length > 0 && (
        <div className="space-y-4">
          {claims.map((claim) => (
            <Card
              key={claim._id || claim.id || claim.claimNumber}
              className="p-6 transition-all hover:shadow-md border border-slate-200/90 rounded-2xl bg-white"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {claim.claimNumber}
                    </span>
                    <StatusBadge status={claim.status} />
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{claim.incidentType}</h3>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Date:{' '}
                      {new Date(claim.incidentDate).toLocaleDateString('en-GB')}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Trees className="w-3.5 h-3.5 text-emerald-600" /> {claim.affectedTreeCount} Damaged Trees
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <FileText className="w-3.5 h-3.5" /> Policy: {claim.policyNumber}
                    </span>
                  </div>
                </div>

                {/* Surveyor & Loss Info */}
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                  <div className="text-left lg:text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Estimated Loss</span>
                    <span className="text-xl font-mono font-black text-slate-900">
                      ₹{(claim.estimatedLoss || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs flex items-center gap-1.5"
                    onClick={() => setSelectedClaim(claim)}
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-700" /> Track Milestone Timeline
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Claim Detail & Milestone Timeline Modal */}
      {selectedClaim && (
        <Modal
          isOpen={Boolean(selectedClaim)}
          onClose={() => setSelectedClaim(null)}
          title={`Claim Tracking: ${selectedClaim.claimNumber}`}
        >
          <div className="space-y-6 py-2 text-xs">
            {/* Header info */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-1.5 font-bold text-slate-900">
                <span>Peril Event:</span>
                <span>{selectedClaim.incidentType}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Affected Tree Count:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {selectedClaim.affectedTreeCount} Trees
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5">
                <span className="text-slate-500">Estimated Claim:</span>
                <span className="font-mono font-bold text-slate-900">
                  ₹{(selectedClaim.estimatedLoss || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Agronomist:</span>
                <span className="font-semibold text-emerald-800">
                  {selectedClaim.inspectorName || 'Devang Joshi'}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h5 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-xs">
                Inspection & Settlement Milestones
              </h5>
              <Timeline
                steps={
                  selectedClaim.timeline || [
                    { title: 'Claim Submitted', timestamp: '18 Jul 2026', completed: true },
                    { title: 'Desk Review Completed', timestamp: '20 Jul 2026', completed: true },
                    { title: 'Field Partner Assigned', timestamp: '22 Jul 2026', completed: true },
                    { title: 'On-Site GPS Inspection', timestamp: 'Pending', completed: false },
                    { title: 'Settlement Decision', timestamp: 'Pending', completed: false },
                  ]
                }
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClaimsListPage;
