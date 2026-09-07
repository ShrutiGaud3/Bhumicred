import React, { useState } from 'react';
import {
  X,
  Trees,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Camera,
  ShieldCheck,
  Compass,
  Layers,
  Save,
  QrCode,
  Sparkles
} from 'lucide-react';
import { Button } from '../../../components/ui/Button.jsx';
import { useToast } from '../../../components/ui/ToastContext.jsx';

export const TreeGeotagModal = ({ isOpen, onClose, taskData }) => {
  const toast = useToast();

  const [trees, setTrees] = useState([
    { id: 'TR-01', species: 'Teakwood (Tectona grandis)', ageYears: 4.5, girthCm: 38, heightM: 6.2, health: 'EXCELLENT', lat: 22.5646, lng: 72.9289, isVerified: true },
    { id: 'TR-02', species: 'Teakwood (Tectona grandis)', ageYears: 4.5, girthCm: 41, heightM: 6.5, health: 'EXCELLENT', lat: 22.5648, lng: 72.9292, isVerified: true },
    { id: 'TR-03', species: 'Sandalwood (Santalum album)', ageYears: 3.0, girthCm: 24, heightM: 4.1, health: 'GOOD', lat: 22.5651, lng: 72.9295, isVerified: false },
    { id: 'TR-04', species: 'Sandalwood (Santalum album)', ageYears: 3.0, girthCm: 22, heightM: 3.8, health: 'NEEDS_PRUNING', lat: 22.5653, lng: 72.9298, isVerified: false },
    { id: 'TR-05', species: 'Neem (Azadirachta indica)', ageYears: 6.0, girthCm: 56, heightM: 8.4, health: 'EXCELLENT', lat: 22.5656, lng: 72.9301, isVerified: true },
  ]);

  const [selectedTree, setSelectedTree] = useState(trees[0]);
  const [surveyNotes, setSurveyNotes] = useState('All teakwood stems show robust cambium thickness and zero fungal borer presence.');

  if (!isOpen) return null;

  const handleToggleVerified = (id) => {
    setTrees((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isVerified: !t.isVerified } : t))
    );
    if (selectedTree?.id === id) {
      setSelectedTree((prev) => ({ ...prev, isVerified: !prev.isVerified }));
    }
  };

  const handleSaveInspection = () => {
    toast.success('Tree census GPS coordinates & biometric inspection signed off successfully!');
    onClose();
  };

  const verifiedCount = trees.filter((t) => t.isVerified).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/50">
          <div className="flex items-center gap-2">
            <Trees className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                Drone & Tree Geotagging Field Inspector
              </h3>
              <p className="text-xs text-neutral-500">
                Plot: {taskData?.landName || 'South Riverbed Parcel'} • Survey No: {taskData?.surveyNo || '412/1'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              {verifiedCount} / {trees.length} Trees Verified
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-200/60 dark:hover:bg-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Tree List */}
          <div className="md:col-span-1 space-y-2.5 border-r border-neutral-100 dark:border-neutral-800 pr-0 md:pr-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Tagged Tree Assets
            </h4>

            {trees.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTree(t)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedTree.id === t.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-sm'
                    : 'bg-neutral-50 dark:bg-neutral-800/40 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-900 dark:text-white">{t.id}</span>
                  {t.isVerified ? (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Geotagged
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-600">Pending</span>
                  )}
                </div>

                <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-1 truncate">
                  {t.species}
                </p>

                <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1.5 font-mono">
                  <span>Girth: {t.girthCm}cm</span>
                  <span>Ht: {t.heightM}m</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Selected Tree Detail & Biometrics Form */}
          <div className="md:col-span-2 space-y-5">
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-300">Biometric Sensor Inspection</span>
                <h3 className="text-lg font-black mt-0.5">{selectedTree.id} • {selectedTree.species}</h3>
                <p className="text-xs text-emerald-200 font-mono mt-0.5">
                  GPS: {selectedTree.lat}° N, {selectedTree.lng}° E (±0.3m Accuracy)
                </p>
              </div>

              <Button
                size="sm"
                variant={selectedTree.isVerified ? 'outline' : 'primary'}
                onClick={() => handleToggleVerified(selectedTree.id)}
                className={`flex items-center gap-1.5 ${selectedTree.isVerified ? 'bg-white/10 text-white border-white/30' : ''}`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {selectedTree.isVerified ? 'Mark Pending' : 'Verify & Lock Geotag'}
              </Button>
            </div>

            {/* Metric inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-500 block">Trunk Girth</span>
                <span className="font-bold text-base text-neutral-900 dark:text-white">{selectedTree.girthCm} cm</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-500 block">Canopy Height</span>
                <span className="font-bold text-base text-neutral-900 dark:text-white">{selectedTree.heightM} m</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-500 block">Estimated Age</span>
                <span className="font-bold text-base text-neutral-900 dark:text-white">{selectedTree.ageYears} Yrs</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-500 block">Health Rating</span>
                <span className="font-bold text-xs text-emerald-600 block mt-1 uppercase">{selectedTree.health}</span>
              </div>
            </div>

            {/* Field Photo Simulation Upload */}
            <div className="p-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/30 text-center">
              <Camera className="w-8 h-8 text-neutral-400 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                High-Resolution Canopy & Trunk Geo-Tagged Photo Attached
              </p>
              <span className="text-[10px] text-neutral-400">
                EXIF Metadata: 2026-09-07 14:22:18 IST • Drone Altitude: 15m
              </span>
            </div>

            {/* Field Notes */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Surveyor Field Notes & Arborist Observation
              </label>
              <textarea
                rows={2}
                value={surveyNotes}
                onChange={(e) => setSurveyNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Surveyor: <strong>Devang Joshi (TerraAgri Survey ID #AGR-402)</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveInspection} className="flex items-center gap-1.5">
              <Save className="w-4 h-4" /> Sign Off Inspection Dossier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
