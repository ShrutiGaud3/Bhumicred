import React, { useState } from 'react';
import {
  MapPin,
  Trees,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Download,
  Building,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MapPlaceholder } from '../../../components/ui/MapPlaceholder.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';
import { MOCK_LANDS } from '../../../services/mockData/landsMock.js';

export const AdminLandsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLand, setSelectedLand] = useState(MOCK_LANDS[0]);

  const filteredLands = MOCK_LANDS.filter(
    (l) =>
      l.landName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.surveyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.khasraNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Master Land & GIS Cadastral Registry"
        subtitle="Global oversight of agricultural plots, CAD/GIS vertex boundaries, dispute flags, and verified land cards."
        backTo="/admin/dashboard"
        breadcrumbs={[
          { label: 'Admin Portal', path: '/admin/dashboard' },
          { label: 'Master Land Registry' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedLand.landName}</h3>
                <p className="text-xs text-gray-500">
                  Survey No: {selectedLand.surveyNumber} • Khasra: {selectedLand.khasraNumber} • {selectedLand.area} {selectedLand.areaUnit}
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
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
            Registered Parcels Master List
          </h4>

          <SearchInput
            placeholder="Search farm, survey, khasra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredLands.map((land) => (
              <div
                key={land.id}
                onClick={() => setSelectedLand(land)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedLand.id === land.id
                    ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-600/10'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-bold text-sm text-gray-900 leading-snug">{land.landName}</h5>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      Survey: {land.surveyNumber} • {land.area} {land.areaUnit}
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
    </div>
  );
};
