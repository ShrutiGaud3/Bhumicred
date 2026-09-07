import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { MOCK_LANDS } from '../../../services/mockData/landsMock.js';

export const InsuranceApplyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselectedTrees = Number(searchParams.get('trees')) || 120;
  const [selectedLandId, setSelectedLandId] = useState(MOCK_LANDS[0].id);
  const [planType, setPlanType] = useState('Comprehensive Agroforestry Cover');
  const [treeCount, setTreeCount] = useState(preselectedTrees);
  const [durationYears, setDurationYears] = useState('3');
  const [speciesDistribution, setSpeciesDistribution] = useState('Teakwood (80), Red Sandalwood (40)');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Financial calculations
  const ratePerTree = 75;
  const sumInsured = treeCount * 12000; // ₹12k per tree asset valuation
  const grossPremium = Math.round(treeCount * ratePerTree * Number(durationYears));
  const subsidyRebate = Math.round(grossPremium * 0.4); // 40% state rebate
  const netPayable = grossPremium - subsidyRebate;

  const handlePay = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setShowPaymentModal(false);
      navigate('/farmer/insurance/pol_101');
    }, 1800);
  };

  const selectedLand = MOCK_LANDS.find((l) => l.id === selectedLandId) || MOCK_LANDS[0];

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Apply for Tree Asset Insurance"
        subtitle="Protect your plantation against natural disasters, fire, and pests with instant policy generation."
        backTo="/farmer/insurance/catalog"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Insurance Catalog', path: '/farmer/insurance/catalog' },
          { label: 'New Policy Application' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Form Card */}
          <Card className="p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Policy Configuration
            </h3>

            <FormSelect
              label="Select Registered Land Parcel"
              value={selectedLandId}
              onChange={(e) => setSelectedLandId(e.target.value)}
              options={MOCK_LANDS.map((land) => ({
                value: land.id,
                label: `${land.landName} (Survey: ${land.surveyNumber} • ${land.area} ${land.areaUnit})`,
              }))}
            />

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
                onChange={(e) => setTreeCount(Number(e.target.value))}
                min="10"
                max="5000"
                required
              />

              <FormSelect
                label="Policy Cover Term"
                value={durationYears}
                onChange={(e) => setDurationYears(e.target.value)}
                options={[
                  { value: '1', label: '1 Year (12 Months)' },
                  { value: '3', label: '3 Years (36 Months - Recommended)' },
                  { value: '5', label: '5 Years (60 Months - Multi-Year Discount)' },
                ]}
              />
            </div>

            <FormInput
              label="Tree Species & Count Breakdown"
              value={speciesDistribution}
              onChange={(e) => setSpeciesDistribution(e.target.value)}
              placeholder="e.g. Teak (60), Sandalwood (30), Mango (20)"
            />

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3 text-xs text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Field verification will be scheduled via BHUMICRED inspection partner within 7 days.
                Provisional risk cover begins immediately upon digital payment.
              </span>
            </div>
          </Card>
        </div>

        {/* Premium Breakdown Sticky Summary */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 bg-white sticky top-6">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
              Premium & Valuation
            </h4>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Total Sum Insured</span>
                <span className="font-bold text-gray-900">₹{sumInsured.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Gross Premium ({durationYears} Yr)</span>
                <span className="font-semibold text-gray-900">₹{grossPremium.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-emerald-700 font-medium">Govt Agro Subsidy (40%)</span>
                <span className="font-bold text-emerald-700">- ₹{subsidyRebate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 text-base">
                <span className="font-bold text-gray-900">Net Payable Premium</span>
                <span className="font-black text-emerald-600">₹{netPayable.toLocaleString()}</span>
              </div>
            </div>

            <Button
              variant="primary"
              className="w-full flex items-center justify-center gap-2 py-3 mt-4 text-base"
              onClick={() => setShowPaymentModal(true)}
            >
              Proceed to Pay ₹{netPayable.toLocaleString()} <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </div>
      </div>

      {/* Payment Gateway Mock Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="BHUMICRED Secure Payment Checkout"
      >
        <div className="space-y-6 py-2">
          {paymentSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Payment Successful!</h4>
              <p className="text-sm text-gray-500 mt-1">Generating your digital policy certificate...</p>
            </div>
          ) : (
            <>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Selected Plan:</span>
                  <span className="font-semibold text-gray-900">{planType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Protected Trees:</span>
                  <span className="font-semibold text-gray-900">{treeCount} Trees</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-200">
                  <span>Total Amount Due:</span>
                  <span className="text-emerald-700">₹{netPayable.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Select Payment Method (Mock Sandbox)
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'upi', label: 'UPI / QR Code (GPay, PhonePe, Paytm)', desc: 'Fastest 0% gateway fee' },
                    { id: 'wallet', label: 'BHUMICRED Farmer Wallet Balance (₹8,450 available)', desc: 'Instant deduction' },
                    { id: 'kcc', label: 'Kisan Credit Card / Net Banking', desc: 'Direct bank debit' },
                  ].map((m, idx) => (
                    <label
                      key={m.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${
                        idx === 0 ? 'border-emerald-500 bg-emerald-50/40' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        defaultChecked={idx === 0}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="font-semibold text-sm text-gray-900">{m.label}</span>
                        <p className="text-xs text-gray-500">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full flex items-center justify-center gap-2 py-3"
                onClick={handlePay}
              >
                Confirm & Pay ₹{netPayable.toLocaleString()}
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
