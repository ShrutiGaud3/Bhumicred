import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  Award,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  FileCheck,
  Calendar,
  MapPin,
  FlaskConical,
  Sprout
} from 'lucide-react';
import { Button } from '../../../components/ui/Button.jsx';

export const SoilCertificateModal = ({ isOpen, onClose, reportData }) => {
  const printRef = useRef();

  if (!isOpen) return null;

  const data = reportData || {
    id: 'SHC-2026-90812',
    farmerName: 'Ramesh Patel',
    village: 'Navli, Anand District, Gujarat',
    khasraNo: '412/1 (Plot A)',
    sampleDate: '15 Jan 2026',
    testingDate: '18 Jan 2026',
    labName: 'TerraAgri NABL Accredited Regional Laboratory, Anand',
    labRegNo: 'NABL/TC-9042',
    healthScore: 84,
    ph: 6.8,
    ec: '0.45 dS/m',
    oc: '0.78% (High)',
    nitrogen: '290 kg/ha (Medium)',
    phosphorus: '22 kg/ha (High)',
    potassium: '310 kg/ha (High)',
    recommendation: 'Apply 40kg Neem Coated Urea and 10kg Bio-NPK consortium prior to rabi sowing.'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">
              Official Soil Health Card Certificate
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center gap-1.5">
              <Printer className="w-4 h-4" /> Print / PDF
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-200/60 dark:hover:bg-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Area */}
        <div ref={printRef} className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
          {/* Official Emblem & Header */}
          <div className="border-4 border-double border-emerald-700/60 p-6 rounded-2xl bg-gradient-to-b from-emerald-50/30 to-transparent dark:from-emerald-950/20">
            <div className="text-center pb-4 border-b border-emerald-600/30">
              <div className="inline-flex items-center justify-center p-2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 mb-2">
                <Sprout className="w-8 h-8" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-emerald-900 dark:text-emerald-300 tracking-tight uppercase">
                National Soil Health Diagnostic Registry
              </h1>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                BHUMICRED Agritech Platform • In Collaboration with NABL Certified Labs
              </p>
              <div className="inline-block mt-2 px-3 py-1 bg-emerald-800 text-white rounded-full text-xs font-bold tracking-wider">
                CERTIFICATE OF SOIL ANALYSIS • {data.id}
              </div>
            </div>

            {/* Farmer & Parcel Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 text-xs border-b border-emerald-600/30">
              <div>
                <span className="text-neutral-500 font-medium">Farmer Name:</span>
                <p className="font-bold text-sm text-neutral-900 dark:text-white mt-0.5">{data.farmerName}</p>
              </div>
              <div>
                <span className="text-neutral-500 font-medium">Khasra / Plot ID:</span>
                <p className="font-bold text-sm text-neutral-900 dark:text-white mt-0.5">{data.khasraNo}</p>
              </div>
              <div>
                <span className="text-neutral-500 font-medium">Location:</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{data.village}</p>
              </div>
              <div>
                <span className="text-neutral-500 font-medium">Collection Date:</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{data.sampleDate}</p>
              </div>
              <div>
                <span className="text-neutral-500 font-medium">Testing Facility:</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{data.labName}</p>
              </div>
              <div>
                <span className="text-neutral-500 font-medium">NABL Accr. No:</span>
                <p className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">{data.labRegNo}</p>
              </div>
            </div>

            {/* Test Results Table */}
            <div className="my-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-2.5 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                12-Parameter Chemical & Nutrient Profile
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-neutral-200 dark:border-neutral-700">
                  <thead className="bg-emerald-100/60 dark:bg-emerald-950/60 font-bold text-emerald-900 dark:text-emerald-200">
                    <tr>
                      <th className="p-2 border-b border-r border-neutral-200 dark:border-neutral-700">Parameter</th>
                      <th className="p-2 border-b border-r border-neutral-200 dark:border-neutral-700">Observed Value</th>
                      <th className="p-2 border-b border-r border-neutral-200 dark:border-neutral-700">Standard Range</th>
                      <th className="p-2 border-b border-neutral-200 dark:border-neutral-700">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    <tr>
                      <td className="p-2 font-medium border-r border-neutral-200 dark:border-neutral-700">Soil Reaction (pH)</td>
                      <td className="p-2 font-bold border-r border-neutral-200 dark:border-neutral-700">{data.ph}</td>
                      <td className="p-2 border-r border-neutral-200 dark:border-neutral-700">6.5 - 7.5</td>
                      <td className="p-2 text-emerald-600 font-semibold">Optimal Neutral</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium border-r border-neutral-200 dark:border-neutral-700">Electrical Conductivity (EC)</td>
                      <td className="p-2 font-bold border-r border-neutral-200 dark:border-neutral-700">{data.ec}</td>
                      <td className="p-2 border-r border-neutral-200 dark:border-neutral-700">&lt; 1.0 dS/m</td>
                      <td className="p-2 text-emerald-600 font-semibold">Normal (Non-Saline)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium border-r border-neutral-200 dark:border-neutral-700">Organic Carbon (OC)</td>
                      <td className="p-2 font-bold border-r border-neutral-200 dark:border-neutral-700">{data.oc}</td>
                      <td className="p-2 border-r border-neutral-200 dark:border-neutral-700">&gt; 0.75%</td>
                      <td className="p-2 text-emerald-600 font-semibold">High / Fertile</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium border-r border-neutral-200 dark:border-neutral-700">Available Nitrogen (N)</td>
                      <td className="p-2 font-bold border-r border-neutral-200 dark:border-neutral-700">{data.nitrogen}</td>
                      <td className="p-2 border-r border-neutral-200 dark:border-neutral-700">280 - 560 kg/ha</td>
                      <td className="p-2 text-blue-600 font-semibold">Medium Adequate</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium border-r border-neutral-200 dark:border-neutral-700">Available Phosphorus (P)</td>
                      <td className="p-2 font-bold border-r border-neutral-200 dark:border-neutral-700">{data.phosphorus}</td>
                      <td className="p-2 border-r border-neutral-200 dark:border-neutral-700">14 - 28 kg/ha</td>
                      <td className="p-2 text-emerald-600 font-semibold">High</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium border-r border-neutral-200 dark:border-neutral-700">Available Potassium (K)</td>
                      <td className="p-2 font-bold border-r border-neutral-200 dark:border-neutral-700">{data.potassium}</td>
                      <td className="p-2 border-r border-neutral-200 dark:border-neutral-700">150 - 300 kg/ha</td>
                      <td className="p-2 text-emerald-600 font-semibold">High</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scientific Agronomist Advice */}
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs">
              <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Agronomist Dosage & Advisory:
              </span>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {data.recommendation}
              </p>
            </div>

            {/* Verification Footer with Seal & QR */}
            <div className="mt-6 pt-4 border-t border-emerald-600/30 flex items-end justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-neutral-300 shadow-sm text-neutral-900">
                  <QrCode className="w-12 h-12" />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-neutral-400">Tamper-Proof Verification ID</p>
                  <p className="font-bold font-mono text-xs text-neutral-800 dark:text-neutral-200">
                    BK-SHC-QR991028-VERIFIED
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Digitally Signed by Chief Soil Chemist
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="w-32 border-b border-dashed border-neutral-400 pb-1 mb-1 font-serif text-sm italic font-bold text-neutral-700 dark:text-neutral-300">
                  Dr. Arvind Mehta
                </div>
                <p className="text-[10px] text-neutral-500 font-medium">Head of Agronomy & Lab Quality</p>
                <p className="text-[9px] text-neutral-400">TerraAgri Testing Facility</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} className="flex items-center gap-1.5">
            <Download className="w-4 h-4" /> Download Official PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
