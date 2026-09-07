import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trees,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  Users,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { MOCK_PROJECTS } from '../../../services/mockData/projectsMock.js';
import { MOCK_LANDS } from '../../../services/mockData/landsMock.js';

export const ProjectsListPage = () => {
  const navigate = useNavigate();
  const [enrollModalProject, setEnrollModalProject] = useState(null);
  const [selectedLandId, setSelectedLandId] = useState(MOCK_LANDS[0].id);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const handleEnroll = () => {
    setEnrollSuccess(true);
    setTimeout(() => {
      setEnrollSuccess(false);
      setEnrollModalProject(null);
    }, 1800);
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-12">
      <PageHeader
        title="Community Agroforestry & Sustainability Projects"
        subtitle="Participate in cluster tree planting, bio-char enrichment, and carbon pooling programs."
        backTo="/farmer/dashboard"
        breadcrumbs={[
          { label: 'Farmer Portal', path: '/farmer/dashboard' },
          { label: 'Sustainability Projects' },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_PROJECTS.map((proj) => (
          <Card
            key={proj.id}
            className="p-6 flex flex-col justify-between hover:shadow-lg transition-all border border-gray-200"
          >
            <div className="space-y-4">
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

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">Project Progress</span>
                  <span className="text-emerald-700">{proj.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${proj.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>Field Partner: <strong className="text-gray-800">{proj.assignedPartner}</strong></span>
                <span>{proj.linkedLandCount} Farmers Enrolled</span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center gap-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate(`/farmer/projects/${proj.id}`)}
              >
                View Milestones
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="w-full text-xs"
                onClick={() => setEnrollModalProject(proj)}
              >
                Enroll My Land
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Enroll Modal */}
      {enrollModalProject && (
        <Modal
          isOpen={Boolean(enrollModalProject)}
          onClose={() => setEnrollModalProject(null)}
          title={`Enroll Land in: ${enrollModalProject.title}`}
        >
          <div className="space-y-6 py-2">
            {enrollSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Land Enrolled Successfully!</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Field partner will conduct initial baseline soil & GPS mapping.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Join fellow regional farmers in {enrollModalProject.location} to unlock pooled carbon
                  subsidies, free clonal saplings, and drip equipment discounts.
                </p>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Select Eligible Land Parcel
                  </label>
                  <select
                    value={selectedLandId}
                    onChange={(e) => setSelectedLandId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:ring-emerald-500"
                  >
                    {MOCK_LANDS.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.landName} (Survey: {l.surveyNumber} • {l.area} {l.areaUnit})
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  variant="primary"
                  className="w-full py-3"
                  onClick={handleEnroll}
                >
                  Confirm Project Enrollment
                </Button>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
