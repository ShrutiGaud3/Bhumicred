import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Plus,
  Trees,
  CheckCircle2,
  Users,
  MapPin,
  TrendingUp,
  RefreshCw,
  Award,
  DollarSign,
  Sparkles,
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
import { projectService } from '../../projects/services/projectService.js';

export const AdminProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newProj, setNewProj] = useState({
    title: '',
    category: 'CIVIC_AGROFORESTRY',
    categoryLabel: 'Civic Agroforestry',
    locationAddress: 'Anand, Gujarat',
    assignedPartnerName: 'AgriTech Field Services',
    scope: '',
    saplingsTarget: '1500',
    carbonCreditEstimatePerAcre: '5.0',
  });
  const [createSuccess, setCreateSuccess] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projRes, statsRes] = await Promise.all([
        projectService.getProjects(),
        projectService.getStats(),
      ]);
      if (projRes.data) setProjects(projRes.data);
      if (statsRes.data) setStats(statsRes.data);
    } catch (e) {
      console.warn('Failed to load admin projects data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: newProj.title,
        category: newProj.category,
        categoryLabel: newProj.category === 'CIVIC_AGROFORESTRY' ? 'Civic Agroforestry' : newProj.category === 'SOIL_RESTORATION' ? 'Soil Restoration' : 'Biodiversity Corridor',
        location: {
          address: newProj.locationAddress,
          district: 'Anand',
          state: 'Gujarat',
        },
        assignedPartner: {
          name: newProj.assignedPartnerName,
          organization: newProj.assignedPartnerName,
        },
        scope: newProj.scope,
        saplingsTarget: Number(newProj.saplingsTarget) || 1000,
        carbonCreditEstimatePerAcre: Number(newProj.carbonCreditEstimatePerAcre) || 4.5,
        status: 'IN_PROGRESS',
        progress: 10,
      };

      await projectService.createProject(payload);
      setCreateSuccess(true);
      setTimeout(() => {
        setCreateSuccess(false);
        setShowCreateModal(false);
        setNewProj({
          title: '',
          category: 'CIVIC_AGROFORESTRY',
          categoryLabel: 'Civic Agroforestry',
          locationAddress: 'Anand, Gujarat',
          assignedPartnerName: 'AgriTech Field Services',
          scope: '',
          saplingsTarget: '1500',
          carbonCreditEstimatePerAcre: '5.0',
        });
      }, 1500);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create sustainability project');
    } finally {
      setSubmitting(false);
    }
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
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" /> Create New Sustainability Project
          </Button>
        }
      />

      {/* KPI Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Active Sustainability Projects</span>
              <FolderKanban className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-gray-900">{stats.totalProjects}</div>
            <span className="text-xs text-emerald-700 mt-1 block">{stats.activeProjects} In Active Execution</span>
          </Card>

          <Card className="p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Enrolled Farm Parcels</span>
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-gray-900">{stats.totalEnrolledLands}</div>
            <span className="text-xs text-gray-400 mt-1 block">Participating smallholders</span>
          </Card>

          <Card className="p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Saplings Planted</span>
              <Trees className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-800">
              {stats.totalSaplingsPlanted?.toLocaleString()}
            </div>
            <span className="text-xs text-emerald-600 mt-1 block">Geotagged & GIS mapped</span>
          </Card>

          <Card className="p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase">Est. Carbon Sequestered</span>
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-gray-900">
              {stats.estimatedCarbonSequesteredTons} <span className="text-sm font-semibold">tCO2e</span>
            </div>
            <span className="text-xs text-emerald-600 mt-1 block">MRV baseline certified</span>
          </Card>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Registered Projects ({projects.length})</h3>

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
            <p className="text-xs">Loading sustainability project registry...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => {
              const projId = proj._id || proj.id;
              const locationStr = proj.location?.address || `${proj.location?.gramPanchayat}, ${proj.location?.district}` || 'Anand, Gujarat';
              const partnerName = proj.assignedPartner?.name || 'AgriTech Field Services';
              const enrolledCount = proj.enrolledLands?.length || (proj.totalHectaresTarget ? Math.round(proj.totalHectaresTarget / 3) : 14);

              return (
                <Card key={projId} className="p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-all space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge variant="success">{proj.categoryLabel || proj.category}</Badge>
                    <StatusBadge status={proj.status || 'IN_PROGRESS'} />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{proj.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {locationStr}
                    </p>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">{proj.scope}</p>

                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-500">Milestone Completion</span>
                      <span className="text-emerald-700 font-bold">{proj.progress || 0}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${proj.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
                    <span>
                      Partner: <strong>{partnerName}</strong>
                    </span>
                    <span className="font-semibold text-emerald-700">{enrolledCount} Enrolled Farms</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Sustainability / Agroforestry Project"
      >
        <form onSubmit={handleCreate} className="space-y-4 py-2">
          {createSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
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
                    { value: 'CIVIC_AGROFORESTRY', label: 'Civic Agroforestry' },
                    { value: 'SOIL_RESTORATION', label: 'Soil Restoration & Drip' },
                    { value: 'BIODIVERSITY_CORRIDOR', label: 'Biodiversity Corridor' },
                    { value: 'CARBON_SEQUESTRATION', label: 'High-Density Carbon Corridor' },
                  ]}
                />
                <FormInput
                  label="Location Jurisdiction"
                  value={newProj.locationAddress}
                  onChange={(e) => setNewProj({ ...newProj, locationAddress: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Saplings Target"
                  type="number"
                  placeholder="1500"
                  value={newProj.saplingsTarget}
                  onChange={(e) => setNewProj({ ...newProj, saplingsTarget: e.target.value })}
                  required
                />
                <FormInput
                  label="Carbon Yield (tCO2e/Acre/Yr)"
                  type="number"
                  placeholder="5.0"
                  value={newProj.carbonCreditEstimatePerAcre}
                  onChange={(e) => setNewProj({ ...newProj, carbonCreditEstimatePerAcre: e.target.value })}
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

              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 font-bold"
              >
                {submitting ? 'Registering Project...' : 'Commit & Register Project'}
              </Button>
            </>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default AdminProjectsPage;
