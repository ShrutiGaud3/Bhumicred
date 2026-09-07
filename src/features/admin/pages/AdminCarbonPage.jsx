import React, { useState } from 'react';
import {
  Leaf,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Download,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';

const MOCK_CARBON_ISSUANCES = [
  {
    id: 'crb_iss_01',
    batchNumber: 'BC-CRB-2026-Q2',
    projectTitle: 'Mogri Gram Cluster Agroforestry',
    creditsIssued: 480,
    creditRate: '₹1,850',
    totalValue: '₹8,88,000',
    status: 'ISSUED',
    registry: 'Gold Standard GS4GG-2026',
    issuedDate: '15 Aug 2026',
  },
  {
    id: 'crb_iss_02',
    batchNumber: 'BC-CRB-2026-Q3-PENDING',
    projectTitle: 'Charotar Regenerative Soil & Drip Mission',
    creditsIssued: 1250,
    creditRate: '₹1,850',
    totalValue: '₹23,12,500',
    status: 'AUDIT_IN_PROGRESS',
    registry: 'Verra VM0042',
    issuedDate: 'Expected Oct 2026',
  },
];

export const AdminCarbonPage = () => {
  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Carbon Credit Registry & Tokenization Central"
        subtitle="Issue verified tCO2e carbon credits, manage registry minting batches, and authorize corporate retirements."
        backTo="/admin/dashboard"
        breadcrumbs={[
          { label: 'Admin Portal', path: '/admin/dashboard' },
          { label: 'Carbon & Green Credits' },
        ]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Total Minted Credits
          </span>
          <p className="text-2xl font-black text-emerald-700">1,730 <span className="text-xs font-normal text-gray-500">tCO2e</span></p>
          <span className="text-xs text-gray-500 mt-1 block">Verra & Gold Standard</span>
        </Card>

        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Trading Floor Price
          </span>
          <p className="text-2xl font-black text-gray-900">₹1,850 <span className="text-xs font-normal text-gray-500">/ credit</span></p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">+4.2% MoM</span>
        </Card>

        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Farmer Payout Pool
          </span>
          <p className="text-2xl font-black text-gray-900">₹32.0 L</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Direct Wallet Allocation</span>
        </Card>

        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Enrolled Forest Area
          </span>
          <p className="text-2xl font-black text-gray-900">142.8 <span className="text-xs font-normal text-gray-500">Ha</span></p>
          <span className="text-xs text-gray-500 mt-1 block">Satellite Monitored</span>
        </Card>
      </div>

      {/* Issuance Batches */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Registry Issuance & Minting Batches</h3>

        <div className="space-y-3">
          {MOCK_CARBON_ISSUANCES.map((batch) => (
            <Card key={batch.id} className="p-6 border border-gray-200 hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {batch.batchNumber}
                    </span>
                    <Badge variant={batch.status === 'ISSUED' ? 'success' : 'warning'}>
                      {batch.status}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-base text-gray-900 mt-1">{batch.projectTitle}</h4>
                  <p className="text-xs text-gray-500">Registry: {batch.registry} • Date: {batch.issuedDate}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-left lg:text-right">
                    <span className="text-xs text-gray-400 block">Carbon Volume</span>
                    <span className="text-lg font-bold text-emerald-700">{batch.creditsIssued} tCO2e</span>
                  </div>
                  <div className="text-left lg:text-right">
                    <span className="text-xs text-gray-400 block">Total Valuation</span>
                    <span className="text-lg font-black text-gray-900">{batch.totalValue}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
