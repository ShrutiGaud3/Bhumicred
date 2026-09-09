import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Trees,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  Users,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Search,
  Award,
  Layers,
  Plus,
} from 'lucide-react';
import { Card } from '../../../components/ui/Card.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { Badge } from '../../../components/ui/Badge.jsx';
import { StatusBadge } from '../../../components/ui/StatusBadge.jsx';
import { PageHeader } from '../../../components/ui/PageHeader.jsx';
import { Modal } from '../../../components/ui/Modal.jsx';
import { SearchInput } from '../../../components/forms/SearchInput.jsx';
import { fetchProjects, enrollLandInProject } from '../projectSlice.js';
import { landService } from '../../land/services/landService.js';

const CATEGORY_TABS = [
  { id: 'ALL', label: 'All Sustainability Projects' },
  { id: 'CIVIC_AGROFORESTRY', label: 'Civic Agroforestry' },
  { id: 'SOIL_RESTORATION', label: 'Soil Restoration' },
  { id: 'BIODIVERSITY_CORRIDOR', label: 'Biodiversity Corridors' },
];

export const ProjectsListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { projects, loading, enrolling } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollModalProject, setEnrollModalProject] = useState(null);
  const [lands, setLands] = useState([]);
  const [loadingLands, setLoadingLands] = useState(false);
  const [selectedLandId, setSelectedLandId] = useState('');
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollError, setEnrollError] = useState('');

  const loadLands = async () => {
    setLoadingLands(true);
    try {
      const res = await landService.getMyLands();
      const landList = res.data || [];
      setLands(landList);
      if (landList.length > 0) {
        setSelectedLandId(landList[0]._id || landList[0].id);
      }
    } catch (e) {
      console.warn('Failed to load lands for project enrollment:', e);
    } finally {
      setLoadingLands(false);
    }
  };

  useEffect(() => {
    dispatch(fetchProjects());
    loadLands();
  }, [dispatch]);

  const filteredProjects = (projects || []).filter((proj) => {
    const matchesCat = selectedCategory === 'ALL' || proj.category === selectedCategory;
    const matchesSearch =
      proj.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.scope?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.location?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.assignedPartner?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenEnrollModal = (proj) => {
    setEnrollModalProject(proj);
    setEnrollSuccess(false);
    setEnrollError('');
    loadLands();
  };

  const handleEnroll = async () => {
    if (!selectedLandId) {
      setEnrollError('Please select a registered land parcel.');
      return;
    }

    setEnrollError('');
    try {
      const projId = enrollModalProject._id || enrollModalProject.id;
      await dispatch(enrollLandInProject({ projectId: projId, landId: selectedLandId })).unwrap();
      setEnrollSuccess(true);
      setTimeout(() => {
        setEnrollSuccess(false);
        setEnrollModalProject(null);
      }, 2000);
    } catch (err) {
      setEnrollError(typeof err === 'string' ? err : 'Enrollment failed. This land parcel may already be enrolled.');
    }
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

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const count =
              tab.id === 'ALL'
                ? (projects || []).length
                : (projects || []).filter((p) => p.category === tab.id).length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === tab.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{tab.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      selectedCategory === tab.id
                        ? 'bg-emerald-900/50 text-emerald-100'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="w-full md:w-72">
          <SearchInput
            placeholder="Search projects by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading && (projects || []).length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
          <p className="text-sm font-semibold">Loading community sustainability projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-gray-200">
          <Trees className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No projects found in this category</h3>
          <p className="text-xs text-gray-500 mt-1">Try clearing filters or switching categories.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => {
            const projId = proj._id || proj.id;
            const locationStr = proj.location?.address || `${proj.location?.gramPanchayat}, ${proj.location?.district}` || 'Anand, Gujarat';
            const partnerName = proj.assignedPartner?.name || 'AgriTech Field Services';
            const enrolledCount = proj.enrolledLands?.length || (proj.totalHectaresTarget ? Math.round(proj.totalHectaresTarget / 3) : 12);
            const progress = proj.progress || 0;

            return (
              <Card
                key={projId}
                className="p-6 flex flex-col justify-between hover:shadow-lg transition-all border border-gray-200"
              >
                <div className="space-y-4">
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

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-500">Project Milestone Progress</span>
                      <span className="text-emerald-700 font-bold">{progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <span>
                      Field Partner: <strong className="text-gray-800">{partnerName}</strong>
                    </span>
                    <span className="font-semibold text-emerald-700">{enrolledCount} Plots Enrolled</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center gap-3 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => navigate(`/farmer/projects/${projId}`)}
                  >
                    View Milestones
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs bg-emerald-700 hover:bg-emerald-800"
                    onClick={() => handleOpenEnrollModal(proj)}
                  >
                    Enroll My Land
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Enroll Land Modal */}
      {enrollModalProject && (
        <Modal
          isOpen={Boolean(enrollModalProject)}
          onClose={() => setEnrollModalProject(null)}
          title={`Enroll Land: ${enrollModalProject.title}`}
        >
          <div className="space-y-6 py-2">
            {enrollSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Land Parcel Enrolled Successfully!</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Your registered land parcel is now linked to this sovereign sustainability project.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Join regional farmers in{' '}
                  <strong className="text-gray-900">
                    {enrollModalProject.location?.address || 'Anand, Gujarat'}
                  </strong>{' '}
                  to unlock pooled carbon credits, free certified saplings, and precision drip support.
                </p>

                {enrollError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
                    {enrollError}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Select Your Registered Land Plot
                  </label>
                  {loadingLands ? (
                    <div className="py-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                      <span>Loading your registered farm parcels...</span>
                    </div>
                  ) : lands.length > 0 ? (
                    <select
                      value={selectedLandId}
                      onChange={(e) => setSelectedLandId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-sm focus:ring-emerald-500 bg-white font-medium text-gray-900"
                    >
                      {lands.map((l) => (
                        <option key={l._id || l.id} value={l._id || l.id}>
                          {l.landName || `Survey ${l.surveyNumber}`} (Survey: {l.surveyNumber} • {l.totalArea || l.area || 1} Acres • {l.village || 'Anand'})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-2">
                      <p className="font-semibold">No registered land parcels found in your farmer account.</p>
                      <p className="text-amber-700">Please add your farm plot to the Land Registry first before enrolling in projects.</p>
                      <Button
                        size="sm"
                        variant="primary"
                        className="bg-emerald-700 hover:bg-emerald-800 flex items-center gap-1.5 mt-2"
                        onClick={() => navigate('/farmer/lands/add')}
                      >
                        <Plus className="w-3.5 h-3.5" /> Register New Land Plot
                      </Button>
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  disabled={enrolling || loadingLands || lands.length === 0}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 font-bold"
                  onClick={handleEnroll}
                >
                  {enrolling ? 'Enrolling Land Parcel...' : 'Confirm Project Enrollment'}
                </Button>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProjectsListPage;
