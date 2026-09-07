import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Trees,
  CheckCircle2,
  Users,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { FormInput } from '../../../components/forms/FormInput.jsx';
import { FormSelect } from '../../../components/forms/FormSelect.jsx';
import { FormTextarea } from '../../../components/forms/FormTextarea.jsx';
import { MOCK_PROJECTS } from '../../../services/mockData/projectsMock.js';

export const AdminProjectsPage = () => {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProj, setNewProj] = useState({
    title: '',
    category: 'Civic Agroforestry',
    location: 'Anand, Gujarat',
    assignedPartner: 'AgriTech Field Services',
    scope: '',
  });
  const [createSuccess, setCreateSuccess] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    const created = {
      id: `prj_${Date.now()}`,
      title: newProj.title || 'New Agroforestry Corridor',
      category: newProj.category,
      location: newProj.location,
      assignedPartner: newProj.assignedPartner,
      scope: newProj.scope || 'Community bund plantation with carbon tracking.',
      progress: 0,
      status: 'IN_PROGRESS',
      startDate: '2026-09-15',
      targetCompletion: '2027-06-30',
      linkedLandCount: 0,
      milestones: [
        { title: 'Baseline GIS Mapping', completed: false, date: '30 Sep 2026' },
      ],
    };
    setProjects([created, ...projects]);
    setCreateSuccess(true);
    setTimeout(() => {
      setCreateSuccess(false);
      setShowCreateModal(false);
    }, 1500);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Project Control & Carbon Registry Quotas"
        subtitle="Create community agroforestry projects, assign inspection partners, and allocate carbon yield quotas."
        backTo="/admin/dashboard"
        breadcrumbs={[
          { label: 'Admin Portal', path: '/admin/dashboard' },
          { label: 'Project Control Center' },
        ]}
        actions={
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" /> Create New Sustainability Project
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <Card key={proj.id} className="p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-all space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="success">{proj.category}</Badge>
              <StatusBadge status={proj.status} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">{proj.title}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {proj.location}
              </p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">{proj.scope}</p>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-500">Milestone Completion</span>
                <span className="text-emerald-700">{proj.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${proj.progress}%` }}></div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Partner: <strong>{proj.assignedPartner}</strong></span>
              <span>{proj.linkedLandCount} Enrolled Farms</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Sustainability / Agroforestry Project"
      >
        <form onSubmit={handleCreate} className="space-y-6 py-2">
          {createSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Project Initialized!</h4>
              <p className="text-sm text-gray-500 mt-1">Ready for farmer enrollment and carbon baselining.</p>
            </div>
          ) : (
            <>
              <FormInput
                label="Project Title"
                placeholder="e.g. Borsad Taluka Regenerative Agroforestry Belt"
                value={newProj.title}
                onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Category"
                  value={newProj.category}
                  onChange={(e) => setNewProj({ ...newProj, category: e.target.value })}
                  options={[
                    { value: 'Civic Agroforestry', label: 'Civic Agroforestry' },
                    { value: 'Soil Restoration', label: 'Soil Restoration & Drip' },
                    { value: 'Carbon Sequestration', label: 'High-Density Carbon Corridor' },
                  ]}
                />
                <FormInput
                  label="Location Jurisdiction"
                  value={newProj.location}
                  onChange={(e) => setNewProj({ ...newProj, location: e.target.value })}
                  required
                />
              </div>

              <FormTextarea
                label="Project Scope & Target Milestones"
                rows={3}
                placeholder="Describe project targets, sapling count, drip optimization, and baseline methodology..."
                value={newProj.scope}
                onChange={(e) => setNewProj({ ...newProj, scope: e.target.value })}
                required
              />

              <Button type="submit" variant="primary" className="w-full py-3">
                Commit & Register Project
              </Button>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};
