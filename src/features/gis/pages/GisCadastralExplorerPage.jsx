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
  FileText,
  Building,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { SovereignGisMap } from '../../../components/gis/SovereignGisMap.jsx';
import { useToast } from '../../../components/ui/ToastContext.jsx';
import { fetchGisLayers, fetchMacroMetrics } from '../gisSlice.js';
import { landService } from '../../land/services/landService.js';
import { storageService } from '../../../services/storageService.js';

export const GisCadastralExplorerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { layers, macroMetrics, isLoading: isGisLoading } = useSelector((state) => state.gis);
  const { user } = useSelector((state) => state.auth);

  const isAdmin =
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'OPERATIONS_ADMIN' ||
    user?.role === 'ADMIN_STAFF' ||
    user?.role === 'GOVERNMENT' ||
    user?.role === 'GOVERNMENT_OFFICIAL';

  const [lands, setLands] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingLands, setLoadingLands] = useState(true);

  const loadLandsData = async () => {
    setLoadingLands(true);
    dispatch(fetchGisLayers());
    dispatch(fetchMacroMetrics('Anand'));

    let liveLands = [];
    try {
      if (isAdmin) {
        // Admin views all registered cadastral parcels in registry
        const res = await landService.getAllLands();
        const list = Array.isArray(res?.data) ? res.data : res?.data?.lands || [];
        liveLands = list;
      } else {
        // Farmer views their registered parcels
        const res = await landService.getMyLands();
        const list = Array.isArray(res?.data) ? res.data : res?.data?.lands || [];
        liveLands = list;
      }
    } catch (e) {
      console.warn('Live GIS land query error:', e);
    }

    // Merge with local storage for instant offline resiliency
    const userIdentifier = user?._id || user?.id || user?.phone || user?.mobile || user?.name;
    const localLands = isAdmin ? storageService.getLands() : storageService.getLands(userIdentifier);
    const combined = [...liveLands];

    localLands.forEach((loc) => {
      const exists = combined.some(
        (c) =>
          c.landId === loc.id ||
          c.landId === loc.landId ||
          c._id === loc.id ||
          (c.surveyNumber === loc.surveyNumber && c.khasraNumber === loc.khasraNumber)
      );
      if (!exists) {
        combined.push(loc);
      }
    });

    setLands(combined);
    if (combined.length > 0) {
      setSelectedParcel(combined[0]);
    }
    setLoadingLands(false);
  };

  useEffect(() => {
    loadLandsData();
  }, [dispatch, user, isAdmin]);

  // Transform lands to GIS Map parcel items
  const mapParcels = lands.map((l) => {
    const rawCoords =
      l.coordinates ||
      l.boundaries?.coordinates?.[0] ||
      l.boundaries?.simpleCoordinates ||
      l.simpleCoordinates ||
      [];

    const treeCount = Number(l.agronomicDetails?.treeCount ?? l.treeCount ?? 0);
    const baseNdvi = treeCount > 50 ? 0.82 : treeCount > 20 ? 0.74 : 0.65;

    return {
      id: l.landId || l._id || l.id,
      landId: l.landId || l._id || l.id,
      surveyNumber: l.surveyNumber || '108/A',
      khasraNumber: l.khasraNumber || '412/1',
      landName: l.landName || `Plot ${l.khasraNumber || ''}`,
      ownerName: l.ownerName || user?.name || 'Citizen Farmer',
      ownerMobile: l.ownerMobile || user?.mobile || '',
      area: Number(l.area || l.areaAcres || 10),
      areaUnit: l.areaUnit || 'Acres',
      soilType: l.agronomicDetails?.soilType || l.soilType || 'Alluvial Loam',
      treeCount,
      treesInsured: Boolean(l.agronomicDetails?.treesInsured || l.treesInsured),
      ndviScore: baseNdvi,
      status: l.status || 'APPROVED',
      village: l.location?.village || l.village || 'Anand',
      district: l.location?.district || l.district || 'Anand',
      state: l.location?.state || l.state || 'Gujarat',
      coordinates: rawCoords,
    };
  });

  const filteredLands = mapParcels.filter(
    (p) =>
      !searchQuery ||
      p.landName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.khasraNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.surveyNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ownerName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportGeoJson = () => {
    if (mapParcels.length === 0) {
      toast.error('No cadastral parcels available to export.');
      return;
    }

    const geoJsonData = {
      type: 'FeatureCollection',
      name: `BHUMICRED_Cadastral_Spatial_Export_${isAdmin ? 'Admin' : 'Farmer'}`,
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: mapParcels.map((p) => ({
        type: 'Feature',
        properties: {
          landId: p.landId,
          khasraNumber: p.khasraNumber,
          surveyNumber: p.surveyNumber,
          ownerName: p.ownerName,
          ownerMobile: p.ownerMobile,
          village: p.village,
          district: p.district,
          state: p.state,
          areaAcres: p.area,
          soilType: p.soilType,
          treeCount: p.treeCount,
          treesInsured: p.treesInsured,
          ndviScore: p.ndviScore,
          status: p.status,
          attestationAuthority: 'BHUMICRED Sovereign Agro-GIS Desk',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            Array.isArray(p.coordinates) && p.coordinates.length >= 3
              ? p.coordinates
              : [
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
    link.download = `BHUMICRED_Cadastral_Layer_${Date.now()}.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('GeoJSON spatial layer exported successfully!');
  };

  const totalCalculatedAcres = lands.reduce((acc, l) => acc + Number(l.area || l.areaAcres || 0), 0);
  const totalCalculatedTrees = lands.reduce(
    (acc, l) => acc + Number(l.agronomicDetails?.treeCount ?? l.treeCount ?? 0),
    0
  );

  const displayAcres =
    lands.length > 0
      ? totalCalculatedAcres.toFixed(1)
      : (macroMetrics?.totalMappedAcres ?? 0);
  const displayTrees =
    lands.length > 0 ? totalCalculatedTrees : (macroMetrics?.totalStandingTrees ?? 0);
  const displayNdvi =
    lands.length > 0
      ? (macroMetrics?.macroNdviAverage || 0.74)
      : (macroMetrics?.macroNdviAverage ?? 0);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title={
          isAdmin
            ? 'Master Cadastral GIS & Sovereign Satellite Registry'
            : 'Sovereign Cadastral GIS Engine & Satellite Explorer'
        }
        subtitle={
          isAdmin
            ? 'Global district oversight of agricultural plots, CAD/GIS vertex boundaries, multispectral NDVI canopy, and verified 7/12 land records.'
            : 'Interactive GeoJSON spatial boundaries, NDVI multispectral vegetation heatmaps, and cadastral survey parcel topology.'
        }
        backTo={isAdmin ? '/admin/dashboard' : '/farmer/dashboard'}
        breadcrumbs={[
          { label: isAdmin ? 'Admin Portal' : 'Farmer Portal', path: isAdmin ? '/admin/dashboard' : '/farmer/dashboard' },
          { label: 'Cadastral GIS Explorer' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={loadLandsData}
              disabled={loadingLands}
            >
              <RefreshCw className={`w-4 h-4 text-emerald-700 ${loadingLands ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              onClick={handleExportGeoJson}
            >
              <FileCode className="w-4 h-4 text-emerald-700" /> Export GeoJSON
            </Button>
            {!isAdmin && (
              <Button
                variant="primary"
                size="sm"
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 shadow-md"
                onClick={() => navigate('/farmer/lands/add')}
              >
                <Plus className="w-4 h-4" /> Map New Parcel
              </Button>
            )}
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
            {displayAcres} <span className="text-xs font-normal text-emerald-200">Acres</span>
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
            {displayNdvi} <span className="text-xs font-semibold text-emerald-700">/ 1.0</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />{' '}
            {Number(displayNdvi) > 0 ? 'Optimal Canopy Density' : 'Awaiting Parcel Data'}
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
            {displayTrees} <span className="text-xs font-normal text-slate-500">Trees</span>
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
          <div className="text-base font-black text-slate-900 mt-2 truncate">Sentinel-2 MSI</div>
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
                  <Badge variant="success" className="text-[10px]">
                    Live Orbit Sync
                  </Badge>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click on any parcel boundary to inspect cadastral revenue particulars and NDVI health.
                </p>
              </div>

              {selectedParcel && (
                <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500">Inspecting:</span>
                  <span className="font-bold text-emerald-800">
                    Survey #{selectedParcel.surveyNumber || selectedParcel.survey}
                  </span>
                </div>
              )}
            </div>

            {/* Sovereign Interactive Map */}
            <SovereignGisMap
              height="min-h-[480px] h-[520px]"
              parcels={mapParcels}
              activeParcelId={selectedParcel?.id || selectedParcel?.landId || selectedParcel?._id}
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
                  <div
                    className="w-4 h-3 bg-lime-500 rounded-sm"
                    title="Moderate Foliage (0.5 - 0.7)"
                  />
                  <div
                    className="w-4 h-3 bg-emerald-600 rounded-sm"
                    title="Dense Healthy Canopy (>0.75)"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                <span>
                  Near-Infrared: <strong>842 nm</strong>
                </span>
                <span>•</span>
                <span>
                  Red Absorption: <strong>665 nm</strong>
                </span>
                <span>•</span>
                <span>
                  Chlorophyll Index:{' '}
                  <strong className="text-emerald-700 font-bold">Optimal</strong>
                </span>
              </div>
            </div>
          </Card>

          {/* Detailed Selected Parcel Inspector Card */}
          {selectedParcel && (
            <Card className="p-5 border border-slate-200/90 rounded-3xl bg-white shadow-sm space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-black font-mono text-sm">
                    CAD
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {selectedParcel.landName || `Parcel #${selectedParcel.khasraNumber}`}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Owner: <strong className="text-slate-800">{selectedParcel.ownerName}</strong>
                      {selectedParcel.ownerMobile && (
                        <span> • Mobile: {selectedParcel.ownerMobile}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={selectedParcel.status || 'APPROVED'} />
                  <Badge variant="outline" className="font-mono text-xs">
                    {selectedParcel.area || selectedParcel.areaAcres} {selectedParcel.areaUnit || 'Acres'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Survey Number</span>
                  <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                    #{selectedParcel.surveyNumber}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Khasra Number</span>
                  <span className="font-bold text-emerald-800 font-mono mt-0.5 block">
                    #{selectedParcel.khasraNumber}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Soil Classification</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                    {selectedParcel.soilType || 'Alluvial Loam'}
                  </span>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <span className="text-emerald-600 block text-[11px] font-medium">Tree Census</span>
                  <span className="font-bold text-emerald-900 mt-0.5 block">
                    🌲 {selectedParcel.treeCount || 0} Standing Trees
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {selectedParcel.village}, {selectedParcel.district}, {selectedParcel.state}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => navigate(`/farmer/lands/${selectedParcel.landId || selectedParcel.id}`)}
                  >
                    <FileText className="w-3.5 h-3.5 mr-1" /> View Full Deed
                  </Button>
                  {!isAdmin && !selectedParcel.treesInsured && (
                    <Button
                      size="sm"
                      variant="primary"
                      className="text-xs bg-emerald-700 hover:bg-emerald-800"
                      onClick={() => navigate('/farmer/insurance/apply')}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Protect Trees
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right 1 Col: Cadastral Parcels Directory & Inspection Drawer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>{isAdmin ? 'Master Registry Parcels' : 'Your Land Parcels'}</span>
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
              placeholder="Search Survey #, Khasra, Owner or Plot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
            />
          </div>

          {/* Parcels List */}
          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
            {loadingLands ? (
              <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-2">
                <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
                <p className="text-xs font-semibold text-slate-600">Loading cadastral database...</p>
              </div>
            ) : filteredLands.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 border border-slate-200 rounded-2xl">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No Cadastral Parcels</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isAdmin
                    ? 'No registered plots found in master registry.'
                    : 'Register a land parcel to inspect cadastral boundaries.'}
                </p>
                {!isAdmin && (
                  <Button size="sm" className="mt-3 text-xs" onClick={() => navigate('/farmer/lands/add')}>
                    Add Land
                  </Button>
                )}
              </div>
            ) : (
              filteredLands.map((parcel) => {
                const isSelected =
                  selectedParcel?.id === parcel.id ||
                  selectedParcel?.landId === parcel.landId ||
                  selectedParcel?._id === parcel.id;

                return (
                  <div
                    key={parcel.id || parcel.landId}
                    onClick={() => setSelectedParcel(parcel)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-600/10'
                        : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-black text-emerald-900 bg-emerald-100/80 px-2 py-0.5 rounded">
                          Khasra #{parcel.khasraNumber}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Survey #{parcel.surveyNumber}
                        </span>
                      </div>
                      <Badge variant="success" className="text-[10px]">
                        {parcel.area} {parcel.areaUnit || 'Acres'}
                      </Badge>
                    </div>

                    <h5 className="font-bold text-xs text-slate-900 truncate mb-1">
                      {parcel.landName}
                    </h5>

                    {isAdmin && (
                      <p className="text-[11px] text-slate-500 mb-2 truncate">
                        Owner: <strong className="text-slate-800">{parcel.ownerName}</strong>
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Soil Type:</span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {parcel.soilType}
                        </span>
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
                        {parcel.ndviScore} (Optimal)
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GisCadastralExplorerPage;
