import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Timeline } from '../../../components/ui/Timeline.jsx';
import { MOCK_PROJECTS } from '../../../services/mockData/projectsMock.js';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = MOCK_PROJECTS.find((p) => p.id === id) || MOCK_PROJECTS[0];

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title={project.title}
        subtitle={`${project.category} • Managed by ${project.assignedPartner}`}
        backTo="/farmer/projects"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Projects', path: '/farmer/projects' },
          { label: project.title },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status} />
            <Button
              variant="primary"
              onClick={() => navigate('/farmer/carbon')}
            >
              View Carbon Credits
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Details & Milestones */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Project Scope & Objectives</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{project.scope}</p>
            </div>

            {/* Milestones Timeline */}
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> Key Milestone Execution
              </h4>

              <Timeline
                events={project.milestones.map((m) => ({
                  title: m.title,
                  timestamp: m.date,
                  completed: m.completed,
                }))}
              />
            </div>
          </Card>
        </div>

        {/* Project Metrics Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider">
              Project Snapshot
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Progress</span>
                <span className="font-bold text-emerald-700">{project.progress}% Complete</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Location</span>
                <span className="font-semibold text-gray-900 text-right">{project.location}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Participating Plots</span>
                <span className="font-semibold text-gray-900">{project.linkedLandCount} Registered Holdings</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-100">
                <span className="text-gray-500">Start Date</span>
                <span className="font-semibold text-gray-900">{project.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Target Completion</span>
                <span className="font-semibold text-gray-900">{project.targetCompletion}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-900 to-teal-950 text-white border-0">
            <Sparkles className="w-6 h-6 text-emerald-400 mb-2" />
            <h4 className="text-base font-bold mb-1">Carbon Credit Baseline</h4>
            <p className="text-xs text-emerald-200 mb-4">
              Enrolled farms receive quarterly tCO2e sequestration disbursements directly into their BHUMICRED Wallet.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
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
