import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  RefreshCw,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { WalletTopupModal } from '../components/WalletTopupModal.jsx';
import { PlusCircle } from 'lucide-react';
import {
  fetchWallet,
  fetchTransactions,
  requestWithdrawal,
} from '../walletSlice.js';

export const WalletPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { wallet, transactions, isLoading, isWithdrawLoading } = useSelector(
    (state) => state.wallet
  );
  const { user } = useSelector((state) => state.auth);

  const [filterType, setFilterType] = useState('ALL');
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('5000');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');

  useEffect(() => {
    dispatch(fetchWallet());
    dispatch(fetchTransactions({ type: filterType !== 'ALL' ? filterType : undefined }));
  }, [dispatch, filterType]);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setWithdrawError('');
    try {
      await dispatch(
        requestWithdrawal({
          amount: Number(withdrawAmount),
          destinationBank: wallet.bankAccount?.bankName || 'HDFC Bank',
          upiId: wallet.bankAccount?.upiId || `${user?.mobile || '9876543210'}@okhdfcbank`,
        })
      ).unwrap();

      setWithdrawSuccess(true);
      dispatch(fetchWallet());
      dispatch(fetchTransactions({ type: filterType !== 'ALL' ? filterType : undefined }));

      setTimeout(() => {
        setWithdrawSuccess(false);
        setShowWithdrawModal(false);
      }, 2500);
    } catch (err) {
      setWithdrawError(err || 'Failed to process payout');
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filterType === 'CREDIT') return tx.type === 'CREDIT';
    if (filterType === 'DEBIT') return tx.type === 'DEBIT';
    return true;
  });

  const availableBal = wallet?.availableBalance || 0;
  const escrowBal = wallet?.escrowBalance || 0;
  const totalEarn = wallet?.totalEarnings || 0;
  const bankAcc = wallet?.bankAccount || {
    bankName: 'HDFC Bank',
    accountNumber: 'XXXXXX2901',
    ifscCode: 'HDFC0001044',
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Farmer Earnings & Digital Wallet"
        subtitle="Manage direct subsidy credits, carbon rewards, marketplace purchases, and instant bank payouts."
        backTo="/farmer/dashboard"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Wallet & Earnings' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/rewards')}
            >
              Referrals & Rewards ({wallet?.rewardPoints || 3200} Pts)
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
              <ArrowUpRight className="w-4 h-4" /> Instant Payout
            </Button>
          </div>
        }
      />

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-6 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white border-0 shadow-xl sm:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Available Liquid Balance
            </span>
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <Wallet className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-black mb-4">₹{availableBal.toLocaleString('en-IN')}</p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-emerald-200 pt-3 border-t border-emerald-800/80">
            <span className="truncate">Linked: {bankAcc.bankName} ({bankAcc.accountNumber})</span>
            <span className="font-semibold text-emerald-300 flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" /> Instant 24x7 IMPS
            </span>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Pending Escrow Pool
          </span>
          <p className="text-3xl font-black text-amber-600">₹{escrowBal.toLocaleString('en-IN')}</p>
          <span className="text-xs text-gray-500 block pt-2 border-t border-gray-100">
            Disburses post satellite & lab verification
          </span>
        </Card>

        <Card className="p-6 bg-white border border-gray-100 shadow-sm space-y-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Lifetime Net Earnings
          </span>
          <p className="text-3xl font-black text-gray-900">₹{totalEarn.toLocaleString('en-IN')}</p>
          <span className="text-xs text-emerald-600 font-semibold block pt-2 border-t border-gray-100">
            Carbon Credits + Government Subsidies
          </span>
        </Card>
      </div>

      {/* Transactions Ledger */}
      <Card className="p-6 md:p-8 space-y-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Immutable Sovereign Transaction History</h3>
            <p className="text-xs text-gray-500">Real-time ledger of subsidies, carbon sales, marketplace debits & withdrawals.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {['ALL', 'CREDIT', 'DEBIT'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === type
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                }`}
              >
                {type === 'ALL' ? 'All Transactions' : type === 'CREDIT' ? 'Credits (+)' : 'Debits (-)'}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
            <span>Loading sovereign ledger records...</span>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((tx) => (
              <div key={tx._id || tx.id || tx.transactionId} className="py-4 flex items-center justify-between gap-4">
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
                    <p className="text-xs text-gray-500">{tx.description}</p>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1">
                      <span>{new Date(tx.timestamp || tx.createdAt).toLocaleString('en-GB')}</span>
                      <span>•</span>
                      <span className="font-mono text-gray-600">{tx.transactionId || tx.referenceId}</span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {tx.paymentMethod?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-base font-black ${
                      tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-gray-900'
                    }`}
                  >
                    {tx.type === 'CREDIT' ? '+' : '-'} ₹{Number(tx.amount || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-gray-400 block uppercase font-mono mt-0.5">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 text-xs">
            No transactions found for the selected filter.
          </div>
        )}
      </Card>

      {/* Withdrawal Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Direct Bank & UPI Payout"
      >
        <form onSubmit={handleWithdraw} className="space-y-6 py-2">
          {withdrawSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Payout Initiated!</h4>
              <p className="text-sm text-gray-500 mt-1">
                ₹{Number(withdrawAmount).toLocaleString('en-IN')} transferred via 24x7 IMPS to {bankAcc.bankName} ({bankAcc.accountNumber}).
              </p>
            </div>
          ) : (
            <>
              {withdrawError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                  {withdrawError}
                </div>
              )}

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Available Balance:</span>
                  <span className="font-bold text-emerald-700 text-sm">₹{availableBal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Destination Account:</span>
                  <span className="font-semibold text-gray-900">{bankAcc.bankName} (IFSC: {bankAcc.ifscCode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Linked UPI VPA:</span>
                  <span className="font-mono text-gray-800">{bankAcc.upiId || `${user?.mobile || '9876543210'}@okhdfcbank`}</span>
                </div>
              </div>

              <FormInput
                label="Enter Withdrawal Amount (₹)"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="100"
                max={availableBal}
                required
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isWithdrawLoading}
                className="w-full py-3"
              >
                Confirm & Transfer ₹{Number(withdrawAmount || 0).toLocaleString('en-IN')}
              </Button>
            </>
          )}
        </form>
      </Modal>

      {/* Interactive Wallet Top-Up UPI Payment Gateway Modal */}
      <WalletTopupModal
        isOpen={showTopupModal}
        onClose={() => setShowTopupModal(false)}
        onTopupSuccess={() => {
          dispatch(fetchWallet());
          dispatch(fetchTransactions({ type: filterType !== 'ALL' ? filterType : undefined }));
        }}
      />
    </div>
  );
};

export default WalletPage;
