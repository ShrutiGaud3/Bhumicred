import React, { useState } from 'react';
import {
  ShieldAlert,
  Camera,
  CheckCircle2,
  Trees,
  Upload,
  FileText,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { FileUploader } from '../../../components/forms/FileUploader.jsx';
import { MOCK_CLAIMS } from '../../../services/mockData/insuranceMock.js';

export const InspectionsQueuePage = () => {
  const [claims, setClaims] = useState(MOCK_CLAIMS);
  const [activeDossierModal, setActiveDossierModal] = useState(null);
  const [dossierForm, setDossierForm] = useState({
    verifiedTreeDamageCount: '18',
    assessedLossAmount: '118000',
    surveyorRemarks: 'Inspected 12 uprooted mature teak trees and 6 damaged sandalwood crowns. Damage pattern is consistent with localized hailstorm gust on 18 Jul 2026.',
  });
  const [signOffSuccess, setSignOffSuccess] = useState(false);

  const handleSignOff = (e) => {
    e.preventDefault();
    setSignOffSuccess(true);
    setTimeout(() => {
      setSignOffSuccess(false);
      if (activeDossierModal) {
        setClaims(
          claims.map((c) => (c.id === activeDossierModal.id ? { ...c, status: 'INSPECTION_COMPLETED' } : c))
        );
      }
      setActiveDossierModal(null);
    }, 1800);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Insurance Loss & Damage Inspections Queue"
        subtitle="Perform tree asset damage verification, geotag evidence capture, and loss appraisal sign-offs."
        backTo="/partner/dashboard"
        breadcrumbs={[
          { label: 'Partner Portal', path: '/partner/dashboard' },
          { label: 'Inspections Queue' },
        ]}
      />

      <div className="space-y-4">
        {claims.map((claim) => (
          <Card key={claim.id} className="p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    {claim.claimNumber}
                  </span>
                  <StatusBadge status={claim.status} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{claim.incidentType}</h3>
                <p className="text-xs text-gray-500">
                  Linked Policy: <strong className="text-gray-800">{claim.policyNumber}</strong> • Claimed Trees: {claim.affectedTreeCount} Trees
                </p>
              </div>

              <div className="flex items-center gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
                <div className="text-left lg:text-right">
                  <span className="text-xs text-gray-400 block">Claimed Loss</span>
                  <span className="text-xl font-bold text-gray-900">₹{claim.estimatedLoss.toLocaleString()}</span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setActiveDossierModal(claim)}
                >
                  <Camera className="w-4 h-4" /> Submit Field Dossier
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Field Dossier Sign-off Modal */}
      {activeDossierModal && (
        <Modal
          isOpen={Boolean(activeDossierModal)}
          onClose={() => setActiveDossierModal(null)}
          title={`Inspection Appraisal Dossier: ${activeDossierModal.claimNumber}`}
        >
          <form onSubmit={handleSignOff} className="space-y-6 py-2">
            {signOffSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Dossier Signed & Transmitted!</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Sent to Super Admin & Underwriting Lead for settlement disbursement authorization.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Verified Damaged Trees"
                    type="number"
                    value={dossierForm.verifiedTreeDamageCount}
                    onChange={(e) => setDossierForm({ ...dossierForm, verifiedTreeDamageCount: e.target.value })}
                    required
                  />
                  <FormInput
                    label="Assessed Net Loss (₹)"
                    type="number"
                    value={dossierForm.assessedLossAmount}
                    onChange={(e) => setDossierForm({ ...dossierForm, assessedLossAmount: e.target.value })}
                    required
                  />
                </div>

                <FormTextarea
                  label="Field Surveyor Technical Appraisal"
                  rows={3}
                  value={dossierForm.surveyorRemarks}
                  onChange={(e) => setDossierForm({ ...dossierForm, surveyorRemarks: e.target.value })}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Upload High-Resolution Geotagged Photos
                  </label>
                  <FileUploader
                    label="Upload drone orthomosaic or geotagged photos (JPG, PNG, PDF)"
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full py-3 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Cryptographically Sign & Submit Appraisal
                </Button>
              </>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
};
