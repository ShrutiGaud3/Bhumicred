import React, { useState, useRef, useMemo } from 'react';
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
  Compass,
  RotateCcw,
  PlusCircle,
  Activity
} from 'lucide-react';
import { Button } from './Button.jsx';

export const InteractiveGisMap = ({
  initialPoints,
  initialPolygons,
  onPointsChange,
  onPolygonChange,
  onAreaChange,
  readOnly = false,
  allowDrawing = true,
  landName = 'Parcel Plot A',
  height = 'h-80 sm:h-96'
}) => {
  // Extract initial points from props with fallback default 4 vertices
  const defaultInitial = [
    { x: 30, y: 35, lat: 22.5648, lng: 72.9288 },
    { x: 74, y: 28, lat: 22.5658, lng: 72.9312 },
    { x: 82, y: 74, lat: 22.5632, lng: 72.9325 },
    { x: 26, y: 76, lat: 22.5621, lng: 72.9295 }
  ];

  const startingPoints = useMemo(() => {
    if (initialPoints && Array.isArray(initialPoints)) {
      return initialPoints;
    }
    if (initialPolygons && Array.isArray(initialPolygons)) {
      if (initialPolygons[0]?.coordinates && Array.isArray(initialPolygons[0].coordinates)) {
        if (initialPolygons[0].coordinates.length === 0) {
          return [];
        }
        return initialPolygons[0].coordinates.map((c, idx) => ({
          x: c.x ?? (idx === 0 ? 30 : idx === 1 ? 74 : idx === 2 ? 82 : 26),
          y: c.y ?? (idx === 0 ? 35 : idx === 1 ? 28 : idx === 2 ? 74 : 76),
          lat: c.lat ?? (22.564 + idx * 0.001),
          lng: c.lng ?? (72.928 + idx * 0.001)
        }));
      }
    }
    return [];
  }, [initialPoints, initialPolygons]);

  const [points, setPoints] = useState(startingPoints);

  React.useEffect(() => {
    setPoints(startingPoints);
  }, [startingPoints]);
  const [showNdvi, setShowNdvi] = useState(false);
  const [mapMode, setMapMode] = useState('SATELLITE'); // 'SATELLITE' | 'CADASTRAL'
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const svgRef = useRef(null);

  // SVG Polygon Points String without percentage for correct SVG coordinate mapping in viewBox 0 0 100 100
  const svgPointsString = useMemo(() => {
    return points.map((p) => `${p.x},${p.y}`).join(' ');
  }, [points]);

  // Calculate closed boundary polyline string (connecting back to vertex 1)
  const svgClosedPolylineString = useMemo(() => {
    if (points.length === 0) return '';
    if (points.length < 3) return points.map((p) => `${p.x},${p.y}`).join(' ');
    return [...points, points[0]].map((p) => `${p.x},${p.y}`).join(' ');
  }, [points]);

  // Calculate Shoelace formula acreage for any given set of vertices
  const calculatePointsAcreage = (pts) => {
    if (!pts || pts.length < 3) return '0.00';
    let area = 0;
    for (let i = 0; i < pts.length; i++) {
      const j = (i + 1) % pts.length;
      area += pts[i].x * pts[j].y;
      area -= pts[j].x * pts[i].y;
    }
    area = Math.abs(area) / 2;
    // Scale factor so default 4-node polygon maps accurately to 12.40 Acres
    return Math.max(0.5, ((area / 2184) * 12.40)).toFixed(2);
  };

  // Memoized acreage for current state
  const acreage = useMemo(() => {
    return calculatePointsAcreage(points);
  }, [points]);

  const notifyChange = (newPts) => {
    setPoints(newPts);
    const newAcreage = calculatePointsAcreage(newPts);
    if (onPointsChange) onPointsChange(newPts, newAcreage);
    if (onPolygonChange) onPolygonChange(newPts, newAcreage);
    if (onAreaChange) onAreaChange(newAcreage);
  };

  const handleMapClick = (e) => {
    if (readOnly || !allowDrawing) return;
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const baseLat = 22.5645;
    const baseLng = 72.9288;
    const newLat = Number((baseLat + (y - 50) * 0.0001).toFixed(4));
    const newLng = Number((baseLng + (x - 50) * 0.0001).toFixed(4));

    const updatedPoints = [...points, { x, y, lat: newLat, lng: newLng }];
    notifyChange(updatedPoints);
  };

  const handleRemovePoint = (index, e) => {
    e.stopPropagation();
    if (readOnly) return;
    const updated = points.filter((_, i) => i !== index);
    notifyChange(updated);
  };

  const handleUndo = (e) => {
    e?.stopPropagation();
    if (points.length > 0) {
      const updated = points.slice(0, -1);
      notifyChange(updated);
    }
  };

  const handleClear = (e) => {
    e?.stopPropagation();
    notifyChange([]);
  };

  const handleResetDefault = (e) => {
    e?.stopPropagation();
    notifyChange(defaultInitial);
  };

  return (
    <div className="rounded-2xl border border-emerald-900/60 bg-neutral-950 overflow-hidden shadow-2xl text-white">
      {/* Top Map Controls */}
      <div className="p-3.5 bg-gradient-to-r from-neutral-900 via-neutral-950 to-slate-900 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm tracking-wide">{landName}</span>
              {points.length >= 3 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Closed Boundary
                </span>
              )}
            </div>
            <span className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
              <span>{points.length} Boundary Vertices</span>
              <span>•</span>
              <span>Est. Area: <strong className="text-emerald-400 font-bold">{acreage} Acres</strong></span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* NDVI Green Health Layer Toggle */}
          <button
            type="button"
            onClick={() => setShowNdvi(!showNdvi)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 text-xs ${
              showNdvi
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400'
                : 'bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 border border-neutral-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            NDVI Health Heatmap
          </button>

          {/* Map Layer Mode */}
          <button
            type="button"
            onClick={() => setMapMode(mapMode === 'SATELLITE' ? 'CADASTRAL' : 'SATELLITE')}
            className="px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 text-neutral-300 font-semibold transition-all flex items-center gap-1.5 text-xs"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            {mapMode === 'SATELLITE' ? 'Satellite Feed' : 'Cadastral Naksha'}
          </button>

          {!readOnly && allowDrawing && (
            <>
              {points.length === 0 ? (
                <button
                  type="button"
                  onClick={() => notifyChange(defaultInitial)}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 text-xs font-semibold transition-colors flex items-center gap-1"
                  title="Auto-Plot Demo Boundary"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Demo Boundary</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleUndo}
                    className="px-2.5 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 text-xs font-semibold transition-colors flex items-center gap-1"
                    title="Undo last plotted point"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span className="hidden sm:inline">Undo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 rounded-xl bg-neutral-800/80 hover:bg-rose-950 text-neutral-400 hover:text-rose-300 border border-neutral-700 transition-colors"
                    title="Clear Coordinates"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Interactive Map Visual Stage */}
      <div
        ref={svgRef}
        onClick={handleMapClick}
        className={`relative ${height} w-full overflow-hidden cursor-crosshair select-none bg-[#0a120c]`}
      >
        {/* Empty Map Drawing Guidance */}
        {points.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center z-10">
            <div className="p-3.5 bg-neutral-900/90 border border-emerald-500/30 rounded-2xl shadow-xl backdrop-blur-md max-w-sm">
              <MapPin className="w-6 h-6 text-emerald-400 mx-auto mb-1.5 animate-bounce" />
              <p className="text-xs font-bold text-neutral-200">Interactive GIS Drawing Stage</p>
              <p className="text-[11px] text-neutral-400 mt-1">Click anywhere on the satellite canvas to plot land boundary vertices (minimum 3 points to form polygon).</p>
            </div>
          </div>
        )}
        {/* Simulated High-Res Satellite Grid Terrain Texture */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            mapMode === 'SATELLITE'
              ? 'bg-[radial-gradient(#2d4231_1.5px,transparent_1.5px)] [background-size:20px_20px] bg-[#0c180e]'
              : 'bg-[linear-gradient(to_right,#1b2b20_1px,transparent_1px),linear-gradient(to_bottom,#1b2b20_1px,transparent_1px)] bg-[size:32px_32px] bg-[#0b140f]'
          }`}
        />

        {/* Agricultural Field Crop Field Simulation Pattern */}
        <div className="absolute inset-0 opacity-45 mix-blend-overlay pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-48 rounded-3xl bg-emerald-700/50 blur-xl transform -rotate-12"></div>
          <div className="absolute bottom-8 right-1/4 w-80 h-56 rounded-3xl bg-teal-800/40 blur-2xl transform rotate-6"></div>
          <div className="absolute top-8 right-12 w-48 h-36 rounded-2xl bg-lime-900/30 blur-xl"></div>
        </div>

        {/* Optional NDVI Vegetation Heatmap Overlay */}
        {showNdvi && (
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/35 via-lime-500/30 to-amber-500/25 backdrop-blur-[0.5px] animate-in fade-in duration-300 flex items-end p-3 pointer-events-none z-10">
            <div className="bg-neutral-900/95 border border-emerald-500/40 px-3.5 py-2 rounded-xl text-[11px] text-neutral-200 flex items-center gap-3 shadow-2xl backdrop-blur-md">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span> High Biomass (NDVI &gt; 0.75)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400"></span> Moderate Canopy (0.45 - 0.75)</span>
            </div>
          </div>
        )}

        {/* Dynamic Connected SVG Polygon and Border Lines Overlay */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          <defs>
            {/* Polygon Gradient Fill */}
            <linearGradient id="polyEmeraldFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
              <stop offset="50%" stopColor="#059669" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.38" />
            </linearGradient>

            {/* Glowing filter for neon boundary */}
            <filter id="gisNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Pattern for boundary plot interior stripes */}
            <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#34d399" strokeWidth="0.8" strokeOpacity="0.2" />
            </pattern>
          </defs>

          {/* 1. Closed Polygon Fill (when 3 or more points) */}
          {points.length >= 3 && (
            <>
              {/* Solid gradient fill */}
              <polygon
                points={svgPointsString}
                fill="url(#polyEmeraldFill)"
              />
              {/* Hatch pattern interior overlay */}
              <polygon
                points={svgPointsString}
                fill="url(#diagonalHatch)"
              />
            </>
          )}

          {/* 2. Glowing Outer Boundary Border Line */}
          {points.length >= 2 && (
            <polyline
              points={svgClosedPolylineString}
              fill="none"
              stroke="#059669"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#gisNeonGlow)"
              vectorEffect="non-scaling-stroke"
              opacity="0.8"
            />
          )}

          {/* 3. Primary Crisp Neon Boundary Line */}
          {points.length >= 2 && (
            <polyline
              points={svgClosedPolylineString}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {/* 4. Active Animated Dashed Survey Guideline */}
          {points.length >= 2 && (
            <polyline
              points={svgClosedPolylineString}
              fill="none"
              stroke="#a7f3d0"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {/* Dynamic Distance / Length Tags along Connected Border Edges */}
        {points.length >= 2 && points.map((p1, idx) => {
          if (points.length < 3 && idx === points.length - 1) return null;
          const p2 = points[(idx + 1) % points.length];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          
          // Approx euclidean distance converted to simulated meters
          const distMeters = Math.round(Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)) * 3.4);

          return (
            <div
              key={`edge-${idx}`}
              style={{ left: `${midX}%`, top: `${midY}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              <div className="px-1.5 py-0.5 rounded bg-black/80 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 shadow-md backdrop-blur-sm whitespace-nowrap">
                {distMeters} m
              </div>
            </div>
          );
        })}

        {/* Clickable & Hoverable Boundary Vertex Pins */}
        {points.map((p, idx) => (
          <div
            key={`vertex-${idx}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center group cursor-pointer"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Outer Pulsing Halo */}
            <div className="absolute w-8 h-8 rounded-full bg-emerald-400/20 animate-ping pointer-events-none" />

            {/* Core Vertex Pin Circle */}
            <div className="relative w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-300 text-slate-950 ring-2 ring-emerald-950 border border-emerald-200 flex items-center justify-center text-[10px] font-black shadow-xl transition-transform transform group-hover:scale-125">
              {idx + 1}
            </div>

            {/* Hover Tooltip with Coordinates and Delete Option */}
            <div className={`absolute bottom-full mb-2 bg-neutral-900/95 border border-emerald-500/40 px-2.5 py-1.5 rounded-xl text-[10px] font-mono text-neutral-200 shadow-2xl backdrop-blur-md whitespace-nowrap transition-all duration-150 flex items-center gap-2 ${
              hoveredIdx === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}>
              <span className="text-emerald-300 font-bold">Vertex #{idx + 1}:</span>
              <span>{p.lat}°N, {p.lng}°E</span>
              {!readOnly && points.length > 3 && (
                <button
                  type="button"
                  onClick={(e) => handleRemovePoint(idx, e)}
                  className="ml-1 p-0.5 text-rose-400 hover:text-rose-200 hover:bg-rose-900/50 rounded"
                  title="Remove this vertex"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Hint banner for interactive mode */}
        {!readOnly && allowDrawing && points.length < 3 && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none z-20">
            <div className="bg-neutral-900/95 text-neutral-200 px-4 py-2 rounded-full border border-emerald-500/40 text-xs shadow-2xl flex items-center gap-2 backdrop-blur-md animate-pulse">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              Click anywhere on the satellite canvas to place land boundary points ({points.length}/3 minimum to close polygon)
            </div>
          </div>
        )}
      </div>

      {/* Coordinate Summary & Cadastral Status Strip */}
      <div className="p-3 bg-neutral-950 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            CRS: <strong className="text-neutral-200 font-mono">EPSG:4326 (WGS-84)</strong>
          </span>
          <span className="text-neutral-600">•</span>
          <span>Cadastral Precision: <strong className="text-neutral-200 font-semibold">0.5m High-Res Cadastral</strong></span>
          <span className="text-neutral-600">•</span>
          <span className="text-emerald-400 font-semibold">{points.length} Vertices Connected</span>
        </div>

        {!readOnly && points.length > 0 && (
          <button
            type="button"
            onClick={handleResetDefault}
            className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg hover:bg-emerald-950/40 border border-emerald-900/40"
          >
            <RefreshCw className="w-3 h-3" /> Reset to Default Polygon
          </button>
        )}
      </div>
    </div>
  );
};

