import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MapPlaceholder } from '../../../components/ui/MapPlaceholder.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';
import { landService } from '../../land/services/landService.js';
import { storageService } from '../../../services/storageService.js';

export const AdminLandsPage = () => {
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
        const list = Array.isArray(res?.data) ? res.data : (res?.data?.lands || []);
        liveList = list.map((item) => ({
          id: item.landId || item._id,
          landId: item.landId || item._id,
          landName: item.landName,
          surveyNumber: item.surveyNumber,
          khasraNumber: item.khasraNumber,
          area: item.area,
          areaUnit: item.areaUnit || 'Acres',
          status: item.status,
          soilType: item.agronomicDetails?.soilType || 'Alluvial Loam',
          treeCount: item.agronomicDetails?.treeCount || 0,
          ownerName: item.ownerName || 'Citizen Farmer',
          ownerMobile: item.ownerMobile || '',
          coordinates: item.boundaries?.simpleCoordinates?.length
            ? item.boundaries.simpleCoordinates
            : (item.boundaries?.coordinates?.[0] || []),
        }));
      } catch (backendErr) {
        console.warn('Backend admin lands fetch error:', backendErr);
      }

      // Merge with local storage
      const local = storageService.getLands();
      const combined = [...liveList];
      local.forEach((loc) => {
        if (!combined.some((c) => c.id === loc.id || c.landId === loc.id || (c.surveyNumber === loc.surveyNumber && c.khasraNumber === loc.khasraNumber))) {
          combined.push(loc);
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
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLands}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Registry
          </Button>
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
            {selectedLand && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedLand.landName}</h3>
                    <p className="text-xs text-gray-500">
                      Owner: <strong className="text-slate-800">{selectedLand.ownerName}</strong> • Survey: {selectedLand.surveyNumber} • Khasra: {selectedLand.khasraNumber} • {selectedLand.area} {selectedLand.areaUnit}
                    </p>
                  </div>
                  <StatusBadge status={selectedLand.status} />
                </div>

                <MapPlaceholder
                  height="min-h-[420px] h-[450px]"
                  initialArea={selectedLand.area}
                  polygonCoords={selectedLand.coordinates || []}
                />
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
              Registered Parcels Master List ({filteredLands.length})
            </h4>

            <SearchInput
              placeholder="Search farm, survey, khasra, owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
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
                        Owner: {land.ownerName} • Survey: {land.surveyNumber} • Khasra: {land.khasraNumber} • {land.area} {land.areaUnit}
                      </p>
                    </div>
                    <StatusBadge status={land.status} />
                  </div>
                  <div className="mt-2 text-xs text-gray-600 flex justify-between">
                    <span>{land.soilType}</span>
                    <span className="text-emerald-700 font-semibold">{land.treeCount} Trees</span>
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
