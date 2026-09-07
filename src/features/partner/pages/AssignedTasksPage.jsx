import React, { useState } from 'react';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  MapPin,
  Trees,
  TestTube,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';

const MOCK_PARTNER_TASKS = [
  {
    id: 'tsk_01',
    taskNumber: 'TSK-2026-081',
    title: 'On-Site Tree Damage Geotag & Loss Assessment',
    category: 'Insurance Inspection',
    farmerName: 'Ramesh Patel',
    village: 'Mogri',
    surveyNumber: '402/A',
    slaDeadline: '12 Sep 2026 (48h left)',
    status: 'IN_PROGRESS',
    feePayable: '₹1,250',
    priority: 'HIGH',
  },
  {
    id: 'tsk_02',
    taskNumber: 'TSK-2026-082',
    title: 'Cadastral Naksha Vertex Geotagging & Boundary Verification',
    category: 'Land GIS Audit',
    farmerName: 'Jitendra Vaghela',
    village: 'Jitodia',
    surveyNumber: '619/C',
    slaDeadline: '15 Sep 2026',
    status: 'PENDING',
    feePayable: '₹950',
    priority: 'MEDIUM',
  },
  {
    id: 'tsk_03',
    taskNumber: 'TSK-2026-083',
    title: 'Deep-Core Soil Sample Collection (0-30cm)',
    category: 'Soil Testing',
    farmerName: 'Kailashben Prajapati',
    village: 'Kheda Rural',
    surveyNumber: '310/1',
    slaDeadline: '18 Sep 2026',
    status: 'PENDING',
    feePayable: '₹600',
    priority: 'NORMAL',
  },
];

export const AssignedTasksPage = () => {
  const [tasks, setTasks] = useState(MOCK_PARTNER_TASKS);
  const [filterCategory, setFilterCategory] = useState('ALL');

  const handleMarkComplete = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: 'COMPLETED' } : t)));
  };

  const filteredTasks = tasks.filter(
    (t) => filterCategory === 'ALL' || t.category.toLowerCase().includes(filterCategory.toLowerCase())
  );

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Field Operations & Assigned Tasks Queue"
        subtitle="Manage assigned GPS surveys, damage assessments, sample pickups, and milestone sign-offs."
        backTo="/partner/dashboard"
        breadcrumbs={[
          { label: 'Partner Portal', path: '/partner/dashboard' },
          { label: 'Assigned Tasks' },
        ]}
      />

      {/* Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {['ALL', 'Insurance Inspection', 'Land GIS Audit', 'Soil Testing'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterCategory === cat
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat === 'ALL' ? 'All Assigned Tasks' : cat}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="p-6 border border-gray-200 hover:shadow-md transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    {task.taskNumber}
                  </span>
                  <Badge variant={task.priority === 'HIGH' ? 'error' : 'warning'}>
                    {task.priority} SLA
                  </Badge>
                  <StatusBadge status={task.status} />
                </div>

                <h4 className="text-lg font-bold text-gray-900">{task.title}</h4>
                <p className="text-xs text-gray-500">
                  Farmer: <strong className="text-gray-800">{task.farmerName}</strong> • Village: {task.village} (Survey: {task.surveyNumber})
                </p>
              </div>

              {/* Fee and Actions */}
              <div className="flex items-center gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
                <div className="text-left lg:text-right">
                  <span className="text-xs text-gray-400 block">Inspection Payout</span>
                  <span className="text-xl font-bold text-emerald-700">{task.feePayable}</span>
                  <span className="text-[11px] text-gray-500 block">SLA: {task.slaDeadline}</span>
                </div>

                {task.status !== 'COMPLETED' ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleMarkComplete(task.id)}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Sign-off Dossier
                  </Button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
