import React, { useState, useRef } from 'react';
import {
  MapPin,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
  CheckCircle2,
  Trash2,
  Info,
  Maximize2,
  Compass
} from 'lucide-react';
import { Button } from './Button.jsx';

export const InteractiveGisMap = ({
  initialPoints = [
    { x: 30, y: 35, lat: 22.5645, lng: 72.9288 },
    { x: 75, y: 25, lat: 22.5658, lng: 72.9312 },
    { x: 85, y: 70, lat: 22.5632, lng: 72.9325 },
    { x: 25, y: 80, lat: 22.5621, lng: 72.9295 }
  ],
  onPointsChange,
  readOnly = false,
  landName = 'Parcel Plot A',
  height = 'h-80 sm:h-96'
}) => {
  const [points, setPoints] = useState(initialPoints);
  const [showNdvi, setShowNdvi] = useState(false);
  const [mapMode, setMapMode] = useState('SATELLITE'); // 'SATELLITE' | 'CADASTRAL'
  const svgRef = useRef(null);

  // Calculate polygon path
  const polygonPointsStr = points.map((p) => `${p.x}%,${p.y}%`).join(' ');

  // Calculate simulated acres based on bounding box
  const calculateAcreage = () => {
    if (points.length < 3) return 0;
    return (points.length * 3.1).toFixed(2);
  };

  const handleMapClick = (e) => {
    if (readOnly) return;
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const baseLat = 22.5645;
    const baseLng = 72.9288;
    const newLat = Number((baseLat + (y - 50) * 0.0001).toFixed(4));
    const newLng = Number((baseLng + (x - 50) * 0.0001).toFixed(4));

    const updatedPoints = [...points, { x, y, lat: newLat, lng: newLng }];
    setPoints(updatedPoints);
    if (onPointsChange) onPointsChange(updatedPoints);
  };

  const handleClear = () => {
    setPoints([]);
    if (onPointsChange) onPointsChange([]);
  };

  const handleResetDefault = () => {
    setPoints(initialPoints);
    if (onPointsChange) onPointsChange(initialPoints);
  };

  return (
    <div className="rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-neutral-900 overflow-hidden shadow-xl text-white">
      {/* Top Map Controls */}
      <div className="p-3.5 bg-neutral-900/95 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <span className="font-bold text-white block">{landName}</span>
            <span className="text-[11px] text-neutral-400">
              {points.length} Boundary Vertices • Est. Area: <strong className="text-emerald-400">{calculateAcreage()} Acres</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* NDVI Green Health Layer Toggle */}
          <button
            type="button"
            onClick={() => setShowNdvi(!showNdvi)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              showNdvi
                ? 'bg-emerald-600 text-white font-semibold'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            NDVI Health Heatmap
          </button>

          {/* Map Layer Mode */}
          <button
            type="button"
            onClick={() => setMapMode(mapMode === 'SATELLITE' ? 'CADASTRAL' : 'SATELLITE')}
            className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            {mapMode === 'SATELLITE' ? 'Satellite Feed' : 'Cadastral Naksha'}
          </button>

          {!readOnly && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-900/40 text-neutral-400 hover:text-rose-400 transition-colors"
              title="Clear Coordinates"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div
        ref={svgRef}
        onClick={handleMapClick}
        className={`relative ${height} w-full overflow-hidden cursor-crosshair select-none bg-neutral-950`}
      >
        {/* Simulated Satellite Terrain Texture */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            mapMode === 'SATELLITE'
              ? 'bg-[radial-gradient(#27362a_1px,transparent_1px)] [background-size:16px_16px] bg-[#141e17]'
              : 'bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] bg-neutral-950'
          }`}
        />

        {/* Agricultural Field Crop Field Simulation Pattern */}
        <div className="absolute inset-0 opacity-40 mix-blend-overlay">
          <div className="absolute top-1/4 left-1/3 w-44 h-32 rounded-3xl bg-emerald-700/60 blur-md transform -rotate-12"></div>
          <div className="absolute bottom-10 right-1/4 w-56 h-40 rounded-3xl bg-teal-800/50 blur-lg transform rotate-6"></div>
          <div className="absolute top-10 right-10 w-36 h-28 rounded-2xl bg-amber-900/40 blur-md"></div>
        </div>

        {/* Optional NDVI Vegetation Heatmap Overlay */}
        {showNdvi && (
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/30 via-lime-500/30 to-amber-500/20 backdrop-blur-[1px] animate-in fade-in duration-300 flex items-end p-3 pointer-events-none">
            <div className="bg-neutral-900/90 border border-neutral-700 px-3 py-1.5 rounded-xl text-[10px] text-neutral-300 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> NDVI &gt; 0.75 (Healthy Canopy)
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ml-1"></span> NDVI &lt; 0.40 (Moisture Stress)
            </div>
          </div>
        )}

        {/* Dynamic Polygon Boundary Overlay */}
        {points.length > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <polygon
              points={polygonPointsStr}
              fill="rgba(16, 185, 129, 0.25)"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray={readOnly ? 'none' : '4 2'}
              className="animate-pulse duration-1000"
            />
          </svg>
        )}

        {/* Clickable Vertex Pins */}
        {points.map((p, idx) => (
          <div
            key={idx}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group pointer-events-none"
          >
            <div className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-950 flex items-center justify-center text-[9px] font-bold text-black shadow-lg">
              {idx + 1}
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono bg-neutral-900 px-1.5 py-0.5 rounded text-neutral-300 mt-1 shadow whitespace-nowrap">
              {p.lat}°N, {p.lng}°E
            </span>
          </div>
        ))}

        {/* Hint banner for interactive mode */}
        {!readOnly && points.length < 3 && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
            <div className="bg-neutral-900/90 text-neutral-300 px-4 py-1.5 rounded-full border border-neutral-700 text-xs shadow-lg flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-400" />
              Click anywhere on the satellite canvas to place land boundary points
            </div>
          </div>
        )}
      </div>

      {/* Coordinate Summary Strip */}
      <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
        <div className="flex items-center gap-3">
          <span>CRS: <strong className="text-neutral-200">EPSG:4326 (WGS-84)</strong></span>
          <span>Cadastral Resolution: <strong className="text-neutral-200">0.5m High-Res</strong></span>
        </div>

        {!readOnly && points.length > 0 && (
          <button
            type="button"
            onClick={handleResetDefault}
            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Reset to Default Polygon
          </button>
        )}
      </div>
    </div>
  );
};
