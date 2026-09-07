import React, { useState } from 'react';
import {
  Wallet,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  FileText,
  DollarSign,
  Plus,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';

const MOCK_INVOICES = [
  {
    id: 'inv_01',
    invoiceNumber: 'INV-2026-PT-042',
    date: '31 Aug 2026',
    description: 'August Field Inspections & Soil Sampling Batch (14 Tasks)',
    amount: 18450,
    status: 'PAID',
    disbursedTo: 'State Bank of India (****8102)',
  },
  {
    id: 'inv_02',
    invoiceNumber: 'INV-2026-PT-043',
    date: '07 Sep 2026',
    description: 'Tree Damage Drone Orthomosaic Surveys (3 Claims)',
    amount: 3750,
    status: 'PROCESSING',
    disbursedTo: 'State Bank of India (****8102)',
  },
];

export const PartnerInvoicesPage = () => {
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const totalEarned = 22200;
  const availablePayout = 3750;

  const handleWithdraw = (e) => {
    e.preventDefault();
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
    }, 1800);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Partner Service Invoices & Payouts"
        subtitle="Track completed field inspection fees, automated milestone releases, and bank payouts."
        backTo="/partner/dashboard"
        breadcrumbs={[
          { label: 'Partner Portal', path: '/partner/dashboard' },
          { label: 'Invoices & Payouts' },
        ]}
        actions={
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => setShowWithdrawModal(true)}
          >
            <ArrowUpRight className="w-4 h-4" /> Request Payout (₹{availablePayout.toLocaleString()})
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-emerald-900 to-teal-950 text-white border-0 shadow-lg">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block mb-1">
            Available Service Payout
          </span>
          <p className="text-3xl font-black mb-3">₹{availablePayout.toLocaleString()}</p>
          <span className="text-xs text-emerald-200">Auto-clears every Monday</span>
        </Card>

        <Card className="p-6 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Total Invoiced
          </span>
          <p className="text-3xl font-bold text-gray-900">₹{totalEarned.toLocaleString()}</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">17 Tasks Completed</span>
        </Card>

        <Card className="p-6 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Linked Bank Account
          </span>
          <p className="text-lg font-bold text-gray-900">SBI (****8102)</p>
          <span className="text-xs text-gray-500 mt-1 block">IFSC: SBIN0001044 (Verified)</span>
        </Card>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Service Invoice History</h3>

        <div className="space-y-3">
          {invoices.map((inv) => (
            <Card key={inv.id} className="p-6 border border-gray-200 hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {inv.invoiceNumber}
                    </span>
                    <StatusBadge status={inv.status} />
                  </div>
                  <h4 className="font-bold text-base text-gray-900 mt-1">{inv.description}</h4>
                  <p className="text-xs text-gray-500">Date: {inv.date} • Disbursed to {inv.disbursedTo}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xl font-black text-gray-900">₹{inv.amount.toLocaleString()}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() => alert(`Downloading Invoice ${inv.invoiceNumber}...`)}
                  >
                    <Download className="w-3.5 h-3.5" /> GST Invoice
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Payout Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Request Partner Payout"
      >
        <form onSubmit={handleWithdraw} className="space-y-6 py-2">
          {withdrawSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Payout Request Submitted!</h4>
              <p className="text-sm text-gray-500 mt-1">
                ₹{availablePayout.toLocaleString()} scheduled for IMPS transfer to SBI (****8102).
              </p>
            </div>
          ) : (
            <>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Available Payout Balance:</span>
                  <span className="font-bold text-gray-900">₹{availablePayout.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bank Destination:</span>
                  <span className="font-semibold text-gray-900">State Bank of India (****8102)</span>
                </div>
              </div>

              <FormInput
                label="Amount to Withdraw (₹)"
                type="number"
                defaultValue={availablePayout}
                max={availablePayout}
                required
              />

              <Button type="submit" variant="primary" className="w-full py-3">
                Confirm & Request Payout Transfer
              </Button>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};
