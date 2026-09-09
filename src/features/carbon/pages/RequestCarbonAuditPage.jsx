import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MOCK_LANDS } from '../../../services/mockData/landsMock.js';

export const RequestCarbonAuditPage = () => {
  const navigate = useNavigate();
  const [selectedLandId, setSelectedLandId] = useState(MOCK_LANDS[0]?.id || '');
  const [auditType, setAuditType] = useState('SATELLITE_LIDAR');
  const [preferredDate, setPreferredDate] = useState('2026-09-20');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Carbon Audit Scheduled!</h2>
        <p className="text-gray-600 text-sm">
          Audit reference <strong className="font-mono text-emerald-700">AUD-CRB-2026-042</strong> has been logged.
          Satellite remote sensing indices will be computed and verified by accredited carbon registries.
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Button variant="primary" onClick={() => navigate('/farmer/carbon')}>
            Back to Carbon Opportunities
          </Button>
          <Button variant="outline" onClick={() => navigate('/farmer/wallet')}>
            View Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Schedule Carbon Baseline Audit"
        subtitle="Verify tree biomass, canopy density, and soil organic carbon for credit tokenization."
        backTo="/farmer/carbon"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Carbon Hub', path: '/farmer/carbon' },
          { label: 'Request Audit' },
        ]}
      />

      <form onSubmit={handleSubmit}>
        <Card className="p-6 md:p-8 space-y-6">
          <FormSelect
            label="Select Target Land Parcel"
            value={selectedLandId}
            onChange={(e) => setSelectedLandId(e.target.value)}
            options={MOCK_LANDS.map((l) => ({
              value: l.id,
              label: `${l.landName} (Survey: ${l.surveyNumber} • ${l.treeCount} Trees)`,
            }))}
          />

          <FormSelect
            label="Carbon Audit Methodology"
            value={auditType}
            onChange={(e) => setAuditType(e.target.value)}
            options={[
              { value: 'SATELLITE_LIDAR', label: 'Remote Satellite LiDAR & Optical Vegetation Index (Free / Sponsored)' },
              { value: 'PHYSICAL_DEEP_CORE', label: 'Physical Deep Core Soil Carbon & Drone Photogrammetry (₹1,500)' },
            ]}
          />

          <FormInput
            label="Preferred Audit Start Date"
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            required
          />

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              All carbon baseline certifications conform to Verra VM0042 & Gold Standard Agroforestry Carbon Accounting frameworks.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Submit Audit Request
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};
