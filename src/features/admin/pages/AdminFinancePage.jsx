import React, { useState } from 'react';
import {
  Wallet,
  DollarSign,
  Download,
  CheckCircle2,
  Clock,
  Building,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';

export const AdminFinancePage = () => {
  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Platform Finance, Escrow & Treasury"
        subtitle="Manage government subsidy disbursements, partner service payouts, escrow balances, and wallet reconciliations."
        backTo="/admin/dashboard"
        breadcrumbs={[
          { label: 'Admin Portal', path: '/admin/dashboard' },
          { label: 'Finance & Payouts' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => alert('Exporting Treasury Payout Audit Report...')}
          >
            <Download className="w-4 h-4" /> Export Treasury Ledger (CSV)
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 bg-gradient-to-br from-emerald-900 to-teal-950 text-white border-0 shadow-lg">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block mb-1">
            Total Escrow Reserves
          </span>
          <p className="text-3xl font-black mb-1">₹48,50,000</p>
          <span className="text-xs text-emerald-200">ICICI Bank Escrow Pool</span>
        </Card>

        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Monthly Payouts
          </span>
          <p className="text-2xl font-black text-gray-900">₹8,45,000</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Subsidies + Inspections</span>
        </Card>

        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Marketplace GMV
          </span>
          <p className="text-2xl font-black text-gray-900">₹14,20,000</p>
          <span className="text-xs text-gray-500 mt-1 block">YTD Agri Inputs</span>
        </Card>

        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Pending Clearances
          </span>
          <p className="text-2xl font-black text-amber-600">₹1,18,000</p>
          <span className="text-xs text-amber-700 font-medium mt-1 block">1 Insurance Settlement</span>
        </Card>
      </div>

      {/* Disbursal Batches */}
      <Card className="p-6 md:p-8 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Recent Automated Settlement Batches</h3>
        <div className="divide-y divide-gray-100 text-xs">
          {[
            { id: 'BAT-2026-081', desc: 'August Farmer Agroforestry Subsidy Direct Credit (42 Beneficiaries)', amount: '₹4,20,000', date: '01 Sep 2026', status: 'COMPLETED' },
            { id: 'BAT-2026-082', desc: 'Enterprise Partner Field Survey Fee Clearing Batch', amount: '₹18,450', date: '02 Sep 2026', status: 'COMPLETED' },
            { id: 'BAT-2026-083', desc: 'Quarterly Carbon Sequestration Reward Distribution (Mogri)', amount: '₹8,88,000', date: '05 Sep 2026', status: 'COMPLETED' },
          ].map((bat, idx) => (
            <div key={idx} className="py-3.5 flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mr-2">
                  {bat.id}
                </span>
                <span className="font-semibold text-gray-900">{bat.desc}</span>
                <span className="text-gray-400 block mt-0.5">Processed on {bat.date} via NPCI DBT Gateway</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900 text-sm">{bat.amount}</span>
                <StatusBadge status={bat.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
