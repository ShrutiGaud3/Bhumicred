import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  TestTube,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  FlaskConical,
  CreditCard,
  Layers,
  Award,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { useToast } from '../../../components/ui/ToastContext.jsx';
import { bookSoilTest } from '../soilSlice.js';
import { landService } from '../../land/services/landService.js';

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
  const dispatch = useDispatch();
  const toast = useToast();

  const [lands, setLands] = useState([]);
  const [selectedLandId, setSelectedLandId] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState(null); // Optional package (null = Free basic)
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [pickupTimeSlot, setPickupTimeSlot] = useState('09:00 AM - 12:00 PM');
  const [showCheckout, setShowCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState(null);

  useEffect(() => {
    const loadLands = async () => {
      try {
        const res = await landService.getMyLands();
        if (res.data && res.data.length > 0) {
          setLands(res.data);
          setSelectedLandId(res.data[0]._id || res.data[0].id);
        }
      } catch (e) {
        console.error('Failed to load lands:', e);
      }
    };
    loadLands();
  }, []);

  const selectedPkg = PACKAGES.find((p) => p.id === selectedPackageId) || null;
  const currentFee = selectedPkg ? selectedPkg.fee : 0;
  const selectedLand = lands.find((l) => (l._id || l.id) === selectedLandId);

  const handleConfirm = async () => {
    if (!selectedLandId) {
      toast.error('Please select a registered land parcel.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      landId: selectedLandId,
      packageId: selectedPackageId || 'pkg_free',
      pickupDate,
      pickupTimeSlot,
    };

    try {
      const actionResult = await dispatch(bookSoilTest(payload));
      if (bookSoilTest.fulfilled.match(actionResult)) {
        setBookedSuccess(true);
        const reqData = actionResult.payload;
        const newId = reqData?._id || reqData?.id;
        setCreatedRequestId(newId);
        toast.success('Soil sample collection scheduled & Soil Card issued!');
        setTimeout(() => {
          setShowCheckout(false);
          if (newId) {
            navigate(`/farmer/soil/report/${newId}`);
          } else {
            navigate('/farmer/soil');
          }
        }, 1600);
      } else {
        toast.error(actionResult.payload || 'Booking failed. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err) {
      toast.error('An error occurred during booking.');
      setIsSubmitting(false);
    }
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
            {lands.length > 0 ? (
              <FormSelect
                label="Land Parcel"
                value={selectedLandId}
                onChange={(e) => setSelectedLandId(e.target.value)}
                options={lands.map((l) => ({
                  value: l._id || l.id,
                  label: `${l.landName} (${l.area || l.areaAcres || '2.5'} ${l.areaUnit || 'Acres'} • Survey: ${l.surveyNumber || 'N/A'})`,
                }))}
              />
            ) : (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                <span>No registered lands found. Register your land parcel first.</span>
                <Button size="sm" variant="primary" onClick={() => navigate('/farmer/lands/add')}>
                  Register Land
                </Button>
              </div>
            )}
          </Card>

          {/* Package Selection (Optional) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center gap-2">
                <label className="block text-sm font-bold text-gray-900">
                  Select Testing Package
                </label>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  Optional
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {selectedPackageId ? (
                  <button
                    type="button"
                    onClick={() => setSelectedPackageId(null)}
                    className="text-emerald-700 hover:text-emerald-800 font-bold underline"
                  >
                    Clear selection (Book Free Basic Test)
                  </button>
                ) : (
                  'Bina package select kiye bhi free testing book ho sakti hai'
                )}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Aap premium lab package choose kar sakte hain ya bina select kiye standard basic soil test (Free) book kar sakte hain.
            </p>

            <div className="space-y-3">
              {/* Option 0: Basic Free Soil Test Option */}
              <div
                onClick={() => setSelectedPackageId(null)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPackageId === null
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/10 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPackageId === null ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                    }`}>
                      {selectedPackageId === null && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">
                          Standard Basic Soil Collection (Government Covered / Free)
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                          Free Scheme
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Free soil health sample collection covered under Soil Health Card & Krishi Sinchayee Scheme.
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-emerald-700">₹0 (Free)</span>
                </div>
              </div>

              {/* Paid Premium Packages */}
              {PACKAGES.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(isSelected ? null : pkg.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/10 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                          isSelected ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
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
                      </div>
                      <span className="text-xl font-bold text-emerald-700">₹{pkg.fee}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-1.5 ml-8">
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
                );
              })}
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
          <Card className="p-6 space-y-4 sticky top-6 bg-white shadow-sm border border-slate-200">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Booking Order Summary</h4>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Target Parcel</span>
                <span className="font-semibold text-gray-900 text-right max-w-[170px] truncate">
                  {selectedLand?.landName || 'Registered Parcel'}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Package</span>
                <span className="font-semibold text-gray-900 text-right max-w-[170px] truncate">
                  {selectedPkg ? selectedPkg.name : 'Standard Free Soil Sampling'}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Pickup Date</span>
                <span className="font-semibold text-gray-900">{pickupDate}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Field Sampling Fee</span>
                <span className="font-bold text-emerald-700">
                  {currentFee > 0 ? `₹${currentFee}` : '₹0 (Free Scheme)'}
                </span>
              </div>
              <div className="flex justify-between pt-2 text-base font-black">
                <span>Total Due</span>
                <span className="text-emerald-600">
                  {currentFee > 0 ? `₹${currentFee}` : '₹0.00 (Free)'}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full flex items-center justify-center gap-2 py-3 mt-4 text-xs font-bold"
              onClick={() => setShowCheckout(true)}
              disabled={lands.length === 0}
            >
              {currentFee > 0 ? (
                <>Book & Pay ₹{currentFee} <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Confirm Free Sample Booking (₹0) <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckout}
        onClose={() => {
          if (!isSubmitting) setShowCheckout(false);
        }}
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
              <p className="text-xs text-emerald-700 font-semibold mt-2">
                Certified Soil Health Card registered into Document Vault.
              </p>
            </div>
          ) : (
            <>
              <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Selected Parcel:</span>
                  <span className="font-bold text-gray-900">{selectedLand?.landName || 'Registered Parcel'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Selected Package:</span>
                  <span className="font-bold text-gray-900">
                    {selectedPkg ? selectedPkg.name : 'Standard Basic Soil Collection (Government Covered / Free)'}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-200">
                  <span>Payable Amount:</span>
                  <span className="text-emerald-700">
                    {currentFee > 0 ? `₹${currentFee}` : '₹0.00 (Free Scheme)'}
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full py-3 text-xs font-bold"
                onClick={handleConfirm}
                isLoading={isSubmitting}
              >
                {currentFee > 0 ? (
                  `Confirm Booking & Deduct from Wallet (₹${currentFee})`
                ) : (
                  'Confirm & Schedule Free Soil Sample Pickup (₹0)'
                )}
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BookSoilTestPage;
