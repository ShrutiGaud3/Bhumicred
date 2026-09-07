import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Trees,
  Droplets,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { Stepper } from '../../../components/ui/Stepper.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { FileUploader } from '../../../components/forms/FileUploader.jsx';
import { InteractiveGisMap } from '../../../components/ui/InteractiveGisMap.jsx';
import { storageService } from '../../../services/storageService.js';
import { useToast } from '../../../components/ui/ToastContext.jsx';

const STEPS = [
  { title: 'Land Details', description: 'Survey & ownership' },
  { title: 'Agronomy & GIS', description: 'Crops & polygon' },
  { title: 'Documents', description: '7/12 & NOC' },
  { title: 'Insurance Choice', description: 'Tree protection' },
  { title: 'Review & Submit', description: 'Confirm application' },
];

export const AddLandPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    landName: '',
    surveyNumber: '',
    khasraNumber: '',
    landType: 'Agricultural (Irrigated)',
    ownershipType: 'Individual Owner',
    area: '',
    areaUnit: 'Acres',
    address: '',
    district: 'Anand',
    state: 'Gujarat',
    pincode: '388345',
    soilType: 'Alluvial Loam',
    irrigationSource: 'Borewell & Drip Irrigation',
    primaryCrops: 'Cotton, Groundnut, Castor',
    treeCount: '45',
    treeSpecies: 'Mango, Teakwood, Neem',
    polygonCoords: [
      [72.9281, 22.5645],
      [72.9312, 22.5648],
      [72.9308, 22.5612],
      [72.9278, 22.561],
      [72.9281, 22.5645],
    ],
    documents: [],
    optInsurance: true,
    insurancePlan: 'Comprehensive Teak & Sandalwood Cover',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toast = useToast();

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      // Persist to storage service & sync cross-role approval
      storageService.saveLand({
        landName: formData.landName || 'New Agricultural Plot',
        surveyNumber: formData.surveyNumber || '108/A',
        khasraNumber: formData.khasraNumber || '412/9',
        areaAcres: Number(formData.area) || 6.4,
        landType: formData.landType,
        soilType: formData.soilType,
        irrigationSource: formData.irrigationSource,
        address: formData.address || 'Anand, Gujarat',
        treeCount: Number(formData.treeCount) || 45,
        status: 'PENDING_VERIFICATION'
      });
      toast.success('Land title application submitted & dispatched to Super Admin approval queue!');
      setSubmitted(true);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Land Application Submitted!</h2>
        <p className="text-gray-600 mb-6">
          Your application for <strong className="text-gray-900">{formData.landName || 'New Parcel'}</strong> (Survey No:{' '}
          {formData.surveyNumber || '402/A'}) has been submitted for GIS and Revenue Officer verification.
        </p>

        <Card className="text-left bg-slate-50 border-slate-200 mb-8 p-6 space-y-3 text-sm">
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="text-gray-500">Application Reference</span>
            <span className="font-mono font-bold text-emerald-700">BC-LND-2026-9810</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="text-gray-500">Total Registered Area</span>
            <span className="font-semibold text-gray-900">{formData.area || '4.8'} {formData.areaUnit}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-gray-200">
            <span className="text-gray-500">Tree Count Geotagged</span>
            <span className="font-semibold text-gray-900">{formData.treeCount} Trees</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estimated Desk Verification</span>
            <span className="font-semibold text-gray-900">2-3 Business Days</span>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/farmer/lands')}
            className="flex items-center justify-center gap-2"
          >
            Go to My Lands <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/farmer/application-status/BC-LND-2026-9810')}
          >
            Track Status Timeline
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Register New Land Parcel"
        subtitle="Submit revenue survey details, draw satellite GIS boundaries, and catalog tree assets."
        backTo="/farmer/lands"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'My Lands', path: '/farmer/lands' },
          { label: 'Register Land' },
        ]}
      />

      {/* Wizard Stepper */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <Stepper steps={STEPS} currentStep={activeStep} />
      </div>

      {/* Step Content */}
      <Card className="p-6 md:p-8">
        {activeStep === 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Land Identity & Location</h3>
                <p className="text-xs text-gray-500">Enter official revenue records details matching your 7/12 extract.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Farm / Parcel Title Name"
                name="landName"
                placeholder="e.g. Shree Ram Farm (North Plot)"
                value={formData.landName}
                onChange={handleChange}
                required
              />
              <FormSelect
                label="Land Classification"
                name="landType"
                value={formData.landType}
                onChange={handleChange}
                options={[
                  { value: 'Agricultural (Irrigated)', label: 'Agricultural (Irrigated)' },
                  { value: 'Agricultural (Semi-Arid)', label: 'Agricultural (Semi-Arid)' },
                  { value: 'Agroforestry / Plantation', label: 'Agroforestry / Plantation' },
                  { value: 'Barren / Wasteland Recovery', label: 'Barren / Wasteland Recovery' },
                ]}
              />
              <FormInput
                label="Revenue Survey Number"
                name="surveyNumber"
                placeholder="e.g. 402/A"
                value={formData.surveyNumber}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Khasra / Khata Number"
                name="khasraNumber"
                placeholder="e.g. 118/2"
                value={formData.khasraNumber}
                onChange={handleChange}
                required
              />
              <FormSelect
                label="Ownership Title"
                name="ownershipType"
                value={formData.ownershipType}
                onChange={handleChange}
                options={[
                  { value: 'Individual Owner', label: 'Individual Owner (Sole Title)' },
                  { value: 'Ancestral Joint', label: 'Ancestral Joint Family' },
                  { value: 'Long-term Leaseholder', label: 'Long-term Leaseholder (> 5 yrs)' },
                  { value: 'FPO / Community Plot', label: 'FPO / Community Plot' },
                ]}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Area Size"
                  name="area"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 4.8"
                  value={formData.area}
                  onChange={handleChange}
                  required
                />
                <FormSelect
                  label="Unit"
                  name="areaUnit"
                  value={formData.areaUnit}
                  onChange={handleChange}
                  options={[
                    { value: 'Acres', label: 'Acres' },
                    { value: 'Hectares', label: 'Hectares' },
                    { value: 'Bigha', label: 'Bigha' },
                    { value: 'Guntha', label: 'Guntha' },
                  ]}
                />
              </div>
            </div>

            <FormTextarea
              label="Full Postal Address & Landmark"
              name="address"
              rows={2}
              placeholder="e.g. Survey 402/A, Village Mogri, Anand District, Gujarat - 388345"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        )}

        {activeStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Agronomy Profile & GIS Boundary</h3>
                <p className="text-xs text-gray-500">
                  Select your soil attributes, crops, and draw your satellite boundary polygon.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                label="Soil Classification"
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                options={[
                  { value: 'Alluvial Loam', label: 'Alluvial Loam (High Silt)' },
                  { value: 'Black Cotton Loam', label: 'Black Cotton Soil (Regur)' },
                  { value: 'Red & Yellow Sandy', label: 'Red & Yellow Sandy Loam' },
                  { value: 'Laterite Soil', label: 'Laterite Soil' },
                  { value: 'Clay Loam', label: 'Heavy Clay Loam' },
                ]}
              />
              <FormSelect
                label="Primary Irrigation Facility"
                name="irrigationSource"
                value={formData.irrigationSource}
                onChange={handleChange}
                options={[
                  { value: 'Borewell & Drip Irrigation', label: 'Borewell & Precision Drip' },
                  { value: 'Canal & Sprinkler', label: 'Government Canal & Sprinkler' },
                  { value: 'Rainfed / Solar Pump', label: 'Rainfed with Solar Storage' },
                  { value: 'Open Well / River Lift', label: 'Open Well / River Lift' },
                ]}
              />
              <FormInput
                label="Primary Standing Crops / Seasonal Rotation"
                name="primaryCrops"
                placeholder="e.g. Cotton, Groundnut, Wheat"
                value={formData.primaryCrops}
                onChange={handleChange}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Standing Tree Count"
                  name="treeCount"
                  type="number"
                  placeholder="e.g. 65"
                  value={formData.treeCount}
                  onChange={handleChange}
                />
                <FormInput
                  label="Tree Species"
                  name="treeSpecies"
                  placeholder="e.g. Teak, Sandalwood"
                  value={formData.treeSpecies}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* GIS Satellite Mapping Widget */}
            <div className="pt-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Interactive GIS Polygon Boundary Demarcation (Satellite & Cadastral Layer)
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Click anywhere on the satellite canvas below to plot or refine your boundary vertices.
              </p>
              <InteractiveGisMap
                landName={formData.landName || 'New Land Demarcation'}
                initialPoints={[
                  { x: 30, y: 35, lat: 22.5645, lng: 72.9288 },
                  { x: 75, y: 25, lat: 22.5658, lng: 72.9312 },
                  { x: 85, y: 70, lat: 22.5632, lng: 72.9325 },
                  { x: 25, y: 80, lat: 22.5621, lng: 72.9295 }
                ]}
                onPointsChange={(pts) => {
                  setFormData((prev) => ({
                    ...prev,
                    polygonCoords: pts.map((p) => [p.lng, p.lat])
                  }));
                }}
              />
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Land Title Documents</h3>
                <p className="text-xs text-gray-500">
                  Upload official verification papers (PDF, JPEG or PNG, max 10MB each).
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  1. Revenue Record (7/12 & 8-A Extract or RoR) <span className="text-red-500">*</span>
                </label>
                <FileUploader
                  label="Upload latest 7/12 land extract signed/digitally authenticated"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  2. Cadastral / Village Map Sketch (Naksha) <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <FileUploader
                  label="Upload village cadastral survey map showing plot borders"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  3. Co-Owner Consent / Lease Agreement <span className="text-gray-400 font-normal">(If applicable)</span>
                </label>
                <FileUploader
                  label="Upload signed NOC if land is jointly held"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Tree Asset & Agroforestry Protection</h3>
                <p className="text-xs text-gray-500">
                  Bundle climate and fire insurance directly with this land registration.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="optInsurance"
                  checked={formData.optInsurance}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                />
                <div>
                  <span className="font-bold text-gray-900">
                    Apply for Tree Insurance Policy Coverage on {formData.treeCount || 45} Trees
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    Protect timber, fruit orchards, and sandalwood from storms, pest epidemics, frost, and wildfire perils.
                  </p>
                </div>
              </label>

              {formData.optInsurance && (
                <div className="pt-4 border-t border-emerald-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-emerald-200">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Selected Plan</span>
                    <h4 className="font-bold text-gray-900 mt-1">Comprehensive Teak & Sandalwood Cover</h4>
                    <p className="text-xs text-gray-500 mt-1">Sum Insured: ₹14,50,000 | Est. Premium: ₹18,200/yr</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-emerald-200 flex flex-col justify-center">
                    <span className="text-xs text-gray-500">Direct Subsidy Benefit</span>
                    <span className="text-sm font-bold text-emerald-600">Up to 40% State Agroforestry Rebate Applicable</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Review Application Summary</h3>
                <p className="text-xs text-gray-500">Verify your information before final submission for verification.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-gray-900 pb-2 border-b border-slate-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Land Identification
                </h4>
                <div className="flex justify-between">
                  <span className="text-gray-500">Parcel Name:</span>
                  <span className="font-semibold text-gray-900">{formData.landName || 'Shree Ram Farm'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Survey / Khasra:</span>
                  <span className="font-semibold text-gray-900">{formData.surveyNumber || '402/A'} / {formData.khasraNumber || '118/2'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Classification:</span>
                  <span className="font-semibold text-gray-900">{formData.landType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Area:</span>
                  <span className="font-semibold text-gray-900">{formData.area || '4.8'} {formData.areaUnit}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2.5">
                <h4 className="font-bold text-gray-900 pb-2 border-b border-slate-200 flex items-center gap-2">
                  <Trees className="w-4 h-4 text-emerald-600" /> Agronomy & Assets
                </h4>
                <div className="flex justify-between">
                  <span className="text-gray-500">Soil Type:</span>
                  <span className="font-semibold text-gray-900">{formData.soilType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Irrigation:</span>
                  <span className="font-semibold text-gray-900">{formData.irrigationSource}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tree Count:</span>
                  <span className="font-semibold text-gray-900">{formData.treeCount || 45} Trees</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Insurance Opt-In:</span>
                  <span className="font-semibold text-emerald-600">{formData.optInsurance ? 'Yes (Included)' : 'No'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-800">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                By clicking Submit, you certify that the uploaded revenue documents are genuine and authorize BHUMICRED Field Officers to conduct remote GIS satellite indexing and scheduled physical inspections.
              </span>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={activeStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            {activeStep === STEPS.length - 1 ? (
              <>
                <Sparkles className="w-4 h-4" /> Submit Application
              </>
            ) : (
              <>
                Continue <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};
