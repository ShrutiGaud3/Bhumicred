import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  ShieldCheck,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { useToast } from '../../../components/ui/ToastContext.jsx';
import { raiseClaim, fetchPolicies, fetchClaims } from '../insuranceSlice.js';
import { insuranceService } from '../services/insuranceService.js';
import { storageService } from '../../../services/storageService.js';

export const RaiseClaimPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const { policies: reduxPolicies, claims: reduxClaims, isLoading } = useSelector((state) => state.insurance);
  const { user } = useSelector((state) => state.auth);

  const queryPolicyParam = searchParams.get('policy') || searchParams.get('policyId') || '';
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState('');
  const [incidentType, setIncidentType] = useState('Severe Hailstorm & Windthrow');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [affectedTreeCount, setAffectedTreeCount] = useState('18');
  const [estimatedLoss, setEstimatedLoss] = useState('125000');
  const [description, setDescription] = useState(
    'High-velocity storm gusts (>80km/h) caused severe crown fracture and branch detachment on insured teak trees.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedClaim, setSubmittedClaim] = useState(null);

  useEffect(() => {
    dispatch(fetchPolicies());
    dispatch(fetchClaims());
  }, [dispatch]);

  useEffect(() => {
    // Strict user filtering for policies and claims
    const userCleanPhone = (user?.mobile || '').replace(/\D/g, '');
    
    const userPols = (reduxPolicies || []).filter((p) => {
      if (user?.role === 'SUPER_ADMIN') return true;
      const pPhone = (p.userMobile || p.ownerMobile || '').replace(/\D/g, '');
      if (userCleanPhone && pPhone && (pPhone === userCleanPhone || pPhone.endsWith(userCleanPhone) || userCleanPhone.endsWith(pPhone))) return true;
      if (user?.id && (p.userId === user.id || p.userId?._id === user.id || p.ownerId === user.id)) return true;
      if (user?._id && (p.userId === user._id || p.userId?._id === user._id || p.ownerId === user._id)) return true;
      if (user?.name && p.userName && p.userName.trim().toLowerCase() === user.name.trim().toLowerCase()) return true;
      return false;
    });

    const uniquePols = [];
    const seenPolKeys = new Set();
    userPols.forEach((p) => {
      const key = p.policyNumber || `${p.khasraNumber}-${p.surveyNumber}`;
      if (!seenPolKeys.has(key)) {
        seenPolKeys.add(key);
        uniquePols.push(p);
      }
    });

    setPolicies(uniquePols);
    setClaims(reduxClaims || []);

    if (uniquePols.length > 0) {
      const match = uniquePols.find(
        (p) => p.policyNumber === queryPolicyParam || p._id === queryPolicyParam || p.id === queryPolicyParam
      );
      const chosen = match || uniquePols[0];
      setSelectedPolicyId(chosen._id || chosen.id || chosen.policyNumber);
    }
  }, [reduxPolicies, reduxClaims, user, queryPolicyParam]);

  const selectedPolicy = policies.find((p) => (p._id || p.id || p.policyNumber) === selectedPolicyId) || policies[0];

  const existingClaimForSelected = claims.find((c) => {
    const cPolNum = c.policyNumber || c.policyId;
    const curPolNum = selectedPolicy?.policyNumber || selectedPolicy?.id || selectedPolicy?._id;
    return (
      (c.policyId && (c.policyId === selectedPolicy?._id || c.policyId === selectedPolicy?.id || c.policyId === selectedPolicy?.policyNumber)) ||
      (c.policyNumber && selectedPolicy?.policyNumber && c.policyNumber === selectedPolicy.policyNumber) ||
      (cPolNum && curPolNum && cPolNum === curPolNum)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPolicyId) {
      toast.error('Please select an active policy to raise claim.');
      return;
    }

    if (existingClaimForSelected) {
      toast.error(
        `A claim (${existingClaimForSelected.claimNumber}) has already been submitted for Policy ${selectedPolicy?.policyNumber}. Duplicate claims are not allowed.`
      );
      return;
    }

    setIsSubmitting(true);

    const payload = {
      policyId: selectedPolicy?._id || selectedPolicy?.id || selectedPolicyId,
      policyNumber: selectedPolicy?.policyNumber || 'BC-POL-2026',
      incidentType,
      incidentDate: new Date(incidentDate),
      affectedTreeCount: parseInt(affectedTreeCount, 10),
      estimatedLoss: Number(estimatedLoss),
      claimDescription: description,
    };

    try {
      const actionResult = await dispatch(raiseClaim(payload));
      if (raiseClaim.fulfilled.match(actionResult)) {
        setSubmittedClaim(actionResult.payload);
        toast.success('Insurance claim logged! Authorized surveyor assigned.');
      } else {
        toast.error(actionResult.payload || 'Failed to submit claim.');
      }
    } catch (err) {
      toast.error('Unexpected error while raising claim.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedClaim) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-md animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Claim Registered Successfully!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto">
            Your claim reference <strong className="text-slate-900 font-mono">{submittedClaim.claimNumber}</strong> has been logged. An authorized agronomist surveyor has been dispatched for GPS drone verification.
          </p>
        </div>

        <Card className="text-left bg-slate-50 border-slate-200/90 p-6 rounded-3xl space-y-3 text-xs">
          <div className="flex justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Claim Tracking ID:</span>
            <span className="font-mono font-bold text-emerald-800 text-sm">
              {submittedClaim.claimNumber}
            </span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Policy Number:</span>
            <span className="font-mono font-semibold text-slate-900">
              {submittedClaim.policyNumber}
            </span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Peril Type:</span>
            <span className="font-semibold text-slate-900">{submittedClaim.incidentType}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Affected Trees Reported:</span>
            <span className="font-semibold text-slate-900 font-mono">
              🌲 {submittedClaim.affectedTreeCount} Trees
            </span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-200">
            <span className="text-slate-500">Assigned Surveyor:</span>
            <span className="font-semibold text-emerald-800">
              {submittedClaim.inspectorName || 'Assigned Field Agronomist'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Estimated Field Audit:</span>
            <span className="font-semibold text-emerald-700">Within 48-72 Hours</span>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/farmer/insurance/claims')}
            className="bg-emerald-700 hover:bg-emerald-800 flex items-center justify-center gap-1.5"
          >
            Go to Claims Tracker <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={() => navigate('/farmer/insurance')}>
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
        subtitle="Report storm damage, pest outbreaks, or fire incidents with geotagged evidence and fast drone review."
        backTo="/farmer/insurance"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Insurance Hub', path: '/farmer/insurance' },
          { label: 'Raise Damage Claim' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Form Main */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 md:p-8 space-y-6 rounded-3xl bg-white border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" /> Incident Particulars
              </h3>

              {policies.length > 0 ? (
                <>
                  <FormSelect
                    label="Select Active Policy"
                    value={selectedPolicyId}
                    onChange={(e) => setSelectedPolicyId(e.target.value)}
                    options={policies.map((p) => {
                      const isClaimed = claims.some(
                        (c) =>
                          (c.policyNumber && c.policyNumber === p.policyNumber) ||
                          (c.policyId && (c.policyId === p._id || c.policyId === p.id || c.policyId === p.policyNumber))
                      );
                      return {
                        value: p._id || p.id || p.policyNumber,
                        label: `${p.policyNumber || 'BC-POL'} — ${p.planName || p.title || 'Agroforestry Cover'} (${p.insuredTreeCount || p.treeCount || 0} Trees)${isClaimed ? ' • [CLAIM ALREADY LODGED]' : ''}`,
                      };
                    })}
                  />

                  {existingClaimForSelected && (
                    <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs space-y-2 text-amber-900 animate-in fade-in duration-200">
                      <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        Claim Already Lodged for this Policy
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        A tree loss claim (Tracking ID: <strong className="font-mono text-slate-900">{existingClaimForSelected.claimNumber}</strong>) has already been submitted on Policy <strong className="font-mono text-slate-900">{selectedPolicy?.policyNumber}</strong>. As per parametric insurance terms, only one claim per policy lifecycle is permitted.
                      </p>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-200/80">
                        <span className="text-[11px] text-slate-600 font-medium">
                          Claim Status: <strong className="text-emerald-800 uppercase font-mono">{existingClaimForSelected.status || 'SUBMITTED'}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => navigate('/farmer/insurance/claims')}
                          className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline flex items-center gap-1 text-xs"
                        >
                          View in Claims Tracker <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800">
                  No active insurance policies found. You must have an active policy to raise a claim.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Peril / Incident Type"
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  disabled={!!existingClaimForSelected}
                  options={[
                    { value: 'Severe Hailstorm & Windthrow', label: 'Severe Hailstorm & Windthrow' },
                    { value: 'Forest & Agro Fire Peril', label: 'Forest & Agro Fire Peril' },
                    { value: 'Pest & Pathogen Infestation (Stem Borer / Root Rot)', label: 'Pest & Pathogen Outbreak' },
                    { value: 'Severe Drought / Water Stress', label: 'Severe Drought Stress' },
                    { value: 'Lightning Strike Damage', label: 'Direct Lightning Strike' },
                  ]}
                />

                <FormInput
                  label="Date of Incident"
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  disabled={!!existingClaimForSelected}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Estimated Affected Trees"
                  type="number"
                  value={affectedTreeCount}
                  onChange={(e) => setAffectedTreeCount(e.target.value)}
                  min="1"
                  max={selectedPolicy?.insuredTreeCount || selectedPolicy?.treeCount || 500}
                  disabled={!!existingClaimForSelected}
                  required
                />

                <FormInput
                  label="Estimated Loss Amount (₹)"
                  type="number"
                  value={estimatedLoss}
                  onChange={(e) => setEstimatedLoss(e.target.value)}
                  disabled={!!existingClaimForSelected}
                  required
                />
              </div>

              <FormTextarea
                label="Incident Details & Observations"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe wind speed, trunk fracture, tree damage..."
                disabled={!!existingClaimForSelected}
                rows={3}
              />

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className={`w-full sm:w-auto px-8 ${
                    existingClaimForSelected
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed border-none'
                      : 'bg-rose-700 hover:bg-rose-800'
                  }`}
                  isLoading={isSubmitting}
                  disabled={policies.length === 0 || !!existingClaimForSelected}
                >
                  {existingClaimForSelected ? (
                    'Claim Already Lodged on this Policy'
                  ) : (
                    <>
                      Submit Claim for Field Audit <ArrowRight className="w-4 h-4 ml-1.5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Info Box */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 rounded-3xl bg-slate-900 text-white shadow-xl">
            <h4 className="font-bold text-sm text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Parametric Audit Protocol
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Once registered, a certified agronomist from <strong>AgriTech Field Services</strong> conducts GPS drone photogrammetry to verify stem and crown damage.
            </p>
            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/10 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Policy:</span>
                <span className="font-mono font-bold text-white">
                  {selectedPolicy?.policyNumber || 'BC-POL-2026'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Sum Insured:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ₹{(Number(selectedPolicy?.sumInsured) || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Insured Trees:</span>
                <span className="font-semibold text-white">{selectedPolicy?.insuredTreeCount || selectedPolicy?.treeCount || 0} Trees</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RaiseClaimPage;
