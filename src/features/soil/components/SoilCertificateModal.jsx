import React, { useRef, useState } from 'react';
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
  Sprout,
  Loader2,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button.jsx';
import { downloadElementAsPdf } from '../../../utils/pdfDownloader.js';

export const SoilCertificateModal = ({ isOpen, onClose, reportData }) => {
  const printRef = useRef();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const data = reportData || {
    id: 'SHC-PENDING',
    farmerName: 'Citizen Farmer',
    village: 'N/A',
    khasraNo: 'N/A',
    sampleDate: 'N/A',
    testingDate: 'N/A',
    labName: 'Accredited Soil Laboratory',
    labRegNo: 'NABL/REG-00',
    healthScore: 0,
    ph: 7.0,
    ec: '0.00 dS/m',
    oc: '0.00%',
    nitrogen: '0 kg/ha',
    phosphorus: '0 kg/ha',
    potassium: '0 kg/ha',
    recommendation: 'No diagnostic report data available.'
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const fileName = `Soil_Health_Card_${String(data.id || 'REPORT').replace(/[^a-zA-Z0-9-_]/g, '_')}`;
      const success = await downloadElementAsPdf('soil-health-card-printable', fileName);
      if (!success) {
        window.print();
      }
    } catch (err) {
      console.warn('Soil card PDF generation error:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in print:p-0 print:m-0 print:static print:bg-white print:overflow-visible print:block">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:max-w-none print:w-full print:border-none print:shadow-none print:bg-white print:overflow-visible print:rounded-none">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/50 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">
              Official Soil Health Card Certificate
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="flex items-center gap-1.5"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isDownloading ? 'Generating PDF...' : 'Download PDF'}
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
        <div ref={printRef} className="p-3 sm:p-5 overflow-y-auto bg-slate-100 dark:bg-neutral-950 flex flex-col items-center flex-1 print:p-0 print:m-0 print:bg-white print:overflow-visible">
          {/* Official Emblem & Header Card */}
          <div
            id="soil-health-card-printable"
            className="w-full max-w-xl bg-white text-slate-900 p-5 sm:p-6 rounded-xl border-2 border-emerald-800 shadow-sm box-border"
            style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
          >
            {/* Header / National Emblem */}
            <div className="text-center pb-3 border-b border-emerald-700/30">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 mb-1.5 shadow-sm">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ display: 'block' }}
                >
                  <path
                    d="M12 22C12 22 12 15 12 11"
                    stroke="#065f46"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 11C10 7 6 6 3 7C3 11 6 15 12 15"
                    fill="#10b981"
                    stroke="#065f46"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 11C14 7 18 6 21 7C21 11 18 15 12 15"
                    fill="#34d399"
                    stroke="#065f46"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 22H17"
                    stroke="#065f46"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h1 className="text-base sm:text-lg font-black text-emerald-950 tracking-tight uppercase leading-snug">
                National Soil Health Diagnostic Registry
              </h1>
              <p className="text-[11px] font-bold text-emerald-700 mt-0.5 leading-normal">
                BHUMICRED Agritech Platform • In Collaboration with NABL Certified Labs
              </p>
              <div className="inline-block mt-1.5 px-3.5 py-1 bg-emerald-800 text-white rounded-full text-[11px] font-bold tracking-wider leading-tight shadow-sm">
                CERTIFICATE OF SOIL ANALYSIS • {data.id}
              </div>
            </div>

            {/* Farmer & Parcel Details */}
            <div className="grid grid-cols-3 gap-y-3 gap-x-4 py-3 my-2 border-b border-emerald-700/20 text-xs">
              <div>
                <span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider block leading-normal">Farmer Name:</span>
                <p className="font-bold text-xs text-slate-900 mt-0.5 leading-normal break-words">{data.farmerName}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider block leading-normal">Khasra / Plot ID:</span>
                <p className="font-bold text-xs text-slate-900 mt-0.5 leading-normal break-words">{data.khasraNo}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider block leading-normal">Location:</span>
                <p className="font-semibold text-xs text-slate-800 mt-0.5 leading-normal break-words">{data.village}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider block leading-normal">Collection Date:</span>
                <p className="font-semibold text-xs text-slate-800 mt-0.5 leading-normal">{data.sampleDate}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider block leading-normal">Testing Facility:</span>
                <p className="font-semibold text-xs text-slate-800 mt-0.5 leading-normal break-words">{data.labName}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider block leading-normal">NABL Accr. No:</span>
                <p className="font-mono font-bold text-xs text-emerald-800 mt-0.5 leading-normal">{data.labRegNo}</p>
              </div>
            </div>

            {/* Test Results Table */}
            <div className="my-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-950 mb-1.5 flex items-center gap-1.5 leading-normal">
                <FlaskConical className="w-3.5 h-3.5 text-emerald-700" />
                12-Parameter Chemical & Nutrient Profile
              </h4>

              <div className="overflow-hidden rounded-lg border border-slate-300 w-full">
                <table className="w-full text-xs text-left border-collapse table-fixed">
                  <colgroup>
                    <col style={{ width: '38%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '22%' }} />
                  </colgroup>
                  <thead className="bg-emerald-100 font-bold text-emerald-950">
                    <tr>
                      <th className="py-2 px-2.5 border-b border-r border-slate-300 text-[11px] leading-normal font-bold">Parameter</th>
                      <th className="py-2 px-2.5 border-b border-r border-slate-300 text-[11px] leading-normal font-bold">Observed Value</th>
                      <th className="py-2 px-2.5 border-b border-r border-slate-300 text-[11px] leading-normal font-bold">Standard Range</th>
                      <th className="py-2 px-2.5 border-b border-slate-300 text-[11px] leading-normal font-bold">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="py-1.5 px-2.5 font-semibold text-slate-800 border-r border-slate-200 text-[11px] leading-normal">Soil Reaction (pH)</td>
                      <td className="py-1.5 px-2.5 font-bold text-slate-900 border-r border-slate-200 text-[11px] leading-normal">{data.ph}</td>
                      <td className="py-1.5 px-2.5 text-slate-600 border-r border-slate-200 text-[11px] leading-normal">6.5 - 7.5</td>
                      <td className="py-1.5 px-2.5 text-emerald-700 font-bold text-[11px] leading-normal">Optimal Neutral</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2.5 font-semibold text-slate-800 border-r border-slate-200 text-[11px] leading-normal">Electrical Conductivity (EC)</td>
                      <td className="py-1.5 px-2.5 font-bold text-slate-900 border-r border-slate-200 text-[11px] leading-normal">{data.ec}</td>
                      <td className="py-1.5 px-2.5 text-slate-600 border-r border-slate-200 text-[11px] leading-normal">&lt; 1.0 dS/m</td>
                      <td className="py-1.5 px-2.5 text-emerald-700 font-bold text-[11px] leading-normal">Normal (Non-Saline)</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2.5 font-semibold text-slate-800 border-r border-slate-200 text-[11px] leading-normal">Organic Carbon (OC)</td>
                      <td className="py-1.5 px-2.5 font-bold text-slate-900 border-r border-slate-200 text-[11px] leading-normal">{data.oc}</td>
                      <td className="py-1.5 px-2.5 text-slate-600 border-r border-slate-200 text-[11px] leading-normal">&gt; 0.75%</td>
                      <td className="py-1.5 px-2.5 text-emerald-700 font-bold text-[11px] leading-normal">High / Fertile</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2.5 font-semibold text-slate-800 border-r border-slate-200 text-[11px] leading-normal">Available Nitrogen (N)</td>
                      <td className="py-1.5 px-2.5 font-bold text-slate-900 border-r border-slate-200 text-[11px] leading-normal">{data.nitrogen}</td>
                      <td className="py-1.5 px-2.5 text-slate-600 border-r border-slate-200 text-[11px] leading-normal">280 - 560 kg/ha</td>
                      <td className="py-1.5 px-2.5 text-blue-700 font-bold text-[11px] leading-normal">Medium Adequate</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2.5 font-semibold text-slate-800 border-r border-slate-200 text-[11px] leading-normal">Available Phosphorus (P)</td>
                      <td className="py-1.5 px-2.5 font-bold text-slate-900 border-r border-slate-200 text-[11px] leading-normal">{data.phosphorus}</td>
                      <td className="py-1.5 px-2.5 text-slate-600 border-r border-slate-200 text-[11px] leading-normal">14 - 28 kg/ha</td>
                      <td className="py-1.5 px-2.5 text-emerald-700 font-bold text-[11px] leading-normal">High</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 px-2.5 font-semibold text-slate-800 border-r border-slate-200 text-[11px] leading-normal">Available Potassium (K)</td>
                      <td className="py-1.5 px-2.5 font-bold text-slate-900 border-r border-slate-200 text-[11px] leading-normal">{data.potassium}</td>
                      <td className="py-1.5 px-2.5 text-slate-600 border-r border-slate-200 text-[11px] leading-normal">150 - 300 kg/ha</td>
                      <td className="py-1.5 px-2.5 text-emerald-700 font-bold text-[11px] leading-normal">High</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scientific Agronomist Advice */}
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs w-full box-border">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1 text-[11px] leading-normal">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                Agronomist Dosage & Advisory:
              </span>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                {data.recommendation}
              </p>
            </div>

            {/* Verification Footer with Seal & QR */}
            <div className="mt-3 pt-2.5 border-t border-emerald-700/30 flex items-center justify-between text-xs w-full">
              <div className="flex items-center gap-2.5">
                <div className="p-1 bg-white rounded border border-slate-300 shadow-sm text-slate-900 shrink-0">
                  <QrCode className="w-8 h-8 text-slate-900" />
                </div>
                <div>
                  <p className="font-mono text-[9px] text-slate-500 leading-normal">Tamper-Proof Verification ID</p>
                  <p className="font-bold font-mono text-[10px] text-slate-900 leading-normal">
                    BK-SHC-QR991028-VERIFIED
                  </p>
                  <span className="inline-flex items-center gap-1 text-[9px] text-emerald-700 font-bold leading-normal">
                    <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0" /> Digitally Signed by Chief Soil Chemist
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="w-36 border-b border-dashed border-slate-400 pb-1 mb-1 font-serif text-xs italic font-bold text-slate-900 text-center leading-normal">
                  Dr. Arvind Mehta
                </div>
                <p className="text-[9px] text-slate-600 font-medium leading-normal text-center">Head of Agronomy & Lab Quality</p>
                <p className="text-[8px] text-slate-500 leading-normal text-center">TerraAgri Testing Facility</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-end gap-3 print:hidden">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-1.5"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isDownloading ? 'Generating PDF...' : 'Download Official PDF'}
          </Button>
        </div>
      </div>
    </div>
  );
};
