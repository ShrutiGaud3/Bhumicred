import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  QrCode,
  TreePine,
  Leaf,
  Globe2,
  Award,
  Calendar
} from 'lucide-react';
import { Button } from '../../../components/ui/Button.jsx';

export const CarbonCertificateModal = ({ isOpen, onClose, carbonData }) => {
  const printRef = useRef();

  if (!isOpen) return null;

  const data = carbonData || {
    id: 'VCS-CRB-2026-08912',
    farmerName: 'Ramesh Patel',
    projectName: 'Gujarat Agroforestry & Soil Carbon Sequestration Initiative',
    verifier: 'Verra / Gold Standard Accredited Third-Party Auditor',
    creditsIssued: 142.5,
    vintageYear: '2025-2026',
    issuedDate: '12 Feb 2026',
    serialNumber: 'IN-VCS-9081-2026-00142',
    equivalentOffset: '142.5 Metric Tonnes of CO2e Sequestered'
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
            <TreePine className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">
              Verified Carbon Credit Certificate
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
          <div className="border-4 border-double border-teal-700/60 p-6 rounded-2xl bg-gradient-to-b from-teal-50/40 to-transparent dark:from-teal-950/20">
            {/* Header */}
            <div className="text-center pb-4 border-b border-teal-600/30">
              <div className="inline-flex items-center justify-center p-2 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 mb-2">
                <Leaf className="w-8 h-8" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-teal-950 dark:text-teal-300 tracking-tight uppercase">
                Certificate of Carbon Sequestration
              </h1>
              <p className="text-xs font-semibold text-teal-700 dark:text-teal-400 mt-0.5">
                BHUMICRED Verified Climate Action Ledger
              </p>
              <div className="inline-block mt-2 px-3 py-1 bg-teal-800 text-white rounded-full text-xs font-bold tracking-wider">
                CERTIFICATE ID • {data.id}
              </div>
            </div>

            {/* Credit Details */}
            <div className="text-center py-6 border-b border-teal-600/30">
              <p className="text-xs text-neutral-500 uppercase font-semibold">Total Verified Carbon Credits Issued</p>
              <div className="text-4xl font-black text-teal-700 dark:text-teal-300 mt-1">
                {data.creditsIssued} tCO2e
              </div>
              <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-1">
                {data.equivalentOffset}
              </p>
            </div>

            {/* Recipient & Registry Info */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-teal-600/30">
              <div>
                <span className="text-neutral-500 font-medium">Beneficiary / Landowner:</span>
                <p className="font-bold text-sm text-neutral-900 dark:text-white mt-0.5">{data.farmerName}</p>
              </div>
              <div>
                <span className="text-neutral-500 font-medium">Project Name:</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{data.projectName}</p>
              </div>
              <div>
                <span className="text-neutral-500 font-medium">Verification Agency:</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{data.verifier}</p>
              </div>
              <div>
                <span className="text-neutral-500 font-medium">Vintage & Date:</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{data.vintageYear} (Issued: {data.issuedDate})</p>
              </div>
            </div>

            {/* Footer with Serial Code & QR */}
            <div className="mt-6 pt-4 border-t border-teal-600/30 flex items-end justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-neutral-300 shadow-sm text-neutral-900">
                  <QrCode className="w-12 h-12" />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-neutral-400">Serialized Blockchain Token ID</p>
                  <p className="font-bold font-mono text-xs text-neutral-800 dark:text-neutral-200">
                    {data.serialNumber}
                  </p>
                  <span className="text-[11px] text-teal-600 font-semibold block mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                    Verified by National Carbon Registry
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="w-32 border-b border-dashed border-neutral-400 pb-1 mb-1 font-serif text-sm italic font-bold text-neutral-700 dark:text-neutral-300">
                  S. K. Nambiar
                </div>
                <p className="text-[10px] text-neutral-500 font-medium">Chief Sustainability Officer</p>
                <p className="text-[9px] text-neutral-400">BHUMICRED Foundation</p>
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
            <Download className="w-4 h-4" /> Download Certificate
          </Button>
        </div>
      </div>
    </div>
  );
};
