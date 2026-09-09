import React, { useState } from 'react';
import {
  TestTube,
  FlaskConical,
  CheckCircle2,
  Plus,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';

export const AdminSoilPage = () => {
  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Soil Testing & NABL Lab Network Central"
        subtitle="Manage testing package parameters, laboratory partner accreditations, and sample SLA tracking."
        backTo="/admin/dashboard"
        breadcrumbs={[
          { label: 'Admin Portal', path: '/admin/dashboard' },
          { label: 'Soil & Lab Network' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 md:p-8 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" /> Accredited Testing Laboratories
          </h3>
          <div className="divide-y divide-gray-100 text-xs space-y-2">
            <div className="py-2 flex justify-between items-center">
              <div>
                <h5 className="font-bold text-sm text-gray-900">National AgriBio Testing Central, Anand</h5>
                <span className="text-gray-500">NABL Accreditation: TC-6612 • Capacity: 250 samples/day</span>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="py-2 flex justify-between items-center">
              <div>
                <h5 className="font-bold text-sm text-gray-900">State Soil Testing Laboratory, Kheda</h5>
                <span className="text-gray-500">Govt Directorate Lab • Capacity: 180 samples/day</span>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:p-8 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-600" /> Testing Package Masters
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
              <div>
                <strong className="text-gray-900">Standard 5-Parameter Macro Health</strong>
                <p className="text-gray-500">pH, EC, Organic Carbon, Nitrogen, Phosphorus</p>
              </div>
              <span className="font-bold text-emerald-700 text-sm">₹450</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
              <div>
                <strong className="text-gray-900">Advanced 12-Parameter Micronutrient Grid</strong>
                <p className="text-gray-500">All Macro + Zinc, Iron, Manganese, Copper, Boron</p>
              </div>
              <span className="font-bold text-emerald-700 text-sm">₹850</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
