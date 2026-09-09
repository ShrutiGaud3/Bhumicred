import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  User,
  MapPin,
  Camera,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Stepper } from '../../../components/ui/Stepper.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FileUploader } from '../../../components/forms/FileUploader.jsx';
import { setUserStatus } from '../../auth/authSlice.js';

export const FarmerOnboardingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    fatherName: user?.fatherName || '',
    gender: user?.gender || 'MALE',
    mobile: user?.mobile || '',
    email: user?.email || '',
    street: user?.address?.fullAddress || '',
    locality: user?.address?.gramPanchayat || user?.address?.village || '',
    taluk: user?.address?.city || user?.address?.taluk || '',
    district: user?.address?.district || '',
    state: user?.address?.state || 'Gujarat',
    pincode: user?.address?.pincode || '',
    deviceLat: user?.location?.lat || 22.5645,
    deviceLng: user?.location?.lng || 72.9281,
    locationCaptured: true,
    photoUploaded: true,
    consentAccepted: true,
  });

  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        fatherName: user.fatherName || prev.fatherName,
        gender: user.gender || prev.gender,
        mobile: user.mobile || prev.mobile,
        email: user.email || prev.email,
        locality: user.address?.gramPanchayat || user.address?.village || prev.locality,
        taluk: user.address?.city || user.address?.taluk || prev.taluk,
        district: user.address?.district || prev.district,
        state: user.address?.state || prev.state,
        pincode: user.address?.pincode || prev.pincode,
      }));
    }
  }, [user]);

  const steps = [
    { title: 'Identity' },
    { title: 'Location & Address' },
    { title: 'Photo & Consent' },
    { title: 'Review & Submit' },
  ];

  const handleCaptureLocation = () => {
    setFormData((prev) => ({
      ...prev,
      deviceLat: 22.5645,
      deviceLng: 72.9281,
      locationCaptured: true,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setUserStatus('PENDING_VERIFICATION'));
    navigate('/verification-pending');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12">
      <PageHeader
        title="Farmer Onboarding & KYC"
        subtitle="Complete your profile to unlock GIS land mapping, tree insurance quotes, and government subsidies."
        breadcrumbs={[
          { label: 'Portal', path: '/farmer/dashboard' },
          { label: 'Onboarding' },
        ]}
      />

      <Stepper steps={steps} currentStep={currentStep} className="mb-6" />

      <Card className="p-6 sm:p-8">
        {/* Step 1: Identity */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">
              Step 1: Personal Particulars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Full Name (as per Aadhaar)"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              <FormInput
                label="Father's / Husband's Name"
                required
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                label="Gender"
                required
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                options={[
                  { label: 'Male', value: 'MALE' },
                  { label: 'Female', value: 'FEMALE' },
                  { label: 'Other', value: 'OTHER' },
                ]}
              />
              <FormInput
                label="Registered Mobile Number"
                disabled
                value={formData.mobile}
                helperText="Verified via OTP"
              />
            </div>
            <FormInput
              label="Email Address (Optional)"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. farmer@example.com"
            />
            <div className="pt-4 flex justify-end">
              <Button onClick={() => setCurrentStep(2)} variant="primary" icon={ArrowRight}>
                Continue to Address
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Location & Address */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">
              Step 2: Residential Address & GPS Location
            </h3>
            <FormInput
              label="Street / House Address"
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormInput
                label="Village / Locality"
                required
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
              />
              <FormInput
                label="Taluk / Block"
                required
                value={formData.taluk}
                onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
              />
              <FormInput
                label="District"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="State"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
              <FormInput
                label="Pincode"
                required
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>

            {/* GPS Capture Card */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-emerald-900">Device GPS Geolocation</p>
                <p className="text-[11px] text-emerald-700">
                  Lat: {formData.deviceLat.toFixed(4)}, Lng: {formData.deviceLng.toFixed(4)} (Accuracy ±5m)
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={handleCaptureLocation} icon={Navigation}>
                Re-Capture GPS
              </Button>
            </div>

            <div className="pt-4 flex justify-between">
              <Button onClick={() => setCurrentStep(1)} variant="ghost" icon={ArrowLeft}>
                Back
              </Button>
              <Button onClick={() => setCurrentStep(3)} variant="primary" icon={ArrowRight}>
                Continue to Photos & Consent
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Photo & Consent */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">
              Step 3: Profile Photo & Declarations
            </h3>

            <FileUploader
              label="Upload Farmer Photo / Aadhaar KYC Proof"
              required
              helperText="Upload recent passport photo or scanned KYC (PDF/JPG)"
            />

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consentAccepted}
                  onChange={(e) => setFormData({ ...formData, consentAccepted: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="consent" className="cursor-pointer">
                  I hereby declare that all provided identity, landholding, and family details are accurate to the best of my knowledge. I consent to BHUMICRED verifying my records with state revenue databases for subsidy and insurance issuance.
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <Button onClick={() => setCurrentStep(2)} variant="ghost" icon={ArrowLeft}>
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(4)}
                disabled={!formData.consentAccepted}
                variant="primary"
                icon={ArrowRight}
              >
                Review Profile
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">
              Step 4: Final Verification Review
            </h3>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Full Name:</span>
                <span className="font-bold text-slate-900">{formData.fullName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Father's Name:</span>
                <span className="font-bold text-slate-900">{formData.fatherName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Mobile & Email:</span>
                <span className="font-bold text-slate-900">{formData.mobile} • {formData.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Address:</span>
                <span className="font-bold text-slate-900">
                  {formData.street}, {formData.locality}, {formData.district}, {formData.state} - {formData.pincode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">GPS Coordinates:</span>
                <span className="font-mono text-emerald-800 font-bold">
                  {formData.deviceLat.toFixed(4)}, {formData.deviceLng.toFixed(4)}
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <Button onClick={() => setCurrentStep(3)} variant="ghost" icon={ArrowLeft}>
                Edit Details
              </Button>
              <Button onClick={handleSubmit} variant="primary" size="lg" icon={ShieldCheck}>
                Submit Profile for Verification
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
