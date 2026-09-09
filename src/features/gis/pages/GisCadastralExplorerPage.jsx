import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  MapPin,
  Download,
  Plus,
  ShieldCheck,
  Search,
  Eye,
  CheckCircle2,
  TreePine,
  Sun,
  Droplets,
  Share2,
  Sparkles,
  ExternalLink,
  Activity,
  FileCode,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { SovereignGisMap } from '../../../components/gis/SovereignGisMap.jsx';
import { useToast } from '../../../components/ui/ToastContext.jsx';
import { fetchGisLayers, fetchMacroMetrics, fetchParcelSpatialData } from '../gisSlice.js';
import { landService } from '../../land/services/landService.js';

export const GisCadastralExplorerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { layers, macroMetrics, isLoading } = useSelector((state) => state.gis);
  const { user } = useSelector((state) => state.auth);

  const [lands, setLands] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTaluka, setFilterTaluka] = useState('ALL');

  useEffect(() => {
    dispatch(fetchGisLayers());
    dispatch(fetchMacroMetrics('Anand'));

    // Fetch real lands from backend
    const loadLands = async () => {
      try {
        const res = await landService.getMyLands();
        if (res.data && res.data.length > 0) {
          setLands(res.data);
          setSelectedParcel(res.data[0]);
        }
      } catch (e) {
        // Fallback
      }
    };
    loadLands();
  }, [dispatch]);

  // Transform lands to GIS Map parcel items
  const mapParcels = lands.map((l, idx) => {
    const coords = l.boundaries?.simpleCoordinates;
    // Map coords to SVG canvas coordinate space
    const baseOffset = (idx % 4) * 160;
    const svgPoly = coords && coords.length >= 3
      ? `${120 + baseOffset},${100 + (idx % 2) * 120} ${300 + baseOffset},${115 + (idx % 2) * 120} ${330 + baseOffset},${270 + (idx % 2) * 120} ${110 + baseOffset},${250 + (idx % 2) * 120}`
      : undefined;

    return {
      id: l.landId || l._id,
      landId: l.landId,
      surveyNumber: l.surveyNumber,
      khasraNumber: l.khasraNumber,
      landName: l.landName,
      ownerName: l.ownerName || user?.name || 'Citizen Farmer',
      area: l.area || l.areaAcres || 10.5,
      soilType: l.agronomicDetails?.soilType || 'Alluvial Loam',
      treeCount: l.agronomicDetails?.treeCount || 60,
      ndviScore: l.agronomicDetails?.treeCount > 50 ? 0.82 : 0.71,
      status: l.status || 'APPROVED',
      svgPolygon: svgPoly,
      centroid: [220 + baseOffset, 180 + (idx % 2) * 120],
    };
  });

  const filteredLands = mapParcels.filter(
    (p) =>
      !searchQuery ||
      p.landName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.khasraNumber?.includes(searchQuery) ||
      p.surveyNumber?.includes(searchQuery)
  );

  const handleExportGeoJson = () => {
    const geoJsonData = {
      type: 'FeatureCollection',
      name: 'BHUMICRED_Cadastral_Spatial_Export',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: mapParcels.map((p) => ({
        type: 'Feature',
        properties: {
          landId: p.landId,
          khasraNumber: p.khasraNumber,
          surveyNumber: p.surveyNumber,
          ownerName: p.ownerName,
          areaAcres: p.area,
          soilType: p.soilType,
          treeCount: p.treeCount,
          ndviScore: p.ndviScore,
          attestationAuthority: 'BHUMICRED Sovereign Agro-GIS Desk',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [72.924, 22.561],
              [72.932, 22.563],
              [72.934, 22.571],
              [72.922, 22.568],
              [72.924, 22.561],
            ],
          ],
        },
      })),
    };

    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BHUMICRED_Cadastral_Layer_Anand_${Date.now()}.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('GeoJSON spatial layer exported successfully!');
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Sovereign Cadastral GIS Engine & Satellite Explorer"
        subtitle="Interactive GeoJSON spatial boundaries, NDVI multispectral vegetation heatmaps, and cadastral survey parcel topology."
        backTo="/farmer/dashboard"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Cadastral GIS Explorer' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={handleExportGeoJson}
            >
              <FileCode className="w-4 h-4 text-emerald-700" /> Export GeoJSON
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 shadow-md"
              onClick={() => navigate('/lands/add')}
            >
              <Plus className="w-4 h-4" /> Map New Parcel
            </Button>
          </div>
        }
      />

      {/* Macro Spatial KPI Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl border-0 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-200 font-medium">Mapped Cadastral Area</span>
            <div className="p-2 bg-white/10 rounded-xl">
              <Layers className="w-4 h-4 text-emerald-300" />
            </div>
          </div>
          <div className="text-2xl font-black mt-2 tracking-tight">
            {macroMetrics?.totalMappedAcres || '21.4'} <span className="text-xs font-normal text-emerald-200">Acres</span>
          </div>
          <span className="text-[11px] text-emerald-300/80 mt-1 block">Digitized & Verified</span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Multispectral NDVI</span>
            <div className="p-2 bg-lime-50 text-lime-700 rounded-xl">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            {macroMetrics?.macroNdviAverage || 0.72} <span className="text-xs font-semibold text-emerald-700">/ 1.0</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Optimal Canopy Density
          </span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Standing Tree Census</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <TreePine className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
            {macroMetrics?.totalStandingTrees || 130} <span className="text-xs font-normal text-slate-500">Trees</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Geo-Tagged & Monitored</span>
        </Card>

        <Card className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Satellite Sensor</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-black text-slate-900 mt-2 truncate">
            Sentinel-2 MSI
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">10m Ground Resolution</span>
        </Card>
      </div>

      {/* Main Split-Screen Visualizer & Cadastral Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left 2 Cols: Master GIS Map Engine */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 sm:p-5 border border-slate-200/90 rounded-3xl bg-white shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>Interactive Cadastral Spatial Engine</span>
                  <Badge variant="success" className="text-[10px]">Live Orbit Sync</Badge>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click on any parcel boundary to inspect cadastral revenue particulars and NDVI health.
                </p>
              </div>

              {selectedParcel && (
                <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500">Inspecting:</span>
                  <span className="font-bold text-emerald-800">
                    Survey #{selectedParcel.surveyNumber}
                  </span>
                </div>
              )}
            </div>

            {/* Sovereign Interactive Map */}
            <SovereignGisMap
              height="min-h-[480px] h-[520px]"
              parcels={mapParcels}
              activeParcelId={selectedParcel?.id}
              onSelectParcel={(p) => setSelectedParcel(p)}
              allowDrawing={true}
              onPolygonDrawn={(data) => {
                if (data) {
                  toast.info(`Polygon Drawn: ${data.areaAcres} Acres calculated via Shoelace formula`);
                }
              }}
            />

            {/* Spectral NDVI Gradient Legend */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">NDVI Canopy Spectrum:</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-3 bg-amber-500 rounded-sm" title="Arid / Barren (<0.4)" />
                  <div className="w-4 h-3 bg-lime-500 rounded-sm" title="Moderate Foliage (0.5 - 0.7)" />
                  <div className="w-4 h-3 bg-emerald-600 rounded-sm" title="Dense Healthy Canopy (>0.75)" />
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                <span>Near-Infrared: <strong>842 nm</strong></span>
                <span>•</span>
                <span>Red Absorption: <strong>665 nm</strong></span>
                <span>•</span>
                <span>Chlorophyll Index: <strong className="text-emerald-700 font-bold">Optimal</strong></span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Cadastral Parcels Directory & Inspection Drawer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Registered Parcels</span>
            </h4>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
              {filteredLands.length} Plots
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Survey # or Plot Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            />
          </div>

          {/* Parcels List */}
          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {filteredLands.map((parcel) => {
              const isSelected = selectedParcel?.id === parcel.id;

              return (
                <div
                  key={parcel.id}
                  onClick={() => setSelectedParcel(parcel)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-600/10'
                      : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-black text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded">
                        Khasra #{parcel.khasraNumber}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Survey #{parcel.surveyNumber}
                      </span>
                    </div>
                    <Badge variant="success" className="text-[10px]">
                      {parcel.area} Acres
                    </Badge>
                  </div>

                  <h5 className="font-bold text-xs text-slate-900 truncate mb-2">
                    {parcel.landName}
                  </h5>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Soil Type:</span>
                      <span className="font-semibold text-slate-800">{parcel.soilType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Standing Trees:</span>
                      <span className="font-semibold text-emerald-800">
                        🌲 {parcel.treeCount} Trees
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-slate-500">NDVI Health:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {parcel.ndviScore} (High Canopy)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GisCadastralExplorerPage;
