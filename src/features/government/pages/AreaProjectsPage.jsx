import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Trees,
  MapPin,
  CheckCircle2,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { projectService } from '../../projects/services/projectService.js';

export const AreaProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const res = await projectService.getProjects();
        if (res.data) {
          setProjects(res.data);
        }
      } catch (e) {
        console.warn('Failed to load government area projects:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="District Area Projects & Carbon Clusters"
        subtitle="Oversight of civic agroforestry plantations, soil restoration corridors, and carbon baseline tracking."
        backTo="/government/dashboard"
        breadcrumbs={[
          { label: 'Government Portal', path: '/government/dashboard' },
          { label: 'Area Projects' },
        ]}
      />

      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
          <p className="text-sm font-semibold">Loading district sustainability projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-gray-200">
          <Trees className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700">No active sustainability projects found in district</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => {
            const projId = proj._id || proj.id;
            const locationStr = proj.location?.address || `${proj.location?.gramPanchayat}, ${proj.location?.district}` || 'Anand, Gujarat';
            const partnerName = proj.assignedPartner?.name || 'AgriTech Field Services';
            const enrolledCount = proj.enrolledLands?.length || (proj.totalHectaresTarget ? Math.round(proj.totalHectaresTarget / 3) : 14);
            const startDateStr = proj.startDate ? new Date(proj.startDate).toLocaleDateString('en-GB') : 'Feb 2026';
            const targetDateStr = proj.targetCompletion ? new Date(proj.targetCompletion).toLocaleDateString('en-GB') : 'Nov 2026';

            return (
              <Card key={projId} className="p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-all space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="success">{proj.categoryLabel || proj.category}</Badge>
                    <StatusBadge status={proj.status || 'IN_PROGRESS'} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{proj.title}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {locationStr}
                  </p>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{proj.scope}</p>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-500">Execution Progress</span>
                    <span className="text-emerald-700 font-bold">{proj.progress || 0}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${proj.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl text-xs text-gray-700 border border-gray-100">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Implementing Agency:</span>
                    <strong className="text-gray-900">{partnerName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Beneficiary Landholdings:</span>
                    <strong className="text-emerald-700">{enrolledCount} Registered Plots</strong>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Timeline: {startDateStr} to {targetDateStr}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5"
                    onClick={() => navigate(`/government/projects/${projId}`)}
                  >
                    Inspect Milestones <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AreaProjectsPage;
