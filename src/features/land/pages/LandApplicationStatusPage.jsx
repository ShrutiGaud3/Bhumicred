import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileCheck,
  Clock,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  FileSpreadsheet,
  Trees,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Timeline } from '../../../components/ui/Timeline.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { landService } from '../services/landService.js';
import { storageService } from '../../../services/storageService.js';

export const LandApplicationStatusPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [landData, setLandData] = useState(null);
  const [loading, setLoading] = useState(true);

  const appId = applicationId || 'LND-PENDING';

  useEffect(() => {
    const fetchLand = async () => {
      setLoading(true);
      try {
        if (applicationId && applicationId !== 'BC-LND-2026-9810' && applicationId !== 'latest') {
          const res = await landService.getLandById(applicationId);
          if (res?.data) {
            setLandData(res.data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend fetch for land status fallback to local cache:', err);
      }

      // Check local storage
      const localLands = storageService.getLands();
      const matched = localLands.find(
        (l) => l.id === applicationId || l.landId === applicationId || l.surveyNumber === applicationId
      ) || localLands[0];

      if (matched) {
        setLandData(matched);
      }
      setLoading(false);
    };

    fetchLand();
  }, [applicationId]);

  const isApproved = landData?.status === 'APPROVED';
  const isQuery = landData?.status === 'QUERY_RAISED' || landData?.status === 'QUERY_PENDING';

  const timelineEvents = [
    {
      title: 'Application Submitted Online',
      description: `Revenue details, 7/12 extract, and GIS boundary submitted by Farmer ${landData?.ownerName || user?.name || 'Citizen'}.`,
      timestamp: landData?.createdAt ? new Date(landData.createdAt).toLocaleString() : 'Recently submitted',
      completed: true,
    },
    {
      title: 'Automated Satellite GIS Vertex Validation',
      description: 'AI and cadastral overlay verified polygon perimeter without boundary overlap.',
      timestamp: 'Completed via Geo-Sentinel AI',
      completed: true,
    },
    {
      title: 'Taluka Revenue Officer Desk Review',
      description: 'Document 7/12 authenticated against state revenue registry.',
      timestamp: isApproved ? 'Verified & Authenticated' : 'In Progress',
      completed: isApproved,
      current: !isApproved && !isQuery,
    },
    {
      title: 'Field Partner Geotag & Biomass Audit',
      description: `Assigned inspection partner validates standing tree assets (${landData?.treeCount || landData?.agronomicDetails?.treeCount || 0} Trees).`,
      timestamp: isApproved ? 'Audit Passed' : 'Scheduled',
      completed: isApproved,
    },
    {
      title: 'Final Approval & Sovereign Land Card Issuance',
      description: 'Cryptographic BHUMICRED Land Passport and Registry ID generated.',
      timestamp: isApproved ? 'Active on Ledger' : 'Pending',
      completed: isApproved,
    },
  ];

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title={`Application Status: ${landData?.landId || landData?.id || appId}`}
        subtitle="Track real-time progress of revenue verification, satellite audits, and cadastral registration."
        backTo="/farmer/lands"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'My Lands', path: '/farmer/lands' },
          { label: 'Application Status' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" /> Verification Lifecycle Timeline
            </h3>

            <Timeline events={timelineEvents} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Application Summary</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={landData?.status || 'PENDING_VERIFICATION'} />
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Applicant Farmer</span>
                <span className="font-semibold text-gray-900">{landData?.ownerName || user?.name || 'Citizen Farmer'}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Parcel Name</span>
                <span className="font-semibold text-gray-900">{landData?.landName || 'Registered Agricultural Plot'}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Survey / Khasra</span>
                <span className="font-semibold text-gray-900">
                  Survey {landData?.surveyNumber || 'N/A'} • Khasra {landData?.khasraNumber || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Registered Area</span>
                <span className="font-semibold text-gray-900 font-mono">
                  {landData?.area || landData?.areaAcres || '0'} {landData?.areaUnit || 'Acres'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tree Assets</span>
                <span className="font-semibold text-emerald-800">
                  {landData?.treeCount || landData?.agronomicDetails?.treeCount || 0} Trees
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-emerald-50 border-emerald-200">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-950">Have a Query or Correction?</h4>
                <p className="text-xs text-emerald-800 mt-1 mb-3">
                  If an administrative officer requests clarifying documents, you can update your submission directly.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100 w-full"
                  onClick={() => navigate('/query-correction')}
                >
                  Open Query Correction Window
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
