import React, { useState } from 'react';
import {
  TestTube,
  FlaskConical,
  Truck,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';

const SOIL_ZONES = [
  { zone: 'Mogri - Anand Central', organicCarbon: '0.82% (High)', nitrogenDeficiency: 'Medium (18%)', status: 'FERTILE', recommendedCrop: 'Cotton, Pulses' },
  { zone: 'Jitodia - Riverbed South', organicCarbon: '0.54% (Medium)', nitrogenDeficiency: 'High (34%)', status: 'REMEDY_NEEDED', recommendedCrop: 'Bajra, Green Manure' },
  { zone: 'Umreth Agroforestry Belt', organicCarbon: '0.91% (Very High)', nitrogenDeficiency: 'Low (8%)', status: 'PRIME', recommendedCrop: 'Teak, Sandalwood' },
];

export const GovernmentSoilPage = () => {
  const [showVanModal, setShowVanModal] = useState(false);
  const [vanSuccess, setVanSuccess] = useState(false);
  const [vanForm, setVanForm] = useState({
    village: 'Mogri Gram Panchayat',
    date: '2026-09-22',
    vanId: 'GUJ-SOIL-VAN-04',
  });

  const handleDispatchVan = (e) => {
    e.preventDefault();
    setVanSuccess(true);
    setTimeout(() => {
      setVanSuccess(false);
      setShowVanModal(false);
    }, 1800);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="District Soil Health Intelligence & Testing Drives"
        subtitle="Regional nutrient mapping, N-P-K deficiency analysis, and mobile soil testing laboratory dispatch."
        backTo="/government/dashboard"
        breadcrumbs={[
          { label: 'Government Portal', path: '/government/dashboard' },
          { label: 'Soil Health Drives' },
        ]}
        actions={
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => setShowVanModal(true)}
          >
            <Truck className="w-4 h-4" /> Dispatch Mobile Soil Testing Van
          </Button>
        }
      />

      {/* Grid of Zonal Health Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">District Zonal Soil Fertility Matrix</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SOIL_ZONES.map((zone, idx) => (
            <Card key={idx} className="p-6 border border-gray-200 hover:shadow-lg transition-all space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-gray-900">{zone.zone}</h4>
                <Badge variant={zone.status === 'FERTILE' || zone.status === 'PRIME' ? 'success' : 'warning'}>
                  {zone.status}
                </Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between pb-1 border-b border-gray-100">
                  <span className="text-gray-500">Organic Carbon:</span>
                  <strong className="text-gray-900">{zone.organicCarbon}</strong>
                </div>
                <div className="flex justify-between pb-1 border-b border-gray-100">
                  <span className="text-gray-500">Nitrogen Deficiency:</span>
                  <strong className={zone.status === 'REMEDY_NEEDED' ? 'text-amber-700' : 'text-emerald-700'}>
                    {zone.nitrogenDeficiency}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Recommended Advisory:</span>
                  <strong className="text-gray-900">{zone.recommendedCrop}</strong>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Mobile Van Dispatch Modal */}
      <Modal
        isOpen={showVanModal}
        onClose={() => setShowVanModal(false)}
        title="Dispatch Mobile Soil Testing Van"
      >
        <form onSubmit={handleDispatchVan} className="space-y-6 py-2">
          {vanSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Mobile Van Dispatched!</h4>
              <p className="text-sm text-gray-500 mt-1">
                Van {vanForm.vanId} assigned to {vanForm.village} on {vanForm.date}.
              </p>
            </div>
          ) : (
            <>
              <FormSelect
                label="Select Mobile Van Unit"
                value={vanForm.vanId}
                onChange={(e) => setVanForm({ ...vanForm, vanId: e.target.value })}
                options={[
                  { value: 'GUJ-SOIL-VAN-04', label: 'Gujarat Mobile Soil Lab 04 (Equipped with AAS Spectrometer)' },
                  { value: 'GUJ-SOIL-VAN-08', label: 'Gujarat Mobile Soil Lab 08 (Micro-Nutrient Assay)' },
                ]}
              />

              <FormInput
                label="Target Village Panchayat Location"
                value={vanForm.village}
                onChange={(e) => setVanForm({ ...vanForm, village: e.target.value })}
                required
              />

              <FormInput
                label="Scheduled Deployment Date"
                type="date"
                value={vanForm.date}
                onChange={(e) => setVanForm({ ...vanForm, date: e.target.value })}
                required
              />

              <Button type="submit" variant="primary" className="w-full py-3">
                Confirm & Route Mobile Van
              </Button>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};
