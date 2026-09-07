import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { LandCard } from '../components/LandCard.jsx';
import { EmptyState } from '../../../components/states/EmptyState.jsx';
import { PlusCircle, MapPin, Filter } from 'lucide-react';
import { storageService } from '../../../services/storageService.js';

export const LandListPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const allLands = storageService.getLands();

  const filteredLands = allLands.filter((l) => {
    const matchesSearch =
      l.landName.toLowerCase().includes(search.toLowerCase()) ||
      l.surveyNumber.toLowerCase().includes(search.toLowerCase()) ||
      (l.khasraNumber && l.khasraNumber.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Registered Lands"
        subtitle="Manage your agricultural parcels, view boundary GIS polygons, and link tree insurance and soil tests."
        breadcrumbs={[
          { label: 'Portal', path: '/farmer/dashboard' },
          { label: 'My Lands' },
        ]}
        action={
          <Link to="/farmer/lands/add">
            <Button variant="primary" icon={PlusCircle}>
              Add New Land
            </Button>
          </Link>
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
      {filteredLands.length > 0 ? (
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
