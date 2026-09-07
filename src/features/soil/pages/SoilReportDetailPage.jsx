import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MOCK_SOIL_REQUESTS } from '../../../services/mockData/soilMock.js';
import { SoilCertificateModal } from '../components/SoilCertificateModal.jsx';

export const SoilReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCertificate, setShowCertificate] = useState(false);

  const soilReq = MOCK_SOIL_REQUESTS.find((s) => s.id === id) || MOCK_SOIL_REQUESTS[0];
  const report = soilReq.reportData || {
    pH: { value: 7.2, rating: 'Optimal (Neutral)', range: '6.5 - 7.5' },
    organicCarbon: { value: '0.82%', rating: 'High Fertility', range: '> 0.75%' },
    nitrogen: { value: '280 kg/ha', rating: 'Medium', range: '280 - 560 kg/ha' },
    phosphorus: { value: '24 kg/ha', rating: 'High', range: '10 - 25 kg/ha' },
    potassium: { value: '310 kg/ha', rating: 'High', range: '110 - 280 kg/ha' },
    zinc: { value: '1.1 ppm', rating: 'Adequate', range: '> 0.6 ppm' },
    iron: { value: '5.4 ppm', rating: 'Adequate', range: '> 4.5 ppm' },
    recommendation: 'Soil is in prime health for cotton & pulse rotation. Supplement with 20kg/acre organic bio-potash during flowering.',
  };

  const nutrientCards = [
    { name: 'pH (Reaction)', value: report.pH.value, rating: report.pH.rating, range: report.pH.range, status: 'OPTIMAL' },
    { name: 'Organic Carbon (OC)', value: report.organicCarbon.value, rating: report.organicCarbon.rating, range: report.organicCarbon.range, status: 'HIGH' },
    { name: 'Available Nitrogen (N)', value: report.nitrogen.value, rating: report.nitrogen.rating, range: report.nitrogen.range, status: 'MEDIUM' },
    { name: 'Available Phosphorus (P)', value: report.phosphorus.value, rating: report.phosphorus.rating, range: report.phosphorus.range, status: 'HIGH' },
    { name: 'Available Potassium (K)', value: report.potassium.value, rating: report.potassium.rating, range: report.potassium.range, status: 'HIGH' },
    { name: 'Available Zinc (Zn)', value: report.zinc.value, rating: report.zinc.rating, range: report.zinc.range, status: 'ADEQUATE' },
    { name: 'Available Iron (Fe)', value: report.iron.value, rating: report.iron.rating, range: report.iron.range, status: 'ADEQUATE' },
    { name: 'Electrical Conductivity (EC)', value: '0.42 dS/m', rating: 'Normal (Non-Saline)', range: '< 1.0 dS/m', status: 'OPTIMAL' },
  ];

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Certified Soil Health Analysis Card"
        subtitle={`Report Ref: ${soilReq.requestNumber} • Land: ${soilReq.landName} • Lab: ${soilReq.assignedLab}`}
        backTo="/farmer/soil"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Soil Hub', path: '/farmer/soil' },
          { label: soilReq.requestNumber },
        ]}
        actions={
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
              Order Recommended Fertilizers
            </Button>
          </div>
        }
      />

      {/* Main Soil Report Card */}
      <Card className="p-8 md:p-10 border-2 border-emerald-600 bg-white space-y-8">
        {/* Header summary */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b-2 border-emerald-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                GOVERNMENT ACCREDITED NABL LAB REPORT
              </span>
              <Badge variant="success">Verified Analysis</Badge>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              12-Parameter Nutrient Diagnostic Health Card
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Sample ID: {soilReq.requestNumber} • Collected on {soilReq.sampleDate || '15 Jan 2026'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCertificate(true)}
              className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1.5"
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
            {report.recommendation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
              <span className="font-bold text-emerald-900 block">Basal Application</span>
              <span className="text-gray-600">50kg DAP + 25kg MOP per acre</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
              <span className="font-bold text-emerald-900 block">Micronutrient Spray</span>
              <span className="text-gray-600">Zinc Sulfate 0.5% at tillering</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-emerald-100 shadow-sm">
              <span className="font-bold text-emerald-900 block">Nitrogen Timing</span>
              <span className="text-gray-600">Split dose at 30 & 60 DAS</span>
            </div>
          </div>
        </div>

        {/* Lab Certification Sign-off */}
        <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>
            Analyzed at: <strong className="text-gray-800">{soilReq.assignedLab}</strong>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Digitally certified by Chief Soil Chemist (QR Authenticated)
          </div>
        </div>
      </Card>

      {/* Official Printable Soil Health Card Modal */}
      <SoilCertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        reportData={{
          id: soilReq.requestNumber,
          farmerName: 'Ramesh Patel',
          village: 'Navli, Anand District, Gujarat',
          khasraNo: soilReq.landName || '412/1',
          sampleDate: soilReq.sampleDate || '15 Jan 2026',
          testingDate: '18 Jan 2026',
          labName: soilReq.assignedLab || 'TerraAgri Regional Soil Testing Laboratory',
          labRegNo: 'NABL/TC-9042',
          healthScore: 84,
          ph: report.pH.value,
          ec: '0.42 dS/m',
          oc: report.organicCarbon.value,
          nitrogen: report.nitrogen.value,
          phosphorus: report.phosphorus.value,
          potassium: report.potassium.value,
          recommendation: report.recommendation
        }}
      />
    </div>
  );
};
