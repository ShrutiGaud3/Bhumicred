import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShieldCheck,
  Trees,
  CheckCircle2,
  MapPin,
  Calendar,
  CreditCard,
  ArrowRight,
  AlertCircle,
  FileCheck,
  Check,
  Award,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { useToast } from '../../../components/ui/ToastContext.jsx';
import { applyPolicy } from '../insuranceSlice.js';
import { landService } from '../../land/services/landService.js';

export const InsuranceApplyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const preselectedTrees = Number(searchParams.get('trees')) || 150;
  const preselectedSpecies = searchParams.get('species') || 'TEAK';

  const [lands, setLands] = useState([]);
  const [selectedLandId, setSelectedLandId] = useState('');
  const [planType, setPlanType] = useState('Comprehensive Agroforestry Cover');
  const [treeCount, setTreeCount] = useState(preselectedTrees);
  const [speciesDistribution, setSpeciesDistribution] = useState('100 Indian Teak (Sagwan), 50 Red Sandalwood');
  const [durationYears, setDurationYears] = useState('3');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const loadLands = async () => {
      try {
        const res = await landService.getMyLands();
        if (res.data && res.data.length > 0) {
          setLands(res.data);
          setSelectedLandId(res.data[0]._id || res.data[0].id);
        }
      } catch (e) {
        // Fallback
      }
    };
    loadLands();
  }, []);

  // Financial calculations
  const ratePerTree = 75;
  const sumInsured = treeCount * 11200; // ₹11.2k per tree asset valuation
  const grossPremium = Math.round(treeCount * ratePerTree * Number(durationYears) * 0.9);
  const subsidyPercent = 40;
  const subsidyRebate = Math.round(grossPremium * (subsidyPercent / 100)); // 40% state rebate
  const netPayable = grossPremium - subsidyRebate;

  const handlePay = async () => {
    if (!selectedLandId) {
      toast.error('Please select a registered land parcel.');
      return;
    }

    setIsSubmitting(true);
    const selectedLand = lands.find((l) => (l._id || l.id) === selectedLandId) || lands[0];

    const payload = {
      landId: selectedLand?._id || selectedLand?.id || selectedLandId,
      planName: planType,
      category: 'Commercial Agroforestry',
      insuredTreeCount: treeCount,
      speciesSummary: speciesDistribution,
      sumInsured,
      annualPremium: Math.round(grossPremium / Number(durationYears)),
      grossPremium,
      farmerNetPayable: netPayable,
      durationMonths: Number(durationYears) * 12,
    };

    try {
      const actionResult = await dispatch(applyPolicy(payload));
      if (applyPolicy.fulfilled.match(actionResult)) {
        setPaymentSuccess(true);
        toast.success('Tree Insurance Policy activated! Bond generated in vault.');
        setTimeout(() => {
          setShowPaymentModal(false);
          const newPolicy = actionResult.payload;
          navigate(`/farmer/insurance/${newPolicy?._id || newPolicy?.policyNumber || 'active'}`);
        }, 1500);
      } else {
        toast.error(actionResult.payload || 'Policy application failed.');
        setIsSubmitting(false);
      }
    } catch (err) {
      toast.error('Payment processing failed.');
      setIsSubmitting(false);
    }
  };

  const selectedLand = lands.find((l) => (l._id || l.id) === selectedLandId);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Apply for Tree Asset Insurance"
        subtitle="Protect your timber & plantation against natural disasters, fire, and pests with 40% government subsidy."
        backTo="/farmer/insurance"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Insurance Catalog', path: '/farmer/insurance' },
          { label: 'New Policy Application' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Form Card */}
          <Card className="p-6 md:p-8 space-y-6 rounded-3xl bg-white border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Policy Configuration
            </h3>

            {lands.length > 0 ? (
              <FormSelect
                label="Select Registered Land Parcel"
                value={selectedLandId}
                onChange={(e) => setSelectedLandId(e.target.value)}
                options={lands.map((land) => ({
                  value: land._id || land.id,
                  label: `${land.landName} (Survey: ${land.surveyNumber} • Khasra: ${land.khasraNumber} • ${land.area || land.areaAcres} Acres)`,
                }))}
              />
            ) : (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                <span>No registered lands found. Register your land first to apply for insurance.</span>
                <Button size="sm" variant="primary" onClick={() => navigate('/farmer/lands/add')}>
                  Register Land
                </Button>
              </div>
            )}

            <FormSelect
              label="Selected Insurance Protection Plan"
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              options={[
                { value: 'Comprehensive Agroforestry Cover', label: 'Comprehensive Agroforestry Cover (40% Subsidy)' },
                { value: 'Individual High-Value Tree Guard', label: 'Individual High-Value Tree Guard (30% Subsidy)' },
                { value: 'Carbon Asset & Timber Shield', label: 'Carbon Asset & Timber Shield (25% Subsidy)' },
              ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Number of Standing Trees"
                type="number"
                value={treeCount}
                onChange={(e) => setTreeCount(Math.max(1, Number(e.target.value)))}
                min="10"
                max="10000"
                required
              />

              <FormSelect
                label="Policy Duration"
                value={durationYears}
                onChange={(e) => setDurationYears(e.target.value)}
                options={[
                  { value: '1', label: '1 Year (Standard)' },
                  { value: '2', label: '2 Years (5% Multi-Year Rebate)' },
                  { value: '3', label: '3 Years (10% Multi-Year Rebate - Recommended)' },
                ]}
              />
            </div>

            <FormInput
              label="Tree Species Breakdown"
              value={speciesDistribution}
              onChange={(e) => setSpeciesDistribution(e.target.value)}
              placeholder="e.g. 100 Indian Teak, 50 Red Sandalwood"
              helperText="Specify species counts for precise parametric valuation"
            />

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 px-8"
                onClick={() => setShowPaymentModal(true)}
                disabled={lands.length === 0}
              >
                Proceed to Subsidy & Settlement <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Summary Card */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 rounded-3xl bg-slate-900 text-white shadow-xl">
            <h4 className="font-bold text-sm text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Sovereign Coverage Summary
            </h4>

            <div className="space-y-3 text-xs border-b border-white/10 pb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Parcel:</span>
                <span className="font-bold text-white text-right">
                  {selectedLand?.landName || 'Registered Farm'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Insured Trees:</span>
                <span className="font-mono font-bold text-emerald-300">{treeCount} Trees</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="font-semibold text-white">{durationYears} Years (36 Months)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Sum Insured:</span>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  ₹{sumInsured.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Gross Actuarial Premium:</span>
                <span className="font-mono">₹{grossPremium.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold bg-emerald-950/60 p-2 rounded-xl border border-emerald-500/20">
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> PM-KMY 40% Subsidy:
                </span>
                <span className="font-mono">-₹{subsidyRebate.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10">
                <span>Net Payable:</span>
                <span className="font-mono text-emerald-400">₹{netPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Payment / Activation Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => {
          if (!isSubmitting) setShowPaymentModal(false);
        }}
        title="Sovereign Policy Activation & Settlement"
      >
        <div className="space-y-4 py-2">
          {paymentSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Policy Successfully Activated!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Attested Policy Bond generated and deposited into your Sovereign Document Vault.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex justify-between font-bold text-slate-900 text-sm">
                  <span>Net Payable Amount:</span>
                  <span className="font-mono text-emerald-800">₹{netPayable.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Includes ₹{subsidyRebate.toLocaleString('en-IN')} direct grant from National Agroforestry Mission.
                </p>
              </div>

              <div className="space-y-2 border border-slate-200 p-3.5 rounded-2xl">
                <span className="font-bold text-slate-800 block">Select Payment Channel:</span>
                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl cursor-pointer">
                  <input type="radio" name="paymentMethod" defaultChecked className="text-emerald-700" />
                  <span className="font-semibold text-slate-900">BHUMICRED Smart Wallet / UPI</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-xl cursor-pointer">
                  <input type="radio" name="paymentMethod" className="text-emerald-700" />
                  <span className="font-semibold text-slate-700">Kisan Credit Card (KCC) Direct Debit</span>
                </label>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full bg-emerald-700 hover:bg-emerald-800 font-bold py-3 text-sm"
                onClick={handlePay}
                isLoading={isSubmitting}
              >
                Confirm Settlement & Activate Policy
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default InsuranceApplyPage;
