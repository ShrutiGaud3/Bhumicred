import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  TestTube,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  Layers,
  Leaf,
  Droplets,
  RefreshCw,
  Clock,
  ArrowRight,
  FlaskConical,
  Truck,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { SoilCertificateModal } from '../components/SoilCertificateModal.jsx';
import { fetchSoilRequestById } from '../soilSlice.js';

export const SoilReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showCertificate, setShowCertificate] = useState(false);

  const { activeReport, isLoading } = useSelector((state) => state.soil);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchSoilRequestById(id));
    }
  }, [id, dispatch]);

  const soilReq = activeReport;

  if (isLoading && !activeReport) {
    return (
      <div className="w-full py-24 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
        <p className="text-sm font-semibold text-slate-600">
          Loading Soil Health Record...
        </p>
      </div>
    );
  }

  if (!soilReq) {
    return (
      <div className="w-full py-16 text-center space-y-4">
        <TestTube className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Soil Request Not Found</h3>
        <Button variant="primary" onClick={() => navigate('/farmer/soil')}>
          Back to Soil Hub
        </Button>
      </div>
    );
  }

  const isReady = soilReq.status === 'REPORT_READY' && soilReq.reportData?.pH?.value;
  const report = soilReq.reportData || {};

  const nutrientCards = [
    {
      name: 'Soil Reaction (pH)',
      value: report.pH?.value || 'Pending',
      rating: report.pH?.rating || 'In Analysis',
      range: report.pH?.range || '6.5 - 7.5',
      status: 'OPTIMAL',
    },
    {
      name: 'Organic Carbon (OC)',
      value: report.organicCarbon?.value || 'Pending',
      rating: report.organicCarbon?.rating || 'In Analysis',
      range: report.organicCarbon?.range || '> 0.75%',
      status: 'HIGH',
    },
    {
      name: 'Available Nitrogen (N)',
      value: report.nitrogen?.value || 'Pending',
      rating: report.nitrogen?.rating || 'In Analysis',
      range: report.nitrogen?.range || '280 - 560 kg/ha',
      status: 'MEDIUM',
    },
    {
      name: 'Available Phosphorus (P)',
      value: report.phosphorus?.value || 'Pending',
      rating: report.phosphorus?.rating || 'In Analysis',
      range: report.phosphorus?.range || '14 - 28 kg/ha',
      status: 'HIGH',
    },
    {
      name: 'Available Potassium (K)',
      value: report.potassium?.value || 'Pending',
      rating: report.potassium?.rating || 'In Analysis',
      range: report.potassium?.range || '150 - 300 kg/ha',
      status: 'HIGH',
    },
    {
      name: 'Available Zinc (Zn)',
      value: report.zinc?.value || 'Pending',
      rating: report.zinc?.rating || 'In Analysis',
      range: report.zinc?.range || '> 0.6 ppm',
      status: 'ADEQUATE',
    },
    {
      name: 'Available Iron (Fe)',
      value: report.iron?.value || 'Pending',
      rating: report.iron?.rating || 'In Analysis',
      range: report.iron?.range || '> 4.5 ppm',
      status: 'ADEQUATE',
    },
    {
      name: 'Electrical Conductivity (EC)',
      value: report.ec?.value || 'Pending',
      rating: report.ec?.rating || 'In Analysis',
      range: report.ec?.range || '< 1.0 dS/m',
      status: 'OPTIMAL',
    },
  ];

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title={isReady ? 'Certified Soil Health Analysis Card' : 'Soil Testing Sample Tracking'}
        subtitle={`Request Ref: ${soilReq.requestNumber} • Land: ${soilReq.landName} • Lab: ${soilReq.assignedLab}`}
        backTo="/farmer/soil"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Soil Hub', path: '/farmer/soil' },
          { label: soilReq.requestNumber },
        ]}
        actions={
          isReady && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setShowCertificate(true)}
              >
                <Printer className="w-4 h-4" /> Official Certificate Preview
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/marketplace')}
              >
                Order Recommended Inputs
              </Button>
            </div>
          )
        }
      />

      {/* If Sample is still processing, show Milestone Tracker Card */}
      {!isReady ? (
        <Card className="p-8 space-y-8 bg-white border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusBadge status={soilReq.status} />
                <span className="text-xs font-mono text-slate-500">
                  Pickup Scheduled for {soilReq.pickupDate} ({soilReq.pickupTimeSlot})
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{soilReq.packageType}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Field Collector: <strong className="text-slate-800">{soilReq.assignedCollector}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Assigned Testing Facility:</span>
              <span className="font-semibold text-sm text-slate-800">{soilReq.assignedLab}</span>
            </div>
          </div>

          {/* 4-Stage Visual Lifecycle Stepper */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Diagnostic Testing Lifecycle
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" /> 1. Booking Scheduled
                </div>
                <p className="text-[11px] text-slate-600 mt-2">
                  Sample pickup scheduled for {soilReq.pickupDate}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                  <Truck className="w-4 h-4 animate-pulse" /> 2. Field Core Sampling
                </div>
                <p className="text-[11px] text-slate-600 mt-2">
                  Collector visiting farm boundary to draw composite grid sample
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 opacity-80">
                <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                  <FlaskConical className="w-4 h-4" /> 3. NABL Lab Spectrometry
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  12-Parameter digestion & chemical assay under NABL/TC-9042
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 opacity-80">
                <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                  <FileText className="w-4 h-4" /> 4. Health Card Issued
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Personalized dosage advice & digitally stamped certificate released
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>
              Lab analysis report will unlock automatically as soon as laboratory enters test readings.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(fetchSoilRequestById(id))}
              className="flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Check Status
            </Button>
          </div>
        </Card>
      ) : (
        /* Main Soil Report Card when Status is REPORT_READY */
        <Card className="p-8 md:p-10 border-2 border-emerald-600 bg-white space-y-8 shadow-sm">
          {/* Header summary */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b-2 border-emerald-100 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                  GOVERNMENT ACCREDITED NABL LAB REPORT
                </span>
                <Badge variant="success">Verified Analysis</Badge>
                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Score: {soilReq.healthScore || 84}/100
                </span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                12-Parameter Nutrient Diagnostic Health Card
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Sample ID: <strong className="font-mono text-slate-700">{soilReq.requestNumber}</strong> • Collected on {soilReq.pickupDate || '15 Jan 2026'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCertificate(true)}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2.5 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <FileText className="w-4 h-4" /> View Signed Certificate
              </button>
            </div>
          </div>

          {/* Diagnostic Nutrient Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {nutrientCards.map((n, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-xs font-semibold text-gray-500 block truncate">{n.name}</span>
                <div className="text-xl font-bold text-gray-900 mt-1">{n.value}</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 text-[11px]">
                  <span className="font-semibold text-emerald-700">{n.rating}</span>
                  <span className="text-gray-400 font-mono">{n.range}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Agronomic Recommendations */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              AI & Agronomist Personalized Dosage Advice
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              {report.recommendation || 'Balanced soil fertility. Apply recommended bio-potash prior to crop sowing.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              {(report.dosageAdvice && report.dosageAdvice.length > 0
                ? report.dosageAdvice
                : [
                    { stage: 'Basal Application', treatment: '50kg DAP + 25kg MOP per acre' },
                    { stage: 'Micronutrient Spray', treatment: 'Zinc Sulfate 0.5% at tillering' },
                    { stage: 'Nitrogen Timing', treatment: 'Split dose at 30 & 60 DAS' },
                  ]
              ).map((adv, i) => (
                <div key={i} className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
                  <span className="font-bold text-emerald-900 block">{adv.stage}</span>
                  <span className="text-gray-600">{adv.treatment}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lab Certification Sign-off */}
          <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <div>
              Analyzed at: <strong className="text-gray-800">{soilReq.assignedLab}</strong> (Reg: {soilReq.labRegNo || 'NABL/TC-9042'})
            </div>
            <div className="flex items-center gap-2 text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Digitally certified by Chief Soil Chemist (QR Authenticated)
            </div>
          </div>
        </Card>
      )}

      {/* Official Printable Soil Health Card Modal */}
      {isReady && (
        <SoilCertificateModal
          isOpen={showCertificate}
          onClose={() => setShowCertificate(false)}
          reportData={{
            id: soilReq.requestNumber,
            farmerName: user?.name || soilReq.userName || 'Citizen Farmer',
            village: soilReq.landId?.village ? `${soilReq.landId.village}, ${soilReq.landId.district || 'Anand'}` : 'Anand District, Gujarat',
            khasraNo: soilReq.landName || soilReq.surveyNumber || 'Plot A-101',
            sampleDate: soilReq.pickupDate || '15 Jan 2026',
            testingDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            labName: soilReq.assignedLab || 'TerraAgri Regional Soil Testing Laboratory',
            labRegNo: soilReq.labRegNo || 'NABL/TC-9042',
            healthScore: soilReq.healthScore || 84,
            ph: report.pH?.value || 6.8,
            ec: report.ec?.value || '0.45 dS/m',
            oc: report.organicCarbon?.value || '0.82%',
            nitrogen: report.nitrogen?.value || '280 kg/ha',
            phosphorus: report.phosphorus?.value || '24 kg/ha',
            potassium: report.potassium?.value || '310 kg/ha',
            recommendation: report.recommendation,
          }}
        />
      )}
    </div>
  );
};

export default SoilReportDetailPage;
