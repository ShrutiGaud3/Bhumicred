import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  TestTube,
  CheckCircle2,
  Clock,
  ArrowRight,
  Upload,
  Calendar,
  Layers,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MOCK_SOIL_REQUESTS } from '../../../services/mockData/soilMock.js';

export const LabSampleQueuePage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Soil Lab Sample Processing Queue"
        subtitle="Track incoming core samples, chemical digestion, AAS spectrometry, and report generation."
        backTo="/partner/dashboard"
        breadcrumbs={[
          { label: 'Partner Portal', path: '/partner/dashboard' },
          { label: 'Lab Sample Queue' },
        ]}
        actions={
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => navigate('/partner/reports')}
          >
            <Upload className="w-4 h-4" /> Upload Certified Lab Report
          </Button>
        }
      />

      <div className="space-y-4">
        {MOCK_SOIL_REQUESTS.map((req) => (
          <Card key={req.id} className="p-6 border border-gray-200 hover:shadow-md transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    {req.requestNumber}
                  </span>
                  <StatusBadge status={req.status} />
                </div>

                <h4 className="text-lg font-bold text-gray-900">{req.packageType}</h4>
                <p className="text-xs text-gray-500">
                  Target Parcel: <strong className="text-gray-800">{req.landName}</strong> • Fee: ₹{req.fee}
                </p>
              </div>

              {/* Status and Action */}
              <div className="flex items-center gap-4">
                {req.status === 'REPORT_READY' ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => navigate(`/farmer/soil/report/${req.id}`)}
                  >
                    View Issued Soil Health Card <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => navigate('/partner/reports')}
                  >
                    <Upload className="w-4 h-4" /> Input Test Readings
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
