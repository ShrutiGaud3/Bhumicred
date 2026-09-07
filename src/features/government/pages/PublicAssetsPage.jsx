import React, { useState } from 'react';
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
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MapPlaceholder } from '../../../components/ui/MapPlaceholder.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';

const MOCK_PUBLIC_ASSETS = [
  {
    id: 'pa_01',
    name: 'Mogri Gram Panchayat Social Forestry Strip',
    category: 'Community Green Belt',
    taluka: 'Anand',
    area: '14.2 Hectares',
    treeCount: 3450,
    speciesSummary: 'Neem (1,400), Shisham (1,200), Peepal (850)',
    healthStatus: 'HEALTHY',
    lastSurvey: '15 Aug 2026',
    encroachmentStatus: 'CLEAR',
    coordinates: [
      [72.9300, 22.5650],
      [72.9380, 22.5680],
      [72.9360, 22.5610],
      [72.9290, 22.5600],
    ],
  },
  {
    id: 'pa_02',
    name: 'Mahi Canal West Bank Plantation',
    category: 'Canal Bund Plantation',
    taluka: 'Umreth',
    area: '28.5 Hectares',
    treeCount: 8200,
    speciesSummary: 'Subabul (4,000), Bamboo Clumps (2,200), Acacia (2,000)',
    healthStatus: 'MONITORED',
    lastSurvey: '20 Jul 2026',
    encroachmentStatus: 'DISPUTE_FLAGGED',
    coordinates: [
      [72.9450, 22.5800],
      [72.9550, 22.5850],
      [72.9520, 22.5720],
      [72.9420, 22.5700],
    ],
  },
  {
    id: 'pa_03',
    name: 'State Highway 83 Roadside Tree Avenue',
    category: 'Avenue Plantation',
    taluka: 'Anand-Borsad',
    area: '18.0 km Stretch',
    treeCount: 2900,
    speciesSummary: 'Gulmohar (1,100), Banyan (600), Mahua (1,200)',
    healthStatus: 'HEALTHY',
    lastSurvey: '02 Sep 2026',
    encroachmentStatus: 'CLEAR',
  },
];

export const PublicAssetsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(MOCK_PUBLIC_ASSETS[0]);
  const [activeLayer, setActiveLayer] = useState('ALL');

  const filteredAssets = MOCK_PUBLIC_ASSETS.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.taluka.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              className="flex items-center gap-2"
              onClick={() => alert('District Tree Census Report generation started...')}
            >
              <Download className="w-4 h-4" /> Export Tree Census Report
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/government/campaigns')}
            >
              Launch Plantation Drive
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
          <p className="text-2xl font-black text-gray-900">42 <span className="text-xs font-normal text-gray-500">Parcels</span></p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">100% Digitized in GIS</span>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <Trees className="w-4 h-4 text-emerald-600" /> Public Trees
          </div>
          <p className="text-2xl font-black text-gray-900">14,550 <span className="text-xs font-normal text-gray-500">Trees</span></p>
          <span className="text-xs text-gray-500 mt-1 block">Across 3 Talukas</span>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4 text-emerald-600" /> Area Coverage
          </div>
          <p className="text-2xl font-black text-gray-900">61.2 <span className="text-xs font-normal text-gray-500">Ha</span></p>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">Social Forestry & Bunds</span>
        </Card>

        <Card className="p-5 bg-white">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Disputed / Flags
          </div>
          <p className="text-2xl font-black text-amber-600">1 <span className="text-xs font-normal text-gray-500">Parcel</span></p>
          <span className="text-xs text-amber-700 font-medium mt-1 block">Mahi Canal West Bank</span>
        </Card>
      </div>

      {/* Main 2-Column GIS Visualizer & Assets Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left: GIS Satellite Map Viewer */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">GIS Cadastral & Forest Parcel Map</h3>
                <p className="text-xs text-gray-500">Viewing: <strong className="text-gray-800">{selectedAsset.name}</strong></p>
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
              polygonCoords={selectedAsset.coordinates || []}
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
                <strong className="text-emerald-700">{selectedAsset.treeCount.toLocaleString()} Trees</strong>
              </div>
              <div>
                <span className="text-gray-400 block">Last Field Audit:</span>
                <strong className="text-gray-800">{selectedAsset.lastSurvey}</strong>
              </div>
            </div>
          </Card>
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
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedAsset.id === asset.id
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
                  <Badge variant={asset.encroachmentStatus === 'CLEAR' ? 'success' : 'warning'} className="text-[10px]">
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
