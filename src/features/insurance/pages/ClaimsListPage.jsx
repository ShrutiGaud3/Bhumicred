import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { Timeline } from '../../../components/ui/Timeline.jsx';
import { MOCK_CLAIMS } from '../../../services/mockData/insuranceMock.js';

export const ClaimsListPage = () => {
  const navigate = useNavigate();
  const [selectedClaim, setSelectedClaim] = useState(null);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Insurance Claims Tracker"
        subtitle="Monitor field inspection status, surveyor reports, and direct claim settlements."
        backTo="/farmer/insurance"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Insurance', path: '/farmer/insurance' },
          { label: 'Claims' },
        ]}
        actions={
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => navigate('/farmer/insurance/raise-claim')}
          >
            <Plus className="w-4 h-4" /> Raise New Claim
          </Button>
        }
      />

      {MOCK_CLAIMS.length === 0 ? (
        <Card className="p-12 text-center">
          <ShieldAlert className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-gray-900">No Claims Filed</h4>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Your tree assets have zero active damage claims.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/farmer/insurance/catalog')}
          >
            View Active Policies
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {MOCK_CLAIMS.map((claim) => (
            <Card
              key={claim.id}
              className="p-6 transition-all hover:shadow-md border border-gray-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {claim.claimNumber}
                    </span>
                    <StatusBadge status={claim.status} />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">{claim.incidentType}</h3>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Date: {new Date(claim.incidentDate).toLocaleDateString('en-GB')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Trees className="w-3.5 h-3.5 text-emerald-600" /> {claim.affectedTreeCount} Damaged Trees
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Policy: {claim.policyNumber}
                    </span>
                  </div>
                </div>

                {/* Surveyor & Loss Info */}
                <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
                  <div className="text-left lg:text-right">
                    <span className="text-xs text-gray-500 block">Estimated Claim</span>
                    <span className="text-xl font-bold text-gray-900">₹{claim.estimatedLoss.toLocaleString()}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <span className="text-gray-500 block">Assigned Surveyor</span>
                    <strong className="text-gray-900 block">{claim.inspectorName} ({claim.assignedPartner})</strong>
                    <span className="text-emerald-700 font-medium block">
                      Visit: {new Date(claim.inspectionDate).toLocaleDateString('en-GB')}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setSelectedClaim(claim)}
                  >
                    View Timeline <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <Modal
          isOpen={Boolean(selectedClaim)}
          onClose={() => setSelectedClaim(null)}
          title={`Claim Tracking: ${selectedClaim.claimNumber}`}
        >
          <div className="space-y-6 py-2">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900">{selectedClaim.incidentType}</h4>
                <p className="text-xs text-gray-500">Linked Policy: {selectedClaim.policyNumber}</p>
              </div>
              <StatusBadge status={selectedClaim.status} />
            </div>

            <Timeline
              events={selectedClaim.timeline.map((step) => ({
                title: step.title,
                timestamp: step.timestamp,
                completed: step.completed,
              }))}
            />

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedClaim(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
