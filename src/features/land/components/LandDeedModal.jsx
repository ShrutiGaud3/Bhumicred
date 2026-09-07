import React, { useRef } from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  QrCode,
  MapPin,
  FileCheck,
  Compass,
  Layers,
  Building2,
  Landmark
} from 'lucide-react';
import { Button } from '../../../components/ui/Button.jsx';

export const LandDeedModal = ({ isOpen, onClose, landData }) => {
  const printRef = useRef();

  if (!isOpen) return null;

  const data = landData || {
    id: 'LND-9082',
    khasraNumber: '412/1',
    khataNumber: '88/A',
    ownerName: 'Ramesh Patel',
    village: 'Navli',
    taluka: 'Anand',
    district: 'Anand, Gujarat',
    totalAreaAcres: 12.4,
    soilType: 'Alluvial Loam',
    irrigationStatus: 'Tube Well & Drip System',
    verificationDate: '24 Jan 2026',
    revenueSealNo: 'REV-GUJ-2026-88190',
    coordinates: [
      { lat: 22.5645, lng: 72.9288 },
      { lat: 22.5658, lng: 72.9312 },
      { lat: 22.5632, lng: 72.9325 },
      { lat: 22.5621, lng: 72.9295 }
    ]
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
            <Landmark className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">
              Cadastral Land Deed & GIS Certificate
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
          <div className="border-4 border-double border-neutral-800/40 dark:border-neutral-700 p-6 rounded-2xl bg-gradient-to-b from-neutral-50/50 to-transparent dark:from-neutral-800/20">
            {/* Header */}
            <div className="text-center pb-4 border-b border-neutral-300 dark:border-neutral-700">
              <div className="inline-flex items-center justify-center p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 mb-2">
                <Landmark className="w-8 h-8" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight uppercase">
                Digital Land Registry & Cadastral Certificate
              </h1>
              <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mt-0.5">
                BHUMICRED Land Verification & Sovereign GIS Grid
              </p>
              <div className="inline-block mt-2 px-3 py-1 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 rounded-full text-xs font-bold tracking-wider">
                PARCEL REGISTRATION CERTIFICATE • #{data.id}
              </div>
            </div>

            {/* Land Ownership Particulars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 text-xs border-b border-neutral-200 dark:border-neutral-700">
              <div>
                <span className="text-neutral-500 font-medium">Recorded Owner:</span>
                <p className="font-bold text-sm text-neutral-900 dark:text-white mt-0.5">{data.ownerName}</p>
              </div>
              <div>
                <span className="text-neutral-500 font-medium">Khasra / Survey No:</span>
                <p className="font-bold text-sm text-emerald-700 dark:text-emerald-400 mt-0.5">{data.khasraNumber}</p>
              </div>
              <div>
                <span className="text-neutral-500 font-medium">Khata No:</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{data.khataNumber}</p>
              </div>
              <div>
                <span className="text-neutral-500 font-medium">Total Registered Area:</span>
                <p className="font-bold text-neutral-900 dark:text-white mt-0.5">{data.totalAreaAcres} Acres</p>
              </div>
              <div>
                <span className="text-neutral-500 font-medium">Jurisdiction:</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{data.village}, {data.taluka}, {data.district}</p>
              </div>
              <div>
                <span className="text-neutral-500 font-medium">Soil & Irrigation:</span>
                <p className="font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{data.soilType} • {data.irrigationStatus}</p>
              </div>
            </div>

            {/* Cadastral Polygon Coordinates */}
            <div className="my-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white mb-2.5 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                Verified Cadastral Boundary Coordinates (WGS-84)
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                {data.coordinates.map((coord, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <span className="text-[10px] text-neutral-400 block font-sans">Vertex P{idx + 1}</span>
                    <span className="font-semibold">{coord.lat.toFixed(4)}° N, {coord.lng.toFixed(4)}° E</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation & Encumbrance Status */}
            <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Non-Encumbrance Status
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                This parcel has been cross-referenced against State 7/12 RoR records, verified with satellite NDVI historical green cover, and certified free of active revenue litigation.
              </p>
            </div>

            {/* Footer Sign-off */}
            <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex items-end justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg border border-neutral-300 shadow-sm text-neutral-900">
                  <QrCode className="w-12 h-12" />
                </div>
                <div>
                  <p className="font-mono text-[10px] text-neutral-400">Digital Cadastral Seal</p>
                  <p className="font-bold font-mono text-xs text-neutral-800 dark:text-neutral-200">
                    {data.revenueSealNo}
                  </p>
                  <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                    Verified on {data.verificationDate}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="w-32 border-b border-dashed border-neutral-400 pb-1 mb-1 font-serif text-sm italic font-bold text-neutral-700 dark:text-neutral-300">
                  K. V. Sharma
                </div>
                <p className="text-[10px] text-neutral-500 font-medium">Zonal Revenue Nodal Officer</p>
                <p className="text-[9px] text-neutral-400">District Collectorate Office</p>
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
            <Download className="w-4 h-4" /> Download Certified Deed
          </Button>
        </div>
      </div>
    </div>
  );
};
