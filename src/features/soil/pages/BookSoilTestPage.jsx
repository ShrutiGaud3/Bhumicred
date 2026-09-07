import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TestTube,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  FlaskConical,
  CreditCard,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { MOCK_LANDS } from '../../../services/mockData/landsMock.js';

const PACKAGES = [
  {
    id: 'pkg_standard',
    name: 'Standard 5-Parameter Macro Health',
    fee: 450,
    parameters: ['pH Value', 'Electrical Conductivity (EC)', 'Organic Carbon (OC)', 'Available Nitrogen (N)', 'Phosphorus (P)'],
    recommendedFor: 'Routine annual soil check before sowing.',
  },
  {
    id: 'pkg_advanced',
    name: 'Advanced 12-Parameter Micronutrient Grid',
    fee: 850,
    parameters: ['pH & EC', 'Organic Carbon', 'N-P-K Macro', 'Zinc, Iron, Manganese, Copper', 'Boron & Sulfur', 'Texture Class'],
    recommendedFor: 'Precision fertilizer optimization & agroforestry crops.',
    popular: true,
  },
  {
    id: 'pkg_carbon',
    name: 'Carbon Baseline & Biological Microbial Assay',
    fee: 1450,
    parameters: ['All 12 Micronutrients', 'Deep Core Soil Carbon (0-30cm)', 'Microbial Biomass Carbon', 'Bulk Density Assay'],
    recommendedFor: 'Carbon credit baseline accreditation projects.',
  },
];

export const BookSoilTestPage = () => {
  const navigate = useNavigate();

  const [selectedLandId, setSelectedLandId] = useState(MOCK_LANDS[0].id);
  const [selectedPackageId, setSelectedPackageId] = useState('pkg_advanced');
  const [pickupDate, setPickupDate] = useState('2026-09-15');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('09:00 AM - 12:00 PM');
  const [showCheckout, setShowCheckout] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const selectedPkg = PACKAGES.find((p) => p.id === selectedPackageId) || PACKAGES[1];

  const handleConfirm = () => {
    setBookedSuccess(true);
    setTimeout(() => {
      setShowCheckout(false);
      navigate('/farmer/soil');
    }, 1800);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Book Soil Sample Collection & Lab Test"
        subtitle="Certified field sample pickup at your farm boundary with accredited NABL lab report."
        backTo="/farmer/soil"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Soil Hub', path: '/farmer/soil' },
          { label: 'Book Test' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Parcel Selection */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" /> Select Target Land Parcel
            </h3>
            <FormSelect
              label="Land Parcel"
              value={selectedLandId}
              onChange={(e) => setSelectedLandId(e.target.value)}
              options={MOCK_LANDS.map((l) => ({
                value: l.id,
                label: `${l.landName} (${l.area} ${l.areaUnit} • Survey: ${l.surveyNumber})`,
              }))}
            />
          </Card>

          {/* Package Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-900">
              Select Testing Package
            </label>
            <div className="space-y-3">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPackageId === pkg.id
                      ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/10'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{pkg.name}</span>
                        {pkg.popular && (
                          <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{pkg.recommendedFor}</p>
                    </div>
                    <span className="text-xl font-bold text-emerald-700">₹{pkg.fee}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5">
                    {pkg.parameters.map((param, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {param}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slot Picker */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" /> Schedule Field Collector Visit
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Preferred Pickup Date"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
              />
              <FormSelect
                label="Preferred Time Window"
                value={pickupTimeSlot}
                onChange={(e) => setPickupTimeSlot(e.target.value)}
                options={[
                  { value: '09:00 AM - 12:00 PM', label: 'Morning (09:00 AM - 12:00 PM)' },
                  { value: '02:00 PM - 05:00 PM', label: 'Afternoon (02:00 PM - 05:00 PM)' },
                ]}
              />
            </div>
          </Card>
        </div>

        {/* Sticky Summary Card */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 sticky top-6 bg-white">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Booking Order Summary</h4>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Package</span>
                <span className="font-semibold text-gray-900">{selectedPkg.name}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Pickup Date</span>
                <span className="font-semibold text-gray-900">{pickupDate}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Field Sampling Fee</span>
                <span className="font-bold text-emerald-700">₹{selectedPkg.fee}</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-black">
                <span>Total Due</span>
                <span className="text-emerald-600">₹{selectedPkg.fee}</span>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full flex items-center justify-center gap-2 py-3 mt-4"
              onClick={() => setShowCheckout(true)}
            >
              Book & Pay ₹{selectedPkg.fee} <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title="Confirm Soil Testing Booking"
      >
        <div className="space-y-6 py-2">
          {bookedSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Sample Pickup Scheduled!</h4>
              <p className="text-sm text-gray-500 mt-1">
                Field collector assigned for {pickupDate} ({pickupTimeSlot}).
              </p>
            </div>
          ) : (
            <>
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Selected Package:</span>
                  <span className="font-bold text-gray-900">{selectedPkg.name}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-200">
                  <span>Payable Amount:</span>
                  <span className="text-emerald-700">₹{selectedPkg.fee}</span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full py-3"
                onClick={handleConfirm}
              >
                Confirm Booking & Deduct from Wallet (₹{selectedPkg.fee})
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
