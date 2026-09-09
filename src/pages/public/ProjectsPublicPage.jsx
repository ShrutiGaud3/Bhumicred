import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, ArrowRight, CheckCircle2, Clock, Trees, RefreshCw, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { projectService } from '../../features/projects/services/projectService.js';

export const ProjectsPublicPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await projectService.getProjects();
        if (res.data) {
          setProjects(res.data);
        }
      } catch (e) {
        console.warn('Failed to load public sustainability projects:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Sustainability & Green Works</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Collaborative Agri Projects
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Transparent project milestones connecting local gram panchayats, farmers, and certified implementation partners.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
          <p className="text-xs">Loading sustainability projects...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((prj) => {
            const prjId = prj._id || prj.id;
            const locationStr = prj.location?.address || `${prj.location?.gramPanchayat}, ${prj.location?.district}` || 'Anand, Gujarat';
            const partnerName = prj.assignedPartner?.name || 'AgriTech Field Services';

            return (
              <Card key={prjId} className="p-6 space-y-4 border border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {prj.categoryLabel || prj.category}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">{prj.progress || 0}% Completed</span>
                </div>
                <h3 className="font-bold text-base text-slate-900">{prj.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{prj.scope}</p>

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${prj.progress || 0}%` }}
                  />
                </div>

                <div className="pt-2 text-xs text-slate-500 flex justify-between">
                  <span>Location: {locationStr}</span>
                  <span>Partner: {partnerName}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectsPublicPage;
