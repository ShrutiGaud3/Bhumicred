import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { MOCK_WALLET } from '../../../services/mockData/walletMock.js';
import { WalletTopupModal } from '../components/WalletTopupModal.jsx';
import { PlusCircle } from 'lucide-react';

export const WalletPage = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('ALL');
  const [currentBalance, setCurrentBalance] = useState(MOCK_WALLET.availableBalance);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('5000');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const transactions = MOCK_WALLET.recentTransactions.filter((tx) => {
    if (filterType === 'CREDIT') return tx.type === 'CREDIT';
    if (filterType === 'DEBIT') return tx.type === 'DEBIT';
    return true;
  });

  const handleWithdraw = (e) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
    }, 2000);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Farmer Earnings & Digital Wallet"
        subtitle="Manage direct subsidy credits, carbon rewards, marketplace purchases, and bank payouts."
        backTo="/farmer/dashboard"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Wallet & Earnings' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/rewards')}
            >
              Referrals & Rewards
            </Button>
            <Button
              variant="primary"
              className="flex items-center gap-2"
              onClick={() => setShowTopupModal(true)}
            >
              <PlusCircle className="w-4 h-4" /> Top Up Wallet
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowWithdrawModal(true)}
            >
              <ArrowUpRight className="w-4 h-4" /> Withdraw
            </Button>
          </div>
        }
      />

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-emerald-900 to-teal-950 text-white border-0 shadow-lg md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Available Liquid Balance
            </span>
            <Wallet className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-4xl font-black mb-4">₹{currentBalance.toLocaleString()}</p>
          <div className="flex items-center justify-between text-xs text-emerald-200 pt-3 border-t border-emerald-800">
            <span>Linked: HDFC Bank (****2901)</span>
            <span className="font-semibold text-emerald-300">Instant UPI IMPS</span>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
            Pending Escrow
          </span>
          <p className="text-3xl font-bold text-amber-600">₹{MOCK_WALLET.pendingBalance.toLocaleString()}</p>
          <span className="text-xs text-gray-500 mt-2 block">Disburses post-inspection</span>
        </Card>

        <Card className="p-6 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
            Lifetime Earnings
          </span>
          <p className="text-3xl font-bold text-gray-900">₹{MOCK_WALLET.totalEarnings.toLocaleString()}</p>
          <span className="text-xs text-emerald-600 font-semibold mt-2 block">Carbon + Subsidies</span>
        </Card>
      </div>

      {/* Transactions Ledger */}
      <Card className="p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
            <p className="text-xs text-gray-500">Real-time ledger of credits, debits, and withdrawals.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {['ALL', 'CREDIT', 'DEBIT'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === type
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                }`}
              >
                {type === 'ALL' ? 'All Transactions' : type === 'CREDIT' ? 'Credits' : 'Debits'}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-100">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl ${
                    tx.type === 'CREDIT'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tx.type === 'CREDIT' ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900">{tx.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span>{new Date(tx.timestamp).toLocaleString('en-GB')}</span>
                    <span>•</span>
                    <span className="font-mono">{tx.referenceId}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-base font-black ${
                    tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-gray-900'
                  }`}
                >
                  {tx.type === 'CREDIT' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                </span>
                <span className="text-[11px] text-gray-400 block uppercase font-mono">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Withdrawal Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Direct Bank Payout"
      >
        <form onSubmit={handleWithdraw} className="space-y-6 py-2">
          {withdrawSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Payout Initiated!</h4>
              <p className="text-sm text-gray-500 mt-1">
                ₹{Number(withdrawAmount).toLocaleString()} transferred to HDFC Bank (****2901).
              </p>
            </div>
          ) : (
            <>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Available Balance:</span>
                  <span className="font-bold text-gray-900">₹{MOCK_WALLET.availableBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Destination Account:</span>
                  <span className="font-semibold text-gray-900">HDFC Bank (IFSC: HDFC0001044)</span>
                </div>
              </div>

              <FormInput
                label="Enter Withdrawal Amount (₹)"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="100"
                max={MOCK_WALLET.availableBalance}
                required
              />

              <Button type="submit" variant="primary" className="w-full py-3">
                Confirm & Transfer ₹{Number(withdrawAmount).toLocaleString()}
              </Button>
            </>
          )}
        </form>
      </Modal>

      {/* Interactive Wallet Top-Up UPI Payment Gateway Modal */}
      <WalletTopupModal
        isOpen={showTopupModal}
        onClose={() => setShowTopupModal(false)}
        onTopupSuccess={(addedAmount) => {
          setCurrentBalance((prev) => prev + addedAmount);
        }}
      />
    </div>
  );
};
