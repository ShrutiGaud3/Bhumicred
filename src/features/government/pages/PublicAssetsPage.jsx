import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Trees,
  ShieldCheck,
  Search,
  Filter,
  Layers,
  AlertTriangle,
  Download,
  Building,
  CheckCircle2,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MapPlaceholder } from '../../../components/ui/MapPlaceholder.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { fetchPublicAssets, createPublicAsset, clearGovernmentErrors } from '../governmentSlice.js';

export const PublicAssetsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { publicAssets, isLoading, error, successMessage } = useSelector((state) => state.government);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    category: 'Community Green Belt',
    taluka: 'Anand',
    district: 'Anand',
    area: '12.5 Hectares',
    treeCount: 2500,
    speciesSummary: 'Neem (1,000), Banyan (500), Shisham (1,000)',
    healthStatus: 'HEALTHY',
    encroachmentStatus: 'CLEAR',
  });

  useEffect(() => {
    dispatch(fetchPublicAssets());
  }, [dispatch]);

  useEffect(() => {
    if (publicAssets && publicAssets.length > 0 && !selectedAsset) {
      setSelectedAsset(publicAssets[0]);
    }
  }, [publicAssets, selectedAsset]);

  const filteredAssets = (publicAssets || []).filter(
    (a) =>
      a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.taluka?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTrees = (publicAssets || []).reduce((acc, a) => acc + (a.treeCount || 0), 0);
  const disputeCount = (publicAssets || []).filter((a) => a.encroachmentStatus === 'DISPUTE_FLAGGED').length;

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    const actionResult = await dispatch(createPublicAsset(newAsset));
    if (createPublicAsset.fulfilled.match(actionResult)) {
      setAddSuccess(true);
      setTimeout(() => {
        setAddSuccess(false);
        setShowAddModal(false);
        dispatch(clearGovernmentErrors());
        dispatch(fetchPublicAssets());
      }, 1500);
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Public Land & Social Forestry Assets"
        subtitle="GIS boundary mapping, tree census tracking, and encroachment monitoring across Anand District."
        backTo="/government/dashboard"
        breadcrumbs={[
          { label: 'Government Portal', path: '/government/dashboard' },
          { label: 'Public Assets' },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-white"
              onClick={() => alert('Exporting District Public Tree Census Report (CSV)...')}
            >
              <Download className="w-4 h-4" /> Export Census (CSV)
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex items-center gap-1.5"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4" /> Add Public Green Asset
            </Button>
          </div>
        }
      />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5 bg-white">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <Building className="w-4 h-4 text-emerald-600" /> Public Parcels
          </div>
          <p className="text-2xl font-black text-gray-900">
            {publicAssets.length} <span className="text-xs font-normal text-gray-500">Parcels</span>
          </p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">100% Digitized in GIS</span>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <Trees className="w-4 h-4 text-emerald-600" /> Public Trees
          </div>
          <p className="text-2xl font-black text-gray-900">
            {totalTrees.toLocaleString()} <span className="text-xs font-normal text-gray-500">Trees</span>
          </p>
          <span className="text-xs text-gray-500 mt-1 block">Across District Belt</span>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4 text-emerald-600" /> Area Coverage
          </div>
          <p className="text-2xl font-black text-gray-900">
            61.2 <span className="text-xs font-normal text-gray-500">Ha</span>
          </p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Social Forestry & Bunds</span>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Disputed / Flags
          </div>
          <p className="text-2xl font-black text-amber-600">
            {disputeCount} <span className="text-xs font-normal text-gray-500">Parcels</span>
          </p>
          <span className="text-xs text-amber-700 font-medium mt-1 block">
            {disputeCount > 0 ? 'Action Required' : 'All Boundaries Clear'}
          </span>
        </Card>
      </div>

      {isLoading && publicAssets.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
          <p className="text-sm font-semibold">Loading public asset records...</p>
        </div>
      ) : publicAssets.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-gray-200">
          <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700">No public assets registered yet</p>
          <Button variant="primary" size="sm" className="mt-4" onClick={() => setShowAddModal(true)}>
            Register First Public Asset
          </Button>
        </Card>
      ) : (
        /* Main 2-Column GIS Visualizer & Assets Directory */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left: GIS Satellite Map Viewer */}
          <div className="lg:col-span-2 space-y-6">
            {selectedAsset && (
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">GIS Cadastral & Forest Parcel Map</h3>
                    <p className="text-xs text-gray-500">
                      Viewing: <strong className="text-gray-800">{selectedAsset.name}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant={selectedAsset.encroachmentStatus === 'CLEAR' ? 'success' : 'warning'}>
                      {selectedAsset.encroachmentStatus === 'CLEAR' ? 'Boundary Clear' : 'Dispute Flagged'}
                    </Badge>
                  </div>
                </div>

                <MapPlaceholder
                  height="min-h-[420px] h-[450px]"
                  initialArea={14.2}
                  polygonCoords={
                    selectedAsset.coordinates?.length
                      ? selectedAsset.coordinates
                      : [
                          [72.93, 22.565],
                          [72.938, 22.568],
                          [72.936, 22.561],
                          [72.929, 22.56],
                        ]
                  }
                />

                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 block">Classification:</span>
                    <strong className="text-gray-800">{selectedAsset.category}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Taluka Jurisdiction:</span>
                    <strong className="text-gray-800">{selectedAsset.taluka}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Standing Tree Census:</span>
                    <strong className="text-emerald-700">
                      {(selectedAsset.treeCount || 0).toLocaleString()} Trees
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Last Field Audit:</span>
                    <strong className="text-gray-800">{selectedAsset.lastSurvey || 'Sep 2026'}</strong>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right: Public Parcels Directory */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
                Public Asset Directory
              </h4>
              <span className="text-xs text-gray-500 font-mono">{filteredAssets.length} Holdings</span>
            </div>

            <SearchInput
              placeholder="Search public lands, roads, canals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredAssets.map((asset) => {
                const assetId = asset._id || asset.id;
                const isSelected = selectedAsset && (selectedAsset._id || selectedAsset.id) === assetId;

                return (
                  <div
                    key={assetId}
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/10'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                          {asset.category}
                        </span>
                        <h5 className="font-bold text-sm text-gray-900 mt-0.5 leading-snug">{asset.name}</h5>
                        <p className="text-xs text-gray-500 mt-1">
                          {asset.taluka} • {asset.area}
                        </p>
                      </div>
                      <Badge
                        variant={asset.encroachmentStatus === 'CLEAR' ? 'success' : 'warning'}
                        className="text-[10px]"
                      >
                        {asset.encroachmentStatus === 'CLEAR' ? 'Clear' : 'Dispute'}
                      </Badge>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Trees className="w-3.5 h-3.5 text-emerald-600" /> {asset.treeCount} Trees
                      </span>
                      <span className="text-emerald-700 font-semibold hover:underline">
                        View on Map →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Public Asset Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register Public Social Forestry Asset"
      >
        <form onSubmit={handleCreateAsset} className="space-y-5 py-2">
          {addSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Asset Registered!</h4>
              <p className="text-sm text-gray-500 mt-1">
                Digitized and entered into Anand District Social Forestry Registry.
              </p>
            </div>
          ) : (
            <>
              <FormInput
                label="Asset Name"
                placeholder="e.g. Anand West Bypass Social Forestry Belt"
                value={newAsset.name}
                onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Classification"
                  value={newAsset.category}
                  onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value })}
                  options={[
                    { value: 'Community Green Belt', label: 'Community Green Belt' },
                    { value: 'Canal Bund Plantation', label: 'Canal Bund Plantation' },
                    { value: 'Avenue Plantation', label: 'Avenue Plantation (Roadside)' },
                    { value: 'Panchayat Grazing Land', label: 'Panchayat Grazing Land' },
                  ]}
                />
                <FormInput
                  label="Taluka"
                  placeholder="e.g. Anand"
                  value={newAsset.taluka}
                  onChange={(e) => setNewAsset({ ...newAsset, taluka: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Area / Dimensions"
                  placeholder="e.g. 18.5 Hectares"
                  value={newAsset.area}
                  onChange={(e) => setNewAsset({ ...newAsset, area: e.target.value })}
                  required
                />
                <FormInput
                  label="Tree Census Count"
                  type="number"
                  placeholder="e.g. 3500"
                  value={newAsset.treeCount}
                  onChange={(e) => setNewAsset({ ...newAsset, treeCount: Number(e.target.value) })}
                  required
                />
              </div>

              <FormInput
                label="Dominant Tree Species"
                placeholder="e.g. Neem (1,500), Subabul (1,000), Banyan (1,000)"
                value={newAsset.speciesSummary}
                onChange={(e) => setNewAsset({ ...newAsset, speciesSummary: e.target.value })}
              />

              <FormSelect
                label="Encroachment Status"
                value={newAsset.encroachmentStatus}
                onChange={(e) => setNewAsset({ ...newAsset, encroachmentStatus: e.target.value })}
                options={[
                  { value: 'CLEAR', label: 'Clear - No Dispute' },
                  { value: 'DISPUTE_FLAGGED', label: 'Dispute Flagged / Encroachment Review' },
                ]}
              />

              <Button type="submit" variant="primary" className="w-full py-3" isLoading={isLoading}>
                Save & Digitized in GIS
              </Button>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default PublicAssetsPage;
