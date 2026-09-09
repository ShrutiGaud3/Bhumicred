import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../authSlice.js';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { SearchableSelect } from '../../../components/forms/SearchableSelect.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Card } from '../../../components/ui/Card.jsx';
import { Stepper } from '../../../components/ui/Stepper.jsx';
import { useToast } from '../../../components/ui/ToastContext.jsx';
import { ROLES, ROLE_LABELS } from '../../../constants/roles.js';
import {
  getCountries,
  getStates,
  getDistricts,
  getCities,
  getGramPanchayats,
} from '../../../constants/indiaGeography.js';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Camera,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Navigation,
  Sparkles,
  Building,
  UploadCloud,
  FileCheck,
  AlertCircle
} from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { isLoading } = useSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    gender: 'MALE',
    mobile: '',
    email: '',
    role: ROLES.FARMER,
    country: 'India (Bharat)',
    state: 'Gujarat',
    district: 'Anand',
    city: 'Anand',
    gramPanchayat: 'Mogri Gram Panchayat',
    pincode: '388345',
    deviceLat: 22.5645,
    deviceLng: 72.9281,
    locationCaptured: false,
    photoUploaded: false,
    photoName: '',
    consentAccepted: false,
  });

  const [errors, setErrors] = useState({});

  const steps = [
    { title: 'Identity', description: 'Personal info' },
    { title: 'Address', description: 'Hierarchy map' },
    { title: 'Location', description: 'GPS & Photo' },
    { title: 'Submit', description: 'Review details' },
  ];

  // Cascading Address Options Calculations based on selected Country
  const countryOptions = getCountries();
  const stateOptions = getStates(formData.country);
  const districtOptions = getDistricts(formData.country, formData.state);
  const cityOptions = getCities(formData.country, formData.state, formData.district);
  const gramPanchayatOptions = getGramPanchayats(formData.country, formData.state, formData.district, formData.city);

  // Dynamic Geographic Terminology based on Country
  const isIndia = formData.country.includes('India');
  const isUSA = formData.country.includes('USA') || formData.country.includes('United States');
  const isUAE = formData.country.includes('UAE') || formData.country.includes('United Arab Emirates');
  const isUK = formData.country.includes('UK') || formData.country.includes('United Kingdom');
  const isCanada = formData.country.includes('Canada');
  const isNepal = formData.country.includes('Nepal');

  const stateLabel = isUAE ? 'Emirate / State' : isCanada || isNepal ? 'Province / State' : isUK ? 'Country / Region' : 'State / Province';
  const districtLabel = isUSA ? 'County / District' : isUK ? 'County / Borough' : 'District / County';
  const cityLabel = isUSA || isCanada ? 'City / Municipality' : isNepal ? 'City / Gaunpalika' : isUAE ? 'City / Sector' : 'City / Taluka / Block';
  const localityLabel = isIndia ? 'Gram Panchayat / Locality' : isNepal ? 'Ward / Gaunpalika' : isUAE ? 'Community / Locality' : isUK ? 'Parish / Ward' : 'Locality / Ward / Precinct';

  // Cascading Handlers
  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    const states = getStates(newCountry);
    const defaultState = states[0] || '';
    const districts = getDistricts(newCountry, defaultState);
    const defaultDistrict = districts[0] || '';
    const cities = getCities(newCountry, defaultState, defaultDistrict);
    const defaultCity = cities[0] || '';
    const gps = getGramPanchayats(newCountry, defaultState, defaultDistrict, defaultCity);
    const defaultGp = gps[0] || '';

    setFormData((prev) => ({
      ...prev,
      country: newCountry,
      state: defaultState,
      district: defaultDistrict,
      city: defaultCity,
      gramPanchayat: defaultGp,
    }));
    if (errors.country) setErrors((prev) => ({ ...prev, country: null }));
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const districts = getDistricts(formData.country, newState);
    const defaultDistrict = districts[0] || '';
    const cities = getCities(formData.country, newState, defaultDistrict);
    const defaultCity = cities[0] || '';
    const gps = getGramPanchayats(formData.country, newState, defaultDistrict, defaultCity);
    const defaultGp = gps[0] || '';

    setFormData((prev) => ({
      ...prev,
      state: newState,
      district: defaultDistrict,
      city: defaultCity,
      gramPanchayat: defaultGp,
    }));
    if (errors.state) setErrors((prev) => ({ ...prev, state: null }));
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    const cities = getCities(formData.country, formData.state, newDistrict);
    const defaultCity = cities[0] || '';
    const gps = getGramPanchayats(formData.country, formData.state, newDistrict, defaultCity);
    const defaultGp = gps[0] || '';

    setFormData((prev) => ({
      ...prev,
      district: newDistrict,
      city: defaultCity,
      gramPanchayat: defaultGp,
    }));
    if (errors.district) setErrors((prev) => ({ ...prev, district: null }));
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    const gps = getGramPanchayats(formData.country, formData.state, formData.district, newCity);
    const defaultGp = gps[0] || '';

    setFormData((prev) => ({
      ...prev,
      city: newCity,
      gramPanchayat: defaultGp,
    }));
    if (errors.city) setErrors((prev) => ({ ...prev, city: null }));
  };

  const handleGramPanchayatChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      gramPanchayat: e.target.value,
    }));
    if (errors.gramPanchayat) setErrors((prev) => ({ ...prev, gramPanchayat: null }));
  };

  const handleCaptureLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            deviceLat: Number(position.coords.latitude.toFixed(5)),
            deviceLng: Number(position.coords.longitude.toFixed(5)),
            locationCaptured: true,
          }));
          toast.success('Live GPS coordinates captured!');
        },
        () => {
          setFormData((prev) => ({
            ...prev,
            deviceLat: 22.5645,
            deviceLng: 72.9281,
            locationCaptured: true,
          }));
          toast.info('GPS calibrated for region (22.5645° N, 72.9281° E)');
        }
      );
    } else {
      setFormData((prev) => ({
        ...prev,
        deviceLat: 22.5645,
        deviceLng: 72.9281,
        locationCaptured: true,
      }));
      toast.info('GPS calibrated for demo coordinates (22.5645° N, 72.9281° E)');
    }
  };

  const handleMockUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photoUploaded: true,
        photoName: file.name,
      }));
      toast.success(`Attached: ${file.name}`);
    } else {
      setFormData((prev) => ({
        ...prev,
        photoUploaded: true,
        photoName: 'citizen_aadhaar_profile.jpg',
      }));
      toast.success('Sample profile photo attached');
    }
  };

  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
      if (!formData.fatherName.trim()) errs.fatherName = "Father's or Husband's name is required";
      const cleanMobile = formData.mobile.replace(/\D/g, '');
      if (!cleanMobile || cleanMobile.length < 8) errs.mobile = 'Valid contact/mobile number is required';
    } else if (step === 2) {
      if (!formData.country.trim()) errs.country = 'Country is required';
      if (!formData.state.trim()) errs.state = `${stateLabel} is required`;
      if (!formData.district.trim()) errs.district = `${districtLabel} is required`;
      if (!formData.city.trim()) errs.city = `${cityLabel} is required`;
      if (!formData.gramPanchayat.trim()) errs.gramPanchayat = `${localityLabel} is required`;
      if (!formData.pincode || formData.pincode.length < 3) errs.pincode = 'Valid Postal / Zip Code is required';
    } else if (step === 3) {
      if (!formData.consentAccepted) errs.consentAccepted = 'Please accept the terms & consent before submitting';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) {
      setCurrentStep(3);
      return;
    }

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      toast.success('Registration submitted! Your application is now under review by Admin.');
      navigate('/verification-pending');
    } else {
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const handleAutoFillDemo = () => {
    setFormData({
      fullName: 'Ramesh Patel',
      fatherName: 'Dahybhai Patel',
      gender: 'MALE',
      mobile: '9876543210',
      email: 'ramesh.patel@bhumicred.in',
      role: ROLES.FARMER,
      country: 'India (Bharat)',
      state: 'Gujarat',
      district: 'Anand',
      city: 'Anand',
      gramPanchayat: 'Mogri Gram Panchayat',
      pincode: '388345',
      deviceLat: 22.5645,
      deviceLng: 72.9281,
      locationCaptured: true,
      photoUploaded: true,
      photoName: 'ramesh_patel_kyc_photo.jpg',
      consentAccepted: true,
    });
    setErrors({});
    toast.info('Prefilled sample farmer application details!');
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6 text-left animate-in fade-in duration-200">
      {/* Header */}
      <div className="text-center px-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] sm:text-xs font-bold border border-emerald-200 mb-1.5 sm:mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Section 3.3 • Citizen Registration</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          BHUMICRED Registration Form
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
          Create your verified sovereign profile for GIS land mapping, tree insurance & smart agricultural services.
        </p>
      </div>

      {/* Stepper with full responsive adjustments */}
      <div className="px-1">
        <Stepper steps={steps} currentStep={currentStep} className="my-1 sm:my-3" />
      </div>

      {/* Form Content Area */}
      <div className="space-y-4">
        {/* Step 1: Personal & Contact Information */}
        {currentStep === 1 && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600 shrink-0" />
                Step 1: Personal Particulars & Contact
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ensure details match your official identity documents (Aadhaar / National ID / Passport).
              </p>
            </div>

            <div className="space-y-3">
              <FormInput
                label="Full Name (as per ID)"
                required
                placeholder="e.g. Ramesh Dahybhai Patel / John Smith"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: null });
                }}
                error={errors.fullName}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput
                  label="Father's / Husband's Name"
                  required
                  placeholder="e.g. Dahybhai Patel"
                  value={formData.fatherName}
                  onChange={(e) => {
                    setFormData({ ...formData, fatherName: e.target.value });
                    if (errors.fatherName) setErrors({ ...errors, fatherName: null });
                  }}
                  error={errors.fatherName}
                />

                <FormSelect
                  label="Gender"
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  options={[
                    { value: 'MALE', label: 'Male' },
                    { value: 'FEMALE', label: 'Female' },
                    { value: 'OTHER', label: 'Other / Non-binary' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput
                  label="Mobile Number"
                  type="tel"
                  required
                  icon={Phone}
                  placeholder="e.g. 9876543210"
                  value={formData.mobile}
                  onChange={(e) => {
                    setFormData({ ...formData, mobile: e.target.value });
                    if (errors.mobile) setErrors({ ...errors, mobile: null });
                  }}
                  error={errors.mobile}
                  helperText="Primary contact number for authentication"
                />

                <FormInput
                  label="Email Address (Optional)"
                  type="email"
                  icon={Mail}
                  placeholder="e.g. citizen@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  helperText="For digital certificates & policy notices"
                />
              </div>

              <FormSelect
                label="Registering As Portal Role"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                options={[
                  { value: ROLES.FARMER, label: 'Farmer / Land Owner' },
                  { value: ROLES.PARTNER, label: 'Enterprise Partner (Surveyor / Lab)' },
                  { value: ROLES.GOVERNMENT, label: 'Government Nodal Authority' },
                ]}
              />
            </div>
          </div>
        )}

        {/* Step 2: Address & Geographic Hierarchy (Fully Multi-Country Searchable Comboboxes) */}
        {currentStep === 2 && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                Step 2: Geographic Hierarchy & Sovereign Location
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Select Country → {stateLabel} → {districtLabel} → {cityLabel} → {localityLabel} with live search & cascading options.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SearchableSelect
                  label="Country"
                  required
                  value={formData.country}
                  onChange={handleCountryChange}
                  options={countryOptions}
                  searchPlaceholder="Type to search Country (e.g. India, USA, UAE, UK, Canada, Nepal)..."
                  allowCustom={true}
                  error={errors.country}
                />

                <SearchableSelect
                  label={stateLabel}
                  required
                  value={formData.state}
                  onChange={handleStateChange}
                  options={stateOptions}
                  searchPlaceholder={`Type to search ${stateLabel} in ${formData.country}...`}
                  error={errors.state}
                  allowCustom={true}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SearchableSelect
                  label={districtLabel}
                  required
                  value={formData.district}
                  onChange={handleDistrictChange}
                  options={districtOptions}
                  searchPlaceholder={`Search ${districtLabel} in ${formData.state}...`}
                  error={errors.district}
                  allowCustom={true}
                />

                <SearchableSelect
                  label={cityLabel}
                  required
                  value={formData.city}
                  onChange={handleCityChange}
                  options={cityOptions}
                  searchPlaceholder={`Search or type ${cityLabel} in ${formData.district}...`}
                  error={errors.city}
                  allowCustom={true}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SearchableSelect
                  label={localityLabel}
                  required
                  value={formData.gramPanchayat}
                  onChange={handleGramPanchayatChange}
                  options={gramPanchayatOptions}
                  searchPlaceholder={`Search or type ${localityLabel} in ${formData.city}...`}
                  error={errors.gramPanchayat}
                  allowCustom={true}
                />

                <FormInput
                  label="Pincode / Postal Zip Code"
                  required
                  placeholder="e.g. 388345 / 90210 / SW1A 1AA"
                  value={formData.pincode}
                  onChange={(e) => {
                    setFormData({ ...formData, pincode: e.target.value });
                    if (errors.pincode) setErrors({ ...errors, pincode: null });
                  }}
                  error={errors.pincode}
                />
              </div>

              {/* Hierarchy summary pill */}
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
                <Building className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="font-bold">Hierarchy Chain: </span>
                  <p className="font-medium text-[11px] sm:text-xs text-slate-800 break-words mt-0.5">
                    {formData.country} → {formData.state} → {formData.district} → {formData.city} → {formData.gramPanchayat} ({formData.pincode})
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location, Photo & Legal Consent */}
        {currentStep === 3 && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600 shrink-0" />
                Step 3: Device Location, Photo & Consent
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Geotag device coordinates and accept data verification terms.
              </p>
            </div>

            {/* GPS Geotag Capture */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                    Device GPS Coordinates
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Used to pinpoint agricultural parcel zone & Mandi pricing radar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCaptureLocation}
                  className="w-full sm:w-auto px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all shadow-sm"
                >
                  <Navigation className="w-3 h-3" />
                  {formData.locationCaptured ? 'Recalibrate GPS' : 'Capture GPS'}
                </button>
              </div>

              {formData.locationCaptured && (
                <div className="flex items-center gap-2 p-2 bg-emerald-100/60 rounded-xl text-xs font-mono text-emerald-900 border border-emerald-200 break-all">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Lat: {formData.deviceLat}° N, Lng: {formData.deviceLng}° E</span>
                </div>
              )}
            </div>

            {/* Profile Photo / Document Attachment */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <div>
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-teal-600" />
                  Profile Photo / National Identity Document (Optional)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Upload identity card copy or portrait photo for expedited review.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <label className="cursor-pointer px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 flex items-center justify-center gap-1.5 shadow-sm transition-all">
                  <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleMockUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => handleMockUpload({})}
                  className="text-xs text-emerald-700 hover:underline font-medium text-center sm:text-left"
                >
                  Attach Sample Photo
                </button>
              </div>

              {formData.photoUploaded && (
                <div className="flex items-center gap-2 p-2 bg-teal-50 rounded-xl text-xs text-teal-900 border border-teal-200 break-all">
                  <FileCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-medium truncate">{formData.photoName || 'citizen_profile_pic.jpg'}</span>
                </div>
              )}
            </div>

            {/* Legal Consent */}
            <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentAccepted}
                  onChange={(e) => {
                    setFormData({ ...formData, consentAccepted: e.target.checked });
                    if (errors.consentAccepted) setErrors({ ...errors, consentAccepted: null });
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 shrink-0"
                />
                <span className="text-[11px] sm:text-xs text-slate-700 leading-relaxed">
                  I hereby declare that the particulars furnished above are true. I consent to BHUMICRED storing and verifying my records with relevant land registries in accordance with the{' '}
                  <Link to="/terms" className="text-emerald-700 font-bold hover:underline" target="_blank">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-emerald-700 font-bold hover:underline" target="_blank">
                    Privacy Policy
                  </Link>.
                </span>
              </label>
              {errors.consentAccepted && (
                <p className="text-xs text-rose-600 flex items-center gap-1 pt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.consentAccepted}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                Step 4: Review Application Particulars
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Review your profile information before dispatching to the Administrative Review Desk.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pb-2.5 border-b border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Applicant Full Name:</span>
                  <span className="font-bold text-slate-900 break-words">{formData.fullName}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Father's / Husband's Name:</span>
                  <span className="font-semibold text-slate-900 break-words">{formData.fatherName}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Gender:</span>
                  <span className="font-semibold text-slate-900">{formData.gender}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Mobile Number:</span>
                  <span className="font-mono font-bold text-slate-900">{formData.mobile}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Email Address:</span>
                  <span className="text-slate-900 break-words">{formData.email || 'Not provided'}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Selected Role:</span>
                  <span className="font-bold text-emerald-800">{ROLE_LABELS[formData.role] || formData.role}</span>
                </div>
              </div>

              <div className="space-y-1 pb-2.5 border-b border-slate-200">
                <span className="text-slate-500 block text-[11px]">Registered Sovereign Hierarchy:</span>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-800 font-medium text-[11px] sm:text-xs break-words">
                  {formData.country} → {formData.state} → {formData.district} → {formData.city} → {formData.gramPanchayat} ({formData.pincode})
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <span className="text-slate-500 block text-[11px]">GPS Geotag:</span>
                  <span className="font-mono text-emerald-700 text-[11px] sm:text-xs break-all">
                    {formData.locationCaptured ? `${formData.deviceLat}° N, ${formData.deviceLng}° E` : 'Calibrated on Submit'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Initial Status:</span>
                  <span className="inline-block font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                    PENDING ADMIN APPROVAL
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] sm:text-xs text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Upon clicking Submit, your application will be dispatched to the <strong>Super Admin Approvals Queue</strong>. The full portal dashboard will unlock immediately upon Admin verification.
              </span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleBack}
              icon={ArrowLeft}
              className="w-full sm:w-auto"
            >
              Back
            </Button>
          ) : (
            <Link to="/login" className="text-xs text-slate-500 hover:text-emerald-700 font-semibold text-center sm:text-left py-1">
              Already have an account? Sign In
            </Link>
          )}

          {currentStep < 4 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
              icon={ArrowRight}
              className="w-full sm:w-auto"
            >
              Continue to Step {currentStep + 1}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleSubmit}
              isLoading={isLoading}
              icon={CheckCircle2}
              className="bg-emerald-700 hover:bg-emerald-800 w-full sm:w-auto"
            >
              Submit Application
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
