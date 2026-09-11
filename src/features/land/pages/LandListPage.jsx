import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { LandCard } from '../components/LandCard.jsx';
import { EmptyState } from '../../../components/states/EmptyState.jsx';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { storageService } from '../../../services/storageService.js';
import { landService } from '../services/landService.js';

export const LandListPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLands = async () => {
    setLoading(true);
    try {
      const userIdentifier = user?.mobile || user?.id || user?.name;
      const response = await landService.getMyLands({
        search: search.trim() || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });

      const list = Array.isArray(response?.data) ? response.data : (response?.data?.lands || []);
      const mapped = list.map((item) => ({
        id: item.landId || item._id,
        landId: item.landId || item._id,
        landName: item.landName,
        surveyNumber: item.surveyNumber,
        khasraNumber: item.khasraNumber,
        landType: item.landType,
        ownershipType: item.ownershipType,
        area: item.area,
        areaUnit: item.areaUnit || 'Acres',
        address: item.location?.address || `${item.location?.village || ''}, ${item.location?.district || ''}`,
        soilType: item.agronomicDetails?.soilType || 'Alluvial Loam',
        irrigationSource: item.agronomicDetails?.irrigationSource || 'Borewell & Drip Irrigation',
        primaryCrops: item.agronomicDetails?.primaryCrops || ['Cotton', 'Wheat'],
        status: item.status || 'PENDING_VERIFICATION',
        treeCount: item.agronomicDetails?.treeCount || 0,
        treesInsured: item.agronomicDetails?.treesInsured || false,
        soilReportStatus: item.agronomicDetails?.soilReportStatus || 'NOT_REQUESTED',
        createdAt: item.createdAt,
        coordinates: item.boundaries?.simpleCoordinates || item.boundaries?.coordinates?.[0] || [],
      }));

      // Combine only this farmer's local storage lands
      const local = storageService.getLands(userIdentifier);
      const combined = [...mapped];
      local.forEach((loc) => {
        const exists = combined.some(
          (c) => c.id === loc.id || c.landId === loc.id || (c.surveyNumber === loc.surveyNumber && c.khasraNumber === loc.khasraNumber)
        );
        if (!exists) {
          combined.push({
            id: loc.id || loc.landId,
            landId: loc.id || loc.landId,
            landName: loc.landName,
            surveyNumber: loc.surveyNumber,
            khasraNumber: loc.khasraNumber,
            landType: loc.landType,
            ownershipType: loc.ownershipType,
            area: loc.area || loc.areaAcres,
            areaUnit: loc.areaUnit || 'Acres',
            address: loc.address || `${loc.village || ''}, ${loc.district || ''}`,
            soilType: loc.soilType || 'Alluvial Loam',
            irrigationSource: loc.irrigationSource || 'Borewell & Drip Irrigation',
            primaryCrops: loc.primaryCrops || ['Cotton', 'Wheat'],
            status: loc.status || 'PENDING_VERIFICATION',
            treeCount: loc.treeCount || 0,
            treesInsured: loc.treesInsured || false,
            soilReportStatus: loc.soilReportStatus || 'NOT_REQUESTED',
            createdAt: loc.createdAt || new Date().toISOString(),
            coordinates: loc.coordinates || [],
          });
        }
      });

      setLands(combined);
    } catch (err) {
      console.warn('Backend fetch failed, using local storage cache:', err);
      const userIdentifier = user?.mobile || user?.id || user?.name;
      const local = storageService.getLands(userIdentifier);
      setLands(local || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, [statusFilter]);

  const filteredLands = lands.filter((l) => {
    const matchesSearch =
      !search.trim() ||
      l.landName?.toLowerCase().includes(search.toLowerCase()) ||
      l.surveyNumber?.toLowerCase().includes(search.toLowerCase()) ||
      (l.khasraNumber && l.khasraNumber.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus =
      statusFilter === 'ALL' ||
      l.status === statusFilter ||
      (statusFilter === 'APPROVED' && (l.status === 'APPROVED' || l.status === 'VERIFIED')) ||
      (statusFilter === 'PENDING_VERIFICATION' && (l.status === 'PENDING_VERIFICATION' || l.status === 'PENDING_REVIEW'));
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Registered Lands"
        subtitle="Manage your sovereign agricultural parcels, view cadastral GIS polygons, and link tree insurance and soil tests."
        breadcrumbs={[
          { label: 'Portal', path: '/farmer/dashboard' },
          { label: 'My Lands' },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLands}
              disabled={loading}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link to="/farmer/lands/add">
              <Button variant="primary" icon={PlusCircle}>
                Add New Land
              </Button>
            </Link>
          </div>
        }
      />

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="sm:col-span-2">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by farm name, Survey No, Khasra No..."
          />
        </div>
        <FormSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { label: 'All Statuses', value: 'ALL' },
            { label: 'Approved (Active)', value: 'APPROVED' },
            { label: 'Pending Verification', value: 'PENDING_VERIFICATION' },
          ]}
        />
      </div>

      {/* Lands Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-700">Loading your cadastral land parcels from sovereign database...</p>
        </div>
      ) : filteredLands.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLands.map((land) => (
            <LandCard key={land.id} land={land} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Lands Found"
          description="You have not registered any land parcel matching your filter criteria."
          actionLabel="Register First Land"
          onAction={() => window.location.assign('/farmer/lands/add')}
        />
      )}
    </div>
  );
};

export default LandListPage;
