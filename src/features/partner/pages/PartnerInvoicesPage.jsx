import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Wallet,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  FileText,
  DollarSign,
  Plus,
  RefreshCw,
  Building,
  ShieldCheck,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { fetchWallet, requestWithdrawal } from '../../wallet/walletSlice.js';

const INITIAL_INVOICES = [
  {
    id: 'inv_01',
    invoiceNumber: 'INV-2026-PT-042',
    date: '31 Aug 2026',
    description: 'August Field Inspections & Soil Sampling Batch (14 Tasks)',
    amount: 18450,
    status: 'PAID',
    disbursedTo: 'State Bank of India (****8102)',
    category: 'SOIL_SAMPLING',
  },
  {
    id: 'inv_02',
    invoiceNumber: 'INV-2026-PT-043',
    date: '07 Sep 2026',
    description: 'Tree Damage Drone Orthomosaic Surveys (3 Claims)',
    amount: 3750,
    status: 'PENDING',
    disbursedTo: 'State Bank of India (****8102)',
    category: 'DRONE_SURVEY',
  },
];

export const PartnerInvoicesPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { wallet } = useSelector((state) => state.wallet);

  // Invoices persistent state
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('bhumicred_partner_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  // Available Payout Balance state
  const [availablePayout, setAvailablePayout] = useState(() => {
    const saved = localStorage.getItem('bhumicred_partner_available_payout');
    return saved ? Number(saved) : 14250;
  });

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [submittingPayout, setSubmittingPayout] = useState(false);

  // New Invoice form state
  const [newInvoiceData, setNewInvoiceData] = useState({
    category: 'SOIL_SAMPLING',
    tasksCount: '5',
    ratePerTask: '850',
    description: 'Geotagged Soil Core Extraction & NPK Lab Dispatch (5 Plots)',
  });

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  // Save to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem('bhumicred_partner_invoices', JSON.stringify(invoices));
    localStorage.setItem('bhumicred_partner_available_payout', String(availablePayout));
  }, [invoices, availablePayout]);

  // Dynamically calculate KPIs
  const totalEarned = invoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
  const totalPaid = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
  const totalPending = invoices
    .filter((inv) => inv.status === 'PENDING' || inv.status === 'PROCESSING')
    .reduce((sum, inv) => sum + Number(inv.amount || 0), 0);

  // Handle Payout Request
  const handleWithdraw = async (e) => {
    e.preventDefault();
    const amount = Number(withdrawAmount || availablePayout);
    if (amount <= 0 || amount > availablePayout) return;

    setSubmittingPayout(true);
    try {
      // Dispatch live Redux withdrawal
      await dispatch(
        requestWithdrawal({
          amount,
          accountNumber: '9912048102',
          ifscCode: 'SBIN0001044',
          accountHolderName: user?.name || 'Aman Singh (Partner)',
        })
      );

      // Deduct from available payout
      setAvailablePayout((prev) => Math.max(0, prev - amount));

      // Add payout transaction to invoices list
      const payoutInvoice = {
        id: `payout_${Date.now()}`,
        invoiceNumber: `PAY-2026-PT-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        description: `Direct Bank Payout Transfer (IMPS to SBI ****8102)`,
        amount: amount,
        status: 'PROCESSING',
        disbursedTo: 'State Bank of India (****8102)',
        category: 'BANK_PAYOUT',
      };

      setInvoices((prev) => [payoutInvoice, ...prev]);
      setWithdrawSuccess(true);
      setTimeout(() => {
        setWithdrawSuccess(false);
        setShowWithdrawModal(false);
        setWithdrawAmount('');
      }, 2000);
    } catch (err) {
      console.error('Payout failed:', err);
    } finally {
      setSubmittingPayout(false);
    }
  };

  // Handle Generating New Service Invoice
  const handleCreateInvoice = (e) => {
    e.preventDefault();
    const tasks = Number(newInvoiceData.tasksCount) || 1;
    const rate = Number(newInvoiceData.ratePerTask) || 850;
    const totalAmount = tasks * rate;

    const newInv = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-2026-PT-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      description: newInvoiceData.description,
      amount: totalAmount,
      status: 'PAID',
      disbursedTo: 'Partner Escrow Buffer',
      category: newInvoiceData.category,
    };

    setInvoices((prev) => [newInv, ...prev]);
    setAvailablePayout((prev) => prev + totalAmount);
    setShowCreateInvoiceModal(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Invoice Number', 'Date', 'Description', 'Category', 'Amount (INR)', 'Status', 'Disbursed To'];
    const rows = invoices.map((inv) => [
      `"${inv.invoiceNumber}"`,
      `"${inv.date}"`,
      `"${inv.description.replace(/"/g, '""')}"`,
      `"${inv.category || 'SERVICE'}"`,
      inv.amount,
      `"${inv.status}"`,
      `"${inv.disbursedTo}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhumicred_partner_invoices_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Partner Service Invoices & Bank Payouts"
        subtitle="Track completed drone inspections, certified soil lab billings, automated escrow releases, and IMPS bank payouts."
        backTo="/partner/dashboard"
        breadcrumbs={[
          { label: 'Partner Portal', path: '/partner/dashboard' },
          { label: 'Invoices & Payouts' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => setShowCreateInvoiceModal(true)}
            >
              Generate Service Invoice
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={FileSpreadsheet}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={ArrowUpRight}
              disabled={availablePayout <= 0}
              onClick={() => {
                setWithdrawAmount(String(availablePayout));
                setShowWithdrawModal(true);
              }}
              className="shadow-md shadow-emerald-900/15"
            >
              Request Payout (₹{availablePayout.toLocaleString()})
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-6 bg-gradient-to-br from-emerald-900 to-teal-950 text-white border-0 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
              Available For Payout
            </span>
            <Wallet className="w-5 h-5 text-emerald-300" />
          </div>
          <p className="text-3xl font-black mb-1 text-white">₹{availablePayout.toLocaleString()}</p>
          <span className="text-xs text-emerald-200 flex items-center gap-1 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" /> Instant IMPS Transfer Ready
          </span>
        </Card>

        <Card className="p-6 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
              Total Invoiced Revenue
            </span>
            <Receipt className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">₹{totalEarned.toLocaleString()}</p>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2 block">
            {invoices.length} Total Billing Items
          </span>
        </Card>

        <Card className="p-6 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
              Settled Bank Transfers
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">₹{totalPaid.toLocaleString()}</p>
          <span className="text-xs text-slate-500 dark:text-neutral-400 mt-2 block">
            ₹{totalPending.toLocaleString()} In Processing
          </span>
        </Card>

        <Card className="p-6 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
              Linked Bank Account
            </span>
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">SBI (****8102)</p>
          <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> IFSC: SBIN0001044 Verified
          </span>
        </Card>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Service Invoice & Payout Ledger
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {invoices.length} Records
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Real-time synchronization with BHUMICRED Partner Escrow Ledger.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {invoices.map((inv) => (
            <Card
              key={inv.id}
              className="p-5 sm:p-6 border border-slate-200 dark:border-neutral-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all bg-white dark:bg-neutral-900"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                      {inv.invoiceNumber}
                    </span>
                    <StatusBadge status={inv.status} />
                    {inv.category && (
                      <span className="text-[10px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                        {inv.category}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-1">
                    {inv.description}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    Date: {inv.date} • Destination: {inv.disbursedTo}
                  </p>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-4 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-neutral-800">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    ₹{Number(inv.amount).toLocaleString()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() =>
                      alert(
                        `Downloading Tax Invoice ${inv.invoiceNumber}\nAmount: ₹${inv.amount}\nStatus: ${inv.status}\nGSTIN: 24AAACB1024F1Z0`
                      )
                    }
                  >
                    <Download className="w-3.5 h-3.5" /> GST Invoice
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Request Payout Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Request IMPS Bank Payout"
      >
        <form onSubmit={handleWithdraw} className="space-y-5 py-2">
          {withdrawSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-950/40 animate-in zoom-in">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Payout Transfer Initiated!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                ₹{Number(withdrawAmount || availablePayout).toLocaleString()} has been scheduled for instant IMPS transfer to SBI Account (****8102).
              </p>
            </div>
          ) : (
            <>
              <div className="p-4 bg-slate-50 dark:bg-neutral-800 rounded-2xl border border-slate-200 dark:border-neutral-700 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Available Payout Balance:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                    ₹{availablePayout.toLocaleString()}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficiary Bank:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">State Bank of India (****8102)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Settlement Speed:</span>
                  <span className="font-bold text-emerald-600">Immediate IMPS (24x7)</span>
                </div>
              </div>

              <FormInput
                label="Amount to Withdraw (₹) *"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                min="100"
                max={availablePayout}
                required
                placeholder={`Max ₹${availablePayout}`}
              />

              <Button
                type="submit"
                variant="primary"
                loading={submittingPayout}
                className="w-full py-3 text-sm font-bold shadow-lg shadow-emerald-900/15"
              >
                {submittingPayout ? 'Processing IMPS Transfer...' : `Confirm & Withdraw ₹${Number(withdrawAmount || availablePayout).toLocaleString()}`}
              </Button>
            </>
          )}
        </form>
      </Modal>

      {/* Generate Service Invoice Modal */}
      <Modal
        isOpen={showCreateInvoiceModal}
        onClose={() => setShowCreateInvoiceModal(false)}
        title="Generate Partner Service Invoice"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4 py-2">
          <FormSelect
            label="Service / Task Category *"
            value={newInvoiceData.category}
            onChange={(e) => setNewInvoiceData({ ...newInvoiceData, category: e.target.value })}
            options={[
              { value: 'SOIL_SAMPLING', label: 'Soil Testing & Field Sample Extractions' },
              { value: 'DRONE_SURVEY', label: 'Drone Orthomosaic & Tree Census Survey' },
              { value: 'LAND_INSPECTION', label: 'Cadastral Boundary Physical Verification' },
              { value: 'TREE_TAGGING', label: 'RFID Tree Geo-Tagging & Health Audit' },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Completed Tasks Count *"
              type="number"
              min="1"
              value={newInvoiceData.tasksCount}
              onChange={(e) => setNewInvoiceData({ ...newInvoiceData, tasksCount: e.target.value })}
              required
            />
            <FormInput
              label="Rate per Task (₹) *"
              type="number"
              value={newInvoiceData.ratePerTask}
              onChange={(e) => setNewInvoiceData({ ...newInvoiceData, ratePerTask: e.target.value })}
              required
            />
          </div>

          <FormInput
            label="Invoice Memo / Description *"
            value={newInvoiceData.description}
            onChange={(e) => setNewInvoiceData({ ...newInvoiceData, description: e.target.value })}
            required
            placeholder="e.g. Geotagged Soil Core Extraction (5 Plots)"
          />

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs flex justify-between items-center">
            <span className="text-emerald-900 dark:text-emerald-200 font-bold">Total Invoice Amount:</span>
            <span className="text-base font-black text-emerald-700 dark:text-emerald-400">
              ₹{(Number(newInvoiceData.tasksCount || 1) * Number(newInvoiceData.ratePerTask || 850)).toLocaleString()}
            </span>
          </div>

          <Button type="submit" variant="primary" className="w-full py-3">
            Submit & Credit to Partner Balance
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default PartnerInvoicesPage;
