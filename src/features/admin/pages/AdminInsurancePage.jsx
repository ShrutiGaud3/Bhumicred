import React, { useState } from 'react';
import {
  ShieldCheck,
  Trees,
  CheckCircle2,
  AlertTriangle,
  Download,
  CloudLightning,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MOCK_POLICIES, MOCK_CLAIMS } from '../../../services/mockData/insuranceMock.js';

export const AdminInsurancePage = () => {
  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Underwriting & Risk Pool Control Center"
        subtitle="Manage parametric insurance triggers, monitor loss ratios, and authorize claim settlements."
        backTo="/admin/dashboard"
        breadcrumbs={[
          { label: 'Admin Portal', path: '/admin/dashboard' },
          { label: 'Underwriting & Claims' },
        ]}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Total Sum Insured
          </span>
          <p className="text-2xl font-black text-gray-900">₹1.83 Cr</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Active Risk Pool</span>
        </Card>

        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Annual Premium GMV
          </span>
          <p className="text-2xl font-black text-emerald-700">₹22,400</p>
          <span className="text-xs text-gray-500 mt-1 block">Underwritten Portfolio</span>
        </Card>

        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Loss Ratio Index
          </span>
          <p className="text-2xl font-black text-gray-900">6.4%</p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Healthy Underwriting Band</span>
        </Card>

        <Card className="p-5 bg-white">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Settled Claims
          </span>
          <p className="text-2xl font-black text-gray-900">₹1.18 L</p>
          <span className="text-xs text-gray-500 mt-1 block">1 Claim Processed</span>
        </Card>
      </div>

      {/* Policies & Claims Tables */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Active Policies Underwritten</h3>

        <div className="space-y-3">
          {MOCK_POLICIES.map((p) => (
            <Card key={p.id} className="p-6 border border-gray-200 hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {p.policyNumber}
                    </span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <h4 className="font-bold text-base text-gray-900 mt-1">{p.planName}</h4>
                  <p className="text-xs text-gray-500">Parcel: {p.landName} • {p.speciesSummary}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-left lg:text-right">
                    <span className="text-xs text-gray-400 block">Sum Insured</span>
                    <span className="text-lg font-bold text-gray-900">₹{p.sumInsured.toLocaleString()}</span>
                  </div>
                  <div className="text-left lg:text-right">
                    <span className="text-xs text-gray-400 block">Annual Premium</span>
                    <span className="text-lg font-bold text-emerald-700">₹{p.annualPremium.toLocaleString()}</span>
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
