import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Trees,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Download,
  Building,
  RefreshCw,
  Layers,
  FileText,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { SovereignGisMap } from '../../../components/gis/SovereignGisMap.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';
import { landService } from '../../land/services/landService.js';
import { storageService } from '../../../services/storageService.js';

export const AdminLandsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLands = async () => {
    setLoading(true);
    try {
      let liveList = [];
      try {
        const res = await landService.getAllLands();
        const list = Array.isArray(res?.data) ? res.data : res?.data?.lands || [];
        liveList = list.map((item) => ({
          id: item.landId || item._id,
          landId: item.landId || item._id,
          landName: item.landName,
          surveyNumber: item.surveyNumber,
          khasraNumber: item.khasraNumber,
          area: Number(item.area || item.areaAcres || 10),
          areaUnit: item.areaUnit || 'Acres',
          status: item.status || 'APPROVED',
          soilType: item.agronomicDetails?.soilType || item.soilType || 'Alluvial Loam',
          treeCount: Number(item.agronomicDetails?.treeCount ?? item.treeCount ?? 0),
          ownerName: item.ownerName || 'Citizen Farmer',
          ownerMobile: item.ownerMobile || '',
          village: item.location?.village || item.village || 'Anand',
          district: item.location?.district || item.district || 'Anand',
          state: item.location?.state || item.state || 'Gujarat',
          coordinates: item.boundaries?.simpleCoordinates?.length
            ? item.boundaries.simpleCoordinates
            : item.boundaries?.coordinates?.[0] || item.coordinates || [],
        }));
      } catch (backendErr) {
        console.warn('Backend admin lands fetch error:', backendErr);
      }

      // Merge with local storage
      const local = storageService.getLands();
      const combined = [...liveList];
      local.forEach((loc) => {
        if (
          !combined.some(
            (c) =>
              c.id === loc.id ||
              c.landId === loc.id ||
              c.landId === loc.landId ||
              (c.surveyNumber === loc.surveyNumber && c.khasraNumber === loc.khasraNumber)
          )
        ) {
          combined.push({
            id: loc.id || loc.landId,
            landId: loc.id || loc.landId,
            landName: loc.landName,
            surveyNumber: loc.surveyNumber,
            khasraNumber: loc.khasraNumber,
            area: Number(loc.area || loc.areaAcres || 10),
            areaUnit: loc.areaUnit || 'Acres',
            status: loc.status || 'APPROVED',
            soilType: loc.agronomicDetails?.soilType || loc.soilType || 'Alluvial Loam',
            treeCount: Number(loc.agronomicDetails?.treeCount ?? loc.treeCount ?? 0),
            ownerName: loc.ownerName || 'Citizen Farmer',
            ownerMobile: loc.ownerMobile || '',
            village: loc.village || 'Anand',
            district: loc.district || 'Anand',
            state: loc.state || 'Gujarat',
            coordinates: loc.coordinates || [],
          });
        }
      });

      setLands(combined);
      if (combined.length > 0) setSelectedLand(combined[0]);
    } catch (err) {
      console.warn('Admin lands error:', err);
      const local = storageService.getLands();
      setLands(local);
      if (local.length > 0) setSelectedLand(local[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  const filteredLands = lands.filter(
    (l) =>
      l.landName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.surveyNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.khasraNumber && l.khasraNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (l.ownerName && l.ownerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Master Land & GIS Cadastral Registry"
        subtitle="Global oversight of agricultural plots, CAD/GIS vertex boundaries, dispute flags, and verified land cards in real-time."
        backTo="/admin/dashboard"
        breadcrumbs={[
          { label: 'Admin Portal', path: '/admin/dashboard' },
          { label: 'Master Land Registry' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLands}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Registry
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/admin/gis')}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800"
            >
              <Layers className="w-4 h-4" /> Full Cadastral Engine
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-700">Loading master cadastral database from MongoDB Atlas...</p>
        </div>
      ) : lands.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          No registered land parcels found in the registry database yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-5 border border-slate-200/90 rounded-3xl bg-white shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span>District Cadastral Boundary Matrix</span>
                    <Badge variant="success" className="text-[10px]">
                      {filteredLands.length} Parcels
                    </Badge>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any parcel to highlight spatial bounds and review cadastral ownership details.
                  </p>
                </div>

                {selectedLand && (
                  <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500">Selected:</span>
                    <span className="font-bold text-emerald-800">
                      Survey #{selectedLand.surveyNumber} (Khasra #{selectedLand.khasraNumber})
                    </span>
                  </div>
                )}
              </div>

              {/* Master Sovereign Cadastral Map */}
              <SovereignGisMap
                height="min-h-[440px] h-[480px]"
                parcels={lands}
                activeParcelId={selectedLand?.id || selectedLand?.landId}
                onSelectParcel={(p) => setSelectedLand(p)}
                defaultLayer="CADASTRAL"
              />
            </Card>

            {/* Selected Parcel Deep-Dive Inspector */}
            {selectedLand && (
              <Card className="p-5 border border-slate-200/90 rounded-3xl bg-white shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{selectedLand.landName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Land ID: <span className="font-mono font-bold text-slate-800">{selectedLand.landId}</span> • 
                      Owner: <strong className="text-slate-800">{selectedLand.ownerName}</strong>
                      {selectedLand.ownerMobile && <span> ({selectedLand.ownerMobile})</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedLand.status} />
                    <Badge variant="outline" className="font-mono text-xs">
                      {selectedLand.area} {selectedLand.areaUnit}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Survey Number</span>
                    <span className="font-bold text-slate-800 font-mono mt-0.5 block">
                      #{selectedLand.surveyNumber}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Khasra Number</span>
                    <span className="font-bold text-emerald-800 font-mono mt-0.5 block">
                      #{selectedLand.khasraNumber}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Soil Type</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                      {selectedLand.soilType}
                    </span>
                  </div>
                  <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                    <span className="text-emerald-600 block text-[11px] font-medium">Standing Trees</span>
                    <span className="font-bold text-emerald-900 mt-0.5 block">
                      🌲 {selectedLand.treeCount} Trees
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {selectedLand.village}, {selectedLand.district}, {selectedLand.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => navigate(`/farmer/lands/${selectedLand.landId || selectedLand.id}`)}
                    >
                      <FileText className="w-3.5 h-3.5 mr-1" /> View Official Deed
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      className="text-xs bg-emerald-700 hover:bg-emerald-800"
                      onClick={() => navigate('/admin/approvals')}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Approvals Desk
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                Parcels Directory ({filteredLands.length})
              </h4>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Live MongoDB
              </span>
            </div>

            <SearchInput
              placeholder="Search farm, survey, khasra, owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {filteredLands.map((land) => (
                <div
                  key={land.id}
                  onClick={() => setSelectedLand(land)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedLand?.id === land.id
                      ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/10'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-bold text-sm text-gray-900 leading-snug">{land.landName}</h5>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">
                        Owner: <strong className="text-slate-800">{land.ownerName}</strong> • Survey: #{land.surveyNumber} • Khasra: #{land.khasraNumber}
                      </p>
                    </div>
                    <StatusBadge status={land.status} />
                  </div>
                  <div className="mt-2 text-xs text-gray-600 flex justify-between border-t border-slate-100 pt-1.5">
                    <span>{land.soilType}</span>
                    <span className="text-emerald-700 font-semibold">🌲 {land.treeCount} Trees • {land.area} {land.areaUnit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLandsPage;
