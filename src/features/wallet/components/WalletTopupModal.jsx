import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CreditCard,
  Building2,
  CheckCircle2,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Lock,
  Download,
  Printer,
  Sparkles
} from 'lucide-react';
import { Button } from '../../../components/ui/Button.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { useToast } from '../../../components/ui/ToastContext.jsx';
import { useDispatch } from 'react-redux';
import { topupWallet } from '../walletSlice.js';

export const WalletTopupModal = ({ isOpen, onClose, onTopupSuccess }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('5000');
  const [paymentMethod, setPaymentMethod] = useState('UPI_GPAY'); // 'UPI_GPAY', 'UPI_PHONEPE', 'UPI_ID', 'CARD', 'NETBANK'
  const [upiId, setUpiId] = useState('farmer@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txDetails, setTxDetails] = useState(null);

  if (!isOpen) return null;

  const quickAmounts = ['1000', '2500', '5000', '10000', '25000'];

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error('Please enter a valid recharge amount');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await dispatch(
        topupWallet({
          amount: numAmount,
          paymentMethod,
          upiId,
          paymentReference: `UPI-RR-${Math.floor(100000000 + Math.random() * 900000000)}`,
        })
      ).unwrap();

      setIsProcessing(false);
      setIsSuccess(true);
      setTxDetails({
        txId: res.transaction?.transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        refNo: res.transaction?.referenceId || `UPI-RR-${Math.floor(100000000 + Math.random() * 900000000)}`,
        amount: numAmount,
        date: new Date().toLocaleString(),
        method: paymentMethod.replace('UPI_', ''),
        status: 'SUCCESS',
      });
      toast.success(`₹${numAmount.toLocaleString()} successfully credited to your Smart Wallet!`);

      if (onTopupSuccess) {
        onTopupSuccess(numAmount);
      }
    } catch (err) {
      setIsProcessing(false);
      toast.error(err || 'Failed to process top-up');
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setTxDetails(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/50">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">
              {isSuccess ? 'Payment Successful' : 'Top Up Smart Wallet'}
            </h3>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-200/60 dark:hover:bg-neutral-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {isSuccess && txDetails ? (
          /* Success Receipt View */
          <div className="p-6 text-center space-y-5">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Transaction Approved</span>
              <h2 className="text-3xl font-black text-neutral-900 dark:text-white mt-1">
                + ₹{txDetails.amount.toLocaleString()}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Credited to BHUMICRED Smart Wallet Balance
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-500 font-sans">Transaction ID:</span>
                <span className="font-bold text-neutral-800 dark:text-neutral-200">{txDetails.txId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-sans">UPI Reference (RRN):</span>
                <span className="text-neutral-800 dark:text-neutral-200">{txDetails.refNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-sans">Payment Channel:</span>
                <span className="font-semibold text-emerald-600">{txDetails.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-sans">Timestamp:</span>
                <span className="text-neutral-600 dark:text-neutral-400">{txDetails.date}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => window.print()} className="flex items-center gap-1.5">
                <Printer className="w-4 h-4" /> Print Receipt
              </Button>
              <Button variant="primary" size="sm" onClick={handleReset}>
                Done & Return to Wallet
              </Button>
            </div>
          </div>
        ) : (
          /* Payment Selection Form */
          <form onSubmit={handleProcessPayment} className="p-6 space-y-5">
            {/* Amount Input */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Enter Top-Up Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-base text-neutral-500">₹</span>
                <input
                  type="number"
                  min="100"
                  max="200000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold text-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              {/* Quick Pills */}
              <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                      amount === q
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
                    }`}
                  >
                    +₹{Number(q).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Select Indian Payment Mode
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'UPI_GPAY', name: 'Google Pay', subtitle: 'Instant UPI', icon: Smartphone },
                  { id: 'UPI_PHONEPE', name: 'PhonePe', subtitle: 'Fast Checkout', icon: Smartphone },
                  { id: 'UPI_ID', name: 'Other UPI ID', subtitle: 'BHIM / Paytm', icon: QrCode },
                  { id: 'NETBANK', name: 'Net Banking', subtitle: 'SBI / HDFC / BoB', icon: Building2 },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                          : 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">{m.name}</p>
                        <p className="text-[10px] text-neutral-500 truncate">{m.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {paymentMethod === 'UPI_ID' && (
              <FormInput
                label="Virtual Payment Address (VPA / UPI ID)"
                placeholder="e.g. mobile@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            )}

            {/* Security Guarantee Strip */}
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 flex items-center gap-2.5 text-xs text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                100% Secure 256-bit Encrypted Banking DBT Gateway
              </span>
            </div>

            {/* Submit Action */}
            <Button
              type="submit"
              variant="primary"
              isLoading={isProcessing}
              className="w-full py-3.5 flex items-center justify-center gap-2 font-bold text-base shadow-lg shadow-emerald-950/20"
            >
              Pay ₹{Number(amount || 0).toLocaleString()} Now
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
