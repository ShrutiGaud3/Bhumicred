import React, { useState } from 'react';
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
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { MOCK_PROJECTS } from '../../../services/mockData/projectsMock.js';

export const AreaProjectsPage = () => {
  const navigate = useNavigate();

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_PROJECTS.map((proj) => (
          <Card key={proj.id} className="p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-all space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="success">{proj.category}</Badge>
                <StatusBadge status={proj.status} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{proj.title}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {proj.location}
              </p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">{proj.scope}</p>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-500">Execution Progress</span>
                <span className="text-emerald-700">{proj.progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${proj.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl text-xs text-gray-700">
              <div>
                <span className="text-gray-400 block text-[10px]">Implementing Agency:</span>
                <strong className="text-gray-900">{proj.assignedPartner}</strong>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Beneficiary Farmers:</span>
                <strong className="text-emerald-700">{proj.linkedLandCount} Registered Plots</strong>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">Timeline: {proj.startDate} to {proj.targetCompletion}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/farmer/projects/${proj.id}`)}
              >
                Inspect Milestones
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
