import React, { useState, useRef, useEffect } from 'react';
import {
  Layers,
  MapPin,
  Compass,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Pencil,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  TreePine,
  Droplets,
  Sun,
  Eye,
  Info,
  Sliders,
} from 'lucide-react';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';

export const SovereignGisMap = ({
  height = 'min-h-[480px] h-[520px]',
  parcels = [],
  activeParcelId = null,
  onSelectParcel = null,
  allowDrawing = false,
  onPolygonDrawn = null,
  initialCoords = null,
  defaultLayer = 'SATELLITE', // 'SATELLITE' | 'CADASTRAL' | 'NDVI' | 'WATER' | 'TREES'
  showControls = true,
  className = '',
}) => {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [layerMode, setLayerMode] = useState(defaultLayer);
  const [hoveredParcel, setHoveredParcel] = useState(null);
  const [layerOpacity, setLayerOpacity] = useState(0.9);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState(initialCoords || []);
  const [calculatedArea, setCalculatedArea] = useState(4.85);

  // Handle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Only display real parcels provided
  const displayParcels = parcels || [];

  // Handle Drawing Click on SVG
  const handleSvgClick = (e) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 800);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 500);

    const newPoints = [...drawnPoints, [x, y]];
    setDrawnPoints(newPoints);

    if (newPoints.length >= 3) {
      // Shoelace approximation
      let areaSum = 0;
      for (let i = 0; i < newPoints.length - 1; i++) {
        areaSum += newPoints[i][0] * newPoints[i + 1][1] - newPoints[i + 1][0] * newPoints[i][1];
      }
      const last = newPoints[newPoints.length - 1];
      const first = newPoints[0];
      areaSum += last[0] * first[1] - first[0] * last[1];
      const approxAcres = Number((Math.abs(areaSum) / 5500).toFixed(2));
      setCalculatedArea(approxAcres > 0 ? approxAcres : 3.2);

      if (onPolygonDrawn) {
        onPolygonDrawn({
          areaAcres: approxAcres,
          coordinates: newPoints,
          vertexCount: newPoints.length,
        });
      }
    }
  };

  const handleResetDrawing = () => {
    setDrawnPoints([]);
    setCalculatedArea(0);
    if (onPolygonDrawn) onPolygonDrawn(null);
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl border border-slate-200 overflow-hidden shadow-xl bg-slate-950 select-none ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-none' : height
      } ${className}`}
    >
      {/* 1. Base Layer Satellite / Topo Surface */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{ opacity: layerOpacity }}
      >
        {layerMode === 'SATELLITE' && (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950">
            {/* Coordinate Grid Texture */}
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #34d399 1.2px, transparent 1.2px), linear-gradient(to right, rgba(52,211,153,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(52,211,153,0.08) 1px, transparent 1px)',
                backgroundSize: '48px 48px, 48px 48px, 48px 48px',
              }}
            />
          </div>
        )}

        {layerMode === 'CADASTRAL' && (
          <div className="absolute inset-0 bg-slate-900">
            {/* High-Contrast Cadastral Revenue Grid Texture */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(234,179,8,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(234,179,8,0.2) 1px, transparent 1px)',
                backgroundSize: '32px 32px, 32px 32px',
              }}
            />
          </div>
        )}

        {layerMode === 'NDVI' && (
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900 via-yellow-950 to-lime-900">
            {/* Multispectral False-Color Heatmap Pattern */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse at 40% 50%, rgba(34,197,94,0.6) 0%, transparent 60%), radial-gradient(ellipse at 75% 30%, rgba(234,179,8,0.5) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(16,185,129,0.7) 0%, transparent 60%)',
              }}
            />
          </div>
        )}

        {layerMode === 'WATER' && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900">
            {/* Canal & Distributary Network */}
            <svg className="w-full h-full absolute inset-0 opacity-60" viewBox="0 0 800 500">
              <path
                d="M 50,250 Q 250,200 450,260 T 780,220"
                stroke="#06b6d4"
                strokeWidth="12"
                fill="none"
                strokeOpacity="0.7"
              />
              <path
                d="M 350,230 L 400,450"
                stroke="#38bdf8"
                strokeWidth="5"
                fill="none"
                strokeDasharray="6 4"
              />
              <path
                d="M 600,240 L 680,60"
                stroke="#38bdf8"
                strokeWidth="5"
                fill="none"
                strokeDasharray="6 4"
              />
            </svg>
          </div>
        )}

        {layerMode === 'TREES' && (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950" />
        )}
      </div>

      {/* 2. Vector SVG Parcel Polygons & Overlay Canvas */}
      <svg
        className={`w-full h-full absolute inset-0 transition-transform duration-300 ${
          isDrawing ? 'cursor-crosshair' : 'cursor-default'
        }`}
        viewBox="0 0 800 500"
        onClick={handleSvgClick}
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Registered Land Parcels */}
        {displayParcels.map((p) => {
          const isSelected = p.id === activeParcelId;
          const isHovered = hoveredParcel?.id === p.id;

          // Color themes based on layer
          let fill = 'rgba(16, 185, 129, 0.22)';
          let stroke = '#10b981';

          if (layerMode === 'CADASTRAL') {
            fill = 'rgba(234, 179, 8, 0.18)';
            stroke = '#eab308';
          } else if (layerMode === 'NDVI') {
            const ndvi = p.ndviScore || 0.75;
            fill =
              ndvi > 0.8
                ? 'rgba(34, 197, 94, 0.45)'
                : ndvi > 0.65
                ? 'rgba(163, 230, 53, 0.35)'
                : 'rgba(245, 158, 11, 0.35)';
            stroke = ndvi > 0.8 ? '#22c55e' : '#84cc16';
          }

          if (isSelected) {
            fill = 'rgba(59, 130, 246, 0.4)';
            stroke = '#3b82f6';
          }

          return (
            <g
              key={p.id}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredParcel(p)}
              onMouseLeave={() => setHoveredParcel(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectParcel) onSelectParcel(p);
              }}
            >
              {/* Parcel Polygon Area */}
              <polygon
                points={p.svgPolygon || '100,100 300,120 320,280 80,240'}
                fill={fill}
                stroke={stroke}
                strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.8}
                strokeDasharray={layerMode === 'CADASTRAL' ? '6 3' : 'none'}
                filter={isSelected ? 'url(#glow)' : undefined}
                className="transition-all duration-150"
              />

              {/* Centroid Label & Stamp */}
              {p.centroid && (
                <g transform={`translate(${p.centroid[0]}, ${p.centroid[1]})`}>
                  <rect
                    x="-45"
                    y="-12"
                    width="90"
                    height="24"
                    rx="6"
                    fill="rgba(15, 23, 42, 0.85)"
                    stroke={stroke}
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="4"
                    fill="#ffffff"
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono tracking-tight"
                  >
                    #{p.khasraNumber} ({p.area}Ac)
                  </text>
                </g>
              )}

              {/* Tree Census Markers if mode active */}
              {(layerMode === 'TREES' || layerMode === 'SATELLITE') && p.centroid && (
                <g transform={`translate(${p.centroid[0] - 25}, ${p.centroid[1] + 25})`}>
                  <circle cx="0" cy="0" r="10" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
                  <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                    🌲 {p.treeCount}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* User Interactive Drawn Polygon */}
        {drawnPoints.length > 0 && (
          <g>
            <polygon
              points={drawnPoints.map((pt) => `${pt[0]},${pt[1]}`).join(' ')}
              fill="rgba(52, 211, 153, 0.3)"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
            {drawnPoints.map((pt, idx) => (
              <circle
                key={idx}
                cx={pt[0]}
                cy={pt[1]}
                r="6"
                fill="#ffffff"
                stroke="#059669"
                strokeWidth="2.5"
              />
            ))}
          </g>
        )}
      </svg>

      {/* 3. Floating Layer Switcher Buttons */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
          {/* Layer Modes */}
          <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-xl overflow-x-auto">
            <button
              onClick={() => setLayerMode('SATELLITE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                layerMode === 'SATELLITE'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Satellite
            </button>
            <button
              onClick={() => setLayerMode('CADASTRAL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                layerMode === 'CADASTRAL'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Cadastral 7/12
            </button>
            <button
              onClick={() => setLayerMode('NDVI')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                layerMode === 'NDVI'
                  ? 'bg-lime-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> NDVI Canopy
            </button>
            <button
              onClick={() => setLayerMode('WATER')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                layerMode === 'WATER'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" /> Canals
            </button>
            <button
              onClick={() => setLayerMode('TREES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                layerMode === 'TREES'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <TreePine className="w-3.5 h-3.5" /> Trees
            </button>
          </div>

          {/* Map Utility Controls (Fullscreen, Zoom, Draw) */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-xl">
            {allowDrawing && (
              <>
                <Button
                  size="sm"
                  variant={isDrawing ? 'primary' : 'outline'}
                  onClick={() => setIsDrawing(!isDrawing)}
                  className={`text-xs px-2.5 py-1 ${
                    isDrawing ? 'bg-emerald-600 text-white' : 'text-slate-200 border-white/20'
                  }`}
                >
                  <Pencil className="w-3 h-3 mr-1" />
                  {isDrawing ? 'Drawing On' : 'Draw Polygon'}
                </Button>
                {drawnPoints.length > 0 && (
                  <button
                    onClick={handleResetDrawing}
                    className="p-1.5 text-slate-300 hover:text-rose-400 hover:bg-white/10 rounded-lg"
                    title="Reset Drawing"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 4. Interactive Hovered Parcel Glassmorphic Tooltip */}
      {hoveredParcel && (
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl border border-emerald-500/40 shadow-2xl text-xs space-y-1.5 max-w-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
            <span className="font-bold text-emerald-400 font-mono">
              Survey #{hoveredParcel.surveyNumber} • Khasra #{hoveredParcel.khasraNumber}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              {hoveredParcel.area} Acres
            </span>
          </div>

          <h5 className="font-bold text-slate-100 truncate">{hoveredParcel.landName}</h5>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
            <div>
              <span className="text-slate-400 block text-[10px]">Owner:</span>
              <span className="font-semibold text-white">{hoveredParcel.ownerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Soil / Trees:</span>
              <span className="font-semibold text-emerald-300">
                {hoveredParcel.soilType} • {hoveredParcel.treeCount} Trees
              </span>
            </div>
          </div>

          {hoveredParcel.ndviScore && (
            <div className="mt-1 flex items-center justify-between text-[10px] bg-white/5 px-2 py-1 rounded">
              <span className="text-slate-400">Canopy Health:</span>
              <span className="font-bold text-emerald-400">
                NDVI {hoveredParcel.ndviScore} (Optimal)
              </span>
            </div>
          )}
        </div>
      )}

      {/* 5. Live Drawing Area Badge */}
      {isDrawing && drawnPoints.length >= 3 && (
        <div className="absolute bottom-4 right-4 z-20 bg-emerald-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl border border-emerald-400/40 shadow-xl flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <div className="text-xs">
            <span className="text-emerald-200 block text-[10px] uppercase font-bold">
              Drawn GIS Polygon
            </span>
            <span className="font-mono font-black text-sm">{calculatedArea} Acres</span>
          </div>
        </div>
      )}

      {/* 6. Compass Stamp in Top-Right Corner */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none opacity-40 hover:opacity-100 transition-opacity">
        <div className="w-10 h-10 rounded-full bg-slate-900/80 border border-white/20 flex items-center justify-center text-white">
          <Compass className="w-6 h-6 text-emerald-400 animate-spin-slow" />
        </div>
      </div>
    </div>
  );
};

export default SovereignGisMap;
