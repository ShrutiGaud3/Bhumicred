import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Navigation,
  Pencil,
  RotateCcw,
  Maximize2,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export const MapPlaceholder = ({
  height = 'min-h-[380px] h-96',
  initialArea = 4.8,
  onPolygonChange,
  showControls = true,
  className = '',
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [polygonDrawn, setPolygonDrawn] = useState(true);
  const [mapType, setMapType] = useState('satellite'); // satellite | terrain
  const [searchQuery, setSearchQuery] = useState('');
  const [calculatedArea, setCalculatedArea] = useState(initialArea);

  const isCssValue = typeof height === 'string' && (height.endsWith('px') || height.endsWith('%') || height.endsWith('vh') || height.endsWith('rem'));
  const heightClass = isCssValue ? '' : height;
  const heightStyle = isCssValue ? { height, minHeight: height } : {};

  const handleSimulateDraw = () => {
    setIsDrawing(true);
    setTimeout(() => {
      setIsDrawing(false);
      setPolygonDrawn(true);
      setCalculatedArea((Math.random() * 3 + 2).toFixed(2));
      if (onPolygonChange) onPolygonChange({ area: 4.85, status: 'VALID_GEOMETRY' });
    }, 800);
  };

  const handleClear = () => {
    setPolygonDrawn(false);
    setCalculatedArea(0);
  };

  return (
    <div
      style={heightStyle}
      className={`relative w-full rounded-3xl border border-slate-200 overflow-hidden shadow-sm bg-slate-900 ${heightClass || 'min-h-[380px] h-96'} ${className}`}
    >
      {/* Background simulated satellite grid overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          mapType === 'satellite'
            ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 opacity-90'
            : 'bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 opacity-90'
        }`}
      >
        {/* Subtle coordinate grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle, #4ade80 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
            backgroundSize: '40px 40px, 40px 40px, 40px 40px',
          }}
        />
      </div>

      {/* Simulated Drawn GIS Polygon Shape */}
      {polygonDrawn && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
          <svg className="w-full h-full max-w-[340px] max-h-[220px] animate-in fade-in zoom-in-95 duration-300" viewBox="0 0 400 300">
            {/* Polygon Area Fill */}
            <polygon
              points="100,60 320,80 340,240 80,210"
              fill="rgba(34, 197, 94, 0.25)"
              stroke="#22c55e"
              strokeWidth="3"
              strokeDasharray="6 4"
            />
            {/* Vertex Nodes */}
            <circle cx="100" cy="60" r="6" fill="#ffffff" stroke="#16a34a" strokeWidth="3" />
            <circle cx="320" cy="80" r="6" fill="#ffffff" stroke="#16a34a" strokeWidth="3" />
            <circle cx="340" cy="240" r="6" fill="#ffffff" stroke="#16a34a" strokeWidth="3" />
            <circle cx="80" cy="210" r="6" fill="#ffffff" stroke="#16a34a" strokeWidth="3" />
            <text x="200" y="150" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">
              GIS Polygon ({calculatedArea} Acres)
            </text>
          </svg>
        </div>
      )}

      {/* Top Floating Controls: Search & Layer */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-lg max-w-xs sm:max-w-sm w-full">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 ml-1 sm:ml-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search survey / plot..."
              className="bg-transparent text-[11px] sm:text-xs text-white placeholder:text-slate-400 focus:outline-none w-full px-1 sm:px-2"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-lg text-[11px] sm:text-xs">
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl font-semibold transition-colors ${
                mapType === 'satellite' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapType('terrain')}
              className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl font-semibold transition-colors ${
                mapType === 'terrain' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Revenue
            </button>
          </div>
        </div>
      )}

      {/* Bottom Floating Toolbar: Draw, Edit, Clear, Live Area Badge */}
      {showControls && (
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              size="sm"
              variant={isDrawing ? 'secondary' : 'primary'}
              onClick={handleSimulateDraw}
              icon={Pencil}
              isLoading={isDrawing}
              className="text-xs px-2.5 py-1.5 sm:px-3 sm:py-2"
            >
              {polygonDrawn ? 'Redraw' : 'Draw Polygon'}
            </Button>
            {polygonDrawn && (
              <Button size="sm" variant="dark" onClick={handleClear} icon={RotateCcw} className="text-xs px-2.5 py-1.5">
                Clear
              </Button>
            )}
          </div>

          {polygonDrawn && (
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border border-emerald-500/30 text-white text-[11px] sm:text-xs flex items-center gap-1.5 shadow-xl">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Area:</span>
              <span className="font-extrabold text-emerald-300 font-mono text-xs sm:text-sm">
                {calculatedArea} Acres
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
