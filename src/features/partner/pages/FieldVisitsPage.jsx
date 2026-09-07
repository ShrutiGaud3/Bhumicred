import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Phone,
  Navigation,
  CheckCircle2,
  Clock,
  User,
  Trees,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { TreeGeotagModal } from '../components/TreeGeotagModal.jsx';

const MOCK_VISITS = [
  {
    id: 'vst_01',
    farmerName: 'Ramesh Patel',
    phone: '+91 91234 56780',
    village: 'Mogri Gram',
    surveyNumber: '402/A',
    visitDate: '12 Sep 2026',
    timeSlot: '11:00 AM',
    purpose: 'Tree Damage Drone Inspection (Hailstorm Loss)',
    status: 'SCHEDULED',
    gpsTarget: '22.5645, 72.9281',
  },
  {
    id: 'vst_02',
    farmerName: 'Jitendra Vaghela',
    phone: '+91 98251 44091',
    village: 'Jitodia',
    surveyNumber: '619/C',
    visitDate: '14 Sep 2026',
    timeSlot: '02:30 PM',
    purpose: 'Soil Core Sampling (N-P-K Micronutrient Baseline)',
    status: 'SCHEDULED',
    gpsTarget: '22.5710, 72.9340',
  },
];

export const FieldVisitsPage = () => {
  const [visits, setVisits] = useState(MOCK_VISITS);
  const [activeCheckInVisit, setActiveCheckInVisit] = useState(null);
  const [checkInSuccess, setCheckInSuccess] = useState(false);
  const [selectedTreeTask, setSelectedTreeTask] = useState(null);

  const handleConfirmCheckIn = () => {
    setCheckInSuccess(true);
    setTimeout(() => {
      setCheckInSuccess(false);
      if (activeCheckInVisit) {
        setVisits(
          visits.map((v) => (v.id === activeCheckInVisit.id ? { ...v, status: 'COMPLETED' } : v))
        );
      }
      setActiveCheckInVisit(null);
    }, 1500);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Field Inspection & Geo-Tagging Visits"
        subtitle="Schedule on-site land surveys, GPS point verifications, and tree sensor biometrics."
        breadcrumbs={[
          { label: 'Partner Portal', path: '/partner/dashboard' },
          { label: 'Field Visits' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visits.map((visit) => (
          <Card key={visit.id} className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-gray-900">{visit.farmerName}</span>
                <span className="text-xs text-gray-500">• {visit.village}</span>
              </div>
              <StatusBadge status={visit.status} />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Visit Purpose:</span>
                <span className="font-semibold text-gray-900">{visit.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Scheduled Time:</span>
                <span className="font-medium text-emerald-700">{visit.visitDate} at {visit.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Target Survey Parcel:</span>
                <span className="font-semibold text-gray-900">Survey No. {visit.surveyNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">GPS Target:</span>
                <span className="font-mono text-gray-700">{visit.gpsTarget}</span>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-1 text-xs"
                onClick={() => alert(`Calling farmer ${visit.phone}...`)}
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-1 text-xs"
                onClick={() => setSelectedTreeTask({ landName: visit.village, surveyNo: visit.surveyNumber })}
              >
                <Trees className="w-3.5 h-3.5 text-emerald-600" /> Tree Geotag
              </Button>

              {visit.status !== 'COMPLETED' ? (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full flex items-center justify-center gap-1 text-xs"
                  onClick={() => setActiveCheckInVisit(visit)}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Check-in
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  className="w-full flex items-center justify-center gap-1 text-xs text-emerald-700 bg-emerald-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Checked-In
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* GPS Check-in Modal */}
      {activeCheckInVisit && (
        <Modal
          isOpen={Boolean(activeCheckInVisit)}
          onClose={() => setActiveCheckInVisit(null)}
          title="On-Site GPS Geotag Check-in"
        >
          <div className="space-y-6 py-2">
            {checkInSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Check-in Verified!</h4>
                <p className="text-sm text-gray-500 mt-1">
                  GPS coordinates matched within 4.2m of target parcel {activeCheckInVisit.surveyNumber}.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-600">
                  Please verify your device GPS location matches farmer {activeCheckInVisit.farmerName}'s parcel boundary.
                </p>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1 text-emerald-950">
                  <div><strong>Target Coordinates:</strong> {activeCheckInVisit.gpsTarget}</div>
                  <div><strong>Device Live GPS:</strong> 22.5646, 72.9282 (Locked)</div>
                  <div className="text-emerald-700 font-semibold pt-1">✓ Proximity Verified: Inside Boundary Polygon</div>
                </div>

                <Button
                  variant="primary"
                  className="w-full py-3"
                  onClick={handleConfirmCheckIn}
                >
                  Confirm On-Site Geotag Check-in
                </Button>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Interactive Tree Geotagging & Drone Biometric Inspector Modal */}
      <TreeGeotagModal
        isOpen={Boolean(selectedTreeTask)}
        onClose={() => setSelectedTreeTask(null)}
        taskData={selectedTreeTask}
      />
    </div>
  );
};
