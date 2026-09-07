import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Upload,
  Calendar,
  MapPin,
  Trees,
  CheckCircle2,
  ArrowRight,
  Camera,
  FileText,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { FileUploader } from '../../../components/forms/FileUploader.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MOCK_POLICIES } from '../../../services/mockData/insuranceMock.js';

export const RaiseClaimPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const defaultPolicyId = searchParams.get('policyId') || MOCK_POLICIES[0].id;
  const [selectedPolicyId, setSelectedPolicyId] = useState(defaultPolicyId);
  const [incidentType, setIncidentType] = useState('Severe Hailstorm & Windthrow');
  const [incidentDate, setIncidentDate] = useState('2026-09-05');
  const [affectedTreeCount, setAffectedTreeCount] = useState('18');
  const [estimatedLoss, setEstimatedLoss] = useState('125000');
  const [description, setDescription] = useState(
    'High-velocity storm gusts (>80km/h) uprooted 12 mature teak trees and fractured crown branches on 6 sandalwood trees.'
  );
  const [submitted, setSubmitted] = useState(false);

  const selectedPolicy = MOCK_POLICIES.find((p) => p.id === selectedPolicyId) || MOCK_POLICIES[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Claim Submitted Successfully!</h2>
        <p className="text-gray-600 mb-6">
          Your claim reference <strong className="text-gray-900">CLM-2026-0988</strong> has been logged. An authorized
          field surveyor has been assigned for GPS drone geotagging and damage inspection.
        </p>

        <Card className="text-left bg-slate-50 border-slate-200 mb-8 p-6 space-y-3 text-sm">
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="text-gray-500">Claim ID</span>
            <span className="font-mono font-bold text-emerald-700">CLM-2026-0988</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="text-gray-500">Peril Type</span>
            <span className="font-semibold text-gray-900">{incidentType}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="text-gray-500">Affected Trees</span>
            <span className="font-semibold text-gray-900">{affectedTreeCount} Trees</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estimated Field Visit</span>
            <span className="font-semibold text-emerald-600">Within 48 Hours</span>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/farmer/insurance/claims')}
            className="flex items-center justify-center gap-2"
          >
            Go to Claims Tracker <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/farmer/insurance')}
          >
            Back to Insurance Hub
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Raise Tree Loss / Damage Claim"
        subtitle="Report storm damage, pest outbreaks, or fire incidents with geotagged photo evidence."
        backTo="/farmer/insurance"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Insurance', path: '/farmer/insurance' },
          { label: 'Raise Claim' },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" /> Incident Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormSelect
              label="Select Active Policy"
              value={selectedPolicyId}
              onChange={(e) => setSelectedPolicyId(e.target.value)}
              options={MOCK_POLICIES.map((p) => ({
                value: p.id,
                label: `${p.planName} (${p.policyNumber} • ${p.landName})`,
              }))}
            />

            <FormSelect
              label="Peril / Incident Category"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              options={[
                { value: 'Severe Hailstorm & Windthrow', label: 'Severe Hailstorm & Windthrow (>70 km/h)' },
                { value: 'Wildfire / Field Surface Fire', label: 'Wildfire / Field Surface Fire' },
                { value: 'Stem Borer & Epidemic Pest Infestation', label: 'Stem Borer & Epidemic Pest Infestation' },
                { value: 'Severe Drought & Crown Dieback', label: 'Severe Drought & Crown Dieback' },
                { value: 'Flooding & Prolonged Inundation', label: 'Flooding & Waterlogging Root Rot' },
              ]}
            />

            <FormInput
              label="Incident Date & Time"
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Damaged Tree Count"
                type="number"
                value={affectedTreeCount}
                onChange={(e) => setAffectedTreeCount(e.target.value)}
                required
              />
              <FormInput
                label="Estimated Loss (₹)"
                type="number"
                value={estimatedLoss}
                onChange={(e) => setEstimatedLoss(e.target.value)}
                required
              />
            </div>
          </div>

          <FormTextarea
            label="Detailed Incident Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the sequence of events, visible damage patterns, and farm area affected..."
            required
          />

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <label className="block text-sm font-semibold text-gray-800">
              Upload Geotagged Damage Photos & Video Evidence <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500">
              Please take clear photos showing tree base roots, fallen trunks, or foliage damage with GPS enabled.
            </p>
            <FileUploader
              label="Upload damage photos (JPG, PNG, MP4 up to 25MB)"
              accept=".jpg,.jpeg,.png,.mp4"
            />
          </div>
        </Card>

        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex items-center gap-2"
          >
            Submit Loss Claim <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
