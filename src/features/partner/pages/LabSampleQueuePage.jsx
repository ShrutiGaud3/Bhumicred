import React, { useState, useEffect } from 'react';
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
  RefreshCw,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { soilService } from '../../soil/services/soilService.js';

export const LabSampleQueuePage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const res = await soilService.getSoilRequests();
        if (res.data) {
          setRequests(res.data);
        }
      } catch (e) {
        console.warn('Failed to load soil requests for lab queue:', e);
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

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
        {loading ? (
          <div className="py-12 text-center text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
            <p className="text-xs">Loading laboratory queue...</p>
          </div>
        ) : requests.length === 0 ? (
          <Card className="p-8 text-center border-dashed border border-slate-200">
            <FlaskConical className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No samples in lab queue</p>
            <p className="text-xs text-slate-500 mt-1">Incoming farm soil test requests will appear here for chemical analysis.</p>
          </Card>
        ) : (
          requests.map((req) => {
            const reqId = req._id || req.id;
            const isReady = req.status === 'REPORT_READY';

            return (
              <Card key={reqId} className="p-6 border border-gray-200 hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {req.requestNumber}
                      </span>
                      <StatusBadge status={req.status || 'SAMPLE_COLLECTION_SCHEDULED'} />
                    </div>

                    <h4 className="text-lg font-bold text-gray-900">{req.packageType}</h4>
                    <p className="text-xs text-gray-500">
                      Target Parcel: <strong className="text-gray-800">{req.landName}</strong> • Fee:{' '}
                      {req.fee > 0 ? `₹${req.fee}` : '₹0 (Free Scheme)'}
                    </p>
                  </div>

                  {/* Status and Action */}
                  <div className="flex items-center gap-4">
                    {isReady ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => navigate(`/farmer/soil/report/${reqId}`)}
                      >
                        View Issued Soil Health Card <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800"
                        onClick={() => navigate(`/partner/reports?requestId=${reqId}`)}
                      >
                        <Upload className="w-4 h-4" /> Input Test Readings & Certify
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LabSampleQueuePage;
