import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Trees,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Award,
  Layers,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Timeline } from '../../../components/ui/Timeline.jsx';
import { projectService } from '../services/projectService.js';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      try {
        const res = await projectService.getProjectById(id);
        if (res.data) {
          setProject(res.data);
        }
      } catch (e) {
        console.warn('Failed to load project details:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
        <p className="text-sm font-semibold">Loading sustainability project blueprint...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <Card className="p-12 text-center max-w-lg mx-auto my-12">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Project Not Found</h3>
        <p className="text-xs text-gray-500 mb-6">The requested agroforestry project could not be found.</p>
        <Button variant="primary" onClick={() => navigate('/farmer/projects')}>
          Back to Sustainability Projects
        </Button>
      </Card>
    );
  }

  const locationStr = project.location?.address || `${project.location?.gramPanchayat}, ${project.location?.district}` || 'Anand, Gujarat';
  const partnerName = project.assignedPartner?.name || 'AgriTech Field Services';
  const enrolledLands = project.enrolledLands || [];
  const milestones = project.milestones || [];
  const carbonYield = project.carbonCreditEstimatePerAcre || 4.5;
  const startDateStr = project.startDate ? new Date(project.startDate).toLocaleDateString('en-GB') : 'Feb 2026';
  const targetDateStr = project.targetCompletion ? new Date(project.targetCompletion).toLocaleDateString('en-GB') : 'Nov 2026';

  const isGov = user?.role === 'GOVERNMENT';
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN_STAFF';

  const backLink = isGov ? '/government/projects' : isAdmin ? '/admin/projects' : '/farmer/projects';
  const portalLabel = isGov ? 'Government Portal' : isAdmin ? 'Admin Portal' : 'Farmer Portal';
  const portalDashboard = isGov ? '/government/dashboard' : isAdmin ? '/admin/dashboard' : '/farmer/dashboard';

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title={project.title}
        subtitle={`${project.categoryLabel || project.category} • Managed by ${partnerName}`}
        backTo={backLink}
        breadcrumbs={[
          { label: portalLabel, path: portalDashboard },
          { label: 'Projects', path: backLink },
          { label: project.title },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status || 'IN_PROGRESS'} />
            <Button
              variant="primary"
              className="bg-emerald-700 hover:bg-emerald-800"
              onClick={() => navigate(isGov ? '/government/dashboard' : '/farmer/carbon')}
            >
              {isGov ? 'Area Overview' : 'View Carbon Credits'}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Details & Milestones */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 md:p-8 space-y-6 border border-gray-200">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Project Scope & Objectives</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{project.scope}</p>
            </div>

            {/* Milestones Timeline */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> Key Milestone Execution & MRV Audits
              </h4>

              {milestones.length > 0 ? (
                <Timeline
                  events={milestones.map((m) => ({
                    title: m.title,
                    timestamp: m.date || (m.completedAt ? new Date(m.completedAt).toLocaleDateString('en-GB') : 'Pending'),
                    completed: m.completed,
                    description: m.description,
                  }))}
                />
              ) : (
                <p className="text-xs text-gray-400">Milestones under initial staging.</p>
              )}
            </div>

            {/* Enrolled Land Parcels */}
            {enrolledLands.length > 0 && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" /> Participating Farm Parcels ({enrolledLands.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {enrolledLands.map((el, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-gray-100 text-xs">
                      <div className="flex justify-between items-baseline font-bold text-gray-900">
                        <span>{el.landName}</span>
                        <span className="text-emerald-700 font-mono">{el.areaAcres} Acres</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Survey: {el.surveyNumber || 'N/A'} • Owner: {el.farmerName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Project Metrics Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4 border border-gray-200">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
              Project Snapshot
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Progress</span>
                <span className="font-bold text-emerald-700">{project.progress || 0}% Complete</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Location</span>
                <span className="font-semibold text-gray-900 text-right">{locationStr}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Enrolled Plots</span>
                <span className="font-semibold text-gray-900">
                  {enrolledLands.length > 0 ? enrolledLands.length : 14} Registered Plots
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Saplings Target</span>
                <span className="font-semibold text-gray-900">
                  {project.saplingsPlanted || 850} / {project.saplingsTarget || 1200} Planted
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Start Date</span>
                <span className="font-semibold text-gray-900">{startDateStr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Target Completion</span>
                <span className="font-semibold text-gray-900">{targetDateStr}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-900 to-teal-950 text-white border-0 shadow-lg">
            <Sparkles className="w-6 h-6 text-emerald-400 mb-2" />
            <h4 className="text-base font-bold mb-1">Carbon Credit Baseline</h4>
            <p className="text-xs text-emerald-200 mb-4 leading-relaxed">
              Enrolled farms earn an estimated <strong>{carbonYield} tCO2e / acre / year</strong> in verified carbon credits directly in their BHUMICRED Wallet.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold"
              onClick={() => navigate('/farmer/carbon')}
            >
              Calculate My Carbon Yield
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
